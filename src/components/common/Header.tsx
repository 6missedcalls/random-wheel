import { useState, useRef, useEffect } from 'react';
import { Settings, Download, Moon, Sun, Volume2, VolumeX, FolderOpen, Pencil, Check, Menu } from 'lucide-react';
import { WheelManager } from '@/components/editor/WheelManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useWheelStore, useSettings, useCurrentWheelName } from '@/store/wheelStore';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { isInstallable, promptInstall } = usePWAInstall();
  const settings = useSettings();
  const currentWheelName = useCurrentWheelName();
  const { updateSettings, setCurrentWheelName } = useWheelStore();
  const [isWheelManagerOpen, setIsWheelManagerOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState(currentWheelName);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  // Sync editing name when current wheel name changes (e.g., loading a wheel)
  useEffect(() => {
    setEditingName(currentWheelName);
  }, [currentWheelName]);

  const startEditing = () => {
    setEditingName(currentWheelName);
    setIsEditingName(true);
  };

  const saveName = () => {
    const trimmedName = editingName.trim();
    if (trimmedName) {
      setCurrentWheelName(trimmedName);
    } else {
      setEditingName(currentWheelName);
    }
    setIsEditingName(false);
  };

  const cancelEditing = () => {
    setEditingName(currentWheelName);
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveName();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

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
        {/* Logo and Wheel Name */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">W</span>
          </div>
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <Input
                ref={inputRef}
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={saveName}
                className="h-8 w-40 sm:w-56 font-bold text-lg"
                maxLength={50}
              />
              <Button size="sm" variant="ghost" onClick={saveName} className="h-8 w-8 p-0">
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              onClick={startEditing}
              className="group flex items-center gap-1 hover:bg-accent rounded px-1 py-0.5 transition-colors"
            >
              <h1 className="font-bold text-lg hidden sm:block truncate max-w-[200px]">
                {currentWheelName}
              </h1>
              <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity hidden sm:block" />
            </button>
          )}
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

          {/* Hamburger menu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="space-y-4">
                {/* My Wheels button */}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsWheelManagerOpen(true)}
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  My Wheels
                </Button>

                {/* Theme toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {settings.theme === 'dark' ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                    <Label htmlFor="theme-toggle">Dark Mode</Label>
                  </div>
                  <Switch
                    id="theme-toggle"
                    checked={settings.theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="h-4 w-4" />
                    <h3 className="font-medium">Settings</h3>
                  </div>

                  {/* Sound toggle */}
                  <div className="space-y-4">
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
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Wheel Manager Dialog */}
      <WheelManager
        isOpen={isWheelManagerOpen}
        onClose={() => setIsWheelManagerOpen(false)}
      />
    </header>
  );
}
