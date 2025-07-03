import { useState, useEffect } from 'react';

export interface AccessibilitySettings {
  highContrast: boolean;
  textSize: 'normal' | 'large' | 'xl' | '2xl';
  voiceNav: boolean;
  screenReader: boolean;
  reducedMotion: boolean;
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    textSize: 'normal',
    voiceNav: false,
    screenReader: true,
    reducedMotion: false,
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Detect system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
  }, []);

  useEffect(() => {
    // Apply settings to document
    const root = document.documentElement;
    
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Remove existing text size classes
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xl', 'text-size-2xl');
    root.classList.add(`text-size-${settings.textSize}`);

    // Save settings to localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, [settings]);

  const toggleHighContrast = () => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const increaseTextSize = () => {
    const sizes: AccessibilitySettings['textSize'][] = ['normal', 'large', 'xl', '2xl'];
    const currentIndex = sizes.indexOf(settings.textSize);
    const nextIndex = Math.min(currentIndex + 1, sizes.length - 1);
    setSettings(prev => ({ ...prev, textSize: sizes[nextIndex] }));
  };

  const decreaseTextSize = () => {
    const sizes: AccessibilitySettings['textSize'][] = ['normal', 'large', 'xl', '2xl'];
    const currentIndex = sizes.indexOf(settings.textSize);
    const nextIndex = Math.max(currentIndex - 1, 0);
    setSettings(prev => ({ ...prev, textSize: sizes[nextIndex] }));
  };

  const setTextSize = (size: AccessibilitySettings['textSize']) => {
    setSettings(prev => ({ ...prev, textSize: size }));
  };

  const toggleVoiceNav = () => {
    setSettings(prev => ({ ...prev, voiceNav: !prev.voiceNav }));
  };

  const toggleScreenReader = () => {
    setSettings(prev => ({ ...prev, screenReader: !prev.screenReader }));
  };

  const announceToScreenReader = (message: string) => {
    if (!settings.screenReader) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return {
    settings,
    toggleHighContrast,
    increaseTextSize,
    decreaseTextSize,
    setTextSize,
    toggleVoiceNav,
    toggleScreenReader,
    announceToScreenReader,
  };
}
