import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccessibilityProvider } from "@/components/accessibility-provider";
import { AccessibilityToolbar } from "@/components/accessibility-toolbar";
import { Navigation } from "@/components/navigation";
import Home from "@/pages/home";
import ProfileSetup from "@/pages/profile-setup";
import Messages from "@/pages/messages";
import Matches from "@/pages/matches";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/profile-setup" component={ProfileSetup} />
      <Route path="/messages" component={Messages} />
      <Route path="/matches" component={Matches} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <AccessibilityToolbar />
            <Navigation />
            <main>
              <Router />
            </main>
            <Toaster />
          </div>
        </TooltipProvider>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
}

export default App;
