import { useNavigate } from 'react-router-dom';
import { SlimNav } from '../components/nav/SlimNav';
import { SampleReportContent } from '../components/shared/SampleReport';
import { DemoRequestForm } from '../components/forms/DemoRequestForm';

export default function SampleReportPage() {
  const navigate = useNavigate();

  const scrollToForm = (e) => {
    e.preventDefault();
    const el = document.getElementById('sample-report-cta');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const input = el.querySelector('input[type="email"]');
        if (input) {
          try { input.focus({ preventScroll: true }); } catch { input.focus(); }
        }
      }, 400);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <SlimNav
        onLogoClick={() => navigate('/')}
        action={
          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 transition-colors shadow-sm"
          >
            Get Early Access
          </button>
        }
      />

      <SampleReportContent />

      {/* Conversion section */}
      <div id="sample-report-cta" className="px-4 py-14 bg-gray-100">
        <div className="max-w-lg mx-auto bg-blue-600 rounded-2xl p-8 shadow-xl text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Want reports like this for every job?
          </h2>
          <p className="text-blue-100 mb-7 text-base">
            Get early access — free during beta
          </p>
          <div className="bg-white rounded-xl p-6">
            <DemoRequestForm id="sample-report-form" source="sample-report-page" />
          </div>
        </div>
      </div>
    </div>
  );
}
