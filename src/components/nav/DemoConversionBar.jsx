import { useState } from 'react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgpqwzo';
const SESSION_KEY = 'demo_bar_converted';

export function DemoConversionBar() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [converted, setConverted] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1'
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'demo-bar' }),
      });
      if (!res.ok) throw new Error('Submission failed');
      sessionStorage.setItem(SESSION_KEY, '1');
      setConverted(true);
    } catch (err) {
      console.error('DemoConversionBar submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4"
    >
      {/* Label — full row on mobile, inline on desktop */}
      <p className="text-slate-300 text-xs sm:text-sm shrink-0 leading-snug">
        <span className="hidden sm:inline">👋 </span>
        You're previewing{' '}
        <span className="font-semibold text-white">Restoration Report</span>
      </p>

      {/* Right — form or success state */}
      {converted ? (
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span>You're in! We'll reach out soon.</span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 w-full sm:w-auto"
          noValidate
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your work email"
            required
            disabled={isSubmitting}
            className="flex-1 min-w-0 sm:flex-none sm:w-52 px-3 py-2 sm:py-1.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50 transition"
          />
          <button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="shrink-0 px-3 py-2 sm:py-1.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-900 text-xs font-bold rounded-lg transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending…' : (
              <>
                <span className="hidden sm:inline">Get Early Access</span>
                <span className="sm:hidden">Get Access →</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
