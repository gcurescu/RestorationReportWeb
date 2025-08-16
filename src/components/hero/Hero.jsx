import { useState, useEffect } from 'react';
import { EmailSignup } from '../forms/EmailSignup';

export function Hero() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

            <p className="text-xs text-slate-500 text-center lg:text-left">
              No spam. Unsubscribe anytime. No credit card for beta.
            </p>
          </div>

          {/* Right Column - Product Preview */}
          <div className="order-first lg:order-last">
            <div className="relative max-w-md mx-auto lg:max-w-none">
              {/* Try video first, fallback to image */}
              {!prefersReducedMotion ? (
                <video
                  className="w-full rounded-lg shadow-xl border border-slate-200"
                  muted
                  autoPlay
                  loop
                  playsInline
                  poster="/assets/sample-report.webp"
                  onError={(e) => {
                    // If video fails to load, hide it and show the fallback image
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                >
                  <source src="/assets/sample-report-demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : null}
              
              {/* Fallback image (always present, hidden if video works) */}
              <picture 
                className={`block ${!prefersReducedMotion ? 'hidden' : ''}`}
                style={{ display: prefersReducedMotion ? 'block' : 'none' }}
              >
                <source srcSet="/assets/sample-report.webp" type="image/webp" />
                <img
                  src="/ProjectSummary.png"
                  alt="Sample restoration report preview showing professional layout with project details, photos, and measurements"
                  className="w-full rounded-lg shadow-xl border border-slate-200"
                  loading="lazy"
                />
              </picture>
            </div>

            {/* Additional context for the preview */}
            <div className="mt-6 text-center lg:text-left">
              <p className="text-sm text-slate-500">
                Sample report generated in under 2 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
