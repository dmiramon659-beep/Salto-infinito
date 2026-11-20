import { Play } from 'lucide-react';

export default function PauseOverlay({ onResume }) {
  return (
    <div
      data-testid="pause-overlay"
      onPointerDown={(e) => e.stopPropagation()}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-[rgba(6,5,14,0.6)] backdrop-blur-[3px]"
    >
      <p className="text-[10px] uppercase tracking-[0.42em] text-white/50">Paused</p>
      <button
        type="button"
        data-testid="pause-resume"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onResume();
        }}
        className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0B0A16] transition hover:bg-[#FFB067]"
      >
        <Play className="h-4 w-4" />
        Continue
      </button>
      <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">Space or P to resume</p>
    </div>
  );
}