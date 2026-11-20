export default function GameOverOverlay({
  score,
  best,
  onRestart,
  canRevive = false,
  adState = 'idle',
  onRevive,
}) {
  const loading = adState === 'loading';

  return (
    <div
      data-testid="over-panel"
      className="absolute inset-0 z-10 flex items-center justify-center px-5"
    >
      <div className="w-full max-w-[400px] rounded-[26px] bg-[rgba(11,10,22,0.82)] px-7 py-7 text-center ring-1 ring-white/12 backdrop-blur-md">
        <p className="text-[10px] uppercase tracking-[0.44em] text-[#FF8B6E]">You crashed</p>
        <h2 className="mt-3 font-display text-[24px] leading-tight text-white">So close</h2>
        <div className="mt-5 flex items-end justify-center gap-8">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/35">Score</p>
            <p
              data-testid="final-score"
              className="font-display text-[38px] leading-none tabular-nums text-white"
            >
              {score}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/35">Best</p>
            <p className="font-display text-[24px] leading-none tabular-nums text-[#FFB067]">
              {best}
            </p>
          </div>
        </div>
        <p
          data-testid="run-earned"
          className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#FFB067]/80"
        >
          +{score} points for the shop
        </p>

        {canRevive && (
          <button
            type="button"
            data-testid="revive-button"
            disabled={loading}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onRevive}
            className="mt-5 w-full rounded-full bg-[#7CFFCB] px-6 py-3 text-sm font-semibold tracking-wide text-[#08281C] transition hover:bg-[#9DFFD9] active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? 'Loading ad…' : '▶ Revive watching an ad'}
          </button>
        )}

        {adState === 'error' && (
          <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#FF8B6E]">
            No ad available right now
          </p>
        )}

        <button
          type="button"
          data-testid="restart-button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onRestart}
          className="mt-3 w-full rounded-full bg-[#FFB067] px-6 py-3 text-sm font-semibold tracking-wide text-[#2A1520] transition hover:bg-[#FFC48A] active:scale-[0.99]"
        >
          Run again
        </button>
        <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-white/30">
          Press space to go again
        </p>
      </div>
    </div>
  );
}