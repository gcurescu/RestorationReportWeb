import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DEMO_PATH = '/app/jobs?demo=1';
const COUNTDOWN_START = 10;

export default function ThankYouPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(COUNTDOWN_START);
  const [cancelled, setCancelled] = useState(false);
  const intervalRef = useRef(null);

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

  useEffect(() => {
    if (cancelled) return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          navigate(DEMO_PATH);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [cancelled, navigate]);

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

        {/* Primary Demo CTA */}
        <div style={{ marginBottom: '28px' }}>
          <Link
            to={DEMO_PATH}
            style={{
              display: 'inline-block',
              background: '#1D6FD8',
              color: 'white',
              padding: '16px 36px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '17px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(29,111,216,0.35)',
              letterSpacing: '0.01em',
            }}
          >
            Explore the Live Demo →
          </Link>

          {!cancelled ? (
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
              Taking you to the demo in{' '}
              <span style={{ fontWeight: '600', color: '#1D6FD8' }}>{countdown}</span> second{countdown !== 1 ? 's' : ''}…{' '}
              <button
                onClick={() => {
                  setCancelled(true);
                  clearInterval(intervalRef.current);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#94a3b8',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Stay on this page
              </button>
            </p>
          ) : (
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#94a3b8' }}>
              Countdown cancelled.
            </p>
          )}
        </div>

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
