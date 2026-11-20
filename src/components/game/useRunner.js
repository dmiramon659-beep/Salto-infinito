import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEATH_DURATION,
  createGame,
  jump,
  releaseJump,
  render,
  revive,
  resize,
  slide,
  toKmh,
  update,
} from './engine';
import { getPalette } from './palettes';
import { POWERUP_BY_KIND, TIMED_KINDS } from './powerups';
import { playDeath, playHurt, playJump, playPickup, playSlide } from './sound';
import { gameplayStart, gameplayStop } from './crazySdk';

const BEST_KEY = 'vallajump:best';
const SWIPE_DOWN = 26;

function readBest() {
  const raw = Number(window.localStorage.getItem(BEST_KEY) || 0);
  return Number.isFinite(raw) ? raw : 0;
}

function flushEvents(g) {
  if (!g.events.length) return;
  for (const event of g.events) {
    if (event === 'jump') playJump();
    else if (event === 'slide') playSlide();
    else if (event === 'powerup') playPickup();
    else if (event === 'hurt') playHurt();
    else if (event === 'death') playDeath();
  }
  g.events.length = 0;
}

export default function useRunner({ skinId = 'runner', boosterId = null, onRunEnd, onRunStart } = {}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const dprRef = useRef(1);
  const phaseRef = useRef('ready');
  const overAtRef = useRef(0);
  const labelRef = useRef(getPalette(0).label);
  const gestureRef = useRef(null);
  const statusRef = useRef('');
  const skinRef = useRef(skinId);
  const boosterRef = useRef(boosterId);
  const onRunEndRef = useRef(onRunEnd);
  const onRunStartRef = useRef(onRunStart);
  const bestRef = useRef(readBest());

  const [phase, setPhase] = useState('ready');
  const [score, setScore] = useState(0);
  const [biome, setBiome] = useState(labelRef.current);
  const [lives, setLives] = useState(1);
  const [effects, setEffects] = useState([]);
  const [best, setBest] = useState(bestRef.current);
  const [multiplier, setMultiplier] = useState(1);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    skinRef.current = skinId;
  }, [skinId]);

  useEffect(() => {
    onRunEndRef.current = onRunEnd;
  }, [onRunEnd]);

  useEffect(() => {
    boosterRef.current = boosterId;
  }, [boosterId]);

  useEffect(() => {
    onRunStartRef.current = onRunStart;
  }, [onRunStart]);

  const start = useCallback(() => {
    const g = gameRef.current;
    if (!g) return;
    gameRef.current = createGame(g.w, g.h, skinRef.current, boosterRef.current);
    if (onRunStartRef.current) onRunStartRef.current();
    phaseRef.current = 'playing';
    statusRef.current = '';
    setPhase('playing');
    setScore(0);
    setLives(gameRef.current.lives);
    setEffects([]);
  }, []);

  const press = useCallback(
    (event) => {
      const current = phaseRef.current;
      if (current === 'paused') return;
      gestureRef.current = event && typeof event.clientY === 'number' ? event.clientY : null;
      if (current === 'playing') {
        jump(gameRef.current);
        return;
      }
      if (current === 'over' && Date.now() - overAtRef.current < 400) return;
      start();
    },
    [start]
  );

  const release = useCallback(() => {
    gestureRef.current = null;
    if (phaseRef.current === 'playing') releaseJump(gameRef.current);
  }, []);

  const togglePause = useCallback(() => {
    const current = phaseRef.current;
    if (current === 'playing') {
      gestureRef.current = null;
      if (gameRef.current) releaseJump(gameRef.current);
      phaseRef.current = 'paused';
      setPhase('paused');
    } else if (current === 'paused') {
      phaseRef.current = 'playing';
      setPhase('playing');
    }
  }, []);

  const move = useCallback((event) => {
    if (phaseRef.current !== 'playing') return;
    const from = gestureRef.current;
    if (from === null || typeof event.clientY !== 'number') return;
    if (event.clientY - from > SWIPE_DOWN) {
      gestureRef.current = event.clientY;
      slide(gameRef.current);
    }
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const applySize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(320, Math.round(rect.width));
      const h = Math.max(260, Math.round(rect.height));
      dprRef.current = dpr;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      if (gameRef.current) resize(gameRef.current, w, h);
      else gameRef.current = createGame(w, h, skinRef.current, boosterRef.current);
    };

    applySize();
    const observer = new ResizeObserver(applySize);
    observer.observe(wrap);

    let raf = 0;
    let last = 0;
    let hudAcc = 0;

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.034, (now - last) / 1000) : 0.016;
      last = now;
      const g = gameRef.current;
      if (!g) return;

      if (phaseRef.current === 'playing') {
        update(g, dt);
        flushEvents(g);
        if (g.dying && g.deathT >= DEATH_DURATION) {
          phaseRef.current = 'over';
          overAtRef.current = Date.now();
          setPhase('over');
          setScore(g.score);
          if (onRunEndRef.current) onRunEndRef.current(g.score);
        }
      } else if (phaseRef.current === 'ready') {
        g.scroll += 60 * dt;
        g.runPhase += dt * 5;
      }

      ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
      const pal = render(ctx, g, now / 1000);

      hudAcc += dt;
      if (hudAcc > 0.1) {
        hudAcc = 0;
        setScore(g.score);
        setMultiplier(g.multiplier);
        setSpeed(phaseRef.current === 'playing' ? toKmh(g.time) : 0);

        if (g.score > bestRef.current) {
          bestRef.current = g.score;
          window.localStorage.setItem(BEST_KEY, String(g.score));
          setBest(g.score);
        }

        if (pal.label !== labelRef.current) {
          labelRef.current = pal.label;
          setBiome(pal.label);
        }

        const active = TIMED_KINDS.filter((kind) => g.effects[kind] > 0).map((kind) => ({
          kind,
          label: POWERUP_BY_KIND[kind].short,
          color: POWERUP_BY_KIND[kind].color,
          left: Math.ceil(g.effects[kind]),
        }));
        const signature = `${g.lives}|${active.map((item) => `${item.kind}${item.left}`).join(',')}`;
        if (signature !== statusRef.current) {
          statusRef.current = signature;
          setLives(g.lives);
          setEffects(active);
        }
      }
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const upCodes = ['Space', 'ArrowUp', 'KeyW', 'Enter'];
    const downCodes = ['ArrowDown', 'KeyS'];

    const onDown = (e) => {
      if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        togglePause();
        return;
      }
      if (upCodes.includes(e.code)) {
        e.preventDefault();
        if (phaseRef.current === 'paused') {
          togglePause();
          return;
        }
        press();
        return;
      }
      if (downCodes.includes(e.code)) {
        e.preventDefault();
        if (phaseRef.current === 'playing') slide(gameRef.current);
      }
    };
    const onUp = (e) => {
      if (upCodes.includes(e.code)) release();
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [press, release, togglePause]);

  const reviveRun = useCallback(() => {
    const g = gameRef.current;
    if (!g || phaseRef.current !== 'over') return;
    revive(g);
    phaseRef.current = 'playing';
    setPhase('playing');
    setScore(g.score);
    setLives(g.lives);
    setEffects([]);
  }, []);

  // CrazyGames: tell the platform when active gameplay starts and stops.
  useEffect(() => {
    if (phase === 'playing') gameplayStart();
    else gameplayStop();
  }, [phase]);

  return {
    wrapRef,
    canvasRef,
    phase,
    score,
    best,
    biome,
    lives,
    effects,
    multiplier,
    speed,
    reviveRun,
    press,
    release,
    move,
    togglePause,
  };
}