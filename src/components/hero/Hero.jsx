import { useState, useEffect, useRef } from 'react';
import { EmailSignup } from '../forms/EmailSignup';

function AppImages({ prefersReducedMotion = false }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // If the user prefers reduced motion, skip intersection animations and show immediately.
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
        <img src="/ReportPreview.svg" alt="Report Preview" className="w-32 sm:w-40 md:w-48 rounded-lg shadow-lg border border-slate-200 transform -rotate-6" loading="lazy" />
      </div>

      <div
        className={`absolute ${transitionClass} ${isVisible ? visibleClass : hiddenClass}`}
        style={{ transitionDelay: isVisible ? '200ms' : '0ms', right: '0%', top: '20%', zIndex: 1 }}
      >
        <img src="/Gallary.svg" alt="Gallery Preview" className="w-32 sm:w-40 md:w-48 rounded-lg shadow-lg border border-slate-200 transform rotate-6" loading="lazy" />
      </div>

      <div
        className={`absolute ${transitionClass} ${isVisible ? visibleClass : hiddenClass}`}
        style={{ transitionDelay: isVisible ? '0ms' : '0ms', left: '50%', top: '10%', transform: 'translateX(-50%)', zIndex: 2 }}
      >
        <img src="/Dashboard.svg" alt="Dashboard Preview" className="w-40 sm:w-48 md:w-56 rounded-lg shadow-xl border border-slate-200" loading="lazy" />
      </div>
    </div>
  );
}

export function Hero() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      // matchMedia may exist but return undefined in some test environments
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery) {
        try {
          setPrefersReducedMotion(!!mediaQuery.matches);

          const handleChange = (e) => setPrefersReducedMotion(!!e.matches);

          // Support both modern and older APIs
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
          // Defensive: if reading matches throws, ignore and leave default
          // (tests and older browsers may behave differently)
          // eslint-disable-next-line no-console
          console.warn('matchMedia check failed', err);
        }
      }
    }
  }, []);

  return (
    <section className="relative bg-white py-16 lg:py-24 overflow-hidden">
      {/* Background SVG */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/HeroBackground.svg" 
          alt=""
          className="w-full h-full object-cover object-center sm:object-right-top opacity-30 sm:opacity-50"
          onLoad={() => console.log('Background image loaded successfully')}
          onError={(e) => console.error('Background image failed to load:', e)}
        />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="max-w-lg">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
              Create claim-ready restoration reports in minutes.
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Generate Water, Fire, and Mold reports your adjuster can approve on first pass.
            </p>

            <div className="mb-8">
              <EmailSignup id="signup" />
            </div>
          </div>

          {/* Right Column - Product Preview (App images) */}
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
