import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Send } from 'lucide-react';
import { ProfileWithUser } from '@shared/schema';
import { useAccessibilityContext } from '@/components/accessibility-provider';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileWithUser | null;
  onSendMessage: (content: string, messageType: string) => void;
}

export function MessageModal({ isOpen, onClose, profile, onSendMessage }: MessageModalProps) {
  const [messageContent, setMessageContent] = useState('');
  const [messageType, setMessageType] = useState('text');
  const [accessibilityEnabled, setAccessibilityEnabled] = useState(false);
  const { announceToScreenReader } = useAccessibilityContext();

  const handleSend = () => {
    if (!messageContent.trim()) return;
    
    onSendMessage(messageContent, messageType);
    setMessageContent('');
    onClose();
    announceToScreenReader(`Message sent to ${profile?.name}`);
  };

  const handleClose = () => {
    setMessageContent('');
    setMessageType('text');
    setAccessibilityEnabled(false);
    onClose();
  };

  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Message to {profile.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              {profile.name} prefers: {profile.communicationPreferences.join(', ')}
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="message-type">Message Type</Label>
            <Select value={messageType} onValueChange={setMessageType}>
              <SelectTrigger id="message-type">
                <SelectValue placeholder="Select message type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Message</SelectItem>
                <SelectItem value="voice">Voice Message</SelectItem>
                <SelectItem value="video">Video Message</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message-content">Your Message</Label>
            <Textarea
              id="message-content"
              placeholder="Write your message here..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={4}
              aria-describedby="message-help"
            />
            <p id="message-help" className="text-xs text-muted-foreground">
              Press Ctrl+Shift+V to use voice input
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="accessibility-features"
              checked={accessibilityEnabled}
              onCheckedChange={(checked) => setAccessibilityEnabled(checked as boolean)}
            />
            <Label htmlFor="accessibility-features">
              Enable accessibility features for this conversation
            </Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!messageContent.trim()}>
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
