import { Pause, Play } from 'lucide-react';

export default function PauseButton({ paused, visible, onToggle }) {
  if (!visible) return null;

  return (
    <button
      type="button"
      data-testid="pause-toggle"
      aria-label={paused ? 'Resume the run' : 'Pause the run'}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="absolute right-4 top-4 z-30 grid h-10 w-10 place-items-center rounded-full bg-[rgba(11,10,22,0.5)] text-white/70 ring-1 ring-white/15 backdrop-blur-sm transition hover:text-white sm:right-6 sm:top-6"
    >
      {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
    </button>
  );
}