import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { SiteBackground } from "@/components/SiteBackground";
import Landing from "@/pages/Landing";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

const NotFound = lazy(() => import("@/pages/not-found"));
const WorkPage = lazy(() => import("@/pages/WorkPage"));
const Services = lazy(() => import("@/pages/Services"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));

function Router() {
  return (
    <Suspense fallback={null}>
      <AnimatePresence mode="wait">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/services" component={Services} />
          <Route path="/work" component={WorkPage} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/project/:id" component={ProjectDetail} />
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
    </Suspense>
  );
}

export interface AppProps {
  path?: string;
}

function AppContent() {
  useSmoothScroll();

  return <Router />;
}

function App({ path }: AppProps) {
  return (
    <MotionConfig reducedMotion="user">
      <SiteBackground />
      <WouterRouter
        base={import.meta.env.BASE_URL.replace(/\/$/, "")}
        ssrPath={path}
      >
        <AppContent />
      </WouterRouter>
    </MotionConfig>
  );
}

export default App;
