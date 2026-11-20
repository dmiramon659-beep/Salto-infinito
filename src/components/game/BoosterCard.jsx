export default function BoosterCard({ booster, coins, active, blocked, locked, onBuy }) {
  const affordable = coins >= booster.price;

  let label = `Buy · ${booster.price}`;
  let disabled = locked;
  if (active) {
    label = 'Ready to run';
    disabled = true;
  } else if (blocked) {
    label = 'You already have a booster';
    disabled = true;
  } else if (!affordable) {
    label = `Missing ${booster.price - coins}`;
    disabled = true;
  }

  return (
    <div
      data-testid={`booster-${booster.id}`}
      className={`flex flex-col rounded-2xl border p-3 transition ${
        active ? 'border-[#FFB067]/70 bg-[#FFB067]/10' : 'border-white/10 bg-white/[0.03]'
      }`}
    >
      <span
        className="h-1 w-8 rounded-full"
        style={{ backgroundColor: booster.color }}
        aria-hidden="true"
      />
      <p className="mt-2 font-display text-[13px] leading-tight text-white">{booster.name}</p>
      <p className="mt-0.5 text-[9px] leading-snug text-white/45">{booster.desc}</p>
      {booster.pack && (
        <p className="mt-1.5 text-[8px] uppercase leading-tight tracking-[0.16em] text-[#8BFFC9]">
          10 landscapes in its theme
        </p>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onBuy(booster)}
        className={`w-full rounded-full px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
          disabled
            ? 'bg-white/5 text-white/30'
            : 'bg-[#FFB067] text-[#2A1520] hover:bg-[#FFC48A]'
        }`}
        style={{ marginTop: 'auto' }}
      >
        {label}
      </button>
    </div>
  );
}