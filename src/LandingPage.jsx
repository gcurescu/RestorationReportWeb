import { useState, useEffect } from 'react';
import SampleReport from './SampleReport';


// Configuration
const SUBMIT_MODE = "netlify"; // or "webhook"
const WEBHOOK_URL = ""; // used only if SUBMIT_MODE === "webhook"

// Inline components and helpers
function LogoMark() {
  return (
    <img 
      src="/RR_Icon.png" 
      alt="Restoration Report Logo" 
      className="h-8 w-8 object-contain"
    />
  );
}

function Check() {
  return (
    <svg className="h-5 w-5 text-green-600 flex-none mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4A1 1 0 0 1 4.707 9.293L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
    </svg>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
      {children}
    </span>
  );
}

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

function TrustBar() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
        <Badge>No credit card for beta</Badge>
        <Badge>Cancel anytime</Badge>
        <Badge>Made for crews</Badge>
      </div>
    </div>
  );
}

function MockScreenPreview() {
  return (
    <img 
      src="/ProjectSummary.png" 
      alt="Restoration Report Preview" 
      className="w-full max-w-sm mx-auto rounded-lg shadow-lg border border-slate-200"
    />
  );
}

function MockReportPreview() {
  return <SampleReport />;
}

function encode(data) {
  return Object.keys(data)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&');
}

