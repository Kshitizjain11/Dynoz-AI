import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-5 left-[5%] right-[5%] z-50"
    >
      <div
        className={`nav-pill flex items-center justify-between h-12 px-6 rounded-full transition-all duration-500 ${
          scrolled ? 'bg-background/80' : 'bg-transparent'
        }`}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-grotesk font-bold text-primary text-lg tracking-tight hover:text-accent transition-colors"
        >
          Dynoz AI
        </button>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('showcase')}
            className="font-mono text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors"
          >
            Platform
          </button>
          <button
            onClick={() => scrollToSection('architecture')}
            className="font-mono text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors"
          >
            Architecture
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="font-mono text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors"
          >
            Contact
          </button>
        </div>

        <button
          onClick={() => scrollToSection('contact')}
          className="font-mono text-xs uppercase tracking-widest bg-accent text-white px-4 py-1.5 rounded-sm hover:bg-accent/80 transition-all"
        >
          Client Portal
        </button>
      </div>
    </motion.nav>
  );
};

export default Navigation;
