import { useState, useEffect, useRef } from 'react';

function AppImages({ prefersReducedMotion = false }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const transitionClass = prefersReducedMotion ? '' : 'transition-all duration-700 ease-out';
  const visibleClass = 'opacity-100 translate-y-0';
  const hiddenClass = prefersReducedMotion ? visibleClass : 'opacity-0 translate-y-8';

  return (
    <div ref={containerRef} className="relative flex justify-center items-center h-80 sm:h-96">
      <div
        className={`absolute ${transitionClass} ${isVisible ? visibleClass : hiddenClass}`}
        style={{ transitionDelay: isVisible ? '400ms' : '0ms', left: '0%', top: '20%', zIndex: 1 }}
      >
        <img src="/ReportPreview.svg" alt="Report Preview" className="w-32 sm:w-40 md:w-48 rounded-lg border-slate-200 transform -rotate-6" loading="lazy" />
      </div>

      <div
        className={`absolute ${transitionClass} ${isVisible ? visibleClass : hiddenClass}`}
        style={{ transitionDelay: isVisible ? '200ms' : '0ms', right: '0%', top: '20%', zIndex: 1 }}
      >
        <img src="/Gallary.svg" alt="Gallery Preview" className="w-32 sm:w-40 md:w-48 rounded-lg border-slate-200 transform rotate-6" loading="lazy" />
      </div>

      <div
        className={`absolute ${transitionClass} ${isVisible ? visibleClass : hiddenClass}`}
        style={{ transitionDelay: isVisible ? '0ms' : '0ms', left: '50%', top: '10%', transform: 'translateX(-50%)', zIndex: 2 }}
      >
        <img src="/Dashboard.svg" alt="Dashboard Preview" className="w-40 sm:w-48 md:w-56 rounded-lg border-slate-200" loading="lazy" />
      </div>
    </div>
  );
}

export function Hero() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery) {
        try {
          setPrefersReducedMotion(!!mediaQuery.matches);
          const handleChange = (e) => setPrefersReducedMotion(!!e.matches);
          if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', handleChange);
          } else if (typeof mediaQuery.addListener === 'function') {
            mediaQuery.addListener(handleChange);
          }
          return () => {
            if (typeof mediaQuery.removeEventListener === 'function') {
              mediaQuery.removeEventListener('change', handleChange);
            } else if (typeof mediaQuery.removeListener === 'function') {
              mediaQuery.removeListener(handleChange);
            }
          };
        } catch (err) {
          console.warn('matchMedia check failed', err);
        }
      }
    }
  }, []);

  const scrollToDemo = (e) => {
    e.preventDefault();
    const el = document.getElementById('demo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const input = el.querySelector('input[name="company"]');
        if (input && typeof input.focus === 'function') {
          try { input.focus({ preventScroll: true }); } catch { input.focus(); }
        }
      }, 400);
    }
  };

  return (
    <section className="relative bg-white py-16 lg:py-24 overflow-hidden">
      {/* Background SVG */}
      <div className="absolute inset-0 z-0">
        <img
          src="/HeroBackground.svg"
          alt=""
          className="w-full h-full object-cover object-center sm:object-right-top opacity-30 sm:opacity-50"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="max-w-lg">
            {/* B2B badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wide">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              Purpose-built for restoration companies
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
              Insurance-Ready Reports in 15 Minutes, Not 3 Hours.
            </h1>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Restoration Report lets your crews document water, fire, and mold jobs on-site — and generates adjuster-ready PDFs that clear on the first pass. No more back-and-forth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={scrollToDemo}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
              >
                Get Early Access →
              </button>
              <a
                href="/app/jobs?demo=1"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-700 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Live Demo
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-4">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Setup in minutes
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Works with any claim portal
              </span>
            </div>

            {/* Urgency / scarcity signal */}
            <p className="text-xs text-slate-400">
              🔒 Founding member pricing available for the first 50 companies — 12 spots remaining.
            </p>
          </div>

          {/* Right Column - Product Preview */}
          <div className="order-first lg:order-last">
            <div className="relative max-w-md mx-auto lg:max-w-none">
              <AppImages prefersReducedMotion={prefersReducedMotion} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
