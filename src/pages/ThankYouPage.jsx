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

        <h1 className="text-3xl font-bold text-slate-900 mb-3">Your Free Bundle is Ready.</h1>
        <p className="text-slate-600 text-lg leading-relaxed mb-8">
          Two resources to help you stop losing money on denied claims.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', margin: '0 0 32px 0' }}>
          <a
            href="/5-documentation-mistakes-guide.pdf"
            download
            style={{
              display: 'inline-block',
              background: '#E8943A',
              color: 'white',
              padding: '14px 28px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '15px',
              textDecoration: 'none',
              width: '320px',
              textAlign: 'center',
            }}
          >
            ⬇ Download: 5 Mistakes Guide (PDF)
          </a>
          <a
            href="/restoration-report-template.docx"
            download
            style={{
              display: 'inline-block',
              background: '#1B3A5C',
              color: 'white',
              padding: '14px 28px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '15px',
              textDecoration: 'none',
              width: '320px',
              textAlign: 'center',
            }}
          >
            ⬇ Download: Report Template (Word)
          </a>
        </div>

        <Link
          to="/"
          className="inline-block text-slate-500 hover:text-slate-700 text-sm transition-colors"
        >
          ← Back to Restoration Report
        </Link>
      </div>
    </div>
  );
}
