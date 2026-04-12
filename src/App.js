import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import LandingPage from './pages/LandingPage.jsx';
import ThankYouPage from './pages/ThankYouPage.jsx';
import AdLandingPage from './pages/AdLandingPage.jsx';
import { JobWizard } from './features/job-wizard/JobWizard';
import JobsList from './mvp/JobsList.jsx';
import ReportPreview from './mvp/ReportPreviewEnhanced.jsx';
import SampleReportPage from './pages/SampleReportPage.jsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/lp" element={<AdLandingPage />} />
          <Route path="/app/new" element={<JobWizard />} />
          <Route path="/app/jobs" element={<JobsList />} />
          <Route path="/app/job/:id" element={<ReportPreview />} />
          <Route path="/sample" element={<SampleReportPage />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </div>
  );
}

export default App;