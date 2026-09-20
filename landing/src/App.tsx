import { AppStateProvider } from "./AppState";
import { BookingProvider } from "./BookingContext";
import { OrbBackground } from "./components/OrbBackground";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { BPRJourney } from "./components/BPRJourney";
import { Services } from "./components/Services";
import { Registry } from "./components/Registry";
import { Impact } from "./components/Impact";
import { Experience } from "./components/Experience";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Testimonials } from "./components/Testimonials";
import { Ecosystem } from "./components/Ecosystem";
import { Newsletter } from "./components/Newsletter";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { BookingModal } from "./components/BookingModal";
import { ScrollProgressBar, BackToTop } from "./components/ScrollChrome";

export default function App() {
  return (
    <AppStateProvider>
      <BookingProvider>
        <div className="app-root">
          <ScrollProgressBar />
          <OrbBackground />
          <Nav />
          <Hero />
          <About />
          <BPRJourney />
          <Services />
          <Registry />
          <Impact />
          <Experience />
          <Skills />
          <Projects />
          <Testimonials />
          <Ecosystem />
          <Newsletter />
          <Contact />
          <Footer />
          <BookingModal />
          <BackToTop />
        </div>
      </BookingProvider>
    </AppStateProvider>
  );
}
