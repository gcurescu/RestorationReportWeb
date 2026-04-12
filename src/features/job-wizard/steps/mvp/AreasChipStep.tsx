import React from 'react';
import { useFormContext } from 'react-hook-form';
import { MvpJob } from '../../../../schemas/job';

const ROOM_OPTIONS = [
  'Kitchen',
  'Bathroom',
  'Basement',
  'Bedroom',
  'Living Room',
  'Attic',
  'Hallway',
  'Garage',
  'Crawlspace',
  'Utility Room',
];

export const AreasChipStep = () => {
  const { watch, setValue } = useFormContext<MvpJob>();
  const areas = watch('areas') ?? [];
  const selectedNames = areas.map((a) => a.name).filter(Boolean) as string[];

  const toggle = (name: string) => {
    if (selectedNames.includes(name)) {
      setValue('areas', areas.filter((a) => a.name !== name), {
        shouldDirty: true,
      });
    } else {
      setValue(
        'areas',
        [
          ...areas,
          {
            name,
            category: '',
            class: '',
            materials: '',
            cause: '',
            overviewNotes: '',
          },
        ],
        { shouldDirty: true }
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center pb-1">
        <h2 className="text-2xl font-bold text-gray-900">Which areas are affected?</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Select all that apply — you can add more detail later.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {ROOM_OPTIONS.map((room) => {
          const active = selectedNames.includes(room);
          return (
            <button
              key={room}
              type="button"
              onClick={() => toggle(room)}
              className={[
                'px-5 py-3 rounded-full text-sm font-medium border-2 transition-all duration-100 cursor-pointer',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                active
                  ? 'border-blue-500 bg-blue-500 text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-gray-50 active:bg-gray-100',
              ].join(' ')}
            >
              {active && (
                <span className="mr-1" aria-hidden>
                  ✓
                </span>
              )}
              {room}
            </button>
          );
        })}
      </div>

      <div className="text-center min-h-[20px]">
        {selectedNames.length > 0 ? (
          <p className="text-sm font-medium text-blue-600">
            {selectedNames.length} area{selectedNames.length !== 1 ? 's' : ''} selected
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            No areas selected — tap above to choose, or skip to continue.
          </p>
        )}
      </div>
    </div>
  );
};
