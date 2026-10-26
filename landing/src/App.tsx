import { AppStateProvider } from "./AppState";
import { BookingProvider } from "./BookingContext";
import { WorkspaceProvider } from "./WorkspaceContext";
import { OrbBackground } from "./components/OrbBackground";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Why } from "./components/Why";
import { BprShowcase } from "./components/BprShowcase";
import { Founder } from "./components/Founder";
import { Research } from "./components/Research";
import { Work } from "./components/Work";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { BookingModal } from "./components/BookingModal";
import { BackToTop } from "./components/ScrollChrome";
import { WorkspaceOverlay } from "./components/Workspace/WorkspaceOverlay";
import { WorkspaceFab } from "./components/Workspace/WorkspaceFab";

export default function App() {
  return (
    <AppStateProvider>
      <BookingProvider>
        <WorkspaceProvider>
          <div className="app-root">
            <OrbBackground />
            <Nav />
            <main>
              <Hero />
              <BprShowcase />
              <Why />
              <Founder />
              <Research />
              <Work />
              <Contact />
            </main>
            <Footer />
            <BookingModal />
            <WorkspaceOverlay />
            <WorkspaceFab />
            <BackToTop />
          </div>
        </WorkspaceProvider>
      </BookingProvider>
    </AppStateProvider>
  );
}
