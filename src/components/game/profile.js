const COINS_KEY = 'vallajump:coins';
const OWNED_KEY = 'vallajump:owned';
const SKIN_KEY = 'vallajump:skin';
const BEST_KEY = 'vallajump:best';
const BOOSTER_KEY = 'vallajump:booster';

function readNumber(key, fallback) {
  const raw = window.localStorage.getItem(key);
  if (raw === null) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

export function loadProfile() {
  const best = readNumber(BEST_KEY, 0);
  const coins = readNumber(COINS_KEY, best);

  let owned = ['runner'];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(OWNED_KEY) || '[]');
    if (Array.isArray(parsed)) owned = Array.from(new Set(['runner', ...parsed]));
  } catch {
    owned = ['runner'];
  }

  const stored = window.localStorage.getItem(SKIN_KEY) || 'runner';
  const skin = owned.includes(stored) ? stored : 'runner';

  const booster = window.localStorage.getItem(BOOSTER_KEY) || null;

  return { coins, owned, skin, booster };
}

export function saveProfile(profile) {
  window.localStorage.setItem(COINS_KEY, String(profile.coins));
  window.localStorage.setItem(OWNED_KEY, JSON.stringify(profile.owned));
  window.localStorage.setItem(SKIN_KEY, profile.skin);
  if (profile.booster) window.localStorage.setItem(BOOSTER_KEY, profile.booster);
  else window.localStorage.removeItem(BOOSTER_KEY);
}