import CharacterPreview from './CharacterPreview';
import { formatCoins } from './formatCoins';

export default function SkinCard({ skin, coins, owned, selected, locked, onBuy, onSelect }) {
  const affordable = coins >= skin.price;

  let label = `Buy · ${formatCoins(skin.price)}`;
  let disabled = locked;
  if (selected) {
    label = 'In use';
    disabled = true;
  } else if (owned) {
    label = 'Use';
  } else if (!affordable) {
    label = `Missing ${formatCoins(skin.price - coins)}`;
    disabled = true;
  }

  const handleClick = () => {
    if (owned) onSelect(skin);
    else onBuy(skin);
  };

  return (
    <div
      data-testid={`skin-${skin.id}`}
      className={`flex flex-col rounded-2xl border p-2.5 transition ${
        selected ? 'border-[#FFB067]/70 bg-[#FFB067]/10' : 'border-white/10 bg-white/[0.03]'
      }`}
    >
      <div className="flex items-center justify-center rounded-xl bg-[#08060F] py-1.5 ring-1 ring-inset ring-white/5">
        <CharacterPreview skin={skin} />
      </div>
      <p className="mt-2 font-display text-[13px] leading-tight text-white">{skin.name}</p>
      <p className="text-[9px] uppercase leading-tight tracking-[0.16em] text-white/35">
        {skin.tag}
      </p>
      {skin.ability && (
        <div className="mt-1 rounded-lg bg-[#FFB067]/10 px-1.5 py-1">
          <p className="text-[9px] font-semibold leading-tight text-[#FFB067]">
            {skin.ability.name}
          </p>
          <p className="mt-0.5 text-[8px] leading-snug text-white/45">{skin.ability.desc}</p>
        </div>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={`mt-2.5 w-full rounded-full px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
          disabled
            ? 'bg-white/5 text-white/30'
            : 'bg-[#FFB067] text-[#2A1520] hover:bg-[#FFC48A]'
        }`}
      >
        {label}
      </button>
    </div>
  );
}