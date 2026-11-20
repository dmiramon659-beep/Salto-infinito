import { BOOSTER_BY_ID } from './boosters';
import { POWERUP_BY_KIND, POWERUPS, TIMED_KINDS } from './powerups';
import { SKIN_BY_ID } from './skins';
import { getPalette } from './palettes';
import { drawWorld } from './drawWorld';
import {
  drawFence,
  drawGate,
  drawParticles,
  drawPlayer,
  drawPowerUp,
  drawShadow,
  drawShield,
} from './drawSprites';

const BASE_SPEED = 340;
const MAX_SPEED = 1080;
const ACCEL = 15;
const GRAVITY = 2500;
const JUMP_V = 940;

const GATE_GAP = 44;
const PLAYER_H = 52;
const SLIDE_H = 26;
const SLIDE_TIME = 0.55;
const POWER_R = 17;
const FLIGHT_TIME = 1.5;
const FLIGHT_RISE = 330;

export const DEATH_DURATION = 1.15;

export function toKmh(elapsed) {
  return Math.max(0, Math.min(999, Math.round(20 + elapsed * 5)));
}

export function createGame(w, h, skinId = 'runner', boosterId = null) {
  const ability = SKIN_BY_ID[skinId]?.ability?.key || null;
  const booster = boosterId ? BOOSTER_BY_ID[boosterId] : null;
  const multiplier = ability === 'randomx2' && Math.random() < 0.5 ? 2 : 1;
  const game = {
    w,
    h,
    skinId,
    ability,
    revives: ability === 'revive' ? 1 : 0,
    multiplier,
    savedByBall: false,
    blinkIn: ability === 'teleport' ? 3 : 0,
    phasing: 0,
    boneIn: ability === 'bone' ? 10 : 0,
    boneCharges: ability === 'bone' ? 5 : 0,
    boneCooldown: 0,
    packId: booster?.pack || null,
    groundY: Math.max(150, Math.round(h * 0.78)),
    scroll: 0,
    speed: BASE_SPEED,
    time: 0,
    meter: 0,
    score: 0,
    lives: ability === 'armor' ? 2 : 1,
    invuln: 0,
    dying: false,
    deathT: 0,
    spin: 0,
    shake: 0,
    flash: 0,
    spawnIn: 560,
    puSpawnIn: 700,
    obstacles: [],
    powerups: [],
    particles: [],
    events: [],
    runPhase: 0,
    effects: { jump: 0, shield: 0, slow: 0, magnet: 0, double: 0, shrink: 0, doublejump: 0 },
    player: {
      x: Math.max(58, Math.round(w * 0.18)),
      y: 0,
      vy: 0,
      onGround: true,
      slide: 0,
      gelatinT: 0,
      boneT: 0,
      doubleUsed: false,
      airJumps: 0,
      flying: false,
      flight: ability === 'flight' ? FLIGHT_TIME : 0,
    },
  };

  if (booster) {
    for (const kind of booster.powers || []) {
      if (kind === 'life') game.lives = Math.min(4, game.lives + 1);
      else if (POWERUP_BY_KIND[kind]) game.effects[kind] = POWERUP_BY_KIND[kind].duration;
    }
  }

  return game;
}

export function resize(game, w, h) {
  game.w = w;
  game.h = h;
  game.groundY = Math.max(150, Math.round(h * 0.78));
  game.player.x = Math.max(58, Math.round(w * 0.18));
}

function spawnDust(g, count) {
  for (let i = 0; i < count; i++) {
    const life = 0.4 + Math.random() * 0.2;
    g.particles.push({
      x: g.player.x + (Math.random() - 0.5) * 16,
      y: g.groundY - g.player.y - Math.random() * 5,
      vx: -50 - Math.random() * 110,
      vy: -20 - Math.random() * 80,
      life,
      max: life,
      size: 3 + Math.random() * 5,
      rgb: '255, 240, 214',
    });
  }
}

function spawnBurst(g, count, rgb = '255, 196, 138') {
  for (let i = 0; i < count; i++) {
    const life = 0.5 + Math.random() * 0.45;
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
    const speed = 140 + Math.random() * 300;
    g.particles.push({
      x: g.player.x + (Math.random() - 0.5) * 20,
      y: g.groundY - g.player.y - 26 + (Math.random() - 0.5) * 18,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * 0.8,
      life,
      max: life,
      size: 3 + Math.random() * 6,
      rgb,
    });
  }
}

