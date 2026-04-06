import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SampleReport from '../components/shared/SampleReport.jsx';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgpqwzo';
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function EmailCaptureForm({ id }) {
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
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
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

  return (
    <form id={id} onSubmit={handleSubmit} className="w-full" noValidate>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={isSubmitting}
          className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 text-slate-900 text-base"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md whitespace-nowrap"
        >
          {isSubmitting ? 'Sending…' : 'Get Early Access →'}
        </button>
      </div>
      {error && (
        <p className="text-red-600 text-sm mt-2" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

const testimonials = [
  {
    quote: "Cuts our report time from 3 hours to under 20 minutes. Our adjuster actually called to compliment the format.",
    name: "James Kowalski",
    role: "Owner",
    company: "Great Lakes Restoration",
    location: "Chicago, IL",
  },
  {
    quote: "First-pass approval rate went up immediately. The PDF format is exactly what adjusters want to see.",
    name: "Maria Delgado",
    role: "Project Manager",
    company: "SunState Mitigation",
    location: "Phoenix, AZ",
  },
  {
    quote: "I was doing reports at midnight. Now I generate them on-site before I leave the job.",
    name: "Derek Holt",
    role: "Crew Lead",
    company: "BlueLine Restoration Services",
    location: "Atlanta, GA",
  },
];

const painPoints = [
  {
    problem: "Reports taking 2-3 hours?",
    solution: "Generate a complete PDF on-site in under 5 minutes.",
  },
  {
    problem: "Adjusters kicking claims back?",
    solution: "Formatted exactly how adjusters want it. First-pass approval.",
  },
  {
    problem: "Still using Word docs or Excel?",
    solution: "Photos, moisture readings, scope notes, PDF — all in one place.",
  },
];

export default function AdLandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Minimal header — logo only */}
      <header className="bg-white border-b border-slate-100 py-4 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <img src="/RR_Icon.png" alt="Restoration Report" className="h-8 w-8 object-contain" />
          <span className="font-bold text-slate-900 text-base">Restoration Report</span>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-800 bg-opacity-60 border border-blue-600 rounded-full px-4 py-1.5 text-sm font-medium text-blue-200 mb-6">
            Early Access — Founding Member Pricing
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Stop Doing Reports at Midnight.
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl">
            Restoration Report lets your crew document water, fire, and mold jobs on-site — generating adjuster-ready PDFs before they leave the job.
          </p>

          <div className="max-w-xl">
            <EmailCaptureForm id="hero-form" />
          </div>

          <p className="mt-4 text-sm text-blue-300">
            🔒 No credit card · Setup in 5 minutes · 12 founding spots remaining
          </p>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="py-12 bg-slate-50 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-medium text-slate-400 uppercase tracking-widest mb-8">
            Trusted by restoration professionals
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <figure key={i} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col">
                <blockquote className="text-sm text-slate-700 mb-4 leading-relaxed flex-1">
                  "{t.quote}"
                </blockquote>
                <figcaption className="text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <div className="font-semibold text-slate-900">{t.name}</div>
                  <div>{t.role}, {t.company}</div>
                  <div className="text-slate-400 mt-0.5">{t.location}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Product output section */}
      <section className="py-14 bg-white px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-8">
            This is what your adjuster gets.
          </h2>
          <SampleReport />
        </div>
      </section>

      {/* Pain points */}
      <section className="py-14 bg-slate-50 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {painPoints.map((p, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <p className="font-semibold text-slate-800 mb-3">{p.problem}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{p.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second email capture */}
      <section className="py-16 bg-blue-700 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to get your first hour back?
          </h2>
          <p className="text-blue-100 mb-8">
            Join restoration crews already cutting report time by 80%.
          </p>
          <EmailCaptureForm id="bottom-form" />
          <p className="mt-4 text-sm text-blue-300">
            🔒 No credit card · Setup in 5 minutes · 12 founding spots remaining
          </p>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-4 text-center text-sm">
        © 2025 Restoration Report ·{' '}
        <a href="/privacy.html" className="hover:text-white transition-colors">
          Privacy
        </a>
      </footer>
    </div>
  );
}
