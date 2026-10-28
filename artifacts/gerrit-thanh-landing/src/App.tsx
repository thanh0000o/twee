import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Home } from '@/pages/home';
import { Guestbook } from '@/pages/guestbook';
import { BlogLinks } from '@/pages/blog-links';
import { Music } from '@/pages/music';
import { Visualisations } from '@/pages/visualisations';
import { Artwork } from '@/pages/artwork';
import { About } from '@/pages/about';
import { Works } from '@/pages/works';
import { MakeItWork } from '@/pages/make-it-work';
import { DroneStrategie } from '@/pages/drone-strategie';
import { FlexDelivery } from '@/pages/flex-delivery';
import { Mokkatoff } from '@/pages/mokkatoff';
import { GrowingPortfolio } from '@/pages/growing-portfolio';
import { AllergenMenuChecker } from '@/pages/allergen-menu-checker';
import { DesktopPortfolio } from '@/pages/desktop-portfolio';
import { FirstPortfolio } from '@/pages/first-portfolio';
import { MusicAgent } from '@/pages/music-agent';
import { VacatureAgent } from '@/pages/vacature-agent';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/guestbook" component={Guestbook} />
        <Route path="/blog-links" component={BlogLinks} />
        <Route path="/music" component={Music} />
        <Route path="/artwork" component={Artwork} />
        <Route path="/works/make-it-work" component={MakeItWork} />
        <Route path="/works/drone-strategie" component={DroneStrategie} />
        <Route path="/works/flex-delivery" component={FlexDelivery} />
        <Route path="/works/mokkatoff" component={Mokkatoff} />
        <Route path="/works/growing-portfolio" component={GrowingPortfolio} />
        <Route path="/works/allergen-menu-checker" component={AllergenMenuChecker} />
        <Route path="/works/desktop-portfolio" component={DesktopPortfolio} />
        <Route path="/works/first-portfolio" component={FirstPortfolio} />
        <Route path="/works/vacature-agent" component={VacatureAgent} />
        <Route path="/works/music-agent" component={MusicAgent} />
        <Route path="/works" component={Works} />
        <Route path="/visualisations" component={Visualisations} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
