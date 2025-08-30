import React from 'react';
import { useFormContext } from 'react-hook-form';

export const ReviewSubmitStep = ({ onEditStep }) => {
  const { getValues } = useFormContext();
  const data = getValues();

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Review Your Information</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Please review all information below before submitting. You can edit any section by clicking the "Edit" button.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Case Info Summary */}
      <ReviewSection
        title="Case Information"
        onEdit={() => onEditStep?.(1)}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Job Name</dt>
            <dd className="text-sm text-gray-900">{data.jobName || 'Not provided'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Claim Number</dt>
            <dd className="text-sm text-gray-900">{data.claimNumber || 'Not provided'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Loss Type</dt>
            <dd className="text-sm text-gray-900">{data.lossType || 'Not provided'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Date of Loss</dt>
            <dd className="text-sm text-gray-900">{data.dateOfLoss || 'Not provided'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Inspector</dt>
            <dd className="text-sm text-gray-900">{data.inspectorName || 'Not provided'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Company</dt>
            <dd className="text-sm text-gray-900">{data.companyName || 'Not provided'}</dd>
          </div>
        </div>
      </ReviewSection>

      {/* Property & Policy Summary */}
      <ReviewSection
        title="Property & Policy"
        onEdit={() => onEditStep?.(2)}
      >
        <div className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Property Address</dt>
            <dd className="text-sm text-gray-900">{data.property?.address || 'Not provided'}</dd>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Insured</dt>
              <dd className="text-sm text-gray-900">{data.property?.insured || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Insurance Company</dt>
              <dd className="text-sm text-gray-900">{data.property?.insurer || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Policy Number</dt>
              <dd className="text-sm text-gray-900">{data.property?.policyNumber || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Deductible</dt>
              <dd className="text-sm text-gray-900">${data.property?.deductible || '0.00'}</dd>
            </div>
          </div>
        </div>
      </ReviewSection>

      {/* Affected Areas Summary */}
      <ReviewSection
        title="Affected Areas"
        onEdit={() => onEditStep?.(3)}
      >
        {data.areas?.length > 0 ? (
          <div className="space-y-3">
            {data.areas.map((area, index) => (
              <div key={index} className="border border-gray-200 rounded p-3">
                <h4 className="font-medium text-gray-900">{area.name || `Area ${index + 1}`}</h4>
                <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                  <div>
                    <span className="font-medium">Category:</span> {area.category}
                  </div>
                  <div>
                    <span className="font-medium">Class:</span> {area.class}
                  </div>
                  <div>
                    <span className="font-medium">Cause:</span> {area.cause}
                  </div>
                </div>
                {area.materials && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Materials:</span> {area.materials}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No affected areas specified</p>
        )}
      </ReviewSection>

      {/* Equipment & Readings Summary */}
      <ReviewSection
        title="Equipment & Readings"
        onEdit={() => onEditStep?.(4)}
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Dehumidifiers</dt>
            <dd className="text-sm text-gray-900">{data.equipment?.dehus?.length || 0} units</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Air Movers</dt>
            <dd className="text-sm text-gray-900">{data.equipment?.movers?.length || 0} units</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Air Scrubbers</dt>
            <dd className="text-sm text-gray-900">{data.equipment?.scrubbers?.length || 0} units</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Psychrometric Readings</dt>
            <dd className="text-sm text-gray-900">{data.moisture?.psychrometrics?.length || 0} readings</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Moisture Points</dt>
            <dd className="text-sm text-gray-900">{data.moisture?.points?.length || 0} points</dd>
          </div>
        </div>
      </ReviewSection>

      {/* Photos & Notes Summary */}
      <ReviewSection
        title="Photos & Notes"
        onEdit={() => onEditStep?.(5)}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Photos</dt>
            <dd className="text-sm text-gray-900">{data.photos?.length || 0} photos</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Log Entries</dt>
            <dd className="text-sm text-gray-900">{data.logNotes?.items?.length || 0} entries</dd>
          </div>
        </div>
        {(data.notes?.general || data.notes?.scope || data.notes?.kitchen || data.notes?.basement) && (
          <div className="mt-3">
            <dt className="text-sm font-medium text-gray-500">Notes Available</dt>
            <dd className="text-sm text-gray-900">
              {[
                data.notes.general && 'General',
                data.notes.scope && 'Scope',
                data.notes.kitchen && 'Kitchen',
                data.notes.basement && 'Basement'
              ].filter(Boolean).join(', ')}
            </dd>
          </div>
        )}
      </ReviewSection>

      {/* Costs & Signoff Summary */}
      <ReviewSection
        title="Costs & Signoff"
        onEdit={() => onEditStep?.(6)}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Labor Cost</dt>
              <dd className="text-sm text-gray-900">${data.costs?.labor || '0.00'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Materials Cost</dt>
              <dd className="text-sm text-gray-900">${data.costs?.materials || '0.00'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Equipment Cost</dt>
              <dd className="text-sm text-gray-900">${data.costs?.equipment || '0.00'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 font-bold">Total Cost</dt>
              <dd className="text-sm text-gray-900 font-bold">${data.costs?.total || '0.00'}</dd>
            </div>
          </div>
          
          <div className="border-t pt-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Work Authorization</dt>
                <dd className="text-sm text-gray-900">
                  {data.signoff?.workAuth?.dataUrl ? 
                    '✅ Signed' + (data.signoff.workAuth.customerName ? ` by ${data.signoff.workAuth.customerName}` : '') :
                    '❌ Not signed'
                  }
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Health Consent</dt>
                <dd className="text-sm text-gray-900">
                  {data.signoff?.healthConsent?.dataUrl ? 
                    '✅ Signed' + (data.signoff.healthConsent.customerName ? ` by ${data.signoff.healthConsent.customerName}` : '') :
                    '❌ Not signed'
                  }
                </dd>
              </div>
            </div>
          </div>
        </div>
      </ReviewSection>

      {/* Final Submit Notice */}
      <div className="border border-green-200 bg-green-50 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Ready to Submit</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>Once you submit this job, it will be saved and you'll be redirected to the job detail page where you can generate reports and make further edits.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewSection = ({ title, children, onEdit }) => (
  <div className="border border-gray-200 rounded-lg p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Edit
        </button>
      )}
    </div>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);
