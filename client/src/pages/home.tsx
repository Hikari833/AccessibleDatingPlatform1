import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProfileCard } from '@/components/profile-card';
import { MessageModal } from '@/components/message-modal';
import { Search, Filter, Plus, Shield, UserCheck, AlertTriangle, Flag, ArrowRight, Mic, MicOff } from 'lucide-react';
import { ProfileWithUser } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useAccessibilityContext } from '@/components/accessibility-provider';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<ProfileWithUser | null>(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { settings, toggleHighContrast, increaseTextSize, decreaseTextSize, toggleVoiceNav, toggleScreenReader, announceToScreenReader } = useAccessibilityContext();

  // Fetch profiles
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['/api/profiles'],
    queryFn: () => fetch('/api/profiles?excludeUserId=1').then(res => res.json()),
  });

  // Fetch matches
  const { data: matches = [] } = useQuery({
    queryKey: ['/api/matches', 1],
    queryFn: () => fetch('/api/matches/1').then(res => res.json()),
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: (receiverId: number) => apiRequest('POST', '/api/likes', { senderId: 1, receiverId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/matches', 1] });
      announceToScreenReader('Profile liked successfully');
    },
  });

  // Message mutation
  const messageMutation = useMutation({
    mutationFn: ({ receiverId, content, messageType }: { receiverId: number; content: string; messageType: string }) =>
      apiRequest('POST', '/api/messages', { senderId: 1, receiverId, content, messageType }),
    onSuccess: () => {
      announceToScreenReader('Message sent successfully');
    },
  });

  const handleLike = (profileId: number) => {
    const profile = profiles.find((p: ProfileWithUser) => p.id === profileId);
    if (profile) {
      likeMutation.mutate(profile.userId);
    }
  };

  const handleMessage = (profile: ProfileWithUser) => {
    setSelectedProfile(profile);
    setMessageModalOpen(true);
  };

  const handleSendMessage = (content: string, messageType: string) => {
    if (selectedProfile) {
      messageMutation.mutate({
        receiverId: selectedProfile.userId,
        content,
        messageType,
      });
    }
  };

  const handleViewProfile = (profileId: number) => {
    announceToScreenReader(`Viewing profile details for profile ${profileId}`);
    // Navigate to profile detail page
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2" id="main-content">
          <Card>
            <CardHeader>
              <CardTitle>Discover People</CardTitle>
              <p className="text-sm text-muted-foreground">
                Find compatible matches based on your preferences and accessibility needs
              </p>
            </CardHeader>
            
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-muted rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="search-input" className="sr-only">
                    Search profiles
                  </Label>
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="search-input"
                        placeholder="Search by interests, location, or accessibility needs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                        aria-describedby="search-help"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    </div>
                    <Button
                      variant={settings.voiceNav ? "default" : "outline"}
                      size="sm"
                      onClick={toggleVoiceNav}
                      className="px-3 shrink-0"
                      aria-label={settings.voiceNav ? "Disable voice navigation" : "Enable voice navigation"}
                      title={settings.voiceNav ? "Voice navigation is ON" : "Voice navigation is OFF"}
                    >
                      {settings.voiceNav ? (
                        <Mic className="w-4 h-4" />
                      ) : (
                        <MicOff className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p id="search-help" className="text-xs text-muted-foreground mt-1">
                    {settings.voiceNav ? 'Voice input enabled - say "search" followed by your query' : 'Click the mic button to enable voice input'}
                  </p>
                </div>
                <Button aria-label="Open accessibility filters">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Profile Cards */}
              <div className="space-y-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p>Loading profiles...</p>
                  </div>
                ) : profiles.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No profiles found. Try adjusting your search criteria.</p>
                  </div>
                ) : (
                  profiles.map((profile: ProfileWithUser) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      onLike={handleLike}
                      onMessage={handleMessage}
                      onViewProfile={handleViewProfile}
                    />
                  ))
                )}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-8">
                <Button variant="outline" className="flex items-center mx-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Load More Profiles
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recent Matches */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {matches.slice(0, 2).map((match: any) => (
                  <div key={match.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted focus-within:ring-2 focus-within:ring-ring">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"
                      alt={`Profile photo of match`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Jamie, 29</p>
                      <p className="text-xs text-muted-foreground">92% match</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="View Jamie's profile"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="link" className="text-sm text-primary p-0">
                  View all matches →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Accessibility Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="screen-reader-toggle" className="text-sm font-medium">
                    Screen Reader Announcements
                  </Label>
                  <Switch
                    id="screen-reader-toggle"
                    checked={settings.screenReader}
                    onCheckedChange={toggleScreenReader}
                    aria-describedby="screen-reader-description"
                  />
                </div>
                <p id="screen-reader-description" className="text-xs text-muted-foreground">
                  Enable audio descriptions for profile actions
                </p>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="voice-input-toggle" className="text-sm font-medium">
                    Voice Input
                  </Label>
                  <Switch
                    id="voice-input-toggle"
                    checked={settings.voiceNav}
                    onCheckedChange={toggleVoiceNav}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast-toggle" className="text-sm font-medium">
                    High Contrast Mode
                  </Label>
                  <Switch
                    id="high-contrast-toggle"
                    checked={settings.highContrast}
                    onCheckedChange={toggleHighContrast}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button variant="link" className="text-sm text-primary p-0">
                  More settings →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Safety Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Safety Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-secondary mt-0.5" />
                  <p className="text-sm">Always meet in public accessible locations for your first few dates.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <UserCheck className="w-5 h-5 text-secondary mt-0.5" />
                  <p className="text-sm">Verify profiles and ask about accessibility needs upfront.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-accent mt-0.5" />
                  <p className="text-sm">Report any inappropriate behavior using our accessible reporting tools.</p>
                </div>
              </div>
              <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Flag className="w-4 h-4 mr-2" />
                Report an Issue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Message Modal */}
      <MessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        profile={selectedProfile}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
