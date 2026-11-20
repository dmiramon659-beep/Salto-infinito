import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isMuted, setMuted as persistMuted } from './sound';

export default function SoundToggle() {
  const [muted, setMutedState] = useState(isMuted());

  const toggle = () => {
    const next = !muted;
    persistMuted(next);
    setMutedState(next);
  };

  return (
    <button
      type="button"
      data-testid="sound-toggle"
      aria-label={muted ? 'Turn sound on' : 'Mute sound'}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      className="absolute bottom-4 right-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-[rgba(11,10,22,0.5)] text-white/70 ring-1 ring-white/15 backdrop-blur-sm transition hover:text-white"
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}