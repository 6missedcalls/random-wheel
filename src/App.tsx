import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/common/Header';
import { OfflineIndicator } from '@/components/common/OfflineIndicator';
import { WheelContainer } from '@/components/wheel/WheelContainer';
import { SegmentList } from '@/components/editor/SegmentList';
import { useSettings, useLastResult, useWheelStore } from '@/store/wheelStore';
import { containerVariants } from '@/lib/animations';

function App() {
  const settings = useSettings();
  const lastResult = useLastResult();
  const { removeSegment } = useWheelStore();

  // Apply theme on mount and when it changes
  useEffect(() => {
    const applyTheme = () => {
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (settings.theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // System preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    applyTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (settings.theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  // Auto-remove winner functionality
  useEffect(() => {
    if (settings.autoRemoveWinner && lastResult) {
      // Small delay to let the user see the result
      const timer = setTimeout(() => {
        removeSegment(lastResult.id);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [lastResult, settings.autoRemoveWinner, removeSegment]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <OfflineIndicator />

      <main className="flex-1 container py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Wheel Section */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <WheelContainer />
          </div>

          {/* Editor Section */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <SegmentList className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)]" />
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>
          Random Wheel - A free, offline-first spinning wheel
        </p>
      </footer>
    </div>
  );
}

export default App;
