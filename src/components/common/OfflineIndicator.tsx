import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={cn(
            'fixed top-16 left-1/2 -translate-x-1/2 z-50',
            'px-4 py-2 rounded-full shadow-lg',
            'flex items-center gap-2 text-sm font-medium',
            isOnline
              ? 'bg-green-500 text-white'
              : 'bg-amber-500 text-white'
          )}
        >
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4" />
              Back online
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              You are offline
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
