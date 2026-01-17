import { motion, AnimatePresence } from 'framer-motion';
import { useLastResult } from '@/store/wheelStore';
import { resultRevealVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface ResultDisplayProps {
  className?: string;
}

export function ResultDisplay({ className }: ResultDisplayProps) {
  const lastResult = useLastResult();

  return (
    <>
      {/* Screen reader announcement */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {lastResult && `The wheel landed on: ${lastResult.label}`}
      </div>

      <AnimatePresence>
        {lastResult && (
          <motion.div
            variants={resultRevealVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn('w-full text-center px-4', className)}
          >
            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-bold"
              style={{ color: lastResult.color }}
            >
              {lastResult.label}
            </motion.h2>
            {lastResult.description && (
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground mt-2 max-w-md mx-auto"
              >
                {lastResult.description}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
