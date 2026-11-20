const MIN_ANGLE = -125;
const MAX_ANGLE = 125;
const SWEEP = MAX_ANGLE - MIN_ANGLE;
const MAX_KMH = 999;
const DANGER_FROM = 0.9;

function angleFor(ratio) {
  return MIN_ANGLE + SWEEP * ratio;
}

function point(ratio, radius) {
  const a = (angleFor(ratio) * Math.PI) / 180;
  return { x: 50 + Math.sin(a) * radius, y: 50 - Math.cos(a) * radius };
}

function arcPath(from, to, radius = 43) {
  const p0 = point(from, radius);
  const p1 = point(to, radius);
  const large = SWEEP * (to - from) > 180 ? 1 : 0;
  return `M ${p0.x} ${p0.y} A ${radius} ${radius} 0 ${large} 1 ${p1.x} ${p1.y}`;
}

const TICKS = Array.from({ length: 21 }, (_, i) => {
  const t = i / 20;
  const major = i % 5 === 0;
  const inner = major ? 33 : 36.5;
  const a = point(t, inner);
  const b = point(t, 40.5);
  return { t, major, a, b };
});

export default function Speedometer({ speed = 0 }) {
  const ratio = Math.max(0, Math.min(1, speed / MAX_KMH));
  const danger = ratio >= DANGER_FROM;

  return (
    <div className="pointer-events-none absolute bottom-3 left-3" data-testid="hud-speed">
      <div className="relative h-[70px] w-[70px]">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle cx="50" cy="50" r="49" fill="rgba(11,10,22,0.55)" />
          <path
            d={arcPath(0, 1)}
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={arcPath(0, Math.max(ratio, 0.004))}
            fill="none"
            stroke={danger ? '#FF3B3B' : '#FFB067'}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {TICKS.map((tick) => (
            <line
              key={tick.t}
              x1={tick.a.x}
              y1={tick.a.y}
              x2={tick.b.x}
              y2={tick.b.y}
              stroke={
                tick.t >= DANGER_FROM
                  ? danger
                    ? '#FF3B3B'
                    : '#FF6B6B'
                  : tick.major
                    ? 'rgba(255,255,255,0.65)'
                    : 'rgba(255,255,255,0.28)'
              }
              strokeWidth={tick.major ? 1.8 : 1}
              strokeLinecap="round"
            />
          ))}
        </svg>

        <div className="absolute inset-0" style={{ transform: `rotate(${angleFor(ratio)}deg)` }}>
          <div className={`absolute inset-0 ${danger ? 'needle-danger' : ''}`}>
            <div
              className="absolute left-1/2 top-1/2 h-[35%] w-[2px] origin-bottom -translate-x-1/2 -translate-y-full rounded-full"
              style={{
                backgroundColor: danger ? '#FF3B3B' : '#FFF3E0',
                boxShadow: danger
                  ? '0 0 8px rgba(255,59,59,0.9)'
                  : '0 0 6px rgba(255,240,214,0.5)',
              }}
            />
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 ring-1 ring-[rgba(11,10,22,0.7)]" />

        <div className="absolute inset-x-0 bottom-0.5 flex flex-col items-center">
          <span
            className={`font-display text-[11px] font-medium leading-none tabular-nums ${
              danger ? 'text-[#FF5B5B]' : 'text-white'
            }`}
          >
            {speed}
          </span>
          <span className="text-[5px] uppercase tracking-[0.18em] text-white/45">km/h</span>
        </div>
      </div>
    </div>
  );
}