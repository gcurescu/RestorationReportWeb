import React, { useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import SignatureCanvas from 'signature_pad';

export const CostsSignoffStep = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const workAuthCanvasRef = useRef(null);
  const healthConsentCanvasRef = useRef(null);
  
  const costs = watch('costs') || {};

  // Calculate total automatically
  useEffect(() => {
    const labor = parseFloat(costs.labor || 0);
    const materials = parseFloat(costs.materials || 0);
    const equipment = parseFloat(costs.equipment || 0);
    const total = labor + materials + equipment;
    setValue('costs.total', total);
  }, [costs.labor, costs.materials, costs.equipment, setValue]);

  // Initialize signature pads
  useEffect(() => {
    if (workAuthCanvasRef.current) {
      const canvas = workAuthCanvasRef.current;
      const signaturePad = new SignatureCanvas(canvas, {
        backgroundColor: 'white',
        penColor: 'black',
      });
      
      signaturePad.addEventListener('endStroke', () => {
        const dataURL = signaturePad.toDataURL();
        setValue('signoff.workAuth.dataUrl', dataURL);
        setValue('signoff.workAuth.signedAtISO', new Date().toISOString());
      });

      return () => signaturePad.off();
    }
  }, [setValue]);

  useEffect(() => {
    if (healthConsentCanvasRef.current) {
      const canvas = healthConsentCanvasRef.current;
      const signaturePad = new SignatureCanvas(canvas, {
        backgroundColor: 'white',
        penColor: 'black',
      });
      
      signaturePad.addEventListener('endStroke', () => {
        const dataURL = signaturePad.toDataURL();
        setValue('signoff.healthConsent.dataUrl', dataURL);
        setValue('signoff.healthConsent.signedAtISO', new Date().toISOString());
      });

      return () => signaturePad.off();
    }
  }, [setValue]);

  const clearSignature = (type) => {
    if (type === 'workAuth' && workAuthCanvasRef.current) {
      const signaturePad = new SignatureCanvas(workAuthCanvasRef.current);
      signaturePad.clear();
      setValue('signoff.workAuth.dataUrl', '');
      setValue('signoff.workAuth.signedAtISO', '');
    } else if (type === 'healthConsent' && healthConsentCanvasRef.current) {
      const signaturePad = new SignatureCanvas(healthConsentCanvasRef.current);
      signaturePad.clear();
      setValue('signoff.healthConsent.dataUrl', '');
      setValue('signoff.healthConsent.signedAtISO', '');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900">Costs & Signoff</h2>
      
      {/* Cost Breakdown */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Breakdown</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Labor Cost
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                {...register('costs.labor')}
                className={`w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.costs?.labor ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.costs?.labor && (
              <p className="mt-1 text-sm text-red-600">{errors.costs.labor.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Materials Cost
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                {...register('costs.materials')}
                className={`w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.costs?.materials ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.costs?.materials && (
              <p className="mt-1 text-sm text-red-600">{errors.costs.materials.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipment Cost
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                {...register('costs.equipment')}
                className={`w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.costs?.equipment ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.costs?.equipment && (
              <p className="mt-1 text-sm text-red-600">{errors.costs.equipment.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Cost
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                {...register('costs.total')}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Work Authorization Signature */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Work Authorization</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name
            </label>
            <input
              type="text"
              {...register('signoff.workAuth.customerName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Signature
            </label>
            <div className="border border-gray-300 rounded-md">
              <canvas
                ref={workAuthCanvasRef}
                width={400}
                height={150}
                className="w-full h-32 rounded-md"
                style={{ backgroundColor: 'white' }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">Sign above to authorize work</p>
              <button
                type="button"
                onClick={() => clearSignature('workAuth')}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Health & Safety Consent */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Health & Safety Consent</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name
            </label>
            <input
              type="text"
              {...register('signoff.healthConsent.customerName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Signature
            </label>
            <div className="border border-gray-300 rounded-md">
              <canvas
                ref={healthConsentCanvasRef}
                width={400}
                height={150}
                className="w-full h-32 rounded-md"
                style={{ backgroundColor: 'white' }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">Sign above to provide health & safety consent</p>
              <button
                type="button"
                onClick={() => clearSignature('healthConsent')}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Terms and Conditions</h3>
        
        <div className="prose text-sm text-gray-600 space-y-3">
          <p>
            <strong>Work Authorization:</strong> I authorize the above-mentioned work to be performed and agree to pay for all materials and labor as outlined in this estimate.
          </p>
          
          <p>
            <strong>Health & Safety:</strong> I understand that restoration work may involve exposure to potential health hazards and consent to the necessary work being performed with appropriate safety measures.
          </p>
          
          <p>
            <strong>Property Access:</strong> I grant access to the property for the duration of the restoration work and understand that some disruption to normal activities may occur.
          </p>
          
          <p>
            <strong>Payment Terms:</strong> Payment is due upon completion of work unless other arrangements have been made in writing.
          </p>
        </div>
      </div>
    </div>
  );
};
