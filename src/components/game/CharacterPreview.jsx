import { useEffect, useRef } from 'react';
import { drawPlayer } from './drawSprites';

export default function CharacterPreview({ skin, width = 58 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = width;
    const h = Math.round(width * 1.35);

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w / 2, h - 6);
    ctx.scale(0.82, 0.82);
    drawPlayer(ctx, {
      x: 0,
      y: 0,
      vy: 0,
      onGround: true,
      groundY: 0,
      pal: { player: '#3A1E2A', accent: '#FFB067' },
      phase: 0,
      skin,
    });
    ctx.restore();
  }, [skin, width]);

  return <canvas ref={canvasRef} aria-hidden="true" className="block" />;
}