function spawnGelatins(g) {
  const tints = ['152, 251, 152', '255, 182, 193'];
  for (let i = 0; i < 12; i += 1) {
    const life = 0.32 + Math.random() * 0.3;
    g.particles.push({
      x: g.player.x + (Math.random() - 0.5) * 18,
      y: g.groundY - g.player.y - Math.random() * 4,
      vx: (Math.random() - 0.5) * 180,
      vy: -90 - Math.random() * 210,
      life,
      max: life,
      size: 3 + Math.random() * 5,
      rgb: tints[i % 2],
    });
  }
}

function spawnWheels(g) {
  const spread = [-0.95, -0.5, 0.1, 0.6, 1.05];
  for (let i = 0; i < spread.length; i += 1) {
    const life = 1.05 + Math.random() * 0.35;
    g.particles.push({
      x: g.player.x + (Math.random() - 0.5) * 20,
      y: g.groundY - g.player.y - 16 - Math.random() * 10,
      vx: spread[i] * 330 + (Math.random() - 0.5) * 90,
      vy: -430 - Math.random() * 250,
      life,
      max: life,
      size: 9 + Math.random() * 3,
      wheel: true,
    });
  }
}

function spawnBasketball(g, o) {
  const life = 0.6;
  g.particles.push({
    x: o.x - 110,
    y: g.groundY - 30,
    vx: 620,
    vy: -30,
    life,
    max: life,
    size: 13,
    ball: true,
  });
}

function stepTeleport(g, dt) {
  if (g.ability !== 'teleport') return;
  g.blinkIn -= dt;
  if (g.blinkIn > 0) return;
  g.blinkIn = 4.5;
  g.invuln = Math.max(g.invuln, 0.8);
  g.phasing = 0.8;
  spawnBurst(g, 12, '150, 220, 255');
  g.events.push('powerup');
}

function throwBone(g) {
  const p = g.player;
  p.boneT = 0.4;
  const life = 0.5;
  g.particles.push({
    x: p.x + 12,
    y: g.groundY - p.y - 34,
    vx: 820,
    vy: -80,
    life,
    max: life,
    size: 16,
    bone: true,
  });
  g.events.push('powerup');

  let target = null;
  for (const o of g.obstacles) {
    if (o.dead || o.x + o.w < p.x) continue;
    if (!target || o.x < target.x) target = o;
  }
  if (!target) return false;

  target.dead = true;
  spawnBurst(g, 9, '255, 240, 205');
  g.meter += 600;
  return true;
}

function stepBone(g, dt) {
  if (g.ability !== 'bone' || g.dying) return;

  if (g.boneCooldown > 0) {
    g.boneCooldown -= dt;
    if (g.boneCooldown <= 0) {
      g.boneCooldown = 0;
      g.boneCharges = 5;
      g.boneIn = 10;
    }
    return;
  }

  g.boneIn -= dt;
  if (g.boneIn > 0) return;

  if (!throwBone(g)) {
    g.boneIn = 0.6;
    return;
  }

  g.boneCharges -= 1;
  g.boneIn = 10;
  if (g.boneCharges <= 0) {
    g.boneCharges = 0;
    g.boneCooldown = 120;
  }
}

function spawnObstacle(g) {
  const airDistance = g.speed * ((2 * JUMP_V) / GRAVITY);
  if (g.time > 8 && Math.random() < 0.34) {
    g.obstacles.push({ type: 'gate', x: g.w + 70, w: 96 });
    g.spawnIn = airDistance * 1.25 + 160;
    return;
  }
  g.obstacles.push({
    type: 'fence',
    x: g.w + 60,
    w: 36 + Math.random() * 20,
    h: 42 + Math.random() * 44,
  });
  g.spawnIn = airDistance * (1.15 + Math.random() * 0.5) + 70;
}

