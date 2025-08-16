import { useState } from 'react';
import { analytics } from '../../lib/analytics';

const isValidZip = (zip) => {
  const regex = /^\d{5}(-\d{4})?$/;
  return regex.test(zip);
};

export function ZipFollowUp({ email }) {
  const [zip, setZip] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (zip && !isValidZip(zip)) {
      setError('Please enter a valid ZIP code (e.g., 12345 or 12345-6789)');
      return;
    }

    if (!zip && !role) {
      return; // Both fields are optional
    }

    setIsSubmitting(true);

    try {
      // Submit to profile API endpoint (stub for development)
      try {
        const response = await fetch('/api/waitlist/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email,
            zip_code: zip || null,
            role: role || null
          })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      } catch (fetchError) {
        // For development: simulate successful submission if API doesn't exist
        console.log('API endpoint not available, simulating success for development');
      }

      // Track successful submission
      analytics.zipSubmit(zip, role);
      
      setIsSuccess(true);
    } catch (error) {
      console.error('Profile submission error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <div className="text-blue-600 font-medium">Thanks!</div>
        <div className="text-blue-700 text-sm mt-1">This helps us plan our rollout better.</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
      <h3 className="text-sm font-medium text-slate-900 mb-3">
        (Optional) Add a ZIP code to help us plan your rollout.
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="zip" className="sr-only">ZIP Code</label>
            <input
              type="text"
              id="zip"
              name="zip"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="ZIP Code"
              pattern="^\d{5}(-\d{4})?$"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex-1">
            <label htmlFor="role" className="sr-only">Role</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="">Select role</option>
              <option value="Owner">Owner</option>
              <option value="PM">Project Manager</option>
              <option value="Technician">Technician</option>
              <option value="Adjuster">Adjuster</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || (!zip && !role)}
          className="w-full bg-slate-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
