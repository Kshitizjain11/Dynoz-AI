import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  { id: 1, title: 'Revenue Growth', subtitle: '+34% RevPAR increase', image: '/images/card_revenue.jpg', metric: '+34%' },
  { id: 2, title: 'Guest Satisfaction', subtitle: '94% satisfaction score', image: '/images/card_satisfaction.jpg', metric: '94%' },
  { id: 3, title: 'Occupancy Patterns', subtitle: 'AI-driven forecasting', image: '/images/card_occupancy.jpg', metric: '97%' },
  { id: 4, title: 'Multilingual AI', subtitle: '40+ languages supported', image: '/images/card_multilingual.jpg', metric: '40+' },
  { id: 5, title: 'Operational Load', subtitle: '68% reduction in overhead', image: '/images/card_efficiency.jpg', metric: '-68%' },
  { id: 6, title: 'Response Time', subtitle: 'Sub-2 second AI response', image: '/images/card_response.jpg', metric: '<2s' },
];

const ShowcaseSection = () => {
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const newRotation = progress * 360;
          setRotation(newRotation);
          setActiveIndex(Math.floor((progress * cards.length) % cards.length));
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const radius = 500;
  const cardWidth = 280;
  const cardHeight = 380;
  const angleStep = 360 / cards.length;

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="relative w-full bg-background overflow-hidden"
      style={{ height: '100vh' }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(46, 92, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46, 92, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="absolute top-16 left-0 right-0 z-20 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-xs uppercase tracking-[0.2em] text-secondary"
        >
          Performance Metrics
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 font-grotesk text-4xl md:text-5xl font-light text-primary tracking-[-0.01em]"
        >
          Data-Driven Results
        </motion.h2>
      </div>

      <div
        ref={carouselRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        <div
          className="relative"
          style={{
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,
            transformStyle: 'preserve-3d',
            transform: `rotateY(${-rotation}deg)`,
            transition: 'transform 0.1s linear',
          }}
        >
          {cards.map((card, index) => {
            const angle = (index * angleStep * Math.PI) / 180;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            const cardRotation = index * angleStep;
            const isActive = index === activeIndex;

            return (
              <div
                key={card.id}
                className="absolute top-1/2 left-1/2 glass-card overflow-hidden cursor-pointer"
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  marginLeft: `-${cardWidth / 2}px`,
                  marginTop: `-${cardHeight / 2}px`,
                  transform: `translateX(${x}px) translateZ(${z}px) rotateY(${cardRotation}deg)`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  borderRadius: '4px',
                  boxShadow: isActive
                    ? '0 0 60px rgba(46, 92, 255, 0.3), 0 0 120px rgba(46, 92, 255, 0.1)'
                    : '0 4px 24px rgba(0, 0, 0, 0.5)',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                <div className="relative w-full h-[65%] overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                </div>

                {/* Card content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
                        {card.subtitle}
                      </span>
                      <h3 className="mt-1 font-grotesk text-lg font-medium text-primary">
                        {card.title}
                      </h3>
                    </div>
                    <span className="font-grotesk text-2xl font-light text-accent">
                      {card.metric}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(46, 92, 255, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Floating labels */}
      <div className="absolute bottom-12 left-8 z-20">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">
          LIVE FEED
        </span>
        <div className="mt-1 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[10px] text-accent">NODE_04</span>
        </div>
      </div>

      <div className="absolute bottom-12 right-8 z-20 text-right">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">
          Scroll to rotate
        </span>
      </div>
    </section>
  );
};

export default ShowcaseSection;