function spawnPowerup(g) {
  const def = POWERUPS[Math.floor(Math.random() * POWERUPS.length)];
  const heights = [30, 64, 108, 148];
  g.powerups.push({
    kind: def.kind,
    x: g.w + 50,
    y: heights[Math.floor(Math.random() * heights.length)],
    bob: Math.random() * Math.PI * 2,
  });
  g.puSpawnIn = 620 + Math.random() * 560;
}

function stepPlayer(g, dt) {
  const p = g.player;
  if (p.flying) {
    p.flight = Math.max(0, p.flight - dt);
    p.vy = 0;
    p.y += FLIGHT_RISE * dt;
    if (p.flight <= 0) p.flying = false;
    return;
  }
  if (p.onGround) return;
  p.vy -= GRAVITY * dt;
  p.y += p.vy * dt;
  if (p.y <= 0) {
    p.y = 0;
    p.vy = 0;
    p.onGround = true;
    if (g.ability === 'flight') p.flight = FLIGHT_TIME;
    spawnDust(g, g.dying ? 5 : 7);
  }
}

function stepParticles(g, dt, dx) {
  for (const pt of g.particles) {
    pt.life -= dt;
    pt.x += pt.vx * dt - dx * 0.35;
    pt.y += pt.vy * dt;
    pt.vy += 420 * dt;
  }
  g.particles = g.particles.filter((pt) => pt.life > 0);
}

function playerBox(g) {
  const p = g.player;
  const scale = g.effects.shrink > 0 ? 0.82 : 1;
  const height = (p.slide > 0 ? SLIDE_H : PLAYER_H) * scale;
  const feet = g.groundY - p.y;
  return { x: p.x - 14 * scale, w: 28 * scale, top: feet - height, feet };
}

function beginDeath(g) {
  g.dying = true;
  g.deathT = 0;
  g.shake = 1;
  g.flash = 1;
  g.player.onGround = false;
  g.player.vy = 560;
  g.player.slide = 0;
  g.player.flying = false;
  spawnBurst(g, 16);
  if (SKIN_BY_ID[g.skinId]?.deathFx === 'wheels') spawnWheels(g);
  g.events.push('death');
}

export function revive(game) {
  const g = game;
  if (!g || !g.dying) return;
  const p = g.player;
  g.dying = false;
  g.deathT = 0;
  g.spin = 0;
  g.shake = 0;
  g.flash = 0.55;
  g.invuln = 2.2;
  g.speed = Math.max(BASE_SPEED, g.speed);
  g.lives = Math.max(1, g.lives);
  p.y = 0;
  p.vy = 0;
  p.onGround = true;
  p.slide = 0;
  p.flying = false;
  p.doubleUsed = false;
  p.airJumps = 0;
  if (g.ability === 'flight') p.flight = FLIGHT_TIME;
  spawnBurst(g, 14, '255, 240, 200');
  g.events.push('powerup');
}

function breakObstacle(g, o) {
  o.dead = true;
  spawnBurst(g, 9, '255, 226, 190');
  g.meter += 700;
}

function applyPowerup(g, kind) {
  const def = POWERUP_BY_KIND[kind];
  if (!def) return;

  if (kind === 'life') {
    g.lives = Math.min(4, g.lives + 1);
  } else if (kind === 'bomb') {
    for (const o of g.obstacles) {
      if (!o.dead) {
        o.dead = true;
        spawnBurst(g, 8, '255, 214, 170');
      }
    }
    g.meter += 1500;
  } else if (kind === 'coin') {
    g.meter += 2200;
  } else {
    g.effects[kind] = def.duration;
  }

  spawnBurst(g, 6, '255, 255, 255');
  g.events.push('powerup');
}

function updatePowerups(g, dt, dx) {
  const p = g.player;
  const box = playerBox(g);
  const targetY = g.groundY - p.y - 28;

  for (const pu of g.powerups) {
    pu.x -= dx;
    pu.bob += dt * 3;
    const cy = g.groundY - pu.y;

    if (g.effects.magnet > 0) {
      const distX = p.x - pu.x;
      const distY = targetY - cy;
      const dist = Math.hypot(distX, distY);
      if (dist < 260 && dist > 1) {
        const pull = 360 * dt * (1 - dist / 300);
        pu.x += (distX / dist) * pull * 2.4;
        pu.y -= (distY / dist) * pull * 2.4;
      }
    }

    const nx = pu.x;
    const ny = g.groundY - pu.y;
    if (
      nx > box.x - POWER_R &&
      nx < box.x + box.w + POWER_R &&
      ny > box.top - POWER_R &&
      ny < box.feet + POWER_R
    ) {
      pu.taken = true;
      applyPowerup(g, pu.kind);
    }
  }
}

