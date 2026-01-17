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
        {lastResult?.description && (
          <motion.div
            variants={resultRevealVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn('w-full text-center', className)}
          >
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-medium"
            >
              {lastResult.description}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
