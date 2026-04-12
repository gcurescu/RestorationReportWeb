import React from 'react';
import { useFormContext } from 'react-hook-form';
import { MvpJob } from '../../../../schemas/job';

const MAX_LENGTH = 1000;

export const DescriptionStep = () => {
  const { register, watch } = useFormContext<MvpJob>();
  const value = (watch('notes') as MvpJob['notes'])?.general ?? '';

  return (
    <div className="space-y-5">
      <div className="text-center pb-1">
        <h2 className="text-2xl font-bold text-gray-900">Describe the damage</h2>
        <p className="text-gray-500 mt-1 text-sm">
          A quick summary is fine — you can add detail in the full report.
        </p>
      </div>

      <div>
        <textarea
          {...register('notes.general')}
          rows={7}
          maxLength={MAX_LENGTH}
          placeholder={
            'e.g. Dishwasher leak in kitchen — water soaked into floor and lower cabinet. ' +
            'Category 1. First noticed on 4/10. Drying equipment placed same day.'
          }
          className={[
            'w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm',
            'focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none',
            'resize-none text-sm text-gray-900 placeholder:text-gray-400 leading-relaxed',
            'transition-shadow',
          ].join(' ')}
        />
        <p className="mt-1.5 text-xs text-right text-gray-400 tabular-nums">
          {String(value).length} / {MAX_LENGTH}
        </p>
      </div>

      <p className="text-center text-xs text-gray-400">
        Optional — tap Continue to skip.
      </p>
    </div>
  );
};
