import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navigation from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import HeroSection from './components/HeroSection';
import ShowcaseSection from './components/ShowcaseSection';
import FeaturesSection from './components/FeaturesSection';
import ContactSection from './components/ContactSection';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.05,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div className="relative bg-background min-h-screen">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main>
        <HeroSection />
        <ShowcaseSection />
        <FeaturesSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-background border-t border-secondary/10 py-12 px-4">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-grotesk font-bold text-primary text-lg">Dynoz</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-secondary">
              AI for Hospitality
            </span>
          </div>

          <div className="flex items-center gap-8">
            <a href="#" className="font-mono text-[10px] uppercase tracking-[0.15em] text-secondary hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="font-mono text-[10px] uppercase tracking-[0.15em] text-secondary hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="font-mono text-[10px] uppercase tracking-[0.15em] text-secondary hover:text-primary transition-colors">
              Security
            </a>
          </div>

          <span className="font-mono text-[10px] text-secondary/60">
            &copy; 2025 Dynoz AI. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
