import { useState, useRef, lazy, Suspense } from "react";
import { AppStateProvider, useAppState } from "./AppState";
import { BookingProvider } from "./BookingContext";
import { OrbBackground } from "./components/OrbBackground";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Statement } from "./components/Statement";
import { About } from "./components/About";
import { BPRJourney } from "./components/BPRJourney";
import { Services } from "./components/Services";
import { Registry } from "./components/Registry";
import { Impact } from "./components/Impact";
import { Experience } from "./components/Experience";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Ecosystem } from "./components/Ecosystem";
import { Newsletter } from "./components/Newsletter";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { BookingModal } from "./components/BookingModal";
import { ScrollProgressBar, BackToTop } from "./components/ScrollChrome";
const WorkspaceDesktop = lazy(() => import("./workspace/WorkspaceDesktop"));
import { XIcon } from "./Icons";
import { ContentPage } from "./ContentPage";
import { useDialog } from "./hooks/useDialog";
import "./workspace/Desktop.css";

function WorkspaceOverlay({ onExit }: { onExit: () => void }) {
  const { lang, theme, isAr } = useAppState();

  const dialog = useRef<HTMLDivElement>(null);
  useDialog(dialog, true, onExit);

  return (
    <div ref={dialog} tabIndex={-1} className="workspace-overlay" role="dialog" aria-modal="true" aria-label={isAr ? "مساحة العمل" : "Workspace"}>
      <Suspense fallback={<div className="workspace-loading" role="status">{isAr ? "جارٍ تحميل مساحة العمل…" : "Loading workspace…"}</div>}>
        <WorkspaceDesktop lang={lang} theme={theme} quality="high" />
      </Suspense>
      <button className="workspace-exit" onClick={onExit}>
        <XIcon size={16} />
        <span>{isAr ? "خروج من مساحة العمل" : "Exit workspace"}</span>
      </button>
    </div>
  );
}

function AppShell() {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  return (
    <>
      <div className="app-root">
        <ScrollProgressBar />
        <OrbBackground />
        <Nav />
        <main id="main-content" tabIndex={-1}>
        <Hero onEnterWorkspace={() => setWorkspaceOpen(true)} />
        <Statement />
        <About />
        <BPRJourney />
        <Services />
        <Registry />
        <Impact />
        <Experience />
        <Skills />
        <Projects />
        <Ecosystem />
        <Newsletter />
        <Contact />
        </main>
        <Footer />
        <BookingModal />
        <BackToTop />
      </div>
      {workspaceOpen && <WorkspaceOverlay onExit={() => setWorkspaceOpen(false)} />}
    </>
  );
}

export default function App({ initialPath = "/" }: { initialPath?: string }) {
  return (
    <AppStateProvider initialPath={initialPath}>
      <BookingProvider>
        <a className="skip-link" href="#main-content">{initialPath.startsWith("/en") ? "Skip to content" : "انتقل إلى المحتوى"}</a>
        {["/", "/ar", "/en"].includes(initialPath) ? <AppShell /> : <ContentPage path={initialPath} />}
      </BookingProvider>
    </AppStateProvider>
  );
}