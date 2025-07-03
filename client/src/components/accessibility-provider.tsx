import { createContext, useContext, ReactNode } from 'react';
import { useAccessibility, AccessibilitySettings } from '@/hooks/use-accessibility';

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  toggleHighContrast: () => void;
  increaseTextSize: () => void;
  decreaseTextSize: () => void;
  setTextSize: (size: AccessibilitySettings['textSize']) => void;
  toggleVoiceNav: () => void;
  toggleScreenReader: () => void;
  announceToScreenReader: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const accessibility = useAccessibility();

  return (
    <AccessibilityContext.Provider value={accessibility}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibilityContext() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibilityContext must be used within AccessibilityProvider');
  }
  return context;
}
