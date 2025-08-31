import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { debounce } from '../../lib/utils';

import { JobSchema, defaultJobValues } from '../../schemas/job';
import { saveDraft, loadDraft, clearDraft, hasDraft } from '../../lib/drafts';
import { saveJob } from '../../mvp/storage';

import { WizardLayout } from '../../components/wizard/WizardLayout';
import { StepIndicator } from '../../components/wizard/StepIndicator';
import { WizardNav } from '../../components/wizard/WizardNav';

import { CaseInfoStep } from './steps/CaseInfoStep';
import { PropertyPolicyStep } from './steps/PropertyPolicyStep';
import { AffectedAreasStep } from './steps/AffectedAreasStep';
import { EquipmentReadingsStep } from './steps/EquipmentReadingsStep';
import { PhotosNotesStep } from './steps/PhotosNotesStep';
import { CostsSignoffStep } from './steps/CostsSignoffStep';
import { ReviewSubmitStep } from './steps/ReviewSubmitStep';

const TOTAL_STEPS = 7;

const stepComponents: Record<number, React.ComponentType<any>> = {
  1: CaseInfoStep,
  2: PropertyPolicyStep,
  3: AffectedAreasStep,
  4: EquipmentReadingsStep,
  5: PhotosNotesStep,
  6: CostsSignoffStep,
  7: ReviewSubmitStep,
};

// Field mapping matching actual job.ts schema
const fieldsForStep = (step: number): string[] => {
  switch (step) {
    case 1: // Case Info
      return [
        'jobName',
        'claimNumber',
        'lossType',
        'dateOfLoss',
        'inspectorName',
        'companyName',
        'contact.phone',
        'contact.email',
        'contact.address',
      ];
    case 2: // Property & Policy
      return [
        'property.address',
        'property.insured',
        // Optional fields are okay to include; they won't block next if valid-or-empty:
        'property.insurer',
        'property.policyNumber',
        'property.deductible',
        'property.coverage',
        'property.adjuster',
      ];
    case 3: // Affected Areas
      return ['areas']; // (Your schema currently makes this optional; gating still works.)
    case 4: // Equipment & Readings
      return ['equipment', 'moisture']; // both are optional in schema; gating will pass if empty
    case 5: // Photos & Notes
      return ['photos', 'notes'];
    case 6: // Costs & Signoff
      return ['costs', 'signoff'];
    case 7: // Review (full form validation happens on submit)
    default:
      return [];
  }
};

export const JobWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);

  // Initialize form with draft data or defaults
  const initializeForm = () => {
    const draft = loadDraft();
    return { 
      ...defaultJobValues, 
      ...(draft || {}) 
    };
  };

  const form = useForm<any>({
    resolver: zodResolver(JobSchema),
    defaultValues: initializeForm(),
    mode: 'onBlur', // Changed from 'onChange' to reduce re-renders
  });

  const { watch, trigger, getValues, formState } = form;

  // Add unload guard when form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (formState.isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formState.isDirty]);

  // Create a stable debounced function
  const debouncedSaveDraft = useMemo(
    () => debounce((data: any) => {
      console.log('Auto-saving draft...', Object.keys(data));
      saveDraft(data);
    }, 2000), // Increased to 2 seconds
    []
  );

  // Watch for form changes and auto-save - but less frequently
  useEffect(() => {
    const subscription = watch((data, { name }) => {
      console.log('Field changed:', name);
      debouncedSaveDraft(data);
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSaveDraft]);

  // Validate current step - only when step changes or on manual trigger
  const validateCurrentStep = useCallback(async () => {
    console.log('Validating step:', currentStep);
    if (currentStep === 7) {
      // Review step - validate everything
      const isValid = await trigger();
      console.log('Review step validation result:', isValid);
      setCanGoNext(isValid);
    } else {
      // Get fields to validate for current step
      const fieldsToValidate = fieldsForStep(currentStep);
      console.log('Validating fields:', fieldsToValidate);
      if (fieldsToValidate.length > 0) {
        const isValid = await trigger(fieldsToValidate as any);
        console.log('Step validation result:', isValid);
        setCanGoNext(isValid);
      } else {
        console.log('No validation needed for this step');
        setCanGoNext(true);
      }
    }
  }, [currentStep, trigger]);

  // Only validate when step changes
  useEffect(() => {
    validateCurrentStep();
  }, [currentStep, validateCurrentStep]);

  const handleNext = async () => {
    const fieldsToValidate = fieldsForStep(currentStep);
    
    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate as any, { shouldFocus: true });
      if (!isValid) {
        // Re-validate to update canGoNext state
        validateCurrentStep();
        return;
      }
    }

    // Save draft and move to next step
    saveDraft(getValues());
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleJobSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Validate entire form
      console.log('Starting full form validation...');
      const isValid = await trigger();
      console.log('Form validation result:', isValid);
      
      if (!isValid) {
        console.log('Form validation failed. Errors:', form.formState.errors);
        setIsSubmitting(false);
        // The errors will now be displayed in the ReviewSubmitStep component
        alert('Please check the form for errors and fix them before submitting.');
        return;
      }

      const formData = getValues();
      console.log('Submitting form data:', formData);
      
      // Save the job
      const jobId = await saveJob(formData);
      console.log('Job saved with ID:', jobId);
      
      // Clear the draft
      clearDraft();
      
      // Navigate to job detail
      navigate(`/app/job/${jobId}`);
    } catch (error) {
      console.error('Failed to save job:', error);
      alert('Failed to save job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
  };

  const CurrentStepComponent = stepComponents[currentStep];

  // Show draft recovery prompt if draft exists and we're on step 1
  const showDraftPrompt = currentStep === 1 && hasDraft();

  return (
    <FormProvider {...form}>
      <WizardLayout title="New Restoration Job">
        {showDraftPrompt && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Draft Found
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>We found a saved draft of your job. Your progress has been automatically restored.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <StepIndicator currentStep={currentStep} />
        
        <div className="min-h-96">
          <CurrentStepComponent 
            onEditStep={currentStep === 7 ? handleEditStep : undefined}
            onValidate={currentStep === 7 ? validateCurrentStep : undefined}
            onSubmit={currentStep === 7 ? handleJobSubmit : undefined}
          />
        </div>

        <WizardNav
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          canGoNext={canGoNext}
          isSubmitting={isSubmitting}
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={handleJobSubmit}
          onValidate={validateCurrentStep}
        />
      </WizardLayout>
    </FormProvider>
  );
};
