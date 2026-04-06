import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analytics } from '../../lib/analytics';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgpqwzo';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function DemoRequestForm({ id = 'demo' }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid work email address.');
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

      if (!res.ok) {
        throw new Error('Submission failed');
      }

      analytics.waitlistSubmit(email.split('@')[1] || 'unknown');
      if (window.fbq) fbq('track', 'Lead');
      if (window.gtag) gtag('event', 'generate_lead', { currency: 'USD', value: 1.0 });
      navigate('/thank-you');
    } catch (err) {
      console.error('Demo form submission error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="demo-email" className="block text-sm font-medium text-slate-700 mb-1">
          Work Email
        </label>
        <input
          type="email"
          id="demo-email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@yourcompany.com"
          required
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 transition"
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold text-base hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2 justify-center">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Sending…
          </span>
        ) : (
          'Request a Demo →'
        )}
      </button>

      <p className="text-xs text-slate-500 text-center leading-relaxed">
        No commitment required &nbsp;·&nbsp; 20-minute walkthrough &nbsp;·&nbsp; We respond within 1 business day
      </p>
    </form>
  );
}
