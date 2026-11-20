const PILOT_RED = '#E60000';
const PILOT_DARK = '#B00000';
const PILOT_INK = '#1A1A1A';
const PILOT_WHITE = '#FFFFFF';
const PILOT_YELLOW = '#FFD700';

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

function drawHelmet(ctx, cx, cy, r) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = PILOT_RED;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = PILOT_INK;
  roundRect(ctx, -r * 0.3, -r * 0.58, r * 1.5, r * 0.66, r * 0.28);
  ctx.fill();

  ctx.fillStyle = PILOT_DARK;
  roundRect(ctx, -r, r * 0.44, r * 2, r * 0.8, r * 0.3);
  ctx.fill();

  ctx.fillStyle = PILOT_INK;
  roundRect(ctx, -r * 0.1, r * 0.58, r * 0.72, r * 0.18, r * 0.09);
  ctx.fill();

  ctx.fillStyle = PILOT_WHITE;
  ctx.beginPath();
  ctx.moveTo(-r, -r * 0.32);
  ctx.quadraticCurveTo(-r * 0.6, -r * 0.2, -r * 0.42, r * 0.42);
  ctx.lineTo(-r * 0.8, r * 0.38);
  ctx.quadraticCurveTo(-r * 0.95, -r * 0.2, -r, -r * 0.32);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  ctx.fillStyle = PILOT_WHITE;
  ctx.font = `700 ${Math.max(5, r * 0.6)}px "DM Sans", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('15', 0, -r * 0.8);

  ctx.restore();
}

function limb(ctx, x1, y1, x2, y2, w) {
  ctx.lineCap = 'round';
  ctx.strokeStyle = PILOT_RED;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.strokeStyle = PILOT_WHITE;
  ctx.lineWidth = Math.max(1.4, w * 0.28);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function boot(ctx, x, y, w, h) {
  ctx.fillStyle = PILOT_INK;
  roundRect(ctx, x, y, w, 3.2, 1.6);
  ctx.fill();
  ctx.fillStyle = PILOT_RED;
  roundRect(ctx, x, y - h, w - 1, h, h * 0.45);
  ctx.fill();
}

function arm(ctx, x1, y1, x2, y2, color = PILOT_RED) {
  ctx.lineCap = 'round';
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function glove(ctx, x, y, r) {
  ctx.fillStyle = PILOT_INK;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function bolt(ctx, cx, cy, s) {
  ctx.beginPath();
  ctx.moveTo(cx + s * 0.3, cy - s * 0.78);
  ctx.lineTo(cx - s * 0.42, cy + s * 0.12);
  ctx.lineTo(cx - s * 0.02, cy + s * 0.12);
  ctx.lineTo(cx - s * 0.3, cy + s * 0.78);
  ctx.lineTo(cx + s * 0.45, cy - s * 0.14);
  ctx.lineTo(cx + s * 0.04, cy - s * 0.14);
  ctx.closePath();
  ctx.fill();
}

function badge(ctx, cx, cy, s) {
  ctx.fillStyle = PILOT_INK;
  ctx.beginPath();
  ctx.arc(cx, cy, s, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = PILOT_YELLOW;
  bolt(ctx, cx, cy, s);
}

function wheel(ctx, cx, cy, r) {
  ctx.fillStyle = PILOT_INK;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#E9EDF2';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
  ctx.fill();
}

function drawF1Car(ctx) {
  ctx.fillStyle = PILOT_INK;
  roundRect(ctx, -36, -24, 8, 14, 2.5);
  ctx.fill();
  ctx.fillStyle = PILOT_RED;
  roundRect(ctx, -33, -21, 5, 8, 2);
  ctx.fill();

  ctx.fillStyle = PILOT_RED;
  roundRect(ctx, -30, -15, 50, 10, 5);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(20, -14.5);
  ctx.lineTo(35, -10);
  ctx.lineTo(35, -6);
  ctx.lineTo(20, -5);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = PILOT_DARK;
  roundRect(ctx, -28, -8.5, 16, 4, 2);
  ctx.fill();

  ctx.fillStyle = PILOT_INK;
  roundRect(ctx, -9, -18, 17, 6, 3);
  ctx.fill();
  roundRect(ctx, 27, -5, 10, 4, 1.6);
  ctx.fill();

  ctx.fillStyle = PILOT_YELLOW;
  bolt(ctx, -3, -10.5, 4.4);

  wheel(ctx, -22, -9, 9);
  wheel(ctx, 16, -8, 8);

  drawHelmet(ctx, -2, -22, 7);
}

export function drawPilot(ctx, phase, sliding, onGround, scale = 1) {
  ctx.scale(scale, scale);

  if (sliding) {
    drawF1Car(ctx);
    return;
  }

  const swing = onGround ? Math.sin(phase) : 0.55;
  const farX = -3 + swing * 8;
  const nearX = 3 - swing * 8;

  ctx.globalAlpha = 0.72;
  limb(ctx, -3, -23, farX, -6, 6.4);
  ctx.globalAlpha = 1;
  boot(ctx, farX - 5, -3, 12, 4.6);

  limb(ctx, 3, -23, nearX, -6, 7);
  boot(ctx, nearX - 6, -3.2, 13, 5.2);

  arm(ctx, -7, -42, -7, -27);

  ctx.fillStyle = PILOT_RED;
  roundRect(ctx, -9, -47, 18, 27, 8);
  ctx.fill();

  badge(ctx, 2, -37, 3.6);

  ctx.fillStyle = PILOT_INK;
  roundRect(ctx, -9, -26, 18, 4, 2);
  ctx.fill();

  glove(ctx, -7, -26, 3.5);

  arm(ctx, 7, -42, 7, -27);
  glove(ctx, 7, -26, 3.5);

  drawHelmet(ctx, 0, -55, 10.5);
}