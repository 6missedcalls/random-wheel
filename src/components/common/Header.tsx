import { Settings, Download, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useWheelStore, useSettings } from '@/store/wheelStore';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { isInstallable, promptInstall } = usePWAInstall();
  const settings = useSettings();
  const { updateSettings } = useWheelStore();

  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: newTheme });

    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">W</span>
          </div>
          <h1 className="font-bold text-lg hidden sm:block">
            Random Wheel
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Install PWA button */}
          {isInstallable && (
            <Button variant="outline" size="sm" onClick={promptInstall}>
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Install App</span>
            </Button>
          )}

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {settings.theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Settings popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="space-y-4">
                <h3 className="font-medium">Settings</h3>

                {/* Sound toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {settings.soundEnabled ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                    <Label htmlFor="sound-toggle">Sound Effects</Label>
                  </div>
                  <Switch
                    id="sound-toggle"
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) =>
                      updateSettings({ soundEnabled: checked })
                    }
                  />
                </div>

                {/* Volume slider */}
                {settings.soundEnabled && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Volume</Label>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(settings.volume * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[settings.volume]}
                      onValueChange={([value]) =>
                        updateSettings({ volume: value })
                      }
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>
                )}

                {/* Confetti toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="confetti-toggle">Confetti Animation</Label>
                  <Switch
                    id="confetti-toggle"
                    checked={settings.showConfetti}
                    onCheckedChange={(checked) =>
                      updateSettings({ showConfetti: checked })
                    }
                  />
                </div>

                {/* Auto-remove winner */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoremove-toggle">Auto-Remove Winner</Label>
                    <p className="text-xs text-muted-foreground">
                      Remove winning segment after spin
                    </p>
                  </div>
                  <Switch
                    id="autoremove-toggle"
                    checked={settings.autoRemoveWinner}
                    onCheckedChange={(checked) =>
                      updateSettings({ autoRemoveWinner: checked })
                    }
                  />
                </div>

                {/* Reduced motion */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="motion-toggle">Reduced Motion</Label>
                    <p className="text-xs text-muted-foreground">
                      Minimize animations
                    </p>
                  </div>
                  <Switch
                    id="motion-toggle"
                    checked={settings.reducedMotion}
                    onCheckedChange={(checked) =>
                      updateSettings({ reducedMotion: checked })
                    }
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
