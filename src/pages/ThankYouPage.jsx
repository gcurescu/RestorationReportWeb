import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ThankYouPage() {
  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'Lead');
    }
    if (window.gtag) {
      window.gtag('event', 'generate_lead', {
        currency: 'USD',
        value: 1.0,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3">You're on the list.</h1>
        <p className="text-slate-600 text-lg leading-relaxed mb-8">
          We'll reach out within 1 business day.
        </p>

        <Link
          to="/"
          className="inline-block text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
        >
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
}
