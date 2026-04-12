import React from 'react';
import { useFormContext } from 'react-hook-form';
import { MvpJob } from '../../../../schemas/job';

const JOB_TYPES = [
  {
    value: 'Water',
    emoji: '💧',
    label: 'Water',
    description: 'Flooding, leaks, or burst pipes',
    bg: 'bg-blue-50',
    activeBorder: 'border-blue-500',
    activeBg: 'bg-blue-50',
    checkBg: 'bg-blue-500',
  },
  {
    value: 'Fire',
    emoji: '🔥',
    label: 'Fire',
    description: 'Fire damage or smoke',
    bg: 'bg-orange-50',
    activeBorder: 'border-orange-500',
    activeBg: 'bg-orange-50',
    checkBg: 'bg-orange-500',
  },
  {
    value: 'Mold',
    emoji: '🍃',
    label: 'Mold',
    description: 'Mold growth or remediation',
    bg: 'bg-green-50',
    activeBorder: 'border-green-500',
    activeBg: 'bg-green-50',
    checkBg: 'bg-green-500',
  },
] as const;

export const JobTypeStep = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<MvpJob>();

  const selected = watch('lossType');

  return (
    <div className="space-y-5">
      <div className="text-center pb-1">
        <h2 className="text-2xl font-bold text-gray-900">What kind of damage?</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Tap the damage type to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {JOB_TYPES.map((type) => {
          const isSelected = selected === type.value;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() =>
                setValue('lossType', type.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              className={[
                'relative flex flex-col items-center justify-center p-6 rounded-2xl border-2',
                'transition-all duration-150 text-center cursor-pointer min-h-[148px] w-full',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
                isSelected
                  ? `${type.activeBorder} ${type.activeBg} shadow-md`
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100',
              ].join(' ')}
            >
              {isSelected && (
                <div
                  className={`absolute top-3 right-3 w-5 h-5 ${type.checkBg} rounded-full flex items-center justify-center`}
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              <span className="text-5xl mb-3" role="img" aria-label={type.label}>
                {type.emoji}
              </span>
              <span className="text-lg font-semibold text-gray-900">{type.label}</span>
              <span className="text-sm text-gray-500 mt-1 leading-snug">
                {type.description}
              </span>
            </button>
          );
        })}
      </div>

      {errors.lossType?.message && (
        <p className="text-center text-sm text-red-600 mt-1">
          {String(errors.lossType.message)}
        </p>
      )}
    </div>
  );
};
