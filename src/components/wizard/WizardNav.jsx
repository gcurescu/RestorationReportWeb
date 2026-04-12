import React from 'react';

export const WizardNav = ({
  currentStep,
  totalSteps,
  canGoNext,
  isSubmitting,
  onNext,
  onBack,
  onSubmit,
  // onValidate kept for API compatibility but not displayed in the simplified nav
  onValidate = undefined,
  /** Label for the final-step action button. Defaults to "Submit". */
  submitLabel = 'Submit',
}) => {
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div
      className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-gray-100 px-5 flex justify-between items-center"
      style={{ paddingTop: 12, paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep}
        className={`min-w-[72px] px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
          isFirstStep
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
        }`}
      >
        Back
      </button>

      <span className="text-xs text-gray-400 tabular-nums">
        {currentStep} / {totalSteps}
      </span>

      {isLastStep ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canGoNext || isSubmitting}
          className={`min-w-[130px] px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            canGoNext && !isSubmitting
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving…
            </span>
          ) : (
            submitLabel
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className={`min-w-[100px] px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            canGoNext
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          Continue →
        </button>
      )}
    </div>
  );
};
