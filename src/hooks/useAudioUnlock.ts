import { useEffect } from 'react';
import { Howler } from 'howler';

/**
 * Hook to unlock audio on first user interaction.
 * Browsers require a user gesture before AudioContext can start.
 */
export function useAudioUnlock() {
  useEffect(() => {
    const unlockAudio = () => {
      // Resume the Howler AudioContext if it exists and is suspended
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume();
      }

      // Remove listeners after first interaction
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
  }, []);
}
