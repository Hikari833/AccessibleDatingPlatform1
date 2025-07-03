import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Compass, Users, MessageCircle, User, Bell, Settings, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAccessibilityContext } from '@/components/accessibility-provider';

export function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { announceToScreenReader } = useAccessibilityContext();

  const handleNavigation = (path: string, label: string) => {
    announceToScreenReader(`Navigating to ${label}`);
  };

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-background shadow-sm border-b border-border" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" onClick={() => handleNavigation('/', 'Home')}>
                <h1 className="text-2xl font-bold text-primary flex items-center">
                  <Heart className="w-6 h-6 mr-2" />
                  AccessLove
                </h1>
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/">
                  <Button
                    variant={isActive('/') ? 'default' : 'ghost'}
                    className="flex items-center"
                    onClick={() => handleNavigation('/', 'Discover')}
                    aria-current={isActive('/') ? 'page' : undefined}
                  >
                    <Compass className="w-4 h-4 mr-1" />
                    Discover
                  </Button>
                </Link>
                <Link href="/matches">
                  <Button
                    variant={isActive('/matches') ? 'default' : 'ghost'}
                    className="flex items-center"
                    onClick={() => handleNavigation('/matches', 'Matches')}
                    aria-current={isActive('/matches') ? 'page' : undefined}
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Matches
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button
                    variant={isActive('/messages') ? 'default' : 'ghost'}
                    className="flex items-center"
                    onClick={() => handleNavigation('/messages', 'Messages')}
                    aria-current={isActive('/messages') ? 'page' : undefined}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Messages
                    <Badge variant="secondary" className="ml-2" aria-label="3 unread messages">
                      3
                    </Badge>
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button
                    variant={isActive('/profile') ? 'default' : 'ghost'}
                    className="flex items-center"
                    onClick={() => handleNavigation('/profile', 'Profile')}
                    aria-current={isActive('/profile') ? 'page' : undefined}
                  >
                    <User className="w-4 h-4 mr-1" />
                    Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Link href="/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-3 text-muted-foreground hover:text-foreground"
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open main menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  handleNavigation('/', 'Discover');
                  setMobileMenuOpen(false);
                }}
              >
                <Compass className="w-4 h-4 mr-2" />
                Discover
              </Button>
            </Link>
            <Link href="/matches">
              <Button
                variant={isActive('/matches') ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  handleNavigation('/matches', 'Matches');
                  setMobileMenuOpen(false);
                }}
              >
                <Users className="w-4 h-4 mr-2" />
                Matches
              </Button>
            </Link>
            <Link href="/messages">
              <Button
                variant={isActive('/messages') ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  handleNavigation('/messages', 'Messages');
                  setMobileMenuOpen(false);
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Messages
                <Badge variant="secondary" className="ml-2">3</Badge>
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant={isActive('/profile') ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  handleNavigation('/profile', 'Profile');
                  setMobileMenuOpen(false);
                }}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
