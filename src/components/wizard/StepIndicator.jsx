import React from 'react';

const LEGACY_STEPS = [
  { id: 1, name: 'Case Info' },
  { id: 2, name: 'Property & Policy' },
  { id: 3, name: 'Affected Areas' },
  { id: 4, name: 'Equipment & Readings' },
  { id: 5, name: 'Photos & Notes' },
  { id: 6, name: 'Costs & Signoff' },
  { id: 7, name: 'Review & Submit' },
];

/**
 * @param {{ currentStep: number, steps?: Array<{id: number, name: string}> }} props
 * `steps` defaults to the legacy 7-step list for backward compatibility.
 */
export const StepIndicator = ({ currentStep, steps = LEGACY_STEPS }) => {
  const total = steps.length;
  const currentStepData = steps.find((s) => s.id === currentStep);
  // 0 % on step 1, 100 % on the last step
  const progressPct = total > 1 ? ((currentStep - 1) / (total - 1)) * 100 : 100;

  return (
    <nav aria-label="Progress" className="mb-6">
      {/* ── Mobile: slim progress bar + step name ── */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-800">
            {currentStepData?.name}
          </span>
          <span className="text-xs text-gray-400 tabular-nums">
            {currentStep} / {total}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ── Desktop: dot + connector row ── */}
      <ol className="hidden sm:flex items-center w-full">
        {steps.map((step, idx) => (
          <li key={step.id} className={idx !== steps.length - 1 ? 'flex-1' : ''}>
            <div className="flex items-center">
              <div className="flex items-center flex-shrink-0">
                {step.id < currentStep ? (
                  <div className="flex items-center justify-center w-7 h-7 bg-blue-600 rounded-full">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : step.id === currentStep ? (
                  <div className="flex items-center justify-center w-7 h-7 bg-blue-600 rounded-full ring-4 ring-blue-100">
                    <span className="text-xs font-bold text-white">{step.id}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-7 h-7 border-2 border-gray-200 rounded-full bg-white">
                    <span className="text-xs font-medium text-gray-400">{step.id}</span>
                  </div>
                )}
                <span className="ml-2 text-xs font-medium text-gray-600 hidden lg:block">
                  {step.name}
                </span>
              </div>
              {idx !== steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 ${
                    step.id < currentStep ? 'bg-blue-300' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
