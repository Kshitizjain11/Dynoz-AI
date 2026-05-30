import { useState } from 'react';
import { motion } from 'framer-motion';
import DomainShader from './DomainShader';

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', inquiry: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', inquiry: '' });
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      <DomainShader />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ backgroundColor: 'rgba(5, 5, 5, 0.4)' }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-24">
        <div className="w-full max-w-[480px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Get Started
            </span>
            <h2 className="mt-4 font-grotesk text-4xl md:text-5xl font-light text-primary tracking-[-0.01em]">
              Initialize Contact
            </h2>
            <p className="mt-4 font-grotesk text-secondary text-base">
              Ready to transform your hospitality operations? Let&apos;s talk.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="glass-card p-8 rounded-sm"
            style={{ backgroundColor: 'rgba(18, 18, 18, 0.85)' }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-grotesk text-2xl text-primary mb-2">Message Sent</h3>
                <p className="font-grotesk text-secondary text-sm">
                  Our AI concierge will respond within 24 hours.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-secondary mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-background/50 border border-secondary/20 text-primary px-4 py-3 font-grotesk text-sm rounded-sm placeholder:text-secondary/40 focus:border-accent transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div className="mb-6">
                  <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-secondary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-background/50 border border-secondary/20 text-primary px-4 py-3 font-grotesk text-sm rounded-sm placeholder:text-secondary/40 focus:border-accent transition-colors"
                    placeholder="you@company.com"
                  />
                </div>

                <div className="mb-8">
                  <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-secondary mb-2">
                    Inquiry
                  </label>
                  <textarea
                    name="inquiry"
                    value={formData.inquiry}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-background/50 border border-secondary/20 text-primary px-4 py-3 font-grotesk text-sm rounded-sm placeholder:text-secondary/40 focus:border-accent transition-colors resize-none"
                    placeholder="Tell us about your property..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-white font-mono text-xs uppercase tracking-widest py-4 rounded-sm hover:bg-accent/80 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Initialize Contact'
                  )}
                </button>
              </>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 text-center"
          >
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-secondary block mb-1">
                Email
              </span>
              <a href="mailto:hello@dynoz.ai" className="font-grotesk text-primary text-sm hover:text-accent transition-colors">
                hello@dynoz.ai
              </a>
            </div>
            <div className="hidden md:block w-px h-8 bg-secondary/20" />
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-secondary block mb-1">
                Response Time
              </span>
              <span className="font-grotesk text-primary text-sm">
                &lt; 2 hours
              </span>
            </div>
            <div className="hidden md:block w-px h-8 bg-secondary/20" />
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-secondary block mb-1">
                Support
              </span>
              <span className="font-grotesk text-primary text-sm">
                24/7 AI + Human
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
