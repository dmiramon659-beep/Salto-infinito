import CharacterPreview from './CharacterPreview';
import { BOOSTER_BY_ID } from './boosters';
import { SKIN_BY_ID, SKINS } from './skins';

export default function LockerPanel({ owned, selected, activeBooster, locked, onSelect }) {
  const equipped = SKIN_BY_ID[selected] || SKINS[0];
  const ownedSkins = SKINS.filter((skin) => owned.includes(skin.id));
  const booster = activeBooster ? BOOSTER_BY_ID[activeBooster] : null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#08060F] px-2 py-1 ring-1 ring-inset ring-white/5">
            <CharacterPreview skin={equipped} width={62} />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/35">Equipped</p>
            <p className="font-display text-base leading-tight text-white">{equipped.name}</p>
            {equipped.ability ? (
              <p className="mt-1 text-[10px] leading-snug text-[#FFB067]">
                {equipped.ability.name} · {equipped.ability.desc}
              </p>
            ) : (
              <p className="mt-1 text-[10px] leading-snug text-white/40">{equipped.tag}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[9px] uppercase tracking-[0.3em] text-white/35">
          My characters · {ownedSkins.length}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {ownedSkins.map((skin) => {
            const active = skin.id === equipped.id;
            return (
              <button
                key={skin.id}
                type="button"
                disabled={active || locked}
                onClick={() => onSelect(skin)}
                className={`flex items-center gap-2 rounded-xl border p-2 text-left transition ${
                  active
                    ? 'border-[#FFB067]/70 bg-[#FFB067]/10'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                }`}
              >
                <CharacterPreview skin={skin} width={32} />
                <span className="min-w-0">
                  <span className="block truncate font-display text-[11px] leading-tight text-white">
                    {skin.name}
                  </span>
                  <span className="block text-[8px] uppercase tracking-[0.14em] text-white/40">
                    {active ? 'Equipped' : 'Equip'}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[9px] uppercase tracking-[0.3em] text-white/35">Booster</p>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          {booster ? (
            <>
              <p className="font-display text-[13px] leading-tight text-white">{booster.name}</p>
              <p className="mt-0.5 text-[9px] leading-snug text-white/45">
                {booster.desc} · next run only
              </p>
            </>
          ) : (
            <p className="text-[11px] leading-snug text-white/45">
              No booster for the next run. Grab one in the shop.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}