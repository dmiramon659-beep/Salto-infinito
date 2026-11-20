export const BIOMES = [
  {
    label: 'DUNES',
    skyTop: '#FFE4BE',
    skyBottom: '#FF9E7B',
    glow: '#FFF7E6',
    far: '#E99B7E',
    mid: '#C4645E',
    near: '#8C4049',
    ground: '#5C2939',
    groundTop: '#7E3C4D',
    prop: '#FBEBD2',
    player: '#3A1E2A',
    accent: '#FFB067',
    stars: 0,
    planets: 0,
  },
  {
    label: 'SAVANNA',
    skyTop: '#FFEDC4',
    skyBottom: '#F7AE6A',
    glow: '#FFF9E6',
    far: '#DB9C63',
    mid: '#B3743F',
    near: '#84512C',
    ground: '#553319',
    groundTop: '#6E4626',
    prop: '#F7E7C6',
    player: '#33200F',
    accent: '#FFC14D',
    stars: 0,
    planets: 0,
  },
  {
    label: 'FOREST',
    skyTop: '#DAF3E6',
    skyBottom: '#7EC7AD',
    glow: '#FFFDF2',
    far: '#58A290',
    mid: '#317869',
    near: '#1D4F48',
    ground: '#12302A',
    groundTop: '#204B41',
    prop: '#F1E3C5',
    player: '#0E2A25',
    accent: '#FFD166',
    stars: 0,
    planets: 0,
  },
  {
    label: 'SNOW',
    skyTop: '#E6F1FB',
    skyBottom: '#A7C8E7',
    glow: '#FFFFFF',
    far: '#9CB7D3',
    mid: '#7997B9',
    near: '#587490',
    ground: '#3C5165',
    groundTop: '#E9F3FC',
    prop: '#3F4D61',
    player: '#26333F',
    accent: '#FF8A5B',
    stars: 0,
    planets: 0,
  },
  {
    label: 'NIGHT',
    skyTop: '#131531',
    skyBottom: '#4C3A70',
    glow: '#FFF1C6',
    far: '#2B2B58',
    mid: '#212042',
    near: '#181731',
    ground: '#0C0B1C',
    groundTop: '#1D1B3A',
    prop: '#C9B9FF',
    player: '#F6EFE6',
    accent: '#FF8B6E',
    stars: 1,
    planets: 0.35,
  },
  {
    label: 'SPACE',
    skyTop: '#08040F',
    skyBottom: '#2B1350',
    glow: '#E9DCFF',
    far: '#2A1247',
    mid: '#1D0D33',
    near: '#150826',
    ground: '#0A0414',
    groundTop: '#30194F',
    prop: '#7FE3FF',
    player: '#FFF1F8',
    accent: '#FF6FB5',
    stars: 1,
    planets: 1,
  },
];

const COLOR_KEYS = [
  'skyTop',
  'skyBottom',
  'glow',
  'far',
  'mid',
  'near',
  'ground',
  'groundTop',
  'prop',
  'player',
  'accent',
];

