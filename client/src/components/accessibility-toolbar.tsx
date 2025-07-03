import { Button } from '@/components/ui/button';
import { useAccessibilityContext } from '@/components/accessibility-provider';
import { Diff, Type, Mic, Volume2 } from 'lucide-react';

export function AccessibilityToolbar() {
  const { settings, toggleHighContrast, increaseTextSize, toggleVoiceNav, toggleScreenReader } = useAccessibilityContext();

  return (
    <div className="bg-gray-800 text-white py-2 px-4" role="banner" aria-label="Accessibility tools">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Accessibility:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleHighContrast}
            className="text-white hover:text-accent-foreground hover:bg-accent"
            aria-label="Toggle high contrast mode"
            aria-pressed={settings.highContrast}
          >
            <Diff className="w-4 h-4 mr-1" />
            High Contrast
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={increaseTextSize}
            className="text-white hover:text-accent-foreground hover:bg-accent"
            aria-label={`Current text size: ${settings.textSize}. Click to increase`}
          >
            <Type className="w-4 h-4 mr-1" />
            Text Size
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVoiceNav}
            className="text-white hover:text-accent-foreground hover:bg-accent"
            aria-label="Toggle voice navigation"
            aria-pressed={settings.voiceNav}
          >
            <Mic className="w-4 h-4 mr-1" />
            Voice Nav
          </Button>
        </div>
        <div className="text-sm">
          <span className="text-gray-300">Screen Reader: </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleScreenReader}
            className="text-secondary hover:text-secondary-foreground hover:bg-secondary p-1"
            aria-label="Toggle screen reader announcements"
          >
            <Volume2 className="w-4 h-4 mr-1" />
            {settings.screenReader ? 'Active' : 'Inactive'}
          </Button>
        </div>
      </div>
    </div>
  );
}
