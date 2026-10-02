import { useRef, lazy, Suspense } from "react";
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
import { WorkspaceProvider, useWorkspace } from "./WorkspaceContext";
import { WorkspaceFab } from "./components/Workspace/WorkspaceFab";
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
  // The Hero entry point opens the same workspace the site-wide FAB opens.
  const { open } = useWorkspace();

  return (
    <div className="app-root">
      <ScrollProgressBar />
      <OrbBackground />
      <Nav />
      <main id="main-content" tabIndex={-1}>
      <Hero onEnterWorkspace={open} />
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
  );
}

// Consumes the workspace context, so it must render inside WorkspaceProvider.
function WorkspaceLayer() {
  const { isOpen, close } = useWorkspace();
  return (
    <>
      <WorkspaceFab />
      {isOpen && <WorkspaceOverlay onExit={close} />}
    </>
  );
}

export default function App({ initialPath = "/" }: { initialPath?: string }) {
  return (
    <AppStateProvider initialPath={initialPath}>
      <BookingProvider>
        <WorkspaceProvider>
          <a className="skip-link" href="#main-content">{initialPath.startsWith("/en") ? "Skip to content" : "انتقل إلى المحتوى"}</a>
          {["/", "/ar", "/en"].includes(initialPath) ? <AppShell /> : <ContentPage path={initialPath} />}
          {/* Workspace entry and overlay live at the root so the workspace is
              reachable from every route, not only the home page. */}
          <WorkspaceLayer />
        </WorkspaceProvider>
      </BookingProvider>
    </AppStateProvider>
  );
}