import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAccessibilityContext } from '@/components/accessibility-provider';
import { 
  Accessibility, 
  Volume2, 
  Eye, 
  Type, 
  Mic, 
  Palette,
  Shield,
  Bell,
  User,
  Heart,
  MessageCircle
} from 'lucide-react';

export default function Settings() {
  const { settings, toggleHighContrast, increaseTextSize, decreaseTextSize, setTextSize, toggleVoiceNav, toggleScreenReader } = useAccessibilityContext();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Customize your accessibility preferences and account settings
        </p>
      </div>

      {/* Accessibility Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Accessibility className="w-5 h-5 mr-2" />
            Accessibility Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="high-contrast">High Contrast Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Increase color contrast for better visibility
                </p>
              </div>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={toggleHighContrast}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="text-size">Text Size</Label>
                <p className="text-sm text-muted-foreground">
                  Current size: {settings.textSize}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={decreaseTextSize}
                  disabled={settings.textSize === 'normal'}
                  aria-label="Decrease text size"
                  size="sm"
                >
                  <Type className="w-3 h-3" />
                  <span className="ml-1">-</span>
                </Button>
                <Select value={settings.textSize} onValueChange={setTextSize}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="xl">X-Large</SelectItem>
                    <SelectItem value="2xl">XX-Large</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={increaseTextSize}
                  disabled={settings.textSize === '2xl'}
                  aria-label="Increase text size"
                  size="sm"
                >
                  <Type className="w-3 h-3" />
                  <span className="ml-1">+</span>
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="screen-reader">Screen Reader Support</Label>
                <p className="text-sm text-muted-foreground">
                  Enable audio announcements for actions
                </p>
              </div>
              <Switch
                id="screen-reader"
                checked={settings.screenReader}
                onCheckedChange={toggleScreenReader}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="voice-nav">Voice Navigation</Label>
                <p className="text-sm text-muted-foreground">
                  Use voice commands to navigate the app
                </p>
              </div>
              <Switch
                id="voice-nav"
                checked={settings.voiceNav}
                onCheckedChange={toggleVoiceNav}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="reduced-motion">Reduced Motion</Label>
                <p className="text-sm text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={() => {}}
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Visual Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="theme">Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color scheme
                </p>
              </div>
              <Select defaultValue="light">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="color-scheme">Color Scheme</Label>
                <p className="text-sm text-muted-foreground">
                  Customize the app's color palette
                </p>
              </div>
              <Select defaultValue="default">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select colors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia Friendly</SelectItem>
                  <SelectItem value="protanopia">Protanopia Friendly</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Volume2 className="w-5 h-5 mr-2" />
            Audio Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="sound-effects">Sound Effects</Label>
                <p className="text-sm text-muted-foreground">
                  Play sounds for app interactions
                </p>
              </div>
              <Switch id="sound-effects" />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="voice-messages">Voice Messages</Label>
                <p className="text-sm text-muted-foreground">
                  Enable voice message recording and playback
                </p>
              </div>
              <Switch id="voice-messages" defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="audio-descriptions">Audio Descriptions</Label>
                <p className="text-sm text-muted-foreground">
                  Provide audio descriptions for images
                </p>
              </div>
              <Switch id="audio-descriptions" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Safety */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Privacy & Safety
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">
                  Control who can see your profile
                </p>
              </div>
              <Select defaultValue="public">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="matches">Matches Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="location-sharing">Location Sharing</Label>
                <p className="text-sm text-muted-foreground">
                  Share your location for better matches
                </p>
              </div>
              <Switch id="location-sharing" defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="read-receipts">Read Receipts</Label>
                <p className="text-sm text-muted-foreground">
                  Let others know when you've read their messages
                </p>
              </div>
              <Switch id="read-receipts" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                <div>
                  <Label htmlFor="new-likes">New Likes</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone likes your profile
                  </p>
                </div>
              </div>
              <Switch id="new-likes" defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                <div>
                  <Label htmlFor="new-messages">New Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you receive new messages
                  </p>
                </div>
              </div>
              <Switch id="new-messages" defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1 flex items-center">
                <User className="w-4 h-4 mr-2" />
                <div>
                  <Label htmlFor="new-matches">New Matches</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you have new matches
                  </p>
                </div>
              </div>
              <Switch id="new-matches" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">
            Export My Data
          </Button>
          <Button variant="outline" className="w-full">
            Deactivate Account
          </Button>
          <Button variant="destructive" className="w-full">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
