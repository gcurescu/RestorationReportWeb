import { useState } from 'react';
import { analytics } from '../../lib/analytics';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgpqwzo';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function DemoRequestForm({ id = 'demo' }) {
  const [fields, setFields] = useState({ company: '', email: '', jobs_per_month: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fields.company.trim()) {
      setError('Please enter your company name.');
      return;
    }
    if (!isValidEmail(fields.email)) {
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
        body: JSON.stringify({
          company: fields.company.trim(),
          email: fields.email.trim(),
          jobs_per_month: fields.jobs_per_month || 'Not specified',
        }),
      });

      if (!res.ok) {
        throw new Error('Submission failed');
      }

      analytics.waitlistSubmit(fields.email.split('@')[1] || 'unknown');
      setIsSuccess(true);
    } catch (err) {
      console.error('Demo form submission error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div id={id} className="rounded-2xl bg-green-50 border border-green-200 p-8 sm:p-10 text-center shadow-sm">
        <div className="flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-900 mb-2">You're on the list!</h3>
        <p className="text-green-800 text-sm leading-relaxed max-w-sm mx-auto">
          We'll reach out to <strong>{fields.company}</strong> within 1 business day to schedule your walkthrough.
          Keep an eye on <strong>{fields.email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="demo-company" className="block text-sm font-medium text-slate-700 mb-1">
          Company Name
        </label>
        <input
          type="text"
          id="demo-company"
          name="company"
          value={fields.company}
          onChange={handleChange}
          placeholder="Acme Restoration"
          required
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 transition"
        />
      </div>

      <div>
        <label htmlFor="demo-email" className="block text-sm font-medium text-slate-700 mb-1">
          Work Email
        </label>
        <input
          type="email"
          id="demo-email"
          name="email"
          value={fields.email}
          onChange={handleChange}
          placeholder="jane@yourcompany.com"
          required
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 transition"
        />
      </div>

      <div>
        <label htmlFor="demo-jobs" className="block text-sm font-medium text-slate-700 mb-1">
          How many jobs/month?
        </label>
        <select
          id="demo-jobs"
          name="jobs_per_month"
          value={fields.jobs_per_month}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 transition bg-white"
        >
          <option value="">Select volume…</option>
          <option value="1–10 jobs">1–10 jobs</option>
          <option value="11–30 jobs">11–30 jobs</option>
          <option value="31–100 jobs">31–100 jobs</option>
          <option value="100+ jobs">100+ jobs</option>
        </select>
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
