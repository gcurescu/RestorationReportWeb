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
      <div className="max-w-lg w-full text-center">
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

        <h1 className="text-3xl font-bold text-slate-900 mb-3">Check Your Inbox.</h1>
        <p className="text-slate-600 text-lg leading-relaxed mb-6">
          Your free Insurance-Ready Report Template is on its way. While you wait —
        </p>

        <a
          href="/restoration-report-template.docx"
          download
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-7 py-4 rounded-xl shadow-md transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Template Now
        </a>

        <div className="block">
          <Link
            to="/"
            className="inline-block text-slate-500 hover:text-slate-700 text-sm transition-colors"
          >
            ← Back to Restoration Report
          </Link>
        </div>
      </div>
    </div>
  );
}
