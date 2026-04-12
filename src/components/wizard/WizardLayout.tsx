import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SlimNav } from '../nav/SlimNav';

interface WizardLayoutProps {
  children: React.ReactNode;
  title: string;
  /** Optional subtitle shown beneath the title, e.g. "Takes about 60 seconds" */
  subtitle?: string;
}

export const WizardLayout = ({ children, title, subtitle }: WizardLayoutProps) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Branded top bar — sticky, full-width */}
      <SlimNav
        onLogoClick={() => navigate('/')}
        action={null}
      />

      <div className="max-w-2xl mx-auto sm:py-8 sm:px-4">
        {/* Mobile: full-screen card. sm+: rounded floating card */}
        <div className="bg-white sm:shadow-xl sm:rounded-2xl overflow-hidden min-h-screen sm:min-h-0">
          <div className="px-5 py-4 border-b border-gray-100">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {/* pb-28 keeps content clear of the sticky WizardNav footer */}
          <div className="px-5 pt-5 pb-28">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
