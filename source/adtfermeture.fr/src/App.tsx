import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Benefits from './components/Benefits';
import Actualites from './components/Actualites';
import Gallery from './components/Gallery';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import { PhotosProvider } from './lib/photos';

export default function App() {
  return (
    <PhotosProvider>
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <section id="menuiseries">
          <Services />
        </section>
        <About />
        <Benefits />
        <Actualites />
        <Gallery />
        <ContactForm />
      </main>
      <Footer />
    </div>
    </PhotosProvider>
  );
}
