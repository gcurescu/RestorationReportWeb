import { useState, useRef, useEffect } from 'react';
import SampleReport from '../components/shared/SampleReport.jsx';
import { useNavigate } from 'react-router-dom';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgpqwzo';
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ─── Shared sub-components ───────────────────────────────────────────────────

function EmailCaptureForm({ id, variant = 'dark', buttonLabel = 'Send Me the Free Bundle →' }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error('Submission failed');
      if (window.fbq) window.fbq('track', 'Lead');
      if (window.gtag) window.gtag('event', 'generate_lead', { currency: 'USD', value: 1.0 });
      navigate('/thank-you');
    } catch (err) {
      console.error('Ad LP form error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = variant === 'dark';

  return (
    <form id={id} onSubmit={handleSubmit} className="w-full" noValidate>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your work email"
          required
          disabled={isSubmitting}
          className={`flex-1 px-5 py-4 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-60 transition ${
            isDark
              ? 'bg-white/10 border border-white/20 text-white placeholder-white/40'
              : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400'
          }`}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-4 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-900 font-bold text-base rounded-xl transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isSubmitting ? 'Sending…' : buttonLabel}
        </button>
      </div>
      {error && (
        <p className={`text-sm mt-2 ${isDark ? 'text-red-400' : 'text-red-600'}`} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

function StarRating() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function CheckIcon({ className = 'w-3 h-3 text-emerald-600' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon({ className = 'w-3 h-3 text-red-600' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const painPoints = [
  {
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
      </svg>
    ),
    title: "You're doing the job twice.",
    body: "You work the site all day, then spend 2–3 hours writing about it at night. That's unpaid overtime — every job, every time. Meanwhile your competition is submitting faster and getting paid first.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9l-3-3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 6l3 3" />
      </svg>
    ),
    title: 'Adjusters keep sending it back.',
    body: 'Missing line item. Wrong format. "Insufficient documentation." Every kickback adds weeks to your payment timeline and costs you leverage. One bad report can hold up your entire cash flow.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: "The money is there — you just can't touch it.",
    body: 'Small restoration companies wait 60–90 days for payment on completed jobs. Tight documentation cuts that timeline in half. Poor documentation can stretch it to never.',
  },
];

const beforeItems = [
  '2–3 hours writing reports at night',
  'Adjusters kick back 1 in 3 reports',
  'Waiting 60–90 days to get paid',
  'Losing line items you forgot to document',
  'Competing on price because your docs look amateur',
];

const afterItems = [
  'Report done before you leave the job site',
  'First-pass approval — nothing missing',
  'Clean docs = faster adjuster sign-off',
  'Every billable item captured on-site',
  'Win jobs by looking like the professional you are',
];

const testimonials = [
  {
    initials: 'JK',
    avatarBg: 'bg-blue-600',
    quote:
      'I used to spend Sunday nights doing paperwork. Now my reports are done before I lock my truck. First adjuster review, no kickbacks. That alone was worth it.',
    name: 'James K.',
    role: 'Owner, Great Lakes Restoration — Chicago, IL',
  },
  {
    initials: 'MD',
    avatarBg: 'bg-emerald-600',
    quote:
      "We had three jobs held up waiting on documentation revisions. Since we switched, we haven't had a single report sent back. Cash flow is completely different now.",
    name: 'Maria D.',
    role: 'Project Manager, SunState Mitigation — Phoenix, AZ',
  },
  {
    initials: 'DH',
    avatarBg: 'bg-violet-600',
    quote:
      "I was skeptical — I've tried every tool out there. This is the first one that actually understands how adjusters think. It generates reports in their format, not ours.",
    name: 'Derek H.',
    role: 'Operations Lead, BlueLine Restoration — Atlanta, GA',
  },
];

const faqs = [
  {
    q: 'Does this replace Xactimate?',
    a: 'No — RestorationReport works alongside Xactimate. It handles the documentation and report generation workflow so your Xactimate estimates have everything they need attached.',
  },
  {
    q: 'What if my adjusters use a specific format?',
    a: 'RestorationReport generates output that matches standard adjuster requirements. During early access, we\'re actively building custom format support based on what our contractors tell us they need.',
  },
  {
    q: 'How long does setup take?',
    a: 'Under 5 minutes. You enter your company info, connect your existing photo workflow, and you\'re done. No IT, no training sessions.',
  },
  {
    q: 'Why is early access free?',
    a: "We're building this with contractors, not for them. Founding members get free access in exchange for feedback that shapes the product. Once we launch publicly, founding members lock in their rate.",
  },
  {
    q: "I'm a solo operator with 2 crews. Is this for me?",
    a: "That's exactly who this is built for. The contractors getting hurt most by slow documentation are the ones who can't afford a full-time estimator. This is your unfair advantage.",
  },
];

// ─── FAQ accordion item ───────────────────────────────────────────────────────

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-900 text-base">{q}</span>
        <svg
          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <p className="pb-5 text-slate-600 leading-relaxed text-sm pr-8">{a}</p>
      )}
    </div>
  );
}

// ─── Shared section backgrounds ──────────────────────────────────────────────

const darkGradient = { background: 'linear-gradient(140deg, #070E1C 0%, #0C2D48 55%, #0E3D6A 100%)' };

const gridOverlay = {
  backgroundImage:
    'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
  backgroundSize: '72px 72px',
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdLandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transitionClass = 'transition-all duration-700 ease-out';
  const visibleClass = 'opacity-100 translate-y-0';
  const hiddenClass = 'opacity-0 translate-y-8';
  return (
    <div className="min-h-screen bg-white antialiased">

      {/* ── Header ── */}
      <header className="absolute top-0 left-0 right-0 z-20 py-5 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <img src="/RR_Icon.png" alt="Restoration Report" className="h-8 w-8 object-contain" />
          <span className="font-bold text-white text-base tracking-tight">Restoration Report</span>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-28 pb-0 px-6" style={darkGradient}>
        {/* Grid + glow overlays */}
        <div className="absolute inset-0 opacity-[0.04]" style={gridOverlay} />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #3B82F6 0%, transparent 70%)' }}
        />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Left: copy + form */}
            <div className="pb-16 lg:pb-24">
              <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-[1.05] tracking-tight mb-5">
                You Did the Work.<br />
                <span className="text-amber-400">Now Get Paid<br />For It.</span>
              </h1>

              <p className="text-lg text-slate-300 leading-relaxed mb-6 max-w-md">
                Most restoration contractors lose thousands every year to adjuster kickbacks and underpaid
                claims. Get our free bundle: the 5 Documentation Mistakes Guide + a ready-to-use
                Insurance-Ready Report Template — and start submitting reports that get approved on the
                first pass.
              </p>

              {/* Form label (mobile only — desktop version lives in the right column) */}
              <div className="lg:hidden">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/80 mb-3">
                  Get the free bundle — instant download
                </p>
                <div className="mb-5 max-w-lg">
                  <EmailCaptureForm id="hero-form" variant="dark" buttonLabel="Send Me the Free Bundle →" />
                </div>

                <p className="text-sm text-slate-500">
                  No credit card &nbsp;·&nbsp; Instant download &nbsp;·&nbsp; Used by contractors in 14 states
                </p>
              </div>

              <div className="mb-6 max-w-md space-y-1.5">
                <p className="text-sm text-slate-300 font-semibold uppercase tracking-wide">You'll get:</p>
                <p className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  5 Documentation Mistakes That Get Claims Denied <span className="text-slate-500">(PDF guide)</span>
                </p>
                <p className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  Insurance-Ready Report Template <span className="text-slate-500">(fillable Word doc)</span>
                </p>
              </div>

              {/* Inline trust signals */}
              <div className="mt-5 flex flex-col sm:flex-row gap-2 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  Used by restoration contractors in 14 states
                </span>
                <span className="hidden sm:inline text-slate-600">·</span>
                <span className="flex items-center gap-1.5">
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  Works with Xactimate, Encircle &amp; any adjuster portal
                </span>
              </div>

              {/* Social proof avatars */}
              <div className="mt-7 flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {[
                    { i: 'JK', bg: 'bg-blue-600' },
                    { i: 'MD', bg: 'bg-emerald-600' },
                    { i: 'DH', bg: 'bg-violet-600' },
                  ].map(({ i, bg }, idx) => (
                    <div
                      key={idx}
                      className={`w-9 h-9 rounded-full border-2 border-[#0C2D48] flex items-center justify-center text-xs font-bold text-white ${bg}`}
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-400">
                  <span className="text-white font-semibold">47 contractors</span> already on the waitlist
                </p>
              </div>
            </div>

            {/* Right: product screenshot */}
            <div className="relative flex flex-col justify-between">
              {/* Desktop-only form — fills the space above the product images */}
              <div className="hidden lg:block mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/80 mb-3">
                  Get the free bundle — instant download
                </p>
                <div className="mb-4">
                  <EmailCaptureForm id="hero-form-desktop" variant="dark" buttonLabel="Send Me the Free Bundle →" />
                </div>
                <p className="text-sm text-slate-500">
                  No credit card &nbsp;·&nbsp; Instant download &nbsp;·&nbsp; Used by contractors in 14 states
                </p>
              </div>
              <div className="relative w-full max-w-xl">
                <div
                  className="absolute -inset-6 rounded-3xl pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.25) 0%, transparent 70%)' }}
                />
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
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator — desktop inline */}
        <div className="hidden lg:flex flex-col items-center pb-8 pt-2 gap-1.5">
          <span className="text-xs text-white/30 uppercase tracking-widest font-medium">Scroll to learn more</span>
          <div className="flex flex-col items-center gap-0.5">
            <svg className="w-5 h-5 text-white/40 animate-bounce" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            <svg className="w-5 h-5 text-white/20 animate-bounce" style={{ animationDelay: '150ms' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Scroll indicator — mobile fixed overlay, fades on scroll */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-30 flex flex-col items-center pb-5 pt-10 gap-1 pointer-events-none transition-opacity duration-500 ${
          scrolled ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ background: 'linear-gradient(to top, #070E1C 0%, #0C2D48 60%, transparent 100%)' }}
      >
        <span className="text-xs text-white/40 uppercase tracking-widest font-medium">Scroll to learn more</span>
        <div className="flex flex-col items-center gap-0.5">
          <svg className="w-5 h-5 text-white/50 animate-bounce" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          <svg className="w-5 h-5 text-white/25 animate-bounce" style={{ animationDelay: '150ms' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          PAIN POINT BANNER — dark stat strip
      ════════════════════════════════════════════════════════ */}
      <section className="bg-slate-900 border-y border-slate-800 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">

          <div>
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="text-2xl font-extrabold text-red-400 line-through opacity-70">3 hrs</span>
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="text-2xl font-extrabold text-amber-400">15 min</span>
            </div>
            <div className="text-sm text-slate-400">Report time, per job</div>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-amber-400 mb-1">60–90 days</div>
            <div className="text-sm text-slate-400">Average payment delay without clean docs</div>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-amber-400 mb-1">60%</div>
            <div className="text-sm text-slate-400">Of claims initially underpaid due to documentation gaps</div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PAIN POINTS — "Sound familiar?"
      ════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">The Problem</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Sound familiar?</h2>
            <p className="text-slate-500 mt-3 max-w-md mx-auto">
              Most restoration contractors are leaving money on the table — not because they did bad work, but because their paperwork doesn't reflect the work they did.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {painPoints.map((p, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 p-7 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center mb-5">
                  {p.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-3">{p.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PRODUCT SCREENSHOTS
      ════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">The Product</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              What your adjuster gets.
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Every report includes everything they need — no follow-up calls, no kickbacks, no delays.
            </p>
          </div>

          <div className="flex justify-center">
            <SampleReport />
          </div>
        </div>
        {/* Badge */}
        <div className="flex justify-center mt-10 px-4">
          <button
            type="button"
            onClick={() => {
              const desktop = document.getElementById('hero-form-desktop');
              const mobile = document.getElementById('hero-form');
              const target = (desktop && desktop.offsetParent) ? desktop : mobile;
              if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/25 rounded-full px-5 py-2 text-sm font-semibold text-amber-400 hover:bg-amber-400/20 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 text-center"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            📦 Free Bundle — 2 Resources for Restoration Contractors
          </button>
        </div>
      </section>
      
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">The Difference</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Which column are you in?
            </h2>
            <p className="text-slate-500 mt-3 max-w-md mx-auto">
              Most restoration companies are still stuck on the left. That's the opportunity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-xl">
            {/* Before */}
            <div className="flex flex-col">
              <div className="bg-red-600 px-6 py-4 flex items-center gap-2">
                <XIcon className="w-5 h-5 text-white" />
                <h3 className="text-white font-bold text-base">Without RestorationReport</h3>
              </div>
              <div className="bg-white flex-1 px-6 py-5 space-y-4">
                {beforeItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                      <XIcon />
                    </span>
                    <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* After */}
            <div className="flex flex-col">
              <div className="bg-emerald-600 px-6 py-4 flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-white" />
                <h3 className="text-white font-bold text-base">With RestorationReport</h3>
              </div>
              <div className="bg-white flex-1 px-6 py-5 space-y-4">
                {afterItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckIcon />
                    </span>
                    <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Social Proof</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Contractors are already saving hours every week.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex flex-col bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <StarRating />
                <blockquote className="mt-4 text-slate-700 leading-relaxed flex-1 text-sm">
                  "{t.quote}"
                </blockquote>
                <div className="mt-5 pt-5 border-t border-slate-200 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-white ${t.avatarBg}`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FAQ
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">FAQ</p>
            <h2 className="text-3xl font-bold text-slate-900">Questions from contractors like you</h2>
          </div>
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl px-6 shadow-sm">
            {faqs.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECOND CTA
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative overflow-hidden" style={darkGradient}>
        <div className="absolute inset-0 opacity-[0.04]" style={gridOverlay} />
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/25 rounded-full px-4 py-1.5 text-sm font-semibold text-amber-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Free Bundle — No Credit Card Required
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            Get the Free Documentation Bundle
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            The 5 Mistakes Guide + Report Template — free for restoration contractors.
          </p>

          <div className="max-w-lg mx-auto">
            <EmailCaptureForm id="bottom-form" variant="dark" buttonLabel="Download the Free Bundle →" />
          </div>

          <p className="mt-5 text-sm text-slate-500">
            No credit card &nbsp;·&nbsp; Instant download &nbsp;·&nbsp; Used by contractors in 14 states
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 text-slate-500 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <img src="/RR_Icon.png" alt="" className="h-5 w-5 opacity-40" />
            <span>© 2025 Restoration Report</span>
          </div>
          <a href="/privacy.html" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
        </div>
      </footer>

    </div>
  );
}
