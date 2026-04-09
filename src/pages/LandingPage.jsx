import { useState, useEffect } from 'react';
import { SlimNav } from '../components/nav/SlimNav';
import { Hero } from '../components/hero/Hero';
import { SocialProof } from '../components/proof/SocialProof';
import SampleReport from '../components/shared/SampleReport.jsx';
import { DemoRequestForm } from '../components/forms/DemoRequestForm';

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
        <h3 className="font-semibold text-slate-900 text-base">{title}</h3>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm" aria-hidden>{number}</div>
        <h3 className="font-semibold text-slate-900 text-base">{title}</h3>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Faq({ q, a }) {
  const [open, setOpen] = useState(false);
  const id = q.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-medium text-slate-900 pr-4 text-sm md:text-base">{q}</span>
        <span className="text-slate-500 text-lg font-light" aria-hidden>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div id={id} className="mt-3 text-sm text-slate-600 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

function LogoMark() {
  return (
    <img
      src="/RR_Icon.png"
      alt="Restoration Report Logo"
      className="h-8 w-8 object-contain"
    />
  );
}

function StatBadge({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-blue-600">{value}</div>
      <div className="text-sm text-slate-600 mt-1">{label}</div>
    </div>
  );
}

export default function LandingPage() {
  const [utmParams, setUtmParams] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((param) => {
      const value = urlParams.get(param);
      if (value) params[param] = value;
    });
    setUtmParams(params);
  }, []);

  const faqData = [
    {
      q: 'What size companies is this built for?',
      a: 'Restoration Report works best for mitigation and restoration companies handling 5–200 jobs per month — from owner-operators running their own crews to regional firms with multiple project managers. If your team is documenting water, fire, or mold jobs for insurance claims, this is built for you.',
    },
    {
      q: 'How will it integrate with our existing workflow?',
      a: 'No complex integrations planned. Your crews will capture data on-site using any phone or tablet, and the app will generate clean PDFs that work with any adjuster portal — Xactimate, CoreLogic, or a simple email attachment. We\'re building this to be up and running in minutes, not weeks.',
    },
    {
      q: 'What does the demo look like?',
      a: 'We\'ll walk you through a 20-minute screen share showing real job workflows: capturing moisture readings, attaching photos, and generating a complete, adjuster-ready PDF. You can also explore the live demo right now at no cost.',
    },
    {
      q: 'Is our job data kept private and secure?',
      a: 'Yes. Your job data is private and never shared with insurance companies, competitors, or third parties. We follow industry-standard security practices and give you full control over your data.',
    },
    {
      q: 'What does it cost?',
      a: 'Free while we\'re in beta. Founding members who join early access will lock in their rate when we launch publicly — so there\'s no downside to getting in now.'
    },
    {
      q: 'Can we see it before we commit?',
      a: 'Yes — we\'ll walk you through the current state of the app and a sample job in the demo. No sign-up needed. The early access request is for contractors who want a guided walkthrough and want to give input on what we build next.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800" data-utm={JSON.stringify(utmParams)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Navigation */}
      <SlimNav />

      {/* Hero */}
      <Hero />

      {/* Integrations Bar */}
      <section className="py-6 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-medium text-slate-400 uppercase tracking-widest mb-4">
            Being built to work with the tools you already rely on
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['Xactimate', 'Symbility', 'QuickBooks', 'Any adjuster portal'].map((name) => (
              <span
                key={name}
                className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium border border-slate-200"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof — Testimonials */}
      <SocialProof />

      {/* Stats Bar */}
      <section className="py-10 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-medium text-slate-400 uppercase tracking-widest mb-6">What we&apos;re designing to deliver</p>
          <div className="grid grid-cols-3 gap-6 sm:gap-12">
            <StatBadge value="80%" label="Less time on reports" />
            <StatBadge value="1st pass" label="Adjuster approval target" />
            <StatBadge value="< 5 min" label="To generate a PDF" />
          </div>
        </div>
      </section>

      {/* Demo Request — Primary Conversion Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-700 to-blue-900" aria-labelledby="demo-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left — pitch copy */}
            <div className="text-white">
              <h2 id="demo-heading" className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                See what we're building — and get early access.
              </h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Join as an early access member and we'll walk you through the app as it stands today — then gather your input to make sure it fits your exact workflow before we launch.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'See a real job documented and exported in under 5 minutes',
                  'Review moisture readings, photos, and scope notes auto-organized',
                  'Get a sample adjuster-ready PDF to share with your team',
                  'Give feedback on your specific workflow — we build based on what you tell us',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-blue-50 text-sm">
                    <svg className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="border-t border-blue-600 pt-6">
                <p className="text-blue-200 text-sm italic">
                  "First-pass approval rate went up immediately. The PDF format is exactly what adjusters want to see."
                </p>
                <p className="text-blue-300 text-xs mt-2">— Maria Delgado, Project Manager, SunState Mitigation</p>
              </div>
            </div>

            {/* Right — form card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Get Early Access</h3>
              <p className="text-slate-500 text-sm mb-6">We'll reach out within 1 business day to set up a walkthrough.</p>
              <DemoRequestForm id="demo" />
            </div>
          </div>
        </div>
      </section>

      {/* Sample Report */}
      <section id="sample" className="py-16 bg-white" aria-labelledby="sample-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="sample-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            See what your reports will look like
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Clean, professional PDFs that adjusters can approve without a single follow-up call.
          </p>
          <div className="flex justify-center">
            <SampleReport />
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const el = document.querySelector('[data-sample-report]');
                if (el) {
                  const btn = el.querySelector('button');
                  if (btn) btn.click();
                }
              }}
              className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 text-sm transition-colors"
            >
              View Full Sample Report →
            </button>
            <a
              href="/app/jobs?demo=1"
              className="inline-flex items-center justify-center bg-slate-100 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-200 font-medium shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-600 text-sm transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Explore Live Demo
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-slate-50" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="features-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Everything your team needs on every job
            </h2>
            <p className="text-lg text-slate-600">Stop juggling multiple apps, spreadsheets, and photo folders</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Moisture &amp; Equipment Logs"
              description="Capture readings as you go — auto roll-up into tables your adjusters recognize. No more manual entry after the fact."
            />
            <FeatureCard
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title="Before/After Photo Documentation"
              description="Attach photos and scope notes side by side. Adjusters get the visual context they need without a single phone call."
            />
            <FeatureCard
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title="One-Tap PDF Export"
              description="Generate polished, claim-ready PDFs in seconds. Upload to any portal, email directly, or print on-site."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-16 bg-white" aria-labelledby="how-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="how-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              A workflow your crews will actually use
            </h2>
            <p className="text-lg text-slate-600">Simple enough for technicians, powerful enough for project managers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <StepCard
              number="1"
              title="Capture on-site"
              description="Take photos, record moisture readings, and log equipment as you work the job — all from any phone or tablet."
            />
            <StepCard
              number="2"
              title="Auto-organize"
              description="Everything gets sorted into the right sections automatically — photos, logs, scope, and affected areas."
            />
            <StepCard
              number="3"
              title="Export and submit"
              description="One tap generates a clean, complete PDF. Upload to your portal, email the adjuster, or share a link."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 bg-slate-50" aria-labelledby="faq-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-slate-600">Everything you need to know before booking a demo</p>
          </div>
          <div className="space-y-4">
            {faqData.map((f, i) => (
              <Faq key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-white" aria-labelledby="final-cta-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="final-cta-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Done doing reports at midnight?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Join the contractors helping us build this right. Free during beta — founding member pricing locked in when we launch publicly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('demo');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
            >
              Get Early Access →
            </button>
            <a
              href="/app/jobs?demo=1"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-600"
            >
              Explore Live Demo
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-500">No commitment &nbsp;·&nbsp; Free during beta &nbsp;·&nbsp; We respond within 1 business day</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12" aria-labelledby="footer-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="footer-heading" className="sr-only">Footer</h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-3">
              <LogoMark />
              <span className="font-bold text-sm sm:text-base">Restoration Report</span>
            </div>
            <nav className="flex gap-6 text-sm">
              <a href="#demo" className="text-slate-400 hover:text-white transition-colors">Request Early Access</a>
              <a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a>
              <a href="#faq" className="text-slate-400 hover:text-white transition-colors">FAQ</a>
              <a href="/privacy.html" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
            </nav>
          </div>
          <p className="mt-6 text-sm text-slate-400 max-w-2xl">
            Purpose-built for water, fire, and mold mitigation teams. Not affiliated with Encircle or Xactimate.
          </p>
        </div>
      </footer>
    </div>
  );
}
