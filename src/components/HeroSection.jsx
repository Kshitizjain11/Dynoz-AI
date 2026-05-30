import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PingPongGame from './PingPongGame';
import gsap from 'gsap';

const HeroSection = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(
      titleRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
    ).fromTo(
      subtitleRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: '100vh' }}
    >
      <PingPongGame />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-secondary border border-secondary/30 px-4 py-2 rounded-full">
            AI-Powered Hospitality Operations
          </span>
        </motion.div>

        <h1
          ref={titleRef}
          className="font-grotesk text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-normal text-primary text-center leading-[1.1] tracking-[-0.02em] max-w-[900px] text-glow opacity-0"
        >
          THE BACK-AND-FORTH
          <br />
          <span className="text-accent">ENDS HERE.</span>
        </h1>

        <p
          ref={subtitleRef}
          className="mt-8 font-grotesk text-base md:text-lg text-secondary text-center max-w-[500px] leading-relaxed opacity-0"
        >
          AI infrastructure that resolves the operational friction of hospitality.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 flex items-center gap-6"
        >
          <a
            href="#showcase"
            className="group relative font-mono text-xs uppercase tracking-widest bg-accent text-white px-8 py-4 rounded-sm overflow-hidden transition-all hover:glow-blue"
          >
            <span className="relative z-10">Explore Platform</span>
          </a>
          <a
            href="#contact"
            className="font-mono text-xs uppercase tracking-widest text-primary border border-primary/30 px-8 py-4 rounded-sm hover:border-accent hover:text-accent transition-all"
          >
            Get in Touch
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-secondary">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-accent to-transparent"
          />
        </motion.div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-[200px] z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #050505)',
        }}
      />
    </section>
  );
};

export default HeroSection;
