import { useState, useEffect } from 'react';
import { SlimNav } from '../components/nav/SlimNav';
import { Hero } from '../components/hero/Hero';
import { SocialProof } from '../components/proof/SocialProof';
import SampleReport from '../components/shared/SampleReport.jsx';

// Reusable components from original (keeping for backward compatibility)
function FeatureCard({ title, description }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-2 text-base">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm" aria-hidden>{number}</div>
        <h3 className="font-semibold text-slate-900 text-base">{title}</h3>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Faq({ q, a }) {
  const [open, setOpen] = useState(false);
  const id = q.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-medium text-slate-900 pr-4 text-sm md:text-base">{q}</span>
        <span className="text-slate-500" aria-hidden>{open ? '-' : '+'}</span>
      </button>
      {open && (
        <div id={id} className="mt-3 text-sm text-slate-600 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

function LogoMark() {
  return (
    <img 
      src="/RR_Icon.png" 
      alt="Restoration Report Logo" 
      className="h-8 w-8 object-contain"
    />
  );
}

function MockReportPreview() {
  return <SampleReport />;
}

export default function LandingPage() {
  // UTM state
  const [utmParams, setUtmParams] = useState({});
  // ROI calculator state removed for demo landing page

  useEffect(() => {
    // Parse UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(param => {
      const value = urlParams.get(param);
      if (value) params[param] = value;
    });
    setUtmParams(params);
  }, []);

  // Global handler: smooth-scroll any link/button that points to #signup
  useEffect(() => {
    function handleClick(e) {
      // Find closest anchor or button with href or data-href
      const target = e.target.closest && e.target.closest('a[href="#signup"], button[data-href="#signup"], [data-cta="signup"]');
      if (target) {
        e.preventDefault();
        const el = document.getElementById('signup');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Focus the first input (email) inside the signup form after scrolling
          setTimeout(() => {
            const input = el.querySelector && (el.querySelector('#signup-email') || el.querySelector('input[type="email"]'));
            if (input && typeof input.focus === 'function') {
              try { input.focus({ preventScroll: true }); } catch { input.focus(); }
            }
          }, 400);
        }
      }
    }

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  const faqData = [
    { q: 'Who is this for?', a: 'Water, fire, and mold mitigation contractors who need professional reports for insurance adjusters. Especially helpful for crews handling multiple claims per week.' },
    { q: 'Do you integrate with adjuster portals?', a: 'We generate clean PDFs that work with any portal - Xactimate, CoreLogic, or email. No complex integrations needed.' },
    { q: 'Will my data be private?', a: 'Yes. Your job data stays private and secure. We do not share information with competitors or insurance companies.' },
    { q: 'How do invites work?', a: 'We are rolling out to Chicagoland first, then expanding. ZIP codes help us prioritize. Beta is free - no credit card required.' }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  };

  

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800" data-utm={JSON.stringify(utmParams)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      {/* Slim Navigation */}
      <SlimNav />

  {/* Hero Section */}
  <Hero subcopy="Generate Water, Fire, and Mold reports your adjuster can approve on first pass." />

      {/* Social Proof */}
      <SocialProof />

      {/* Beta Access Banner */}
      <section className="py-12 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">🎉 Beta Now Live!</h2>
            <p className="text-green-100 mb-4">
              Skip the waitlist. Start creating professional reports today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="/app/jobs?demo=1"
                className="inline-flex items-center justify-center bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 font-medium shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white text-sm transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Demo
              </a>
              <a 
                href="/app/jobs"
                className="inline-flex items-center justify-center bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-900 font-medium shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white text-sm transition-colors"
              >
                Access Beta (Free) →
              </a>
            </div>
          </div>
        </div>
      </section>

            {/* Sample */}
        <section id="sample" className="py-16 bg-white" aria-labelledby="sample-heading">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="sample-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Sample Report</h2>
            <p className="text-lg text-slate-600 mb-8">See what your reports will look like</p>
            <div className="flex justify-center"><MockReportPreview /></div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  // Trigger the modal in the SampleReport component
                  const sampleReportElement = document.querySelector('[data-sample-report]');
                  if (sampleReportElement) {
                    const viewButton = sampleReportElement.querySelector('button');
                    if (viewButton) viewButton.click();
                  }
                }}
                className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 text-sm"
              >
                View Full Sample Report →
              </button>
              <a 
                href="/app/jobs?demo=1"
                className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-600 text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Try Demo Now →
              </a>
            </div>
          </div>
        </section>

      {/* Features */}
      <section id="features" className="py-16 bg-white" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="features-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Everything you need for professional reports
            </h2>
            <p className="text-lg text-slate-600">Stop juggling multiple apps and spreadsheets</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
                title="Moisture and Equipment Logs"
                description="Capture readings as you go — auto roll-up into tables."
            />
            <FeatureCard
                title="Before/After and Scope"
                description="Attach photos and scope notes side by side for adjusters."
            />
            <FeatureCard
                title="One-tap Export"
                description="Generate polished PDFs you can email or upload to claim portals."
            />
            </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 bg-white" aria-labelledby="how-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="how-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-lg text-slate-600">Simple workflow that fits your process</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <StepCard number="1" title="Capture on site" description="Take photos, record moisture readings, and add equipment as you work the job." />
            <StepCard number="2" title="Auto-organize" description="Everything gets sorted into the right sections automatically - photos, logs, scope." />
            <StepCard number="3" title="Export and share" description="One tap generates a clean PDF ready for adjusters, claim portals, or email." />
          </div>
        </div>
      </section>

      {/* Removed waitlist CTAs and ROI calculator for demo-ready landing page */}

      {/* FAQ */}
      <section id="faq" className="py-16" aria-labelledby="faq-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Frequently asked questions</h2>
            <p className="text-lg text-slate-600">Everything you need to know about Restoration Report</p>
          </div>
          <div className="space-y-4">
            {faqData.map((f, i) => (
              <Faq key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA removed (waitlist) */}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-12" aria-labelledby="footer-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="footer-heading" className="sr-only">Footer</h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-3">
              <LogoMark />
              <span className="font-bold text-sm sm:text-base">Restoration Report</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="/privacy.html" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400 max-w-2xl">Made for Water, Fire, and Mold mitigation teams. Not affiliated with Encircle or Xactimate.</p>
        </div>
      </footer>
    </div>
  );
}
