import { motion, AnimatePresence } from 'framer-motion';
import { X, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLastResult, useWheelStore } from '@/store/wheelStore';
import { resultRevealVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface ResultDisplayProps {
  className?: string;
}

export function ResultDisplay({ className }: ResultDisplayProps) {
  const lastResult = useLastResult();
  const { setResult } = useWheelStore();

  const handleDismiss = () => {
    setResult(null);
  };

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
            className={cn('w-full max-w-md mx-auto', className)}
          >
            <Card className="relative overflow-hidden border-0 shadow-none bg-transparent">
              <div
                className="absolute inset-0 opacity-20"
                style={{ backgroundColor: lastResult.color }}
              />
              <CardContent className="relative p-6 text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={handleDismiss}
                  aria-label="Dismiss result"
                >
                  <X className="h-4 w-4" />
                </Button>

                <motion.div
                  initial={{ rotate: -10, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-block mb-4"
                >
                  <PartyPopper className="h-12 w-12 text-primary" />
                </motion.div>

                <p className="text-sm text-muted-foreground mb-2">
                  The wheel has spoken!
                </p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-3"
                >
                  <div
                    className="w-6 h-6 rounded-full shrink-0 border-2 border-white shadow-md"
                    style={{ backgroundColor: lastResult.color }}
                  />
                  <h2 className="text-2xl font-bold">{lastResult.label}</h2>
                </motion.div>

                {lastResult.description && (
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 text-base text-muted-foreground"
                  >
                    {lastResult.description}
                  </motion.p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