function toRgb(hex) {
  let body = hex.replace('#', '');
  if (body.length === 3) {
    body = body
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(body, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function hexToRgba(hex, alpha) {
  const [r, g, b] = toRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function mixColor(a, b, t) {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const from = toRgb(a);
  const to = toRgb(b);
  const r = Math.round(from[0] + (to[0] - from[0]) * t);
  const g = Math.round(from[1] + (to[1] - from[1]) * t);
  const bl = Math.round(from[2] + (to[2] - from[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

export function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function hexToHsl(hex) {
  const [r255, g255, b255] = toRgb(hex);
  const r = r255 / 255;
  const g = g255 / 255;
  const b = b255 / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const sat = Math.max(0, Math.min(100, s)) / 100;
  const lig = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * lig - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lig - c / 2;
  let rgb;
  if (hue < 60) rgb = [c, x, 0];
  else if (hue < 120) rgb = [x, c, 0];
  else if (hue < 180) rgb = [0, c, x];
  else if (hue < 240) rgb = [0, x, c];
  else if (hue < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  const to = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${to(rgb[0])}${to(rgb[1])}${to(rgb[2])}`;
}

function tint(hex, hueShift, lightShift) {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h + hueShift, s, l + lightShift);
}

const PACK_BASES = {
  aurora: {
    label: 'AURORA',
    hue: 52,
    light: 7,
    base: {
      skyTop: '#081726',
      skyBottom: '#1E5B58',
      glow: '#C9FFE8',
      far: '#1B4A50',
      mid: '#143238',
      near: '#0B2126',
      ground: '#071518',
      groundTop: '#123035',
      prop: '#B8FFE4',
      player: '#F4FFF9',
      accent: '#8BFFC9',
      stars: 1,
      planets: 0.2,
    },
  },
  storm: {
    label: 'STORM',
    hue: 26,
    light: 8,
    base: {
      skyTop: '#1E2434',
      skyBottom: '#55617A',
      glow: '#DDE7F5',
      far: '#37435A',
      mid: '#293347',
      near: '#1C2233',
      ground: '#12161F',
      groundTop: '#242C3E',
      prop: '#E6EDF9',
      player: '#F6F9FF',
      accent: '#8FD3FF',
      stars: 0.18,
      planets: 0,
    },
  },
  volcano: {
    label: 'VOLCANO',
    hue: 34,
    light: 6,
    base: {
      skyTop: '#280811',
      skyBottom: '#8A2A19',
      glow: '#FFD9A8',
      far: '#571A15',
      mid: '#3C100E',
      near: '#280A0A',
      ground: '#140404',
      groundTop: '#31100C',
      prop: '#FFCFA0',
      player: '#FFE9D8',
      accent: '#FF7A3C',
      stars: 0.35,
      planets: 0.25,
    },
  },
};

export const PACKS = Object.entries(PACK_BASES).reduce((acc, [id, def]) => {
  acc[id] = Array.from({ length: 10 }, (_, i) => {
    const t = i / 9;
    const hue = (t - 0.5) * def.hue;
    const light = Math.sin(t * Math.PI) * def.light - def.light * 0.3;
    const base = def.base;
    return {
      label: `${def.label} ${String(i + 1).padStart(2, '0')}`,
      skyTop: tint(base.skyTop, hue, light),
      skyBottom: tint(base.skyBottom, hue * 0.7, light * 0.9),
      glow: tint(base.glow, hue * 0.35, light * 0.4),
      far: tint(base.far, hue, light),
      mid: tint(base.mid, hue, light * 0.9),
      near: tint(base.near, hue, light * 0.8),
      ground: tint(base.ground, hue, light * 0.6),
      groundTop: tint(base.groundTop, hue, light * 0.7),
      prop: tint(base.prop, hue * 0.5, light * 0.4),
      player: base.player,
      accent: tint(base.accent, hue * 0.8, light * 0.3),
      stars: base.stars,
      planets: base.planets,
    };
  });
  return acc;
}, {});

const SPAN = 3200;
const PACK_SPAN = 1600;

function blend(list, scroll, span) {
  const total = scroll / span;
  const floor = Math.floor(total);
  const index = ((floor % list.length) + list.length) % list.length;
  const next = (index + 1) % list.length;
  const local = total - floor;
  const raw = Math.max(0, Math.min(1, (local - 0.68) / 0.32));
  const f = raw * raw * (3 - 2 * raw);

  const from = list[index];
  const to = list[next];
  const out = { label: f > 0.55 ? to.label : from.label };

  for (const key of COLOR_KEYS) {
    out[key] = mixColor(from[key], to[key], f);
  }
  out.stars = from.stars + (to.stars - from.stars) * f;
  out.planets = from.planets + (to.planets - from.planets) * f;
  return out;
}

export function getPalette(scroll, packId = null) {
  const pack = packId ? PACKS[packId] : null;
  return pack ? blend(pack, scroll, PACK_SPAN) : blend(BIOMES, scroll, SPAN);
}