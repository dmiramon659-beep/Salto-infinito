import { X } from 'lucide-react';
import BoosterShop from './BoosterShop';
import CharacterShop from './CharacterShop';
import LockerPanel from './LockerPanel';
import { formatCoins } from './formatCoins';

const TABS = [
  { id: 'shop', label: 'Shop' },
  { id: 'locker', label: 'Locker' },
];

export default function ShopDrawer({
  open,
  tab,
  onTabChange,
  onClose,
  coins,
  owned,
  selected,
  activeBooster,
  locked,
  onBuySkin,
  onSelectSkin,
  onBuyBooster,
}) {
  return (
    <div className={`fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/65 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <aside
        data-testid="shop-drawer"
        className={`absolute left-0 top-0 flex h-full w-[min(430px,92vw)] flex-col border-r border-white/10 bg-[#0E0C1C] shadow-[30px_0_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-[#FF9E7B]/80">Your balance</p>
            <p className="font-display text-lg leading-none tabular-nums text-[#FFB067]">
              {formatCoins(coins)}
              <span className="ml-1.5 text-[9px] uppercase tracking-[0.2em] text-white/35">
                points
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-1.5 px-4 py-3">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex-1 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
                tab === item.id
                  ? 'bg-[#FFB067] text-[#2A1520]'
                  : 'bg-white/5 text-white/55 hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {tab === 'shop' ? (
            <div className="space-y-5">
              <CharacterShop
                coins={coins}
                owned={owned}
                selected={selected}
                locked={locked}
                onBuy={onBuySkin}
                onSelect={onSelectSkin}
              />
              <BoosterShop
                coins={coins}
                activeBooster={activeBooster}
                locked={locked}
                onBuy={onBuyBooster}
              />
            </div>
          ) : (
            <LockerPanel
              owned={owned}
              selected={selected}
              activeBooster={activeBooster}
              locked={locked}
              onSelect={onSelectSkin}
            />
          )}
        </div>
      </aside>
    </div>
  );
}