/**
 * Analytics utility for tracking events
 * Safely no-ops if gtag is not available
 */

export function track(event, payload = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, payload);
  } else {
    // Optional: log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics:', event, payload);
    }
  }
}

// Predefined event helpers
export const analytics = {
  ctaClick: (location = 'unknown') => track('cta_click', { location, page: 'landing' }),
  waitlistSubmit: (emailDomain) => track('waitlist_submit', { email_domain: emailDomain, page: 'landing' }),
  zipSubmit: (zip, role) => track('zip_submit', { zip_code: zip, role, page: 'landing' })
};
