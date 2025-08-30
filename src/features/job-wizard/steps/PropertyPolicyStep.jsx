import React from 'react';
import { useFormContext } from 'react-hook-form';

export const PropertyPolicyStep = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Property & Policy Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Address *
          </label>
          <textarea
            {...register('property.address')}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.property?.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter property address"
          />
          {errors.property?.address && (
            <p className="mt-1 text-sm text-red-600">{errors.property.address.message}</p>
          )}
        </div>

        {/* Insured Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insured Name *
          </label>
          <input
            type="text"
            {...register('property.insured')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.property?.insured ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter insured name"
          />
          {errors.property?.insured && (
            <p className="mt-1 text-sm text-red-600">{errors.property.insured.message}</p>
          )}
        </div>

        {/* Insurance Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insurance Company *
          </label>
          <input
            type="text"
            {...register('property.insurer')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.property?.insurer ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter insurance company"
          />
          {errors.property?.insurer && (
            <p className="mt-1 text-sm text-red-600">{errors.property.insurer.message}</p>
          )}
        </div>

        {/* Policy Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Policy Number *
          </label>
          <input
            type="text"
            {...register('property.policyNumber')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.property?.policyNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter policy number"
          />
          {errors.property?.policyNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.property.policyNumber.message}</p>
          )}
        </div>

        {/* Deductible */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deductible *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              {...register('property.deductible')}
              className={`w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.property?.deductible ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.property?.deductible && (
            <p className="mt-1 text-sm text-red-600">{errors.property.deductible.message}</p>
          )}
        </div>

        {/* Adjuster */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adjuster Name *
          </label>
          <input
            type="text"
            {...register('property.adjuster')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.property?.adjuster ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter adjuster name"
          />
          {errors.property?.adjuster && (
            <p className="mt-1 text-sm text-red-600">{errors.property.adjuster.message}</p>
          )}
        </div>

        {/* Coverage Details */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coverage Details *
          </label>
          <textarea
            {...register('property.coverage')}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.property?.coverage ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe the coverage details, limits, and any special provisions"
          />
          {errors.property?.coverage && (
            <p className="mt-1 text-sm text-red-600">{errors.property.coverage.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
