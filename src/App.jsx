import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import BlogSection from './components/BlogSection';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import LocationSection from './components/LocationSection';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import ScrollToTop from './components/ScrollToTop';
import AdminApp from './pages/admin/AdminApp';
import BlogPost from './pages/BlogPost';
import ThemeProvider from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/" element={
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
            } />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;