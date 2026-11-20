import { Heart } from 'lucide-react';

export default function Hud({ score, best, biome, lives = 1, effects = [], multiplier = 1 }) {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[rgba(6,5,14,0.55)] via-[rgba(6,5,14,0.18)] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-6">
        <div>
          <p className="text-[9px] uppercase tracking-[0.38em] text-white/45">Score</p>
          <p
            data-testid="hud-score"
            className="font-display text-[38px] font-medium leading-none tabular-nums text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)] sm:text-5xl"
          >
            {String(score).padStart(3, '0')}
          </p>
          <div className="mt-2 flex items-center gap-1" data-testid="hud-lives">
            {Array.from({ length: lives }).map((_, index) => (
              <Heart
                key={index}
                className="h-3.5 w-3.5 fill-[#FF7D9C] text-[#FF7D9C] drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 pr-12 sm:pr-14">
          <span className="rounded-full bg-[rgba(11,10,22,0.4)] px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-white/75 ring-1 ring-white/15 backdrop-blur-sm">
            {biome}
          </span>
          {multiplier > 1 && (
            <span
              data-testid="hud-multiplier"
              className="rounded-full bg-[#FFC93C]/20 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#FFC93C] ring-1 ring-[#FFC93C]/40 backdrop-blur-sm"
            >
              Score x2
            </span>
          )}
          <span className="text-[10px] uppercase tracking-[0.24em] text-white/40">
            Best{' '}
            <span
              data-testid="hud-best"
              className={`tabular-nums ${
                score > 0 && score >= best ? 'font-semibold text-[#FFB067]' : 'text-white/75'
              }`}
            >
              {String(best).padStart(3, '0')}
            </span>
            {score > 0 && score >= best && (
              <span className="ml-1 text-[9px] text-[#FFB067]">new</span>
            )}
          </span>
        </div>
      </div>

      {effects.length > 0 && (
        <div
          data-testid="hud-effects"
          className="pointer-events-none absolute inset-x-0 top-[104px] flex flex-wrap justify-center gap-1.5 px-4"
        >
          {effects.map((effect) => (
            <span
              key={effect.kind}
              style={{
                color: effect.color,
                borderColor: `${effect.color}66`,
                backgroundColor: `${effect.color}1f`,
              }}
              className="rounded-full border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm"
            >
              {effect.label} {effect.left}s
            </span>
          ))}
        </div>
      )}
    </>
  );
}