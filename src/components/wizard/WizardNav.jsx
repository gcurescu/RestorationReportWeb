import React from 'react';

export const WizardNav = ({ 
  currentStep, 
  totalSteps, 
  canGoNext, 
  isSubmitting, 
  onNext, 
  onBack, 
  onSubmit,
  onValidate
}) => {
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep}
        className={`px-4 py-2 text-sm font-medium rounded-md ${
          isFirstStep
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500'
        }`}
      >
        Back
      </button>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </span>
        {onValidate && (
          <button
            type="button"
            onClick={onValidate}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Check Form
          </button>
        )}
      </div>

      {isLastStep ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canGoNext || isSubmitting}
          className={`px-6 py-2 text-sm font-medium rounded-md ${
            canGoNext && !isSubmitting
              ? 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </div>
          ) : (
            'Submit Job'
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            canGoNext
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      )}
    </div>
  );
};
