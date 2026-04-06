import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgpqwzo';
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function EmailCaptureForm({ id, variant = 'dark' }) {
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
          placeholder="Work email address"
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
          {isSubmitting ? 'Sending…' : 'Get Early Access →'}
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

const testimonials = [
  {
    initials: 'JK',
    avatarBg: 'bg-blue-600',
    quote:
      'Cuts our report time from 3 hours to under 20 minutes. Our adjuster actually called to compliment the format.',
    name: 'James Kowalski',
    role: 'Owner',
    company: 'Great Lakes Restoration',
    location: 'Chicago, IL',
  },
  {
    initials: 'MD',
    avatarBg: 'bg-emerald-600',
    quote:
      'First-pass approval rate went up immediately. The PDF format is exactly what adjusters want to see.',
    name: 'Maria Delgado',
    role: 'Project Manager',
    company: 'SunState Mitigation',
    location: 'Phoenix, AZ',
  },
  {
    initials: 'DH',
    avatarBg: 'bg-violet-600',
    quote:
      "I was doing reports at midnight. Now I generate them on-site before I leave the job.",
    name: 'Derek Holt',
    role: 'Crew Lead',
    company: 'BlueLine Restoration Services',
    location: 'Atlanta, GA',
  },
];

const beforeItems = [
  '2–3 hours writing reports after hours',
  'Adjusters kicking claims back for missing data',
  'Photos emailed separately from scope notes',
  'Word docs that don\'t match adjuster format',
  'Crew waiting on office to finalize paperwork',
];

const afterItems = [
  'Complete PDF generated on-site in under 5 minutes',
  'First-pass adjuster approval — every time',
  'Photos, readings & scope in one document',
  'Formatted exactly how adjusters require it',
  'Done before your crew leaves the job',
];

const stats = [
  { value: '80%', label: 'Less time on reports' },
  { value: '< 5 min', label: 'To generate a full PDF' },
  { value: '1st pass', label: 'Adjuster approval' },
  { value: '12', label: 'Founding spots left' },
];

const screenshots = [
  { src: '/Dashboard.svg', label: 'Job Dashboard', desc: 'All active jobs tracked in one place' },
  { src: '/ReportPreview.svg', label: 'Report Preview', desc: 'Auto-generated adjuster-ready layout' },
  { src: '/Gallary.svg', label: 'Photo Documentation', desc: 'Photos organized by room and date' },
];

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function BrowserChrome({ children }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
      <div className="bg-slate-800/80 px-4 py-3 flex items-center gap-2 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-amber-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <div className="ml-3 flex-1 bg-white/10 rounded-md h-5 flex items-center px-3">
          <span className="text-white/40 text-xs">restorationreport.com/report/WD-2847</span>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function AdLandingPage() {
  return (
    <div className="min-h-screen bg-white antialiased">

      {/* ── Header ── */}
      <header className="absolute top-0 left-0 right-0 z-20 py-5 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <img src="/RR_Icon.png" alt="Restoration Report" className="h-8 w-8 object-contain" />
          <span className="font-bold text-white text-base tracking-tight">Restoration Report</span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden pt-28 pb-0 px-6"
        style={{ background: 'linear-gradient(140deg, #070E1C 0%, #0C2D48 55%, #0E3D6A 100%)' }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
        {/* Radial glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #3B82F6 0%, transparent 70%)' }}
        />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">

            {/* Left: copy + form */}
            <div className="pb-16 lg:pb-24">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/25 rounded-full px-4 py-1.5 text-sm font-semibold text-amber-400 mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Early Access — Founding Member Pricing
              </div>

              <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-[1.04] tracking-tight mb-5">
                Stop Doing<br />
                Reports at<br />
                <span className="text-amber-400">Midnight.</span>
              </h1>

              <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-md">
                Restoration Report lets your crew document water, fire, and mold jobs
                on-site — generating adjuster-ready PDFs before they leave the job.
              </p>

              <div className="mb-5 max-w-lg">
                <EmailCaptureForm id="hero-form" variant="dark" />
              </div>

              <p className="text-sm text-slate-500">
                🔒 No credit card &nbsp;·&nbsp; Setup in 5 minutes &nbsp;·&nbsp; 12 founding spots remaining
              </p>

              {/* Social proof avatars */}
              <div className="mt-8 flex items-center gap-3">
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

            {/* Right: product screenshot rising from bottom */}
            <div className="relative flex items-end justify-center lg:justify-end">
              <div className="relative w-full max-w-xl">
                {/* Glow */}
                <div
                  className="absolute -inset-6 rounded-3xl pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.25) 0%, transparent 70%)' }}
                />
                <BrowserChrome>
                  <img
                    src="/RestorationReportHeroImagePromo.svg"
                    alt="Adjuster-ready restoration report PDF"
                    className="w-full block"
                    loading="eager"
                  />
                </BrowserChrome>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-slate-900 border-y border-slate-800 py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-extrabold text-amber-400 tracking-tight">{s.value}</div>
              <div className="text-sm text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Product screenshots ── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">The Product</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              This is what your adjuster gets.
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              A complete, professionally formatted PDF — generated on-site, every time.
              No more midnight report marathons.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {screenshots.map((img, i) => (
              <div
                key={i}
                className="group rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-white"
              >
                <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="ml-2 flex-1 bg-white rounded h-4" />
                </div>
                <div className="overflow-hidden bg-slate-50">
                  <img
                    src={img.src}
                    alt={img.label}
                    className="w-full block group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="px-5 py-4">
                  <div className="font-semibold text-slate-900 text-sm">{img.label}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{img.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Before vs After ── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Sound familiar?
            </h2>
            <p className="text-slate-500 mt-3 max-w-md mx-auto">
              Most restoration companies are still stuck in the left column.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 shadow-xl rounded-2xl overflow-hidden">
            {/* Before */}
            <div className="flex flex-col">
              <div className="bg-red-600 px-6 py-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h3 className="text-white font-bold text-base">Before Restoration Report</h3>
              </div>
              <div className="bg-white flex-1 px-6 py-5 space-y-4">
                {beforeItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* After */}
            <div className="flex flex-col">
              <div className="bg-emerald-600 px-6 py-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-white font-bold text-base">With Restoration Report</h3>
              </div>
              <div className="bg-white flex-1 px-6 py-5 space-y-4">
                {afterItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Social Proof</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Teams saving hours every week.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex flex-col bg-slate-50 rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <StarRating />

                <blockquote className="mt-4 text-slate-700 leading-relaxed flex-1">
                  "{t.quote}"
                </blockquote>

                <div className="mt-5 pt-5 border-t border-slate-200 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-white ${t.avatarBg}`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-slate-500 text-xs">{t.role} · {t.company}</div>
                    <div className="text-slate-400 text-xs">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Second CTA ── */}
      <section
        className="py-24 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(140deg, #070E1C 0%, #0C2D48 55%, #0E3D6A 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/25 rounded-full px-4 py-1.5 text-sm font-semibold text-amber-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Only 12 founding spots remaining
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            Get your first hour back<br />tomorrow morning.
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            Join restoration crews already cutting report time by 80%.
            Founding member pricing — locked in forever.
          </p>

          <div className="max-w-lg mx-auto">
            <EmailCaptureForm id="bottom-form" variant="dark" />
          </div>

          <p className="mt-5 text-sm text-slate-500">
            🔒 No credit card &nbsp;·&nbsp; Setup in 5 minutes &nbsp;·&nbsp; We respond within 1 business day
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
