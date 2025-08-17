import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import NewJobForm from './mvp/NewJobForm.jsx';
import JobsList from './mvp/JobsList.jsx';
import ReportPreview from './mvp/ReportPreview.jsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app/new" element={<NewJobForm />} />
          <Route path="/app/jobs" element={<JobsList />} />
          <Route path="/app/job/:id" element={<ReportPreview />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;