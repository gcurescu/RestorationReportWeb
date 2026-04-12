import React, { useRef } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { MvpJob } from '../../../../schemas/job';

export const PhotosStep = () => {
  const { control, register } = useFormContext<MvpJob>();
  const { fields, append, remove } = useFieldArray({ control, name: 'photos' });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          append({
            caption: '',
            file: ev.target.result as string,
            time: new Date().toISOString(),
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  return (
    <div className="space-y-5">
      <div className="text-center pb-1">
        <h2 className="text-2xl font-bold text-gray-900">Add photos</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Photos make your report more credible. Optional — you can add more after preview.
        </p>
      </div>

      {/* Tap-to-upload zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={[
          'w-full flex flex-col items-center justify-center gap-3',
          'min-h-[160px] rounded-2xl border-2 border-dashed',
          'transition-colors cursor-pointer',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2',
          fields.length > 0
            ? 'border-blue-200 bg-blue-50 hover:bg-blue-100 active:bg-blue-100'
            : 'border-gray-200 bg-gray-50 hover:bg-gray-100 active:bg-gray-100',
        ].join(' ')}
      >
        <div className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
          <svg
            className="w-6 h-6 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700">
            {fields.length > 0 ? 'Add more photos' : 'Tap to add photos'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or HEIC · up to 10 MB each</p>
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      {/* Photo grid */}
      {fields.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {fields.map((field, idx) => (
            <div key={field.id} className="relative group">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={field.file}
                  alt={`Damage documentation ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => remove(idx)}
                className={[
                  'absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 text-white',
                  'flex items-center justify-center text-xs leading-none',
                  'opacity-0 group-hover:opacity-100 focus:opacity-100',
                  'transition-opacity focus:outline-none',
                ].join(' ')}
                aria-label="Remove photo"
              >
                ✕
              </button>
              <input
                {...register(`photos.${idx}.caption`)}
                type="text"
                placeholder="Caption…"
                className="mt-1 w-full text-xs px-2 py-1.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:outline-none bg-white"
              />
            </div>
          ))}
        </div>
      )}

      {fields.length === 0 && (
        <p className="text-center text-xs text-gray-400 italic">
          No photos yet. Tap above to add one.
        </p>
      )}
    </div>
  );
};
