import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    id: 1,
    label: '01 / Reservations',
    title: 'Intelligent Booking',
    description: 'AI voice agents handle reservation inquiries 24/7, process modifications, and manage cancellations across all channels without human intervention.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 2,
    label: '02 / Guest Prep',
    title: 'Pre-Arrival Orchestration',
    description: 'Automated guest preparation including room preferences, special requests, amenity scheduling, and personalized welcome sequences.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    id: 3,
    label: '03 / In-Stay',
    title: 'Real-Time Request Routing',
    description: 'Guest requests are instantly understood, categorized, and routed to the correct department — housekeeping, maintenance, concierge, or F&B.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 4,
    label: '04 / Feedback',
    title: 'Post-Checkout Intelligence',
    description: 'Automated feedback collection, sentiment analysis, and review generation that turns guest insights into actionable operational improvements.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    id: 5,
    label: '05 / Multilingual',
    title: '40+ Languages, Zero Delay',
    description: 'Native-fluency AI voice agents communicate seamlessly in over 40 languages, eliminating language barriers for international guests.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
  },
  {
    id: 6,
    label: '06 / Personalization',
    title: 'Guest Memory Engine',
    description: 'Every preference, request, and interaction is remembered. Returning guests experience truly personalized service from the first contact.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            delay: i * 0.1,
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="architecture"
      className="relative w-full bg-background py-32 px-4"
    >
      {/* Section header */}
      <div className="max-w-[1200px] mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-secondary">
            The Full Guest Journey
          </span>
          <h2 className="mt-4 font-grotesk text-4xl md:text-5xl lg:text-[56px] font-light text-primary tracking-[-0.01em] leading-[1.2]">
            Every touchpoint.
            <br />
            <span className="text-accent">One AI layer.</span>
          </h2>
        </motion.div>
      </div>

      {/* Features grid */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            ref={(el) => { cardsRef.current[index] = el; }}
            className="group glass-card p-8 rounded-sm cursor-default hover:border-accent/40 transition-all duration-500"
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-sm bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent/20 transition-colors">
              {feature.icon}
            </div>

            {/* Label */}
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-secondary">
              {feature.label}
            </span>

            {/* Title */}
            <h3 className="mt-2 font-grotesk text-xl font-medium text-primary group-hover:text-accent transition-colors">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="mt-3 font-grotesk text-sm text-secondary leading-relaxed">
              {feature.description}
            </p>

            {/* Hover line */}
            <div className="mt-6 h-px bg-secondary/10 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-0 bg-accent group-hover:w-full transition-all duration-700" />
            </div>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[1200px] mx-auto mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {[
          { value: '40+', label: 'Languages' },
          { value: '<2s', label: 'Response Time' },
          { value: '68%', label: 'Load Reduction' },
          { value: '24/7', label: 'Availability' },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <span className="font-grotesk text-4xl md:text-5xl font-light text-accent">
              {stat.value}
            </span>
            <span className="block mt-2 font-mono text-xs uppercase tracking-[0.15em] text-secondary">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
