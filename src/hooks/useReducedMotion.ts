import { useEffect, useState } from 'react';
import { useSettings } from '@/store/wheelStore';

export function useReducedMotion(): boolean {
  const settings = useSettings();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // User setting overrides system preference
  return settings.reducedMotion || prefersReducedMotion;
}
