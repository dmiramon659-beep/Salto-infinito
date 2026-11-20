import BoosterCard from './BoosterCard';
import { BOOSTERS } from './boosters';

export default function BoosterShop({ coins, activeBooster, locked, onBuy }) {
  return (
    <section data-testid="boosters" className="w-full max-w-[1080px]">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.42em] text-[#FF9E7B]/80">Start line</p>
          <h2 className="font-display text-lg font-medium tracking-tight text-white sm:text-xl">
            Run boosters
          </h2>
        </div>
        <p className="max-w-[240px] text-right text-[9px] uppercase leading-tight tracking-[0.18em] text-white/35">
          Only valid for the run you buy them for
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {BOOSTERS.map((booster) => (
          <BoosterCard
            key={booster.id}
            booster={booster}
            coins={coins}
            active={activeBooster === booster.id}
            blocked={Boolean(activeBooster) && activeBooster !== booster.id}
            locked={locked}
            onBuy={onBuy}
          />
        ))}
      </div>
    </section>
  );
}