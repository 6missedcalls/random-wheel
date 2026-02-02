import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { OfflineIndicator } from '@/components/common/OfflineIndicator';
import { HomePage } from '@/routes/HomePage';
import { AdminPage } from '@/routes/AdminPage';
import { useSettings } from '@/store/wheelStore';
import { useAudioUnlock } from '@/hooks/useAudioUnlock';

function App() {
  const settings = useSettings();

  // Unlock audio on first user interaction
  useAudioUnlock();

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <OfflineIndicator />

      <main className="flex-1 container py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
