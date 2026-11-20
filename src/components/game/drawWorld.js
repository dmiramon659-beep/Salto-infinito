import { hash, hexToRgba } from './palettes';

function cloud(ctx, x, y, s) {
  ctx.beginPath();
  ctx.arc(x, y, 26 * s, 0, Math.PI * 2);
  ctx.arc(x + 28 * s, y + 7 * s, 19 * s, 0, Math.PI * 2);
  ctx.arc(x - 28 * s, y + 9 * s, 15 * s, 0, Math.PI * 2);
  ctx.fill();
}

function drawPlanets(ctx, w, groundY, amount) {
  const bodies = [
    { x: 0.16, y: 0.26, r: 0.075, ring: true },
    { x: 0.44, y: 0.46, r: 0.03, ring: false },
    { x: 0.88, y: 0.15, r: 0.045, ring: false },
  ];
  ctx.globalAlpha = amount;
  for (const body of bodies) {
    const cx = body.x * w;
    const cy = body.y * groundY;
    const rad = Math.min(w, groundY) * body.r;

    if (body.ring) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.32);
      ctx.beginPath();
      ctx.ellipse(0, 0, rad * 1.9, rad * 0.5, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(214, 178, 255, 0.55)';
      ctx.lineWidth = Math.max(1.5, rad * 0.16);
      ctx.stroke();
      ctx.restore();
    }

    const grad = ctx.createRadialGradient(
      cx - rad * 0.35,
      cy - rad * 0.4,
      rad * 0.15,
      cx,
      cy,
      rad
    );
    grad.addColorStop(0, '#C9A2FF');
    grad.addColorStop(1, '#43257A');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function drawWorld(ctx, s, p, time) {
  const { w, h, groundY, scroll } = s;

  const sky = ctx.createLinearGradient(0, 0, 0, groundY + 20);
  sky.addColorStop(0, p.skyTop);
  sky.addColorStop(1, p.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(-18, -18, w + 36, groundY + 40);

  if (p.stars > 0.02) {
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 70; i++) {
      const sx = hash(i * 3.71) * w;
      const sy = hash(i * 9.13) * groundY * 0.62;
      const rad = 0.7 + hash(i * 5.37) * 1.2;
      const twinkle = 0.55 + 0.45 * Math.sin(time * 1.7 + i * 0.9);
      ctx.globalAlpha = Math.max(0, 0.7 * p.stars * twinkle);
      ctx.beginPath();
      ctx.arc(sx, sy, rad, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  const sunX = w * 0.74;
  const sunY = groundY * 0.26;
  const sunR = Math.max(22, Math.min(w, h) * 0.052);
  const halo = ctx.createRadialGradient(sunX, sunY, sunR * 0.5, sunX, sunY, sunR * 4.2);
  halo.addColorStop(0, hexToRgba(p.glow, 0.75));
  halo.addColorStop(1, hexToRgba(p.glow, 0));
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR * 4.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = p.glow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.fill();

  if (p.planets > 0.02) drawPlanets(ctx, w, groundY, p.planets);

  ctx.fillStyle = hexToRgba(p.glow, 0.4 * (1 - p.planets));
  const cloudGap = 250;
  const cloudPar = 0.05;
  const cloudFirst = Math.floor((scroll * cloudPar) / cloudGap) - 1;
  const cloudCount = Math.ceil(w / cloudGap) + 3;
  for (let k = 0; k < cloudCount; k++) {
    const ai = cloudFirst + k;
    const cx = ai * cloudGap - scroll * cloudPar + hash(ai * 1.7) * 80;
    const cy = 34 + hash(ai * 2.3) * (groundY * 0.4);
    cloud(ctx, cx, cy, 0.7 + hash(ai * 4.1) * 0.6);
  }

  ctx.fillStyle = p.far;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  for (let x = 0; x <= w + 8; x += 8) {
    const wx = x + scroll * 0.1;
    const y = groundY - 74 - (Math.sin(wx * 0.0043) * 32 + Math.sin(wx * 0.0117 + 2.1) * 14);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, groundY);
  ctx.closePath();
  ctx.fill();

  const midStep = 230;
  const midPar = 0.26;
  const midBase = groundY - 4;
  const midFirst = Math.floor((scroll * midPar) / midStep) - 1;
  const midCount = Math.ceil(w / midStep) + 3;
  ctx.fillStyle = p.mid;
  for (let k = 0; k < midCount; k++) {
    const ai = midFirst + k;
    const bx = ai * midStep - scroll * midPar;
    const peak = 104 + hash(ai * 1.71) * 128;
    const half = midStep * (0.52 + hash(ai * 2.37) * 0.24);
    ctx.beginPath();
    ctx.moveTo(bx - half, midBase);
    ctx.lineTo(bx, midBase - peak);
    ctx.lineTo(bx + half, midBase);
    ctx.closePath();
    ctx.fill();
  }

  const bushStep = 140;
  const bushPar = 0.52;
  const bushFirst = Math.floor((scroll * bushPar) / bushStep) - 1;
  const bushCount = Math.ceil(w / bushStep) + 3;
  ctx.fillStyle = p.near;
  for (let k = 0; k < bushCount; k++) {
    const ai = bushFirst + k;
    const bx = ai * bushStep - scroll * bushPar;
    const rad = 26 + hash(ai * 4.13) * 24;
    const cy = groundY + 4 - rad * 0.42;
    ctx.beginPath();
    ctx.arc(bx, cy, rad, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bx + rad * 0.9, cy + rad * 0.12, rad * 0.7, Math.PI, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = p.ground;
  ctx.fillRect(-18, groundY, w + 36, h - groundY + 18);
  ctx.fillStyle = p.groundTop;
  ctx.fillRect(-18, groundY - 4, w + 36, 7);

  ctx.fillStyle = hexToRgba(p.groundTop, 0.32);
  const dashGap = 84;
  const dashFirst = Math.floor(scroll / dashGap);
  const dashCount = Math.ceil(w / dashGap) + 2;
  for (let k = 0; k < dashCount; k++) {
    const x = (dashFirst + k) * dashGap - scroll;
    ctx.fillRect(x, groundY + 26, 38, 4);
    ctx.fillRect(x + 52, groundY + 54, 22, 3);
  }

  ctx.fillStyle = p.near;
  const tuftGap = 92;
  const tuftFirst = Math.floor(scroll / tuftGap);
  const tuftCount = Math.ceil(w / tuftGap) + 2;
  for (let k = 0; k < tuftCount; k++) {
    const ai = tuftFirst + k;
    const x = ai * tuftGap - scroll;
    const th = 7 + hash(ai * 6.7) * 9;
    ctx.fillRect(x, groundY - 4 - th, 3, th);
    ctx.fillRect(x + 6, groundY - 4 - th * 0.7, 2, th * 0.7);
  }
}