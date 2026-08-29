import { AppStateProvider } from "./AppState";
import { BookingProvider } from "./BookingContext";
import { OrbBackground } from "./components/OrbBackground";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Ecosystem } from "./components/Ecosystem";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { BookingModal } from "./components/BookingModal";

export default function App() {
  return (
    <AppStateProvider>
      <BookingProvider>
        <div className="app-root">
          <OrbBackground />
          <Nav />
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Ecosystem />
          <Contact />
          <Footer />
          <BookingModal />
        </div>
      </BookingProvider>
    </AppStateProvider>
  );
}
