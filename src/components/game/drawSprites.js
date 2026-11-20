import { hexToRgba } from './palettes';
import { POWERUP_BY_KIND } from './powerups';
import { drawPilot } from './drawPilot';

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

export function drawShadow(ctx, cx, groundY, width, alpha = 0.16) {
  ctx.fillStyle = `rgba(0,0,0,${Math.max(0.04, alpha)})`;
  ctx.beginPath();
  ctx.ellipse(cx, groundY + 5, width / 2, Math.max(3, width * 0.075), 0, 0, Math.PI * 2);
  ctx.fill();
}

export function drawFence(ctx, o, groundY, pal) {
  const top = groundY - o.h;
  const postW = Math.max(6, o.w * 0.15);
  const railH = Math.max(5, o.h * 0.12);

  ctx.fillStyle = pal.prop;
  roundRect(ctx, o.x, top, postW, o.h, 3);
  ctx.fill();
  roundRect(ctx, o.x + o.w - postW, top, postW, o.h, 3);
  ctx.fill();
  roundRect(ctx, o.x, top + o.h * 0.16, o.w, railH, railH / 2);
  ctx.fill();
  roundRect(ctx, o.x, top + o.h * 0.56, o.w, railH, railH / 2);
  ctx.fill();

  ctx.fillStyle = hexToRgba(pal.player, 0.16);
  ctx.fillRect(o.x + postW, top + o.h * 0.16 + railH, o.w - postW * 2, 2.5);
  ctx.fillRect(o.x + postW, top + o.h * 0.56 + railH, o.w - postW * 2, 2.5);
}

export function drawGate(ctx, o, groundY, pal, time, gap) {
  const barH = 26;
  const barBottom = groundY - gap;
  const barTop = barBottom - barH;

  ctx.fillStyle = hexToRgba(pal.player, 0.5);
  ctx.fillRect(o.x, -24, 9, barTop + 24);
  ctx.fillRect(o.x + o.w - 9, -24, 9, barTop + 24);

  ctx.fillStyle = pal.prop;
  roundRect(ctx, o.x, barTop, o.w, barH, 6);
  ctx.fill();

  ctx.save();
  roundRect(ctx, o.x, barTop, o.w, barH, 6);
  ctx.clip();
  ctx.fillStyle = hexToRgba(pal.accent, 0.85);
  for (let sx = o.x - barH; sx < o.x + o.w + barH; sx += 24) {
    ctx.beginPath();
    ctx.moveTo(sx, barBottom);
    ctx.lineTo(sx + 12, barBottom);
    ctx.lineTo(sx + 12 + barH, barTop);
    ctx.lineTo(sx + barH, barTop);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillRect(o.x + 5, barTop + 3, o.w - 10, 2);

  const arrowY = barBottom + 13;
  const pulse = 0.45 + 0.35 * Math.sin(time * 5);
  ctx.globalAlpha = pulse;
  ctx.fillStyle = pal.accent;
  ctx.beginPath();
  ctx.moveTo(o.x + o.w / 2 - 8, arrowY);
  ctx.lineTo(o.x + o.w / 2 + 8, arrowY);
  ctx.lineTo(o.x + o.w / 2, arrowY + 10);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawPowerUpIcon(ctx, kind, cx, cy, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (kind === 'jump') {
    ctx.beginPath();
    ctx.moveTo(cx, cy + 7);
    ctx.lineTo(cx, cy - 6);
    ctx.moveTo(cx - 5, cy - 1);
    ctx.lineTo(cx, cy - 7);
    ctx.lineTo(cx + 5, cy - 1);
    ctx.stroke();
  } else if (kind === 'shield') {
    ctx.beginPath();
    ctx.moveTo(cx, cy - 8);
    ctx.lineTo(cx + 6, cy - 5);
    ctx.lineTo(cx + 6, cy + 1);
    ctx.quadraticCurveTo(cx, cy + 8, cx - 6, cy + 1);
    ctx.lineTo(cx - 6, cy - 5);
    ctx.closePath();
    ctx.stroke();
  } else if (kind === 'life') {
    ctx.beginPath();
    ctx.moveTo(cx, cy + 7);
    ctx.bezierCurveTo(cx - 10, cy - 1, cx - 6, cy - 9, cx, cy - 4);
    ctx.bezierCurveTo(cx + 6, cy - 9, cx + 10, cy - 1, cx, cy + 7);
    ctx.fill();
  } else if (kind === 'slow') {
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - 4);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 4, cy + 1);
    ctx.stroke();
  } else if (kind === 'magnet') {
    ctx.beginPath();
    ctx.arc(cx, cy - 1, 6, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy - 1);
    ctx.lineTo(cx - 6, cy + 5);
    ctx.moveTo(cx + 6, cy - 1);
    ctx.lineTo(cx + 6, cy + 5);
    ctx.stroke();
  } else if (kind === 'double') {
    ctx.font = '700 12px "DM Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('x2', cx, cy + 1);
  } else if (kind === 'shrink') {
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy);
    ctx.lineTo(cx - 3, cy);
    ctx.moveTo(cx + 8, cy);
    ctx.lineTo(cx + 3, cy);
    ctx.moveTo(cx - 6, cy - 3);
    ctx.lineTo(cx - 3, cy);
    ctx.lineTo(cx - 6, cy + 3);
    ctx.moveTo(cx + 6, cy - 3);
    ctx.lineTo(cx + 3, cy);
    ctx.lineTo(cx + 6, cy + 3);
    ctx.stroke();
  } else if (kind === 'doublejump') {
    [-3, 4].forEach((off) => {
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy + off + 2);
      ctx.lineTo(cx, cy + off - 3);
      ctx.lineTo(cx + 5, cy + off + 2);
      ctx.stroke();
    });
  } else if (kind === 'bomb') {
    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 3, cy + Math.sin(angle) * 3);
      ctx.lineTo(cx + Math.cos(angle) * 8, cy + Math.sin(angle) * 8);
      ctx.stroke();
    }
  } else {
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 2.6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawPowerUp(ctx, pu, groundY, time) {
  const def = POWERUP_BY_KIND[pu.kind];
  if (!def) return;
  const radius = 17;
  const cx = pu.x;
  const cy = groundY - pu.y + Math.sin(time * 3 + pu.bob) * 3.5;

  const halo = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 2.2);
  halo.addColorStop(0, hexToRgba(def.color, 0.45));
  halo.addColorStop(1, hexToRgba(def.color, 0));
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(12, 10, 24, 0.85)';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = def.color;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  drawPowerUpIcon(ctx, pu.kind, cx, cy, def.color);
}