function collide(g) {
  if (g.phasing > 0) return;
  const p = g.player;
  const box = playerBox(g);

  for (const o of g.obstacles) {
    const ox = o.x + 5;
    const ow = o.w - 10;
    if (box.x + box.w <= ox || box.x >= ox + ow) continue;

    const hit =
      o.type === 'gate'
        ? !(p.slide > 0 && box.top >= g.groundY - GATE_GAP)
        : box.feet > g.groundY - o.h + 6;
    if (!hit) continue;

    if (g.effects.shield > 0 || g.invuln > 0) {
      breakObstacle(g, o);
    } else if (g.lives > 1) {
      g.lives -= 1;
      g.invuln = 1.6;
      g.flash = 0.7;
      breakObstacle(g, o);
      g.events.push('hurt');
    } else if (g.revives > 0) {
      g.revives -= 1;
      g.invuln = 2;
      g.flash = 1;
      breakObstacle(g, o);
      spawnBurst(g, 20, '255, 168, 78');
      g.events.push('hurt');
    } else if (g.ability === 'basketball' && !g.savedByBall) {
      g.savedByBall = true;
      g.invuln = 1.4;
      g.flash = 0.8;
      breakObstacle(g, o);
      spawnBasketball(g, o);
      spawnBurst(g, 10, '255, 170, 90');
      g.events.push('hurt');
    } else {
      beginDeath(g);
    }
    break;
  }
}

export function jump(game) {
  const g = game;
  const p = g.player;
  if (g.dying) return;

  if (p.onGround) {
    p.slide = 0;
    p.onGround = false;
    p.doubleUsed = false;
    p.airJumps = 0;
    const gelatin = g.ability === 'gelatin';
    p.vy = JUMP_V * (g.effects.jump > 0 ? 1.34 : 1) * (gelatin ? 1.25 : 1);
    spawnDust(g, 4);
    if (gelatin) {
      p.gelatinT = 0.34;
      spawnGelatins(g);
    }
    g.events.push('jump');
    return;
  }

  if (g.ability === 'flight' && p.flight > 0) {
    p.flying = true;
    p.slide = 0;
    p.vy = 0;
    spawnBurst(g, 8, '255, 240, 190');
    g.events.push('jump');
    return;
  }

  if (g.ability === 'triplejump' && p.airJumps < 2) {
    p.airJumps += 1;
    p.slide = 0;
    p.vy = JUMP_V * 0.9;
    spawnBurst(g, 6, '126, 219, 255');
    g.events.push('jump');
    return;
  }

  if ((g.effects.doublejump > 0 || g.ability === 'doublejump') && !p.doubleUsed) {
    p.doubleUsed = true;
    p.slide = 0;
    p.vy = JUMP_V * 0.92;
    spawnBurst(g, 6, '160, 232, 255');
    g.events.push('jump');
  }
}

export function slide(game) {
  const g = game;
  const p = g.player;
  if (g.dying) return;

  const duration = g.ability === 'fastslide' ? SLIDE_TIME * 1.25 : SLIDE_TIME;

  if (p.onGround) {
    p.slide = duration;
    spawnDust(g, g.ability === 'fastslide' ? 10 : 6);
  } else {
    p.vy = Math.min(p.vy, -1400);
    p.slide = duration;
  }
  g.events.push('slide');
}

export function releaseJump(game) {
  const p = game.player;
  if (p.flying) {
    p.flying = false;
    return;
  }
  if (!game.dying && !p.onGround && p.vy > 0) p.vy *= 0.52;
}

