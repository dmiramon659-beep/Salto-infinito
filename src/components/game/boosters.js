export const BOOSTERS = [
  {
    id: 'escudo',
    name: 'Starting shield',
    desc: 'You start the run with a shield.',
    price: 250,
    color: '#7CC7FF',
    powers: ['shield'],
  },
  {
    id: 'iman',
    name: 'Magnet',
    desc: 'Pulls power-ups in from the start.',
    price: 320,
    color: '#FFA45B',
    powers: ['magnet'],
  },
  {
    id: 'puntos',
    name: 'Points x2',
    desc: 'You start with doubled points.',
    price: 480,
    color: '#FFD75E',
    powers: ['double'],
  },
  {
    id: 'salto',
    name: 'Super jump',
    desc: 'Higher jumps from the start.',
    price: 650,
    color: '#7EF0C6',
    powers: ['jump'],
  },
  {
    id: 'doble',
    name: 'Double jump',
    desc: 'Double jump from the start.',
    price: 900,
    color: '#6FE3FF',
    powers: ['doublejump'],
  },
  {
    id: 'vida',
    name: 'Extra life',
    desc: 'You start with one more life.',
    price: 1200,
    color: '#FF7D9C',
    powers: ['life'],
  },
  {
    id: 'aurora',
    name: 'Aurora pack',
    desc: 'Shield and magnet from the start.',
    price: 2400,
    color: '#8BFFC9',
    powers: ['shield', 'magnet'],
    pack: 'aurora',
  },
  {
    id: 'tormenta',
    name: 'Storm pack',
    desc: 'Double jump and points x2 from the start.',
    price: 4000,
    color: '#8FD3FF',
    powers: ['doublejump', 'double'],
    pack: 'storm',
  },
  {
    id: 'volcan',
    name: 'Volcano pack',
    desc: 'Shield and extra life from the start.',
    price: 6500,
    color: '#FF7A3C',
    powers: ['shield', 'life'],
    pack: 'volcano',
  },
];

export const BOOSTER_BY_ID = BOOSTERS.reduce((acc, booster) => {
  acc[booster.id] = booster;
  return acc;
}, {});