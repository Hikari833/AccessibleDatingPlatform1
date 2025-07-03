export interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

export class AccessibilityManager {
  private recognition: any;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private commands: VoiceCommand[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      
      this.recognition.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          this.handleVoiceCommand(lastResult[0].transcript);
        }
      };
    }
  }

  // Speech synthesis methods
  speak(text: string, priority: 'low' | 'medium' | 'high' = 'medium') {
    if (!this.synthesis) return;
    
    // Cancel previous speech if high priority
    if (priority === 'high') {
      this.synthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    this.synthesis.speak(utterance);
  }

  announceAction(action: string) {
    this.speak(action, 'medium');
  }

  announceError(error: string) {
    this.speak(`Error: ${error}`, 'high');
  }

  announceSuccess(message: string) {
    this.speak(message, 'medium');
  }

  // Voice recognition methods
  startListening() {
    if (!this.recognition || this.isListening) return;
    
    this.isListening = true;
    this.recognition.start();
    this.speak('Voice navigation activated. Say a command.');
  }

  stopListening() {
    if (!this.recognition || !this.isListening) return;
    
    this.isListening = false;
    this.recognition.stop();
    this.speak('Voice navigation deactivated.');
  }

  registerCommand(command: VoiceCommand) {
    this.commands.push(command);
  }

  private handleVoiceCommand(transcript: string) {
    const command = transcript.toLowerCase().trim();
    
    const matchedCommand = this.commands.find(cmd => 
      command.includes(cmd.command.toLowerCase())
    );
    
    if (matchedCommand) {
      this.speak(`Executing ${matchedCommand.description}`);
      matchedCommand.action();
    } else {
      this.speak('Command not recognized. Try saying "help" for available commands.');
    }
  }

  // Keyboard navigation helpers
  static trapFocus(element: HTMLElement) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });
  }

  static announceToScreenReader(message: string) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }

  // High contrast mode
  static enableHighContrast() {
    document.documentElement.classList.add('high-contrast');
  }

  static disableHighContrast() {
    document.documentElement.classList.remove('high-contrast');
  }

  // Text size adjustment
  static setTextSize(size: 'normal' | 'large' | 'xl' | '2xl') {
    const sizes = ['normal', 'large', 'xl', '2xl'];
    sizes.forEach(s => {
      document.documentElement.classList.remove(`text-size-${s}`);
    });
    document.documentElement.classList.add(`text-size-${size}`);
  }

  // Focus management
  static moveFocusToElement(selector: string) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Skip links
  static createSkipLink(targetId: string, text: string) {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.className = 'skip-link';
    skipLink.textContent = text;
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.moveFocusToElement(`#${targetId}`);
    });
    
    return skipLink;
  }
}

export const accessibilityManager = new AccessibilityManager();
