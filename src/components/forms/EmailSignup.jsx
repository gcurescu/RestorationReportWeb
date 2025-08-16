import { useState } from 'react';
import { analytics } from '../../lib/analytics';
import { ZipFollowUp } from './ZipFollowUp';

// Simple email validation
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const getEmailDomain = (email) => {
  const parts = email.split('@');
  return parts.length > 1 ? parts[1] : 'unknown';
};

export function EmailSignup({ id = "signup" }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to API endpoint (stub for development)
      try {
        const response = await fetch('/api/waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.trim() })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      } catch (fetchError) {
        // For development: simulate successful submission if API doesn't exist
        console.log('API endpoint not available, simulating success for development');
      }

      // Track successful submission
      analytics.waitlistSubmit(getEmailDomain(email));
      
      setIsSuccess(true);
    } catch (error) {
      console.error('Waitlist submission error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div id={id} className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-green-600 font-medium">Thanks for joining the waitlist!</div>
          <div className="text-green-700 text-sm mt-1">We'll keep you updated on our progress.</div>
        </div>
        <ZipFollowUp email={email} />
      </div>
    );
  }

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-describedby={error ? 'email-error' : undefined}
          disabled={isSubmitting}
        />
        {error && (
          <div id="email-error" className="text-red-600 text-sm mt-2">
            {error}
          </div>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Joining...' : 'Join waitlist'}
      </button>

      <p className="text-xs text-slate-500 text-center">
        No spam. Unsubscribe anytime. No credit card for beta.
      </p>
    </form>
  );
}
