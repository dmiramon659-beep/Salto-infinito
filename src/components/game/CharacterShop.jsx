import SkinCard from './SkinCard';
import { formatCoins } from './formatCoins';
import { SKINS } from './skins';

export default function CharacterShop({ coins, owned, selected, locked, onBuy, onSelect }) {
  return (
    <section data-testid="shop" className="w-full max-w-[1080px]">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.42em] text-[#FF9E7B]/80">Shop</p>
          <h2 className="font-display text-lg font-medium tracking-tight text-white sm:text-xl">
            Characters
          </h2>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/35">Your balance</p>
          <p
            data-testid="shop-coins"
            className="font-display text-xl leading-none tabular-nums text-[#FFB067]"
          >
            {formatCoins(coins)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {SKINS.map((skin) => (
          <SkinCard
            key={skin.id}
            skin={skin}
            coins={coins}
            owned={owned.includes(skin.id)}
            selected={selected === skin.id}
            locked={locked}
            onBuy={onBuy}
            onSelect={onSelect}
          />
        ))}
      </div>

      <p className="mt-2.5 text-[10px] uppercase tracking-[0.2em] text-white/25">
        Earn shop points by finishing every run
      </p>
    </section>
  );
}