export function update(game, dt) {
  const g = game;
  const p = g.player;
  g.time += dt;

  if (g.dying) {
    g.deathT += dt;
    g.speed = Math.max(0, g.speed - 620 * dt);
    g.spin += dt * 8;
    g.shake = Math.max(0, g.shake - dt * 1.7);
    g.flash = Math.max(0, g.flash - dt * 2.4);
    const ddx = g.speed * dt;
    g.scroll += ddx;
    for (const o of g.obstacles) o.x -= ddx;
    for (const pu of g.powerups) pu.x -= ddx;
    stepPlayer(g, dt);
    stepParticles(g, dt, ddx);
    return;
  }

  for (const kind of TIMED_KINDS) {
    if (g.effects[kind] > 0) g.effects[kind] = Math.max(0, g.effects[kind] - dt);
  }
  if (g.invuln > 0) g.invuln = Math.max(0, g.invuln - dt);
  if (g.phasing > 0) g.phasing = Math.max(0, g.phasing - dt);

  const pace = g.ability === 'slowmo' ? 0.85 : 1;
  const target =
    Math.min(MAX_SPEED, BASE_SPEED + g.time * ACCEL) * pace * (g.effects.slow > 0 ? 0.6 : 1);
  g.speed += (target - g.speed) * Math.min(1, dt * 5);

  const sliding = p.slide > 0;
  const slideBoost = !sliding ? 1 : g.ability === 'fastslide' ? 1.25 : g.ability === 'f1slide' ? 1.1 : 1;
  const dx = g.speed * dt * slideBoost;
  g.scroll += dx;
  g.meter += dx * (g.effects.double > 0 ? 2 : 1);
  g.score = Math.floor((g.meter / 11) * g.multiplier);
  g.runPhase += dt * (g.speed / 46);

  if (p.slide > 0) p.slide = Math.max(0, p.slide - dt);
  if (p.gelatinT > 0) p.gelatinT = Math.max(0, p.gelatinT - dt);
  if (p.boneT > 0) p.boneT = Math.max(0, p.boneT - dt);
  stepPlayer(g, dt);
  stepTeleport(g, dt);
  stepBone(g, dt);

  g.spawnIn -= dx;
  if (g.spawnIn <= 0) spawnObstacle(g);

  for (const o of g.obstacles) o.x -= dx;

  g.puSpawnIn -= dx;
  if (g.puSpawnIn <= 0) spawnPowerup(g);
  updatePowerups(g, dt, dx);

  stepParticles(g, dt, dx);
  collide(g);

  g.obstacles = g.obstacles.filter((o) => !o.dead && o.x + o.w > -60);
  g.powerups = g.powerups.filter((pu) => !pu.taken && pu.x > -60);
}

export function render(ctx, g, time) {
  const pal = getPalette(g.scroll, g.packId);

  ctx.save();
  if (g.shake > 0.01) {
    const wobble = time * 55;
    ctx.translate(Math.sin(wobble) * 10 * g.shake, Math.cos(wobble * 1.4) * 7 * g.shake);
  }

  drawWorld(ctx, g, pal, time);

  for (const o of g.obstacles) {
    if (o.dead) continue;
    if (o.type === 'gate') {
      drawGate(ctx, o, g.groundY, pal, time, GATE_GAP);
      continue;
    }
    drawShadow(ctx, o.x + o.w / 2, g.groundY, o.w * 1.05, 0.13);
    drawFence(ctx, o, g.groundY, pal);
  }

  for (const pu of g.powerups) drawPowerUp(ctx, pu, g.groundY, time);

  const p = g.player;
  const lift = Math.min(1, p.y / 120);
  drawShadow(ctx, p.x, g.groundY, 40 - lift * 14, 0.2 - lift * 0.09);

  const blink = g.invuln > 0 && Math.floor(time * 14) % 2 === 0;
  if (!blink) {
    drawPlayer(ctx, {
      ...p,
      groundY: g.groundY,
      pal,
      phase: g.runPhase,
      spin: g.dying ? g.spin : 0,
      sliding: !g.dying && p.slide > 0,
      scale: g.effects.shrink > 0 ? 0.82 : 1,
      skin: SKIN_BY_ID[g.skinId],
    });
  }

  if (g.effects.shield > 0) drawShield(ctx, p, g.groundY, time);

  drawParticles(ctx, g.particles);

  ctx.restore();

  if (g.flash > 0.01) {
    ctx.fillStyle = `rgba(255, 228, 198, ${g.flash * 0.3})`;
    ctx.fillRect(-20, -20, g.w + 40, g.h + 40);
  }

  return pal;
}