export function drawShield(ctx, p, groundY, time) {
  const cy = groundY - p.y - (p.slide > 0 ? 14 : 30);
  const radius = 34 + Math.sin(time * 6) * 2.5;

  ctx.save();
  ctx.globalAlpha = 0.5;
  const grad = ctx.createRadialGradient(p.x, cy, radius * 0.45, p.x, cy, radius);
  grad.addColorStop(0, 'rgba(124, 199, 255, 0)');
  grad.addColorStop(1, 'rgba(124, 199, 255, 0.9)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(p.x, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(206, 238, 255, 0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(p.x, cy, radius * 0.92, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawSliding(ctx, colors, phase) {
  const wobble = Math.sin(phase * 2) * 2;

  ctx.fillStyle = hexToRgba(colors.accent, 0.5);
  ctx.fillRect(-40, -14, 16, 3);
  ctx.fillRect(-32, -7, 12, 3);

  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.moveTo(4, -19);
  ctx.quadraticCurveTo(-18, -26 + wobble, -30, -15 + wobble);
  ctx.quadraticCurveTo(-14, -14, 4, -11);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = colors.body;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-6, -9);
  ctx.lineTo(-26, -4);
  ctx.moveTo(2, -9);
  ctx.lineTo(-14, -3);
  ctx.stroke();

  ctx.fillStyle = colors.body;
  roundRect(ctx, -14, -21, 30, 16, 8);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(19, -15, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.arc(22, -17, 1.8, 0, Math.PI * 2);
  ctx.fill();
}

function drawWings(ctx, colors, phase) {
  const flap = Math.sin(phase * 1.4) * 3;
  ctx.fillStyle = hexToRgba(colors.accent, 0.8);
  [-1, 1].forEach((side) => {
    ctx.beginPath();
    ctx.moveTo(side * 6, -44);
    ctx.quadraticCurveTo(side * 26, -55 + flap, side * 31, -34 + flap);
    ctx.quadraticCurveTo(side * 18, -38, side * 6, -31);
    ctx.closePath();
    ctx.fill();
  });
}

function drawVictoryHair(ctx, cx, cy, scale = 1, sway = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  ctx.fillStyle = '#FFD75E';
  ctx.beginPath();
  ctx.moveTo(-5, -4);
  ctx.quadraticCurveTo(-17, 2 + sway, -14, 17 + sway);
  ctx.quadraticCurveTo(-7, 9, -4, 1);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, 9.7, Math.PI * 0.92, Math.PI * 2.08);
  ctx.fill();

  ctx.fillStyle = '#FF7D9C';
  ctx.beginPath();
  ctx.ellipse(-6.4, -6.6, 3.4, 2.2, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-6.4, -6.6, 3.4, 2.2, 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-6.4, -6.6, 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

const VICTORY_SKIN = '#F3C6A5';
const VICTORY_SHIRT = '#2F6BFF';
const VICTORY_JEANS = '#2C4A86';
const VICTORY_SHOE = '#F7F9FF';

function drawVictoryStar(ctx, cx, cy, size) {
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const rr = i % 2 === 0 ? size : size * 0.45;
    const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
    const px = cx + Math.cos(a) * rr;
    const py = cy + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawVictory(ctx, phase, sliding, onGround, scale = 1) {
  ctx.scale(scale, scale);

  if (sliding) {
    ctx.strokeStyle = VICTORY_JEANS;
    ctx.lineWidth = 6.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-4, -10);
    ctx.lineTo(-26, -4);
    ctx.moveTo(2, -10);
    ctx.lineTo(-13, -3);
    ctx.stroke();

    ctx.fillStyle = VICTORY_SHOE;
    roundRect(ctx, -31, -7, 12, 5.5, 2.6);
    ctx.fill();
    roundRect(ctx, -18, -6, 12, 5.5, 2.6);
    ctx.fill();

    ctx.fillStyle = VICTORY_SHIRT;
    roundRect(ctx, -14, -21, 28, 15, 7);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    drawVictoryStar(ctx, -6, -13, 4);

    ctx.fillStyle = VICTORY_SKIN;
    ctx.beginPath();
    ctx.arc(19, -15, 8, 0, Math.PI * 2);
    ctx.fill();
    drawVictoryHair(ctx, 19, -15, 0.92, Math.sin(phase * 2) * 2);

    ctx.fillStyle = '#3A2418';
    ctx.beginPath();
    ctx.arc(22, -16, 1.7, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  const swing = onGround ? Math.sin(phase) : 0.6;

  ctx.strokeStyle = VICTORY_JEANS;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-3, -23);
  ctx.lineTo(-3 + swing * 9, -4);
  ctx.moveTo(3, -23);
  ctx.lineTo(3 - swing * 9, -4);
  ctx.stroke();

  ctx.fillStyle = VICTORY_SHOE;
  roundRect(ctx, -3 + swing * 9 - 4, -6, 12, 6, 3);
  ctx.fill();
  roundRect(ctx, 3 - swing * 9 - 4, -6, 12, 6, 3);
  ctx.fill();

  ctx.strokeStyle = VICTORY_SKIN;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(2, -40);
  ctx.lineTo(9 - swing * 6, -28);
  ctx.moveTo(-2, -40);
  ctx.lineTo(-9 + swing * 6, -28);
  ctx.stroke();

  ctx.fillStyle = VICTORY_SHIRT;
  roundRect(ctx, -9, -47, 18, 27, 8);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  drawVictoryStar(ctx, 0, -36, 4.2);

  ctx.fillStyle = VICTORY_SKIN;
  ctx.beginPath();
  ctx.arc(0, -55, 9, 0, Math.PI * 2);
  ctx.fill();
  drawVictoryHair(ctx, 0, -55, 1, Math.sin(phase * 1.6) * 3);

  ctx.fillStyle = '#3A2418';
  ctx.beginPath();
  ctx.arc(4, -56, 1.9, 0, Math.PI * 2);
  ctx.fill();
}

function drawVariant(ctx, variant, colors, phase) {
  if (variant === 'robot') {
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, -63);
    ctx.lineTo(0, -69);
    ctx.stroke();
    ctx.fillStyle = colors.accent;
    ctx.beginPath();
    ctx.arc(0, -70.5, 2.4, 0, Math.PI * 2);
    ctx.fill();
    roundRect(ctx, -6.5, -59, 13, 6, 2.5);
    ctx.fill();
    ctx.fillStyle = 'rgba(12, 10, 24, 0.85)';
    ctx.beginPath();
    ctx.arc(-2.4, -56, 1.2, 0, Math.PI * 2);
    ctx.arc(2.4, -56, 1.2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (variant === 'cat') {
    ctx.fillStyle = colors.body;
    ctx.beginPath();
    ctx.moveTo(-8, -61);
    ctx.lineTo(-6, -69);
    ctx.lineTo(-1, -62);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(8, -61);
    ctx.lineTo(6, -69);
    ctx.lineTo(1, -62);
    ctx.closePath();
    ctx.fill();
  } else if (variant === 'ninja') {
    ctx.fillStyle = colors.accent;
    roundRect(ctx, -9, -58.5, 18, 5, 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-9, -57);
    ctx.lineTo(-22, -53);
    ctx.lineTo(-22, -49);
    ctx.lineTo(-9, -54);
    ctx.closePath();
    ctx.fill();
  } else if (variant === 'astro') {
    ctx.strokeStyle = hexToRgba(colors.accent, 0.9);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -55, 12.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, -55, 10, Math.PI * 1.05, Math.PI * 1.45);
    ctx.stroke();
  } else if (variant === 'ice') {
    ctx.fillStyle = hexToRgba(colors.accent, 0.9);
    [-7, 0, 7].forEach((offset, index) => {
      const tall = 10 - Math.abs(index - 1) * 3;
      ctx.beginPath();
      ctx.moveTo(offset - 2.6, -62);
      ctx.lineTo(offset, -62 - tall);
      ctx.lineTo(offset + 2.6, -62);
      ctx.closePath();
      ctx.fill();
    });
  } else if (variant === 'flame') {
    const flick = Math.sin(phase * 9) * 1.6;
    ctx.fillStyle = colors.accent;
    ctx.beginPath();
    ctx.moveTo(0, -62);
    ctx.quadraticCurveTo(-9, -70 + flick, -3, -76 - flick);
    ctx.quadraticCurveTo(0, -70, 4, -75 + flick);
    ctx.quadraticCurveTo(9, -69, 0, -62);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath();
    ctx.moveTo(0, -63);
    ctx.quadraticCurveTo(-4, -68, -1, -72);
    ctx.quadraticCurveTo(2, -67, 3, -71);
    ctx.quadraticCurveTo(4, -66, 0, -63);
    ctx.fill();
  } else if (variant === 'titan') {
    ctx.fillStyle = hexToRgba(colors.accent, 0.9);
    roundRect(ctx, -16, -47, 8, 13, 3);
    ctx.fill();
    roundRect(ctx, 8, -47, 8, 13, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-7, -62);
    ctx.lineTo(0, -73);
    ctx.lineTo(7, -62);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(-9, -27, 18, 3);
  } else if (variant === 'phoenix') {
    const flick = Math.sin(phase * 9) * 2;
    ctx.fillStyle = colors.accent;
    [-1, 1].forEach((side) => {
      ctx.beginPath();
      ctx.moveTo(side * 3, -60);
      ctx.quadraticCurveTo(side * 13, -68 + flick, side * 5, -77 - flick);
      ctx.quadraticCurveTo(side * 2, -68, side * 0.5, -61);
      ctx.closePath();
      ctx.fill();
    });
    ctx.beginPath();
    ctx.moveTo(-7, -23);
    ctx.quadraticCurveTo(-22, -16 + flick, -18, -3);
    ctx.quadraticCurveTo(-11, -12, -2, -19);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 228, 168, 0.75)';
    ctx.beginPath();
    ctx.moveTo(-5, -22);
    ctx.quadraticCurveTo(-14, -14, -13, -8);
    ctx.quadraticCurveTo(-8, -15, -3, -19);
    ctx.closePath();
    ctx.fill();
  } else if (variant === 'time') {
    const hand = phase * 0.8;
    ctx.strokeStyle = hexToRgba(colors.accent, 0.95);
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, -78, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -78);
    ctx.lineTo(Math.cos(hand) * 6, -78 + Math.sin(hand) * 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -36, 5, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * Math.PI * 2 + hand * 0.4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 6, -36 + Math.sin(a) * 6);
      ctx.lineTo(Math.cos(a) * 8.5, -36 + Math.sin(a) * 8.5);
      ctx.stroke();
    }
  } else if (variant === 'void') {
    ctx.fillStyle = hexToRgba(colors.accent, 0.6);
    for (let i = 0; i < 3; i += 1) {
      const a = phase * 1.5 + (i / 3) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 17, -36 + Math.sin(a) * 8, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = hexToRgba(colors.accent, 0.85);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-7, -44);
    ctx.lineTo(-2, -38);
    ctx.lineTo(-5, -33);
    ctx.lineTo(1, -27);
    ctx.stroke();
  } else if (variant === 'deity') {
    const pulse = Math.sin(phase * 2) * 1.4;
    ctx.strokeStyle = hexToRgba(colors.accent, 0.95);
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.ellipse(0, -74 + pulse, 11, 4, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = hexToRgba(colors.accent, 0.8);
    [-1, 1].forEach((side) => {
      ctx.beginPath();
      ctx.moveTo(side * 7, -62);
      ctx.lineTo(side * 16, -72 + pulse);
      ctx.lineTo(side * 9, -58);
      ctx.closePath();
      ctx.fill();
    });
    ctx.beginPath();
    ctx.moveTo(-9, -28);
    ctx.lineTo(9, -28);
    ctx.lineTo(6, -20);
    ctx.lineTo(-6, -20);
    ctx.closePath();
    ctx.fill();
  } else if (variant === 'pablum') {
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, -8, -45, 16, 17, 5);
    ctx.fill();

    ctx.fillStyle = '#FFCB2E';
    for (let i = -2; i <= 2; i += 1) {
      const tall = 10 - Math.abs(i) * 1.7;
      ctx.beginPath();
      ctx.moveTo(i * 3.4 - 3, -62);
      ctx.lineTo(i * 3.4, -62 - tall);
      ctx.lineTo(i * 3.4 + 3, -62);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = hexToRgba(colors.accent, 0.35);
    ctx.beginPath();
    ctx.arc(-9.5, -37, 6.5, 0, Math.PI * 2);
    ctx.arc(9.5, -37, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.accent;
    roundRect(ctx, -12.5, -41, 6, 9, 3);
    ctx.fill();
    roundRect(ctx, 6.5, -41, 6, 9, 3);
    ctx.fill();

    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.arc(4, -56, 2.8, 0, Math.PI * 2);
    ctx.fill();
    return;
  } else if (variant === 'king') {
    ctx.fillStyle = colors.accent;
    ctx.beginPath();
    ctx.moveTo(-13, -63);
    ctx.lineTo(-13, -79);
    ctx.lineTo(-6.5, -71);
    ctx.lineTo(0, -84);
    ctx.lineTo(6.5, -71);
    ctx.lineTo(13, -79);
    ctx.lineTo(13, -63);
    ctx.closePath();
    ctx.fill();
    roundRect(ctx, -13.5, -67, 27, 7, 3);
    ctx.fill();

    ctx.fillStyle = '#FF4D6D';
    ctx.beginPath();
    ctx.arc(0, -75, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4AC6FF';
    [-9, 9].forEach((gx) => {
      ctx.beginPath();
      ctx.arc(gx, -73, 1.7, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = 'rgba(196, 38, 62, 0.9)';
    ctx.beginPath();
    ctx.moveTo(-7, -46);
    ctx.quadraticCurveTo(-17, -30, -12, -16);
    ctx.quadraticCurveTo(-4, -28, -7, -46);
    ctx.closePath();
    ctx.fill();
    return;
  } else if (variant === 'basket') {
    ctx.fillStyle = '#F5F6FA';
    roundRect(ctx, -9.5, -46, 19, 19, 5);
    ctx.fill();
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.fillStyle = colors.accent;
    ctx.font = '700 10px "DM Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('7', 0, -35);

    ctx.fillStyle = colors.body;
    roundRect(ctx, -11, -29, 22, 8, 3);
    ctx.fill();
    ctx.fillStyle = '#F5F6FA';
    roundRect(ctx, -9, -28, 18, 2.6, 1.3);
    ctx.fill();
  } else if (variant === 'rock') {
    const cx = 0;
    const cy = -34;
    const pulse = 0.7 + Math.sin(phase * 3) * 0.3;

    const halo = ctx.createRadialGradient(cx, cy, 2, cx, cy, 21);
    halo.addColorStop(0, 'rgba(190, 245, 255, 0.9)');
    halo.addColorStop(0.4, 'rgba(60, 150, 255, 0.42)');
    halo.addColorStop(1, 'rgba(30, 70, 200, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, 21, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#04060F';
    ctx.beginPath();
    ctx.arc(cx, cy, 4.2 + pulse * 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(160, 235, 255, ${0.5 + pulse * 0.4})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(cx, cy, 6.8 + pulse * 1.4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.save();
    ctx.strokeStyle = 'rgba(120, 215, 255, 0.95)';
    ctx.shadowColor = 'rgba(90, 190, 255, 0.9)';
    ctx.shadowBlur = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let i = 0; i < 12; i += 1) {
      const spread = (i / 12) * Math.PI * 2 + 0.18;
      const len = 16 + ((i * 7) % 9) + pulse * 3;
      ctx.lineWidth = i % 2 === 0 ? 2 : 1.3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      for (let s = 1; s <= 3; s += 1) {
        const d = (len * s) / 3;
        const wob = (s % 2 === 0 ? 1 : -1) * (2.2 + (i % 3));
        ctx.lineTo(
          cx + Math.cos(spread) * d + Math.cos(spread + Math.PI / 2) * wob,
          cy + Math.sin(spread) * d * 0.85 + Math.sin(spread + Math.PI / 2) * wob,
        );
      }
      ctx.stroke();
    }
    ctx.restore();
  } else if (variant === 'crown') {
    ctx.fillStyle = colors.accent;
    ctx.beginPath();
    ctx.moveTo(-8, -62);
    ctx.lineTo(-8, -70);
    ctx.lineTo(-4, -66);
    ctx.lineTo(0, -73);
    ctx.lineTo(4, -66);
    ctx.lineTo(8, -70);
    ctx.lineTo(8, -62);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath();
    ctx.arc(0, -68, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.arc(4, -56, 1.9, 0, Math.PI * 2);
  ctx.fill();
}

const GELATIN_GREEN = '#98FB98';
const GELATIN_PINK = '#FFB6C1';
const GELATIN_INK = '#15151C';
const GELATIN_CAPE = '#1B2B4A';

function drawGelatinBlob(ctx, x, y, r, color, squash = 1) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fillStyle = hexToRgba(color, 0.88);
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * squash, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.62)';
  ctx.beginPath();
  ctx.arc(x - r * 0.32, y - r * 0.34, r * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

function drawGelatinCrown(ctx, cx, cy, scale = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(-9, 0);
  ctx.lineTo(-9, -9);
  ctx.lineTo(-4.5, -3.6);
  ctx.lineTo(0, -12);
  ctx.lineTo(4.5, -3.6);
  ctx.lineTo(9, -9);
  ctx.lineTo(9, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#FF9900';
  ctx.beginPath();
  ctx.arc(0, -2.6, 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGelatin(ctx, phase, throwing, sliding, onGround) {
  const swing = onGround ? Math.sin(phase) * 9 : -6;
  const bob = Math.sin(phase * 2) * 1.6;

  if (sliding) {
    ctx.fillStyle = GELATIN_CAPE;
    ctx.beginPath();
    ctx.moveTo(0, -17);
    ctx.quadraticCurveTo(-20, -23, -30, -12);
    ctx.quadraticCurveTo(-15, -10, 0, -8);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = GELATIN_INK;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-6, -8);
    ctx.lineTo(-26, -3);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, -14, -20, 26, 15, 7);
    ctx.fill();

    ctx.fillStyle = GELATIN_INK;
    ctx.beginPath();
    ctx.arc(19, -15, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FF9900';
    ctx.beginPath();
    ctx.arc(22, -16, 2.2, 0, Math.PI * 2);
    ctx.fill();

    drawGelatinCrown(ctx, 19, -21, 0.72);
    drawGelatinBlob(ctx, 27, -5, 4.6, GELATIN_GREEN, 0.7);
    drawGelatinBlob(ctx, 33, -3, 4, GELATIN_PINK, 0.7);
    return;
  }

  ctx.fillStyle = GELATIN_CAPE;
  ctx.beginPath();
  ctx.moveTo(-3, -45);
  ctx.quadraticCurveTo(-21, -35 + bob, -18, -9);
  ctx.quadraticCurveTo(-9, -22, -3, -31);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = GELATIN_INK;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-3, -21);
  ctx.lineTo(-3 + swing, -2);
  ctx.moveTo(3, -21);
  ctx.lineTo(3 - swing, -2);
  ctx.moveTo(2, -40);
  ctx.lineTo(11, -33);
  ctx.moveTo(-2, -40);
  ctx.lineTo(-11, -33);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, -9, -47, 18, 28, 7);
  ctx.fill();
  ctx.fillStyle = 'rgba(21, 21, 28, 0.09)';
  roundRect(ctx, -9, -24, 18, 5, 3);
  ctx.fill();

  ctx.fillStyle = GELATIN_INK;
  ctx.beginPath();
  ctx.arc(0, -55, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FF9900';
  ctx.beginPath();
  ctx.arc(4, -56, 2.6, 0, Math.PI * 2);
  ctx.fill();

  drawGelatinCrown(ctx, 0, -62.5);

  if (throwing) {
    drawGelatinBlob(ctx, -7, -4, 6, GELATIN_GREEN, 0.55);
    drawGelatinBlob(ctx, 7, -3, 5.5, GELATIN_PINK, 0.55);
  } else {
    drawGelatinBlob(ctx, 13, -35 + bob, 4.6, GELATIN_GREEN, 1);
    drawGelatinBlob(ctx, -13, -35 + bob * 0.8, 4.2, GELATIN_PINK, 1);
  }
}

const PENGUIN_BODY = '#1A1C26';
const PENGUIN_BELLY = '#F7F3EA';
const PENGUIN_BEAK = '#FF9F1C';

function drawPenguinFoot(ctx, x, y, lift = 0) {
  ctx.save();
  ctx.translate(x, y - lift);
  ctx.fillStyle = PENGUIN_BEAK;
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPenguin(ctx, phase, sliding, onGround) {
  const swing = onGround ? Math.sin(phase) * 5 : 2;
  const bob = Math.sin(phase * 2) * 1.4;

  if (sliding) {
    ctx.strokeStyle = 'rgba(190, 236, 255, 0.85)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i += 1) {
      const off = i * 8;
      ctx.beginPath();
      ctx.moveTo(-18 - off, -7 - i * 5);
      ctx.lineTo(-36 - off, -7 - i * 5);
      ctx.stroke();
    }

    ctx.fillStyle = PENGUIN_BODY;
    ctx.beginPath();
    ctx.ellipse(-2, -13, 27, 12, -0.06, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = PENGUIN_BELLY;
    ctx.beginPath();
    ctx.ellipse(-1, -10, 20, 7, -0.06, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = PENGUIN_BODY;
    ctx.beginPath();
    ctx.arc(20, -17, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = PENGUIN_BELLY;
    ctx.beginPath();
    ctx.ellipse(22, -15.5, 5, 3.6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = PENGUIN_BODY;
    ctx.beginPath();
    ctx.arc(24, -18, 1.9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = PENGUIN_BEAK;
    ctx.beginPath();
    ctx.moveTo(28, -16);
    ctx.lineTo(36, -13.5);
    ctx.lineTo(28, -11);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(21, -2, 7, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  const flap = Math.sin(phase * 1.1) * 0.06;

  drawPenguinFoot(ctx, -7, -1, Math.max(0, swing * 2));
  drawPenguinFoot(ctx, 7, -1, Math.max(0, -swing * 2));

  ctx.fillStyle = PENGUIN_BODY;
  ctx.beginPath();
  ctx.ellipse(-13, -32 + bob, 5.5, 13, 0.34, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(13, -32 - bob, 5.5, 13, -0.34 - flap, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(0, -29, 15, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = PENGUIN_BELLY;
  ctx.beginPath();
  ctx.ellipse(2, -27, 10, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = PENGUIN_BODY;
  ctx.beginPath();
  ctx.arc(0, -55 + bob, 11, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = PENGUIN_BELLY;
  ctx.beginPath();
  ctx.ellipse(4.5, -56 + bob, 6.5, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = PENGUIN_BODY;
  ctx.beginPath();
  ctx.arc(6.5, -57 + bob, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = PENGUIN_BEAK;
  ctx.beginPath();
  ctx.moveTo(9, -55 + bob);
  ctx.lineTo(17, -52.5 + bob);
  ctx.lineTo(9, -50 + bob);
  ctx.closePath();
  ctx.fill();
}

const SKELETON_BONE = '#F7F4EF';
const SKELETON_INK = '#22252C';
const SKELETON_HOODIE = '#2D6B3D';
const SKELETON_HOOD = '#707070';
const SKELETON_SHORTS = '#E6C23D';
const SKELETON_SHOE = '#78549C';
const SKELETON_SHOE_FAR = '#5F4180';
const SKELETON_EYE = '#00F2FF';

function boneLimb(ctx, x1, y1, x2, y2, w = 4.4) {
  ctx.lineCap = 'round';
  ctx.strokeStyle = SKELETON_INK;
  ctx.lineWidth = w + 2.4;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.strokeStyle = SKELETON_BONE;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawSkeletonHead(ctx, x, y, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);

  ctx.fillStyle = SKELETON_BONE;
  ctx.strokeStyle = SKELETON_INK;
  ctx.lineWidth = 2;

  roundRect(ctx, -1.5, 2.5, 12.5, 9, 3.6);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(0.5, -3.6, 9.6, 9.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'rgba(146, 138, 124, 0.2)';
  ctx.beginPath();
  ctx.ellipse(-3.4, 0.6, 4.6, 4.2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.ellipse(1.6, -8.6, 4.2, 2.4, -0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#12151B';
  ctx.beginPath();
  ctx.ellipse(4.6, -4.4, 3.5, 3.9, -0.12, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.shadowColor = SKELETON_EYE;
  ctx.shadowBlur = 12;
  ctx.fillStyle = SKELETON_EYE;
  ctx.beginPath();
  ctx.arc(5.3, -4.4, 1.9, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#12151B';
  ctx.beginPath();
  ctx.moveTo(6.4, -0.6);
  ctx.lineTo(8.6, 2.2);
  ctx.lineTo(5.2, 2.2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = 'rgba(34, 37, 44, 0.55)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    roundRect(ctx, 1 + i * 2.7, 3.6, 2.3, 4.6, 0.8);
    ctx.fill();
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(0, 242, 255, 0.4)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.ellipse(0.5, -3.6, 9.4, 9, 0, -1.35, 0.35);
  ctx.stroke();

  ctx.restore();
}

function drawSkeleton(ctx, phase, sliding, onGround, throwing, scale = 1) {
  ctx.scale(scale, scale);
  const bob = onGround ? Math.sin(phase * 2) * 1.4 : -2;

  if (sliding) {
    ctx.globalAlpha = 0.6;
    boneLimb(ctx, -5, -11, 13, -7, 3.4);
    ctx.globalAlpha = 1;

    ctx.fillStyle = SKELETON_SHOE_FAR;
    roundRect(ctx, 11, -9.5, 14, 7.6, 3.6);
    ctx.fill();

    boneLimb(ctx, -1, -14, 18, -3, 4.2);

    ctx.fillStyle = SKELETON_SHOE;
    roundRect(ctx, 16, -6.5, 16, 9, 4.5);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
    roundRect(ctx, 17, 0.4, 14, 2.2, 1.1);
    ctx.fill();

    ctx.fillStyle = SKELETON_SHORTS;
    roundRect(ctx, -14, -20, 18, 12, 5);
    ctx.fill();

    ctx.fillStyle = SKELETON_HOOD;
    ctx.beginPath();
    ctx.ellipse(-22, -17, 11.5, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = SKELETON_HOODIE;
    roundRect(ctx, -27, -24, 26, 17, 8);
    ctx.fill();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
    roundRect(ctx, -27, -11, 26, 4, 2);
    ctx.fill();

    drawSkeletonHead(ctx, -24, -19, 0.86);
    return;
  }

  const swing = onGround ? Math.sin(phase) : 0.6;
  const farX = -3 + swing * 8;
  const nearX = 3 - swing * 8;

  ctx.globalAlpha = 0.6;
  boneLimb(ctx, -3, -22, farX, -7, 3.6);
  ctx.globalAlpha = 1;

  ctx.fillStyle = SKELETON_SHOE_FAR;
  roundRect(ctx, farX - 5, -8.2, 13, 7.6, 3.6);
  ctx.fill();

  boneLimb(ctx, 3, -22, nearX, -6.5, 4.2);

  ctx.fillStyle = SKELETON_SHOE;
  roundRect(ctx, nearX - 6, -8.4, 15, 8.4, 4);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
  roundRect(ctx, nearX - 5, -1.8, 13, 2.4, 1.2);
  ctx.fill();

  ctx.fillStyle = SKELETON_SHORTS;
  roundRect(ctx, -7.5, -34 + bob, 17, 13.5, 5);
  ctx.fill();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
  roundRect(ctx, -7.5, -28 + bob, 17, 3, 1.5);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.24)';
  roundRect(ctx, -6, -32 + bob, 7, 4, 2);
  ctx.fill();

  ctx.fillStyle = SKELETON_HOODIE;
  ctx.beginPath();
  ctx.moveTo(-10, -52 + bob);
  ctx.quadraticCurveTo(-17, -43 + bob, -11, -31 + bob);
  ctx.lineTo(8, -31 + bob);
  ctx.quadraticCurveTo(14, -42 + bob, 9, -52 + bob);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
  ctx.beginPath();
  ctx.moveTo(9, -52 + bob);
  ctx.quadraticCurveTo(14, -42 + bob, 8, -31 + bob);
  ctx.lineTo(3, -31 + bob);
  ctx.quadraticCurveTo(8, -42 + bob, 4, -52 + bob);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.32)';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-8, -38 + bob);
  ctx.quadraticCurveTo(-1, -33.5 + bob, 7, -38 + bob);
  ctx.stroke();

  ctx.fillStyle = SKELETON_HOOD;
  ctx.beginPath();
  ctx.ellipse(-4, -55 + bob, 12.5, 11, -0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.beginPath();
  ctx.ellipse(-7.5, -54 + bob, 7, 6.4, -0.12, 0, Math.PI * 2);
  ctx.fill();

  if (throwing) {
    ctx.strokeStyle = SKELETON_HOODIE;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(6, -46 + bob);
    ctx.lineTo(19, -51 + bob);
    ctx.stroke();

    ctx.strokeStyle = SKELETON_INK;
    ctx.lineWidth = 5.4;
    ctx.beginPath();
    ctx.moveTo(19, -51 + bob);
    ctx.lineTo(26, -53 + bob);
    ctx.stroke();
    ctx.strokeStyle = SKELETON_BONE;
    ctx.lineWidth = 3.4;
    ctx.stroke();
  } else {
    ctx.strokeStyle = SKELETON_HOODIE;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(5, -46 + bob);
    ctx.lineTo(4, -35 + bob);
    ctx.stroke();

    ctx.fillStyle = SKELETON_BONE;
    ctx.strokeStyle = SKELETON_INK;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(4, -33.4 + bob, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  drawSkeletonHead(ctx, 3, -56 + bob, 1);
}

export function drawPlayer(ctx, pl) {
  const {
    x,
    y,
    vy,
    onGround,
    groundY,
    pal,
    phase,
    spin = 0,
    sliding = false,
    scale = 1,
    skin,
    flying = false,
  } = pl;

  const colors =
    skin && skin.body
      ? { body: skin.body, accent: skin.accent }
      : { body: pal.player, accent: pal.accent };
  const variant = skin ? skin.variant : 'runner';
  const feet = groundY - y;

  ctx.save();
  ctx.translate(x, feet);
  ctx.rotate(spin);

  if (variant === 'gelatin') {
    drawGelatin(ctx, phase, pl.gelatinT > 0, sliding, onGround);
    ctx.restore();
    return;
  }

  if (variant === 'penguin') {
    drawPenguin(ctx, phase, sliding, onGround);
    ctx.restore();
    return;
  }

  if (variant === 'skeleton') {
    drawSkeleton(ctx, phase, sliding, onGround, pl.boneT > 0, scale);
    ctx.restore();
    return;
  }

  if (variant === 'victory') {
    drawVictory(ctx, phase, sliding, onGround, scale);
    ctx.restore();
    return;
  }

  if (variant === 'pilot') {
    drawPilot(ctx, phase, sliding, onGround, scale);
    ctx.restore();
    return;
  }

  if (sliding) {
    drawSliding(ctx, colors, phase);
    ctx.restore();
    return;
  }

  const swing = onGround ? Math.sin(phase) : vy > 0 ? -0.8 : 0.6;
  const tilt = onGround ? 0 : -0.1;
  ctx.rotate(tilt);
  ctx.scale(scale, scale);

  const glow = variant === 'neon';
  if (variant === 'wings') drawWings(ctx, colors, phase);

  if (flying) {
    ctx.fillStyle = hexToRgba(colors.accent, 0.28);
    ctx.beginPath();
    ctx.ellipse(0, -24, 30, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = hexToRgba(colors.accent, 0.5);
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.ellipse(0, -6 + i * 8, 19 - i * 4.5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const flap = Math.sin(phase * 0.9) * 4;
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.moveTo(-3, -40);
  ctx.quadraticCurveTo(-22, -47 + flap, -32, -29 + flap);
  ctx.quadraticCurveTo(-19, -37, -3, -33);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = colors.body;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-3, -21);
  ctx.lineTo(-3 + swing * 9, -2);
  ctx.moveTo(3, -21);
  ctx.lineTo(3 - swing * 9, -2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(2, -40);
  ctx.lineTo(9 - swing * 6, -28);
  ctx.stroke();

  if (glow) {
    ctx.shadowColor = colors.accent;
    ctx.shadowBlur = 14;
  }

  ctx.fillStyle = colors.body;
  roundRect(ctx, -9, -47, 18, 29, 8);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, -55, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';

  drawVariant(ctx, variant, colors, phase);

  ctx.restore();
}

export function drawParticles(ctx, list) {
  for (const pt of list) {
    const fade = Math.max(0, pt.life / pt.max);
    if (pt.bone) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, fade * 1.8);
      ctx.translate(pt.x, pt.y);
      ctx.rotate((pt.max - pt.life) * 16);
      ctx.fillStyle = SKELETON_BONE;
      ctx.strokeStyle = 'rgba(34, 37, 44, 0.7)';
      ctx.lineWidth = 1.4;
      roundRect(ctx, -pt.size / 2, -2.6, pt.size, 5.2, 2.6);
      ctx.fill();
      ctx.stroke();
      for (const sx of [-1, 1]) {
        for (const sy of [-1, 1]) {
          ctx.beginPath();
          ctx.arc((sx * pt.size) / 2, sy * 2.6, 3.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      continue;
    }
    if (pt.wheel) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, fade * 1.6);
      ctx.translate(pt.x, pt.y);
      ctx.rotate((pt.max - pt.life) * 15);
      ctx.fillStyle = '#1B1E24';
      ctx.beginPath();
      ctx.arc(0, 0, pt.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#E9EDF2';
      ctx.beginPath();
      ctx.arc(0, 0, pt.size * 0.44, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(233, 237, 242, 0.9)';
      ctx.lineWidth = 1.6;
      for (let s = 0; s < 4; s += 1) {
        const a = (s / 4) * Math.PI;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * pt.size * 0.4, Math.sin(a) * pt.size * 0.4);
        ctx.lineTo(-Math.cos(a) * pt.size * 0.4, -Math.sin(a) * pt.size * 0.4);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, pt.size * 0.94, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      continue;
    }
    if (pt.ball) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, fade * 1.6);
      ctx.fillStyle = '#F4A62A';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(38, 22, 12, 0.85)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(pt.x - pt.size, pt.y);
      ctx.lineTo(pt.x + pt.size, pt.y);
      ctx.moveTo(pt.x, pt.y - pt.size);
      ctx.lineTo(pt.x, pt.y + pt.size);
      ctx.stroke();
      ctx.restore();
      continue;
    }
    ctx.fillStyle = `rgba(${pt.rgb}, ${0.5 * fade})`;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.size * (0.4 + fade * 0.9), 0, Math.PI * 2);
    ctx.fill();
  }
}