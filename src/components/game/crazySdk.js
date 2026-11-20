// Thin wrapper around the CrazyGames SDK v3.
// Every call is safe when the SDK is missing or disabled (local builds, previews).

let ready = false;

function sdk() {
  if (typeof window === 'undefined') return null;
  return window.CrazyGames && window.CrazyGames.SDK ? window.CrazyGames.SDK : null;
}

function safe(fn) {
  try {
    fn();
  } catch (error) {
    // The game must keep running even if the SDK rejects a call.
  }
}

export async function initCrazySdk() {
  const s = sdk();
  if (!s || typeof s.init !== 'function') return false;
  try {
    await s.init();
    ready = true;
  } catch (error) {
    ready = false;
  }
  if (ready) {
    safe(() => s.game.loadingStop());
  }
  return ready;
}

export function isCrazySdkReady() {
  return ready;
}

export function gameplayStart() {
  if (!ready) return;
  const s = sdk();
  if (s) safe(() => s.game.gameplayStart());
}

export function gameplayStop() {
  if (!ready) return;
  const s = sdk();
  if (s) safe(() => s.game.gameplayStop());
}

// Reward on adFinished only; adError means the player gets nothing.
export function requestRewardedAd({ onStart, onFinish, onError } = {}) {
  const s = sdk();
  if (!ready || !s || !s.ad || typeof s.ad.requestAd !== 'function') {
    if (onError) onError({ code: 'unavailable', message: 'CrazyGames SDK not available' });
    return;
  }
  safe(() =>
    s.ad.requestAd('rewarded', {
      adStarted: () => {
        if (onStart) onStart();
      },
      adFinished: () => {
        if (onFinish) onFinish();
      },
      adError: (error) => {
        if (onError) onError(error);
      },
    })
  );
}