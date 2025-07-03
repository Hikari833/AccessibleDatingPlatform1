import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, User, Calendar, MapPin } from 'lucide-react';
import { MatchWithProfiles } from '@shared/schema';
import { useAccessibilityContext } from '@/components/accessibility-provider';

export default function Matches() {
  const { announceToScreenReader } = useAccessibilityContext();
  const currentUserId = 1; // This would come from auth context

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['/api/matches', currentUserId],
    queryFn: () => fetch(`/api/matches/${currentUserId}`).then(res => res.json()),
  });

  const handleMessage = (match: MatchWithProfiles) => {
    const otherProfile = match.profile1.userId === currentUserId ? match.profile2 : match.profile1;
    announceToScreenReader(`Opening message dialog for ${otherProfile.name}`);
    // Navigate to messages or open message modal
  };

  const handleViewProfile = (match: MatchWithProfiles) => {
    const otherProfile = match.profile1.userId === currentUserId ? match.profile2 : match.profile1;
    announceToScreenReader(`Viewing ${otherProfile.name}'s profile`);
    // Navigate to profile detail
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading your matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Your Matches</h1>
        <p className="text-muted-foreground">
          People who have liked you back and share mutual interest
        </p>
      </div>

      {matches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No matches yet</h3>
            <p className="text-muted-foreground mb-4">
              Keep discovering profiles and liking people you're interested in!
            </p>
            <Button>
              <User className="w-4 h-4 mr-2" />
              Discover People
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match: MatchWithProfiles) => {
            const otherProfile = match.profile1.userId === currentUserId ? match.profile2 : match.profile1;
            
            return (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      New Match
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(match.matchedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-20 h-20 mb-3">
                      <AvatarImage 
                        src={otherProfile.photos[0] || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"} 
                        alt={`${otherProfile.name}'s profile photo`}
                      />
                      <AvatarFallback>
                        {otherProfile.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h3 className="font-semibold text-lg">{otherProfile.name}</h3>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {otherProfile.location}
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {otherProfile.bio}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 justify-center">
                    {otherProfile.interests.slice(0, 3).map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {otherProfile.interests.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{otherProfile.interests.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleMessage(match)}
                      className="flex-1 bg-primary hover:bg-primary/90"
                      aria-label={`Send message to ${otherProfile.name}`}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    
                    <Button
                      onClick={() => handleViewProfile(match)}
                      variant="outline"
                      className="flex-1"
                      aria-label={`View ${otherProfile.name}'s profile`}
                    >
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