export default function LandingPage() {
  // Form state
  const [email, setEmail] = useState('');
  const [zip, setZip] = useState('');
  const [stickyEmail, setStickyEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  // UTM state
  const [utmParams, setUtmParams] = useState({});

  // ROI calculator state
  const [claimsPerMonth, setClaimsPerMonth] = useState(10);
  const [hoursPerClaim, setHoursPerClaim] = useState(2);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const collected = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(k => {
      if (params.has(k)) collected[k] = params.get(k);
    });
    setUtmParams(collected);
    const onScroll = () => setShowSticky(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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

  async function handleSubmit(e, formEmail = email, isSticky = false) {
    if (SUBMIT_MODE === 'webhook') e.preventDefault(); else e.preventDefault(); // keep inline for netlify to show success inline
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitMessage('');
    setIsError(false);
    try {
      if (SUBMIT_MODE === 'webhook') {
        if (!WEBHOOK_URL) throw new Error('Missing WEBHOOK_URL');
        const payload = {
          email: formEmail,
          zip: isSticky ? '' : zip,
          utm: {
            source: utmParams.utm_source || '',
            medium: utmParams.utm_medium || '',
            campaign: utmParams.utm_campaign || '',
            term: utmParams.utm_term || '',
            content: utmParams.utm_content || ''
          },
          source: 'restorationreport.app',
            ts: new Date().toISOString()
        };
        const res = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Request failed');
        setSubmitMessage('Thanks - you are on the waitlist.');
        setEmail('');
        setZip('');
        setStickyEmail('');
      } else if (SUBMIT_MODE === 'netlify') {
        const formData = {
          'form-name': 'waitlist',
          email: formEmail,
          zip: isSticky ? '' : zip,
          ...utmParams
        };
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encode(formData)
        });
        setSubmitMessage('Thanks - you are on the waitlist.');
        if (isSticky) setStickyEmail('');
      }
    } catch (err) {
      setIsError(true);
      setSubmitMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const derivedHours = (claimsPerMonth * hoursPerClaim) || 0;

  function scrollToSignup() {
    const el = document.getElementById('signup');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {/* Header */}
      <header className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button type="button" onClick={() => window.location.reload()} className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
              <LogoMark />
              <span className="font-bold text-slate-900 text-sm sm:text-base">Restoration Report</span>
            </button>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#features" className="text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">How it works</a>
              <a href="#proof" className="text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">Proof</a>
              <a href="#roi" className="text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">ROI</a>
              <a href="#faq" className="text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">FAQ</a>
              <a href="#sample" className="text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">Sample</a>
              <a href="#signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 font-medium shadow">Join</a>
            </nav>
          </div>
        </div>
      </header>
      {/* Hero */}
            
              {/* Hero */}
              <section className="relative h-screen">
                <div className="absolute inset-0 z-0">         {/* changed -z-10 -> z-0 */}
                  <img
                    src="/RestorationReportHeroImagePromo.svg"
                    alt="Hero Image"
                    className="w-full h-full object-cover"
                    aria-hidden
                  />
                </div>
              </section>
      {/* Sign up */}
      <section className="pt-14 pb-16 lg:pt-20 lg:pb-24" aria-labelledby="hero-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1 id="hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">Create claim-ready Water, Fire, and Mold reports in minutes</h1>
              <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-xl">Capture photos, readings, and notes one time, then export a clean PDF adjusters accept.</p>
              <ul className="space-y-3 mb-8 text-sm sm:text-base">
                <li className="flex items-start gap-3"><Check /><span>Single above-the-fold signup</span></li>
                <li className="flex items-start gap-3"><Check /><span>Clear value prop and proof sections</span></li>
                <li className="flex items-start gap-3"><Check /><span>Optional ZIP to prioritize invites by territory</span></li>
              </ul>
              <div id="signup" className="scroll-mt-24">
                <SignupForm
                  email={email}
                  zip={zip}
                  setEmail={setEmail}
                  setZip={setZip}
                  utmParams={utmParams}
                  isSubmitting={isSubmitting}
                  submitMessage={submitMessage}
                  isError={isError}
                  handleSubmit={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Proof bar */}
      <section id="proof" className="py-10" aria-label="Proof and trust">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBar />
        </div>
      </section>
      {/* Features */}
      <section id="features" className="py-16" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="features-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Everything you need for professional reports</h2>
            <p className="text-lg text-slate-600">Stop juggling multiple apps and spreadsheets</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard title="Moisture and Equipment Logs" description="Capture readings as you go - auto roll-up into tables." />
            <FeatureCard title="Before/After and Scope" description="Attach photos and scope notes side by side for adjusters." />
            <FeatureCard title="One-tap Export" description="Generate polished PDFs you can email or upload to claim portals." />
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
      {/* ROI calculator */}
      <section id="roi" className="py-16" aria-labelledby="roi-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <div className="text-center mb-8">
              <h2 id="roi-heading" className="text-2xl font-bold text-slate-900 mb-2">Calculate your time savings</h2>
              <p className="text-slate-600 text-sm sm:text-base">Estimated hours saved per month = claims * hours saved per claim.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="claims" className="block text-sm font-medium text-slate-700 mb-2">Claims per month</label>
                <input
                  id="claims"
                  type="number"
                  min="0"
                  value={claimsPerMonth}
                  onChange={e => setClaimsPerMonth(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
                />
              </div>
              <div>
                <label htmlFor="hours" className="block text-sm font-medium text-slate-700 mb-2">Hours saved per claim</label>
                <input
                  id="hours"
                  type="number"
                  step="0.5"
                  min="0"
                  value={hoursPerClaim}
                  onChange={e => setHoursPerClaim(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
                />
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 text-center mb-8">
              <div className="text-3xl font-bold text-blue-600 mb-1">{derivedHours} hours</div>
              <div className="text-slate-600 text-sm">Estimated hours saved per month</div>
            </div>
            <div className="text-center">
              <button type="button" onClick={scrollToSignup} className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600">Join the waitlist</button>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section id="faq" className="py-16 bg-white" aria-labelledby="faq-heading">
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
      {/* Sample */}
      <section id="sample" className="py-16" aria-labelledby="sample-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="sample-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Sample Report</h2>
          <p className="text-lg text-slate-600 mb-8">See what your reports will look like</p>
          <div className="flex justify-center"><MockReportPreview /></div>
        </div>
      </section>
      {/* Sticky signup */}
      {showSticky && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 shadow-lg z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <form onSubmit={(e) => handleSubmit(e, stickyEmail, true)} className="flex items-center gap-3" aria-label="Sticky signup form">
              <label htmlFor="sticky-email" className="sr-only">Work Email Address</label>
              <input
                id="sticky-email"
                type="email"
                required
                value={stickyEmail}
                onChange={e => setStickyEmail(e.target.value)}
                placeholder="Work email"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
              />
              <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600">{isSubmitting ? '...' : 'Join'}</button>
            </form>
          </div>
        </div>
      )}
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-12" aria-labelledby="footer-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="footer-heading" className="sr-only">Footer</h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-3">
              <LogoMark />
              <span className="font-bold text-sm sm:text-base">Restoration Report</span>
            </div>
            <div className="text-sm text-slate-400">© {new Date().getFullYear()} Restoration Report</div>
          </div>
          <p className="mt-4 text-sm text-slate-400 max-w-2xl">Made for Water, Fire, and Mold mitigation teams. Not affiliated with Encircle or Xactimate.</p>
        </div>
      </footer>
    </div>
  );
}

// Signup form component (internal only to keep single file organization)
function SignupForm({ email, zip, setEmail, setZip, utmParams, isSubmitting, submitMessage, isError, handleSubmit }) {
  return (
    <form
      name="waitlist"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      action="/success"
      onSubmit={(e) => handleSubmit(e)}
      className="space-y-4"
      aria-label="Signup form"
    >
      <input type="hidden" name="form-name" value="waitlist" />
      <input type="hidden" name="bot-field" />
      {Object.entries(utmParams).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="email" className="sr-only">Work Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            required
            placeholder="Work email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
            autoComplete="email"
          />
        </div>
        <div className="sm:w-32">
          <label htmlFor="zip" className="sr-only">ZIP Code</label>
          <input
            id="zip"
            type="text"
            name="zip"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="ZIP (optional)"
            value={zip}
            onChange={e => setZip(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
          />
        </div>
        <div className="sm:w-auto">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
          >{isSubmitting ? 'Joining...' : 'Join the waitlist'}</button>
        </div>
      </div>
      {submitMessage && (
        <div className={`text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>{submitMessage}</div>
      )}
      <p className="text-xs text-slate-500">No spam. Unsubscribe anytime.</p>
    </form>
  );
}
