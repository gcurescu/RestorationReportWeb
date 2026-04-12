import React from 'react';
import { useFormContext } from 'react-hook-form';
import { MvpJob } from '../../../../schemas/job';

const EMOJI: Record<string, string> = {
  Water: '💧',
  Fire: '🔥',
  Mold: '🍃',
};

interface PreviewStepProps {
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export const PreviewStep = ({ onSubmit, isSubmitting }: PreviewStepProps) => {
  const { getValues } = useFormContext<MvpJob>();
  const data = getValues();

  const selectedAreas = (data.areas ?? [])
    .map((a) => a.name)
    .filter(Boolean) as string[];
  const description = data.notes?.general?.trim();
  const photoCount = (data.photos ?? []).length;
  const emoji = EMOJI[data.lossType] ?? '📋';

  return (
    <div className="space-y-6">
      <div className="text-center pb-1">
        <h2 className="text-2xl font-bold text-gray-900">Ready to preview</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Here's a summary of what you've entered.
        </p>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50 divide-y divide-gray-100 overflow-hidden">
        {/* Job type */}
        <div className="flex items-center gap-3 px-5 py-4">
          <span className="text-3xl leading-none" aria-hidden>
            {emoji}
          </span>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Damage Type
            </p>
            <p className="text-base font-bold text-gray-900 mt-0.5">
              {data.lossType || '—'} Damage
            </p>
          </div>
        </div>

        {/* Affected areas */}
        <div className="px-5 py-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Affected Areas
          </p>
          {selectedAreas.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {selectedAreas.map((name) => (
                <span
                  key={name}
                  className="inline-block px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium"
                >
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">None selected</p>
          )}
        </div>

        {/* Description */}
        <div className="px-5 py-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Description
          </p>
          {description ? (
            <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
              {description}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">No description added</p>
          )}
        </div>

        {/* Photos */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Photos
            </p>
            <p className="text-base font-bold text-gray-900 mt-0.5">
              {photoCount > 0
                ? `${photoCount} photo${photoCount !== 1 ? 's' : ''}`
                : 'None added'}
            </p>
          </div>
          {photoCount > 0 && (
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Primary CTA — big, confident button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className={[
          'w-full py-4 rounded-2xl text-base font-bold transition-all',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          isSubmitting
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-200',
        ].join(' ')}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Saving report…
          </span>
        ) : (
          '👁  Preview Report'
        )}
      </button>

      <p className="text-center text-xs text-gray-400 leading-relaxed">
        Saved locally on this device. You can fill in the full details — policy info, equipment,
        costs, and sign-off — after previewing.
      </p>
    </div>
  );
};
