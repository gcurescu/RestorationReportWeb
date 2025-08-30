import React from 'react';

const steps = [
  { id: 1, name: 'Case Info', href: '#' },
  { id: 2, name: 'Property & Policy', href: '#' },
  { id: 3, name: 'Affected Areas', href: '#' },
  { id: 4, name: 'Equipment & Readings', href: '#' },
  { id: 5, name: 'Photos & Notes', href: '#' },
  { id: 6, name: 'Costs & Signoff', href: '#' },
  { id: 7, name: 'Review & Submit', href: '#' },
];

export const StepIndicator = ({ currentStep }) => {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={stepIdx !== steps.length - 1 ? 'flex-1' : ''}>
            <div className="flex items-center">
              <div className="flex items-center">
                {step.id < currentStep ? (
                  <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-full">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : step.id === currentStep ? (
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                    <span className="text-sm font-medium text-white">{step.id}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-8 h-8 border-2 border-gray-300 rounded-full">
                    <span className="text-sm font-medium text-gray-500">{step.id}</span>
                  </div>
                )}
                <span className="ml-2 text-sm font-medium text-gray-900 hidden sm:block">
                  {step.name}
                </span>
              </div>
              {stepIdx !== steps.length - 1 && (
                <div className="flex-1 w-full h-px bg-gray-300 ml-4 hidden sm:block" />
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
