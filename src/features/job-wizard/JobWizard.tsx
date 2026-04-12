import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { debounce } from '../../lib/utils';

import { MvpJobSchema, MvpJob, defaultMvpJobValues, defaultJobValues } from '../../schemas/job';
import { saveJob } from '../../mvp/storage';

import { WizardLayout } from '../../components/wizard/WizardLayout';
import { StepIndicator } from '../../components/wizard/StepIndicator';
import { WizardNav } from '../../components/wizard/WizardNav';

import { JobTypeStep } from './steps/mvp/JobTypeStep';
import { AreasChipStep } from './steps/mvp/AreasChipStep';
import { DescriptionStep } from './steps/mvp/DescriptionStep';
import { PhotosStep } from './steps/mvp/PhotosStep';
import { PreviewStep } from './steps/mvp/PreviewStep';

// ─── Draft helpers (separate key so the MVP draft doesn't clobber the full wizard) ──
const MVP_DRAFT_KEY = 'rr-mvp-draft';

const saveMvpDraft = (data: Partial<MvpJob>): void => {
  try {
    localStorage.setItem(MVP_DRAFT_KEY, JSON.stringify(data));
  } catch {}
};

const loadMvpDraft = (): Partial<MvpJob> | null => {
  try {
    const raw = localStorage.getItem(MVP_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const clearMvpDraft = (): void => {
  try {
    localStorage.removeItem(MVP_DRAFT_KEY);
  } catch {}
};

const hasMvpDraft = (): boolean => localStorage.getItem(MVP_DRAFT_KEY) !== null;

// ─── Wizard config ────────────────────────────────────────────────────────────

const MVP_STEPS = [
  { id: 1, name: 'Job Type' },
  { id: 2, name: 'Affected Areas' },
  { id: 3, name: 'Description' },
  { id: 4, name: 'Photos' },
  { id: 5, name: 'Preview' },
];

const TOTAL_STEPS = MVP_STEPS.length;

/** Fields that must pass validation before advancing from a given step.
 *  Only step 1 (lossType) is truly required in the MVP flow. */
const fieldsForStep = (step: number): string[] => {
  if (step === 1) return ['lossType'];
  return [];
};

/** Merges MVP form data into a full job-compatible shape for storage.
 *  Required fields not collected by the MVP wizard are auto-generated. */
const buildJobPayload = (mvp: MvpJob) => {
  const dateStr = new Date().toISOString().split('T')[0];
  const autoId = `DEMO-${Date.now().toString(36).toUpperCase()}`;
  return {
    ...defaultJobValues,
    lossType: mvp.lossType,
    jobName: `${mvp.lossType} Damage — ${dateStr}`,
    claimNumber: autoId,
    dateOfLoss: dateStr,
    inspectorName: 'Inspector',
    companyName: 'Restoration Report',
    contact: { phone: '', email: '', address: '' },
    property: { address: '', insured: '' },
    areas: mvp.areas ?? [],
    notes: {
      general: mvp.notes?.general ?? '',
      scope: '',
      kitchen: '',
      basement: '',
    },
    photos: mvp.photos ?? [],
  };
};

// ─── Component ────────────────────────────────────────────────────────────────

const stepComponents: Record<number, React.ComponentType<any>> = {
  1: JobTypeStep,
  2: AreasChipStep,
  3: DescriptionStep,
  4: PhotosStep,
  5: PreviewStep,
};

export const JobWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initializeForm = (): Partial<MvpJob> => {
    const draft = loadMvpDraft();
    if (draft?.lossType) {
      return { ...defaultMvpJobValues, ...draft };
    }
    return { ...defaultMvpJobValues };
  };

  const form = useForm<any>({
    resolver: zodResolver(MvpJobSchema),
    defaultValues: initializeForm(),
    mode: 'onBlur',
  });

  const { watch, trigger, getValues, formState } = form;

  // Unload guard when form has unsaved data
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (formState.isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [formState.isDirty]);

  // Auto-save draft (debounced, 1.5 s)
  const debouncedSave = useMemo(
    () => debounce((data: any) => saveMvpDraft(data), 1500),
    []
  );
  useEffect(() => {
    const sub = watch((data) => debouncedSave(data));
    return () => sub.unsubscribe();
  }, [watch, debouncedSave]);

  // Validate fields relevant to the current step
  const validateCurrentStep = useCallback(async () => {
    const fields = fieldsForStep(currentStep);
    if (fields.length > 0) {
      const ok = await trigger(fields as any);
      setCanGoNext(ok);
    } else {
      setCanGoNext(true);
    }
  }, [currentStep, trigger]);

  useEffect(() => {
    validateCurrentStep();
  }, [currentStep, validateCurrentStep]);

  const handleNext = async () => {
    const fields = fieldsForStep(currentStep);
    if (fields.length > 0) {
      const ok = await trigger(fields as any, { shouldFocus: true });
      if (!ok) return;
    }
    saveMvpDraft(getValues());
    setCurrentStep((p) => Math.min(p + 1, TOTAL_STEPS));
  };

  const handleBack = () => setCurrentStep((p) => Math.max(p - 1, 1));

  const handleJobSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const payload = buildJobPayload(getValues());
      const jobId = await saveJob(payload);
      clearMvpDraft();
      navigate(`/app/job/${jobId}`);
    } catch (err) {
      setErrorMessage('Failed to save the report. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = stepComponents[currentStep];
  const isLastStep = currentStep === TOTAL_STEPS;
  const showDraftBanner = currentStep === 1 && hasMvpDraft();

  return (
    <FormProvider {...form}>
      <WizardLayout title="New Report" subtitle="Takes about 60 seconds">
        {/* Error banner */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-700 flex-1">{errorMessage}</p>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-red-600 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Draft restored banner */}
        {showDraftBanner && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-2.5">
            <svg
              className="w-4 h-4 text-blue-400 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs text-blue-700">
              Draft restored — your progress was saved automatically.
            </p>
          </div>
        )}

        <StepIndicator currentStep={currentStep} steps={MVP_STEPS} />

        <div className="min-h-80">
          <CurrentStepComponent
            onSubmit={isLastStep ? handleJobSubmit : undefined}
            isSubmitting={isLastStep ? isSubmitting : undefined}
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
          onValidate={undefined}
          submitLabel="Preview Report"
        />
      </WizardLayout>
    </FormProvider>
  );
};

