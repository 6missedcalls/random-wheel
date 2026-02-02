import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { WheelContainer } from '@/components/wheel/WheelContainer';
import { SegmentList } from '@/components/editor/SegmentList';
import { useSettings, useLastResult, useWheelStore } from '@/store/wheelStore';
import { containerVariants } from '@/lib/animations';

export function HomePage() {
  const settings = useSettings();
  const lastResult = useLastResult();
  const { removeSegment } = useWheelStore();

  // Auto-remove winner functionality
  useEffect(() => {
    if (settings.autoRemoveWinner && lastResult) {
      const timer = setTimeout(() => {
        removeSegment(lastResult.id);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [lastResult, settings.autoRemoveWinner, removeSegment]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center gap-8 max-w-xl mx-auto"
    >
      {/* Wheel Section */}
      <div className="w-full flex flex-col items-center">
        <WheelContainer />
      </div>

      {/* Editor Section */}
      <div className="w-full">
        <SegmentList />
      </div>
    </motion.div>
  );
}
