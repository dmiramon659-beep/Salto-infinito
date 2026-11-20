import { useCallback, useRef, useState } from 'react';
import GameOverOverlay from '@/components/game/GameOverOverlay';
import Hud from '@/components/game/Hud';
import PauseButton from '@/components/game/PauseButton';
import PauseOverlay from '@/components/game/PauseOverlay';
import ShopDrawer from '@/components/game/ShopDrawer';
import Speedometer from '@/components/game/Speedometer';
import SoundToggle from '@/components/game/SoundToggle';
import StartOverlay from '@/components/game/StartOverlay';
import { gameplayStop, isCrazySdkReady, requestRewardedAd } from '@/components/game/crazySdk';
import { loadProfile, saveProfile } from '@/components/game/profile';
import { setForcedMute } from '@/components/game/sound';
import useRunner from '@/components/game/useRunner';

export default function Play() {
  const [profile, setProfile] = useState(loadProfile);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('shop');
  const [reviveUsed, setReviveUsed] = useState(false);
  const [adState, setAdState] = useState('idle');
  const awardedRef = useRef(0);
  const phaseRef = useRef('ready');

  const handleRunEnd = useCallback((score) => {
    if (!score) return;
    awardedRef.current = score;
    setProfile((prev) => {
      const next = { ...prev, coins: prev.coins + score };
      saveProfile(next);
      return next;
    });
  }, []);

  const handleRunStart = useCallback(() => {
    awardedRef.current = 0;
    setReviveUsed(false);
    setAdState('idle');
    setDrawerOpen(false);
    setProfile((prev) => {
      if (!prev.booster) return prev;
      const next = { ...prev, booster: null };
      saveProfile(next);
      return next;
    });
  }, []);

  const {
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
  } = useRunner({
    skinId: profile.skin,
    boosterId: profile.booster,
    onRunEnd: handleRunEnd,
    onRunStart: handleRunStart,
  });

  phaseRef.current = phase;

  const buySkin = (skin) => {
    setProfile((prev) => {
      if (prev.owned.includes(skin.id) || prev.coins < skin.price) return prev;
      const next = {
        ...prev,
        coins: prev.coins - skin.price,
        owned: [...prev.owned, skin.id],
        skin: skin.id,
      };
      saveProfile(next);
      return next;
    });
  };

  const selectSkin = (skin) => {
    setProfile((prev) => {
      if (!prev.owned.includes(skin.id)) return prev;
      const next = { ...prev, skin: skin.id };
      saveProfile(next);
      return next;
    });
  };

  const buyBooster = (booster) => {
    setProfile((prev) => {
      if (prev.booster || prev.coins < booster.price) return prev;
      const next = { ...prev, coins: prev.coins - booster.price, booster: booster.id };
      saveProfile(next);
      return next;
    });
  };

  const openDrawer = (tab) => {
    setDrawerTab(tab);
    setDrawerOpen(true);
  };

  const grantRevive = () => {
    setReviveUsed(true);
    setAdState('idle');
    // A new run started while the ad played: do not revive that one.
    if (phaseRef.current !== 'over') return;
    setProfile((prev) => {
      const next = { ...prev, coins: Math.max(0, prev.coins - awardedRef.current) };
      saveProfile(next);
      return next;
    });
    awardedRef.current = 0;
    reviveRun();
  };

  // One rewarded ad per run: revive on adFinished, nothing on adError.
  const handleRevive = () => {
    if (reviveUsed || adState === 'loading') return;
    if (!isCrazySdkReady()) {
      // Not running on CrazyGames (local preview): no ad to play.
      grantRevive();
      return;
    }
    setAdState('loading');
    requestRewardedAd({
      onStart: () => {
        setForcedMute(true);
        gameplayStop();
      },
      onFinish: () => {
        setForcedMute(false);
        grantRevive();
      },
      onError: () => {
        setForcedMute(false);
        setReviveUsed(true);
        setAdState('error');
      },
    });
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center gap-5 bg-[#0B0A16] px-4 py-6 text-[#F7F0E7]">
      <header className="flex w-full max-w-[1080px] items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.42em] text-[#FF9E7B]/80">No finish line</p>
          <h1 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
            Endless Jump
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <p className="hidden text-[10px] uppercase tracking-[0.28em] text-white/30 sm:block">
            Space / ↑ jump · ↓ slide
          </p>
          <button
            type="button"
            data-testid="open-shop"
            onClick={() => openDrawer('shop')}
            className="rounded-full bg-[#FFB067] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2A1520] transition hover:bg-[#FFC48A]"
          >
            Shop
          </button>
          <button
            type="button"
            data-testid="open-locker"
            onClick={() => openDrawer('locker')}
            className="rounded-full bg-white/[0.06] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
          >
            Locker
          </button>
        </div>
      </header>

      <div
        ref={wrapRef}
        data-testid="stage"
        onPointerDown={press}
        onPointerMove={move}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={release}
        className="relative h-[60vh] max-h-[600px] min-h-[340px] w-full max-w-[1080px] cursor-pointer touch-none select-none overflow-hidden rounded-[26px] ring-1 ring-white/10 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
      >
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
        <Hud
          score={score}
          best={best}
          biome={biome}
          lives={lives}
          effects={effects}
          multiplier={multiplier}
        />
        <Speedometer speed={speed} />
        <SoundToggle />
        <PauseButton
          paused={phase === 'paused'}
          visible={phase === 'playing' || phase === 'paused'}
          onToggle={togglePause}
        />
        {phase === 'paused' && <PauseOverlay onResume={togglePause} />}
        {phase === 'ready' && (
          <StartOverlay onStart={press} best={best} coins={profile.coins} />
        )}
        {phase === 'over' && (
          <GameOverOverlay
            score={score}
            best={best}
            onRestart={press}
            canRevive={!reviveUsed}
            adState={adState}
            onRevive={handleRevive}
          />
        )}
      </div>

      <p className="text-center text-[10px] uppercase tracking-[0.24em] text-white/25">
        Hold to jump higher · Swipe down to slide under
      </p>

      <ShopDrawer
        open={drawerOpen}
        tab={drawerTab}
        onTabChange={setDrawerTab}
        onClose={() => setDrawerOpen(false)}
        coins={profile.coins}
        owned={profile.owned}
        selected={profile.skin}
        activeBooster={profile.booster}
        locked={phase === 'playing' || phase === 'paused'}
        onBuySkin={buySkin}
        onSelectSkin={selectSkin}
        onBuyBooster={buyBooster}
      />
    </div>
  );
}