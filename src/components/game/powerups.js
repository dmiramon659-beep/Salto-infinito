export const POWERUPS = [
  { kind: 'jump', label: 'Super jump', short: 'JUMP', color: '#7EF0C6', duration: 8 },
  { kind: 'shield', label: 'Invincible', short: 'SHIELD', color: '#7CC7FF', duration: 7 },
  { kind: 'life', label: 'Extra life', short: 'LIFE', color: '#FF7D9C', duration: 0 },
  { kind: 'slow', label: 'Slow motion', short: 'SLOW', color: '#B79CFF', duration: 6 },
  { kind: 'magnet', label: 'Magnet', short: 'MAGNET', color: '#FFA45B', duration: 8 },
  { kind: 'double', label: 'Points x2', short: 'X2', color: '#FFD75E', duration: 9 },
  { kind: 'shrink', label: 'Mini', short: 'MINI', color: '#9CF06A', duration: 8 },
  { kind: 'doublejump', label: 'Double jump', short: 'DOUBLE', color: '#6FE3FF', duration: 10 },
  { kind: 'bomb', label: 'Demolition', short: 'BOMB', color: '#FF8A6B', duration: 0 },
  { kind: 'coin', label: 'Points bag', short: '+PTS', color: '#FFE0A3', duration: 0 },
];

export const POWERUP_BY_KIND = POWERUPS.reduce((acc, item) => {
  acc[item.kind] = item;
  return acc;
}, {});

export const TIMED_KINDS = ['jump', 'shield', 'slow', 'magnet', 'double', 'shrink', 'doublejump'];