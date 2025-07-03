import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, User, MapPin, Circle } from 'lucide-react';
import { ProfileWithUser } from '@shared/schema';
import { useAccessibilityContext } from '@/components/accessibility-provider';

interface ProfileCardProps {
  profile: ProfileWithUser;
  onLike: (profileId: number) => void;
  onMessage: (profile: ProfileWithUser) => void;
  onViewProfile: (profileId: number) => void;
}

export function ProfileCard({ profile, onLike, onMessage, onViewProfile }: ProfileCardProps) {
  const { announceToScreenReader } = useAccessibilityContext();

  const handleLike = () => {
    onLike(profile.id);
    announceToScreenReader(`Liked ${profile.name}'s profile`);
  };

  const handleMessage = () => {
    onMessage(profile);
    announceToScreenReader(`Opening message dialog for ${profile.name}`);
  };

  const handleViewProfile = () => {
    onViewProfile(profile.id);
    announceToScreenReader(`Viewing ${profile.name}'s full profile`);
  };

  return (
    <Card className="mb-6 hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-ring">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img
              src={profile.photos[0] || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"}
              alt={`Profile photo of ${profile.name}`}
              className="w-32 h-32 rounded-lg object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">{profile.name}</h3>
                <p className="text-muted-foreground flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profile.location}
                </p>
              </div>
              <div className="flex items-center text-sm text-secondary">
                <Circle className="w-2 h-2 mr-1 fill-current" />
                <span>Online now</span>
              </div>
            </div>
            
            <p className="text-foreground mb-4">{profile.bio}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="bg-blue-100 text-blue-800">
                  {interest}
                </Badge>
              ))}
              {profile.disabilityType && (
                <Badge variant="outline" className="bg-orange-100 text-orange-800">
                  {profile.disabilityType}
                </Badge>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleLike}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                aria-label={`Like ${profile.name}'s profile`}
              >
                <Heart className="w-4 h-4 mr-2" />
                Like
              </Button>
              <Button
                onClick={handleMessage}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                aria-label={`Send message to ${profile.name}`}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button
                onClick={handleViewProfile}
                variant="outline"
                aria-label={`View ${profile.name}'s full profile`}
              >
                <User className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
