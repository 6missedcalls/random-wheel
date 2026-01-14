import { motion } from 'framer-motion';
import { Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCanSpin, useIsSpinning } from '@/store/wheelStore';
import { cn } from '@/lib/utils';

interface SpinButtonProps {
  onClick: () => void;
  className?: string;
}

export function SpinButton({ onClick, className }: SpinButtonProps) {
  const canSpin = useCanSpin();
  const isSpinning = useIsSpinning();

  return (
    <motion.div
      whileHover={canSpin ? { scale: 1.05 } : undefined}
      whileTap={canSpin ? { scale: 0.95 } : undefined}
    >
      <Button
        size="lg"
        onClick={onClick}
        disabled={!canSpin}
        className={cn(
          'text-lg font-bold px-8 py-6 rounded-full shadow-lg',
          'bg-gradient-to-r from-primary to-primary/80',
          'hover:from-primary/90 hover:to-primary/70',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        data-spin-trigger="true"
        aria-label={isSpinning ? 'Wheel is spinning' : 'Spin the wheel'}
      >
        {isSpinning ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Spinning...
          </>
        ) : (
          <>
            <Play className="mr-2 h-5 w-5" />
            Spin!
          </>
        )}
      </Button>
    </motion.div>
  );
}
