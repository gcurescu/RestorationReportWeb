import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Job } from '../../../schemas/job';

export const AffectedAreasStep = () => {
  const { register, control, formState: { errors } } = useFormContext<Job>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'areas',
  });

  const addArea = () => {
    append({
      name: '',
      category: '1',
      class: '1',
      materials: '',
      cause: '',
      overviewNotes: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Affected Areas</h2>
        <button
          type="button"
          onClick={addArea}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Area
        </button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No affected areas added yet. Click "Add Area" to get started.</p>
        </div>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Area #{index + 1}
            </h3>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Area Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area Name *
              </label>
              <input
                type="text"
                {...register(`areas.${index}.name`)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.areas?.[index]?.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Kitchen, Living Room"
              />
              {errors.areas?.[index]?.name?.message && (
                <p className="mt-1 text-sm text-red-600">{String(errors.areas?.[index]?.name?.message)}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register(`areas.${index}.category`)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.areas?.[index]?.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="1">Category 1 - Clean Water</option>
                <option value="2">Category 2 - Gray Water</option>
                <option value="3">Category 3 - Black Water</option>
              </select>
              {errors.areas?.[index]?.category?.message && (
                <p className="mt-1 text-sm text-red-600">{String(errors.areas?.[index]?.category?.message)}</p>
              )}
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class *
              </label>
              <select
                {...register(`areas.${index}.class`)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.areas?.[index]?.class ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="1">Class 1 - Minimal Absorption</option>
                <option value="2">Class 2 - Significant Absorption</option>
                <option value="3">Class 3 - Maximum Absorption</option>
                <option value="4">Class 4 - Specialty Drying</option>
              </select>
              {errors.areas?.[index]?.class?.message && (
                <p className="mt-1 text-sm text-red-600">{String(errors.areas?.[index]?.class?.message)}</p>
              )}
            </div>

            {/* Cause */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cause *
              </label>
              <input
                type="text"
                {...register(`areas.${index}.cause`)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.areas?.[index]?.cause ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Burst pipe, Roof leak"
              />
              {errors.areas?.[index]?.cause?.message && (
                <p className="mt-1 text-sm text-red-600">{String(errors.areas?.[index]?.cause?.message)}</p>
              )}
            </div>

            {/* Materials Affected */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materials Affected *
              </label>
              <textarea
                {...register(`areas.${index}.materials`)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.areas?.[index]?.materials ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="List affected materials (e.g., hardwood flooring, drywall, cabinets)"
              />
              {errors.areas?.[index]?.materials?.message && (
                <p className="mt-1 text-sm text-red-600">{String(errors.areas?.[index]?.materials?.message)}</p>
              )}
            </div>

            {/* Overview Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overview Notes
              </label>
              <textarea
                {...register(`areas.${index}.overviewNotes`)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Additional notes about this area"
              />
            </div>
          </div>
        </div>
      ))}

      {errors.areas && (
        <p className="text-sm text-red-600">
          At least one affected area is required.
        </p>
      )}
    </div>
  );
};
