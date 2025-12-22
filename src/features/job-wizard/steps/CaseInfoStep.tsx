import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Job } from '../../../schemas/job';

export const CaseInfoStep = () => {
  const { register, formState: { errors } } = useFormContext<Job>();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Case Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Name *
          </label>
          <input
            type="text"
            {...register('jobName')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.jobName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter job name"
          />
          {errors.jobName?.message && (
            <p className="mt-1 text-sm text-red-600">{String(errors.jobName?.message)}</p>
          )}
        </div>

        {/* Claim Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Claim Number *
          </label>
          <input
            type="text"
            {...register('claimNumber')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.claimNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter claim number"
          />
          {errors.claimNumber?.message && (
            <p className="mt-1 text-sm text-red-600">{String(errors.claimNumber?.message)}</p>
          )}
        </div>

        {/* Loss Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loss Type *
          </label>
          <select
            {...register('lossType')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.lossType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select loss type</option>
            <option value="Water">Water</option>
            <option value="Fire">Fire</option>
            <option value="Mold">Mold</option>
          </select>
          {errors.lossType?.message && (
            <p className="mt-1 text-sm text-red-600">{String(errors.lossType?.message)}</p>
          )}
        </div>

        {/* Date of Loss */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Loss *
          </label>
          <input
            type="date"
            {...register('dateOfLoss')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.dateOfLoss ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dateOfLoss?.message && (
            <p className="mt-1 text-sm text-red-600">{String(errors.dateOfLoss?.message)}</p>
          )}
        </div>

        {/* Inspector Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inspector Name *
          </label>
          <input
            type="text"
            {...register('inspectorName')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.inspectorName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter inspector name"
          />
          {errors.inspectorName?.message && (
            <p className="mt-1 text-sm text-red-600">{String(errors.inspectorName?.message)}</p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            {...register('companyName')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.companyName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter company name"
          />
          {errors.companyName?.message && (
            <p className="mt-1 text-sm text-red-600">{String(errors.companyName?.message)}</p>
          )}
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              {...register('contact.phone')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.contact?.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="(555) 123-4567"
            />
            {errors.contact?.phone?.message && (
              <p className="mt-1 text-sm text-red-600">{String(errors.contact?.phone?.message)}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              {...register('contact.email')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.contact?.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="john@example.com"
            />
            {errors.contact?.email?.message && (
              <p className="mt-1 text-sm text-red-600">{String(errors.contact?.email?.message)}</p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              {...register('contact.address')}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.contact?.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter full address"
            />
            {errors.contact?.address?.message && (
              <p className="mt-1 text-sm text-red-600">{String(errors.contact?.address?.message)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
