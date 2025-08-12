// src/pages/HomePage.jsx
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import BlogSection from '@/components/BlogSection';
import Reviews from '@/components/Reviews';
import Contact from '@/components/Contact';
import LocationSection from '@/components/LocationSection';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import ScrollToTop from '@/components/ScrollToTop';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <BlogSection />
        <Reviews />
        <Contact />
        <LocationSection />
      </main>
      <Footer />
      <WhatsAppWidget />
      <ScrollToTop />
    </>
  );
}
