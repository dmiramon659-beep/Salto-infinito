export default function StartOverlay({ onStart, best = 0, coins = 0 }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center px-5">
      <div className="w-full max-w-[420px] rounded-[26px] bg-[rgba(11,10,22,0.74)] px-7 py-8 text-center ring-1 ring-white/12 backdrop-blur-md">
        <p className="text-[10px] uppercase tracking-[0.44em] text-[#FFB067]">Endless runner</p>
        <h2 className="mt-3 font-display text-[26px] leading-[1.15] text-white sm:text-[32px]">
          Jump the fences.
          <br />
          The world won't wait.
        </h2>
        <p className="mt-3 text-[13px] leading-relaxed text-white/55">
          Faster every second, a new landscape every time. There is no finish line: only your best.
        </p>

        <div className="mt-5 flex items-center justify-center gap-8">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/35">Best</p>
            <p
              data-testid="start-best"
              className="font-display text-2xl leading-none tabular-nums text-white"
            >
              {String(best).padStart(3, '0')}
            </p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/35">Shop balance</p>
            <p
              data-testid="start-coins"
              className="font-display text-2xl leading-none tabular-nums text-[#FFB067]"
            >
              {coins}
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid="start-button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onStart}
          className="mt-6 w-full rounded-full bg-[#FFB067] px-6 py-3 text-sm font-semibold tracking-wide text-[#2A1520] transition hover:bg-[#FFC48A] active:scale-[0.99]"
        >
          Start running
        </button>
        <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/30">
          Space / ↑ jump · swipe down to slide
        </p>
      </div>
    </div>
  );
}