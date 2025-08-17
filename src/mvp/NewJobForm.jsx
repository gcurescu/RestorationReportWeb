import React, { useState, useRef, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import SignatureCanvas from 'signature_pad';
import { reportSchema, defaultValues } from './ReportSchema';
import { saveJob } from './storage';
import { calculateDehuPintsPerDay, calculateAirMovers, calculateEnergyConsumption, calculateDaysBetween } from './utils/calculators';
import { formatDate, formatDateTime } from './utils/formatters';

const NewJobForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workAuthSig, setWorkAuthSig] = useState(null);
  const [healthConsentSig, setHealthConsentSig] = useState(null);
  
  // Refs for signature canvas elements
  const workAuthCanvasRef = useRef(null);
  const healthConsentCanvasRef = useRef(null);
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues,
  });

  // Field arrays for all the dynamic sections
  const { fields: psychFields, append: appendPsych, remove: removePsych } = useFieldArray({
    control,
    name: 'moisture.psychrometrics',
  });

  const { fields: pointFields, append: appendPoint, remove: removePoint } = useFieldArray({
    control,
    name: 'moisture.points',
  });

  const { fields: unaffectedFields, append: appendUnaffected, remove: removeUnaffected } = useFieldArray({
    control,
    name: 'moisture.unaffected',
  });

  const { fields: hvacFields, append: appendHvac, remove: removeHvac } = useFieldArray({
    control,
    name: 'moisture.hvac',
  });

  const { fields: dehuFields, append: appendDehu, remove: removeDehu } = useFieldArray({
    control,
    name: 'equipment.dehus',
  });

  const { fields: moverFields, append: appendMover, remove: removeMover } = useFieldArray({
    control,
    name: 'equipment.movers',
  });

  const { fields: scrubberFields, append: appendScrubber, remove: removeScrubber } = useFieldArray({
    control,
    name: 'equipment.scrubbers',
  });

  const { fields: photoFields, append: appendPhoto, remove: removePhoto } = useFieldArray({
    control,
    name: 'photos',
  });

  const { fields: roomFields, append: appendRoom, remove: removeRoom } = useFieldArray({
    control,
    name: 'rooms',
  });

  const { fields: videoFields, append: appendVideo, remove: removeVideo } = useFieldArray({
    control,
    name: 'videos',
  });

  const { fields: logFields, append: appendLog, remove: removeLog } = useFieldArray({
    control,
    name: 'logNotes.items',
  });

  const { fields: dehuCalcFields, append: appendDehuCalc, remove: removeDehuCalc } = useFieldArray({
    control,
    name: 'calculators.dehu',
  });

  const { fields: airMoverCalcFields, append: appendAirMoverCalc, remove: removeAirMoverCalc } = useFieldArray({
    control,
    name: 'calculators.airMovers',
  });

  const { fields: attachmentFields, append: appendAttachment, remove: removeAttachment } = useFieldArray({
    control,
    name: 'attachments',
  });

  // Initialize signature pads using useEffect to avoid infinite loops
  useEffect(() => {
    if (workAuthCanvasRef.current && !workAuthSig) {
      const signaturePad = new SignatureCanvas(workAuthCanvasRef.current, {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        penColor: 'rgb(0, 0, 0)',
      });
      workAuthCanvasRef.current.signaturePad = signaturePad;
      setWorkAuthSig(signaturePad);
    }
  }, [workAuthSig]);

  useEffect(() => {
    if (healthConsentCanvasRef.current && !healthConsentSig) {
      const signaturePad = new SignatureCanvas(healthConsentCanvasRef.current, {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        penColor: 'rgb(0, 0, 0)',
      });
      healthConsentCanvasRef.current.signaturePad = signaturePad;
      setHealthConsentSig(signaturePad);
    }
  }, [healthConsentSig]);

  const handlePhotoUpload = (e, sectionName, roomIndex = null, index = 0) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file, fileIndex) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newPhoto = {
            caption: `${sectionName} Photo ${index + fileIndex + 1}`,
            file: event.target.result,
            timeISO: new Date().toISOString(),
          };

          if (roomIndex !== null) {
            // Room-specific photo
            const currentRooms = watch('rooms') || [];
            if (currentRooms[roomIndex]) {
              const currentPhotos = currentRooms[roomIndex].photos || [];
              currentPhotos.push(newPhoto);
              setValue(`rooms.${roomIndex}.photos`, currentPhotos);
            }
          } else {
            // General photos
            const currentPhotos = watch('photos') || [];
            currentPhotos.push(newPhoto);
            setValue('photos', currentPhotos);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setValue(`videos.${index}.file`, event.target.result);
        setValue(`videos.${index}.timeISO`, new Date().toISOString());
        
        // Try to generate thumbnail (simplified)
        const video = document.createElement('video');
        video.src = event.target.result;
        video.addEventListener('loadedmetadata', () => {
          video.currentTime = 1; // Seek to 1 second for thumbnail
        });
        video.addEventListener('seeked', () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0);
          setValue(`videos.${index}.thumbnail`, canvas.toDataURL());
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-calculate equipment energy
  const calculateEquipmentEnergy = (index, type) => {
    const equipment = watch(`equipment.${type}.${index}`);
    if (equipment?.placedISO && equipment?.powerKw) {
      const days = equipment.removedISO 
        ? calculateDaysBetween(equipment.placedISO, equipment.removedISO)
        : calculateDaysBetween(equipment.placedISO);
      
      const hours = days * 24;
      const energyKwh = calculateEnergyConsumption(parseFloat(equipment.powerKw), hours);
      
      setValue(`equipment.${type}.${index}.days`, days);
      setValue(`equipment.${type}.${index}.energyKwh`, energyKwh);
    }
  };

  // Calculator functions
  const runDehuCalculation = (index) => {
    const calc = watch(`calculators.dehu.${index}`);
    if (calc?.classOfWater && calc?.volumeFt3) {
      const recommended = calculateDehuPintsPerDay(calc.classOfWater, calc.volumeFt3);
      setValue(`calculators.dehu.${index}.recommendedPintsPerDay`, recommended);
    }
  };

  const runAirMoverCalculation = (index) => {
    const calc = watch(`calculators.airMovers.${index}`);
    if (calc?.floorFt2) {
      const recommended = calculateAirMovers(calc.floorFt2, calc.insetsOrOffsets || 0);
      setValue(`calculators.airMovers.${index}.recommendedMovers`, recommended);
    }
  };

  const addLogNote = () => {
    appendLog({
      atISO: new Date().toISOString(),
      author: watch('company.name') || 'User',
      source: 'note',
      text: '',
    });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Add signature data if available
      if (workAuthSig && !workAuthSig.isEmpty()) {
        setValue('signatures.workAuth.dataUrl', workAuthSig.toDataURL());
        setValue('signatures.workAuth.signedAtISO', new Date().toISOString());
      }
      if (healthConsentSig && !healthConsentSig.isEmpty()) {
        setValue('signatures.healthConsent.dataUrl', healthConsentSig.toDataURL());
        setValue('signatures.healthConsent.signedAtISO', new Date().toISOString());
      }

      const jobId = saveJob(watch());
      navigate(`/app/job/${jobId}`);
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Error saving job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPreview = handleSubmit((data) => {
    const jobId = saveJob(data);
    navigate(`/app/job/${jobId}`);
  });

  const FormSection = ({ title, children, className = '' }) => (
    <div className={`bg-white rounded-lg border border-slate-200 p-4 mb-4 ${className}`}>
      <h2 className="text-lg font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-2">{title}</h2>
      {children}
    </div>
  );

  const Input = ({ label, name, type = 'text', ...props }) => (
    <div className="mb-3">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        {...register(name)}
        className="w-full border rounded-lg px-3 py-3 text-sm border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[44px]"
        {...props}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );

  const TextArea = ({ label, name, rows = 3, ...props }) => (
    <div className="mb-3">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <textarea
        rows={rows}
        {...register(name)}
        className="w-full border rounded-lg px-3 py-3 text-sm border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[44px]"
        {...props}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );

  const NumberInput = ({ label, name, min, max, step = 0.1, ...props }) => (
    <div className="mb-3">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        {...register(name, { valueAsNumber: true })}
        className="w-full border rounded-lg px-3 py-3 text-sm border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[44px]"
        {...props}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );

  const Select = ({ label, name, options, ...props }) => (
    <div className="mb-3">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <select
        {...register(name)}
        className="w-full border rounded-lg px-3 py-3 text-sm border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[44px]"
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );

  const SignatureField = ({ label, signaturePad, onClear, onSave, customerName, signedAt, canvasRef }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      
      <div className="mb-3">
        <Input 
          label="Customer Name" 
          name={customerName}
        />
      </div>

      <div className="border border-slate-300 rounded-lg p-4 mb-3">
        <canvas
          ref={canvasRef}
          width={300}
          height={150}
          className="border border-dashed border-slate-300 w-full bg-white rounded"
        />
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => signaturePad?.clear()}
            className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Signature
          </button>
        </div>
      </div>
      
      {signedAt && (
        <p className="text-xs text-slate-500">
          Signed: {formatDateTime(watch(signedAt))}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/app/jobs')}
              className="text-blue-600 text-sm font-medium"
            >
              ← Back to Jobs
            </button>
            <h1 className="text-lg font-bold text-slate-900 mt-1">New Job</h1>
          </div>
          <button
            onClick={onPreview}
            disabled={isSubmitting}
            className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium disabled:opacity-60 min-h-[44px]"
          >
            {isSubmitting ? 'Saving...' : 'Preview'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-4 max-w-4xl mx-auto">
        {/* Company Info */}
        <FormSection title="Company Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Company Name *" name="company.name" />
            <Input label="Phone *" name="company.phone" type="tel" />
            <Input label="Email *" name="company.email" type="email" />
            <div className="md:col-span-2">
              <TextArea label="Address *" name="company.address" rows={2} />
            </div>
            <div className="md:col-span-2">
              <Input label="Logo URL" name="company.logoUrl" type="url" />
            </div>
          </div>
        </FormSection>

        {/* Policyholder */}
        <FormSection title="Policyholder Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name *" name="policyholder.name" />
            <Input label="Phone *" name="policyholder.phone" type="tel" />
            <div className="md:col-span-2">
              <TextArea label="Address *" name="policyholder.address" rows={2} />
            </div>
          </div>
        </FormSection>

        {/* Claim */}
        <FormSection title="Claim Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Type of Loss *" 
              name="claim.typeOfLoss"
              options={[
                { value: 'Water', label: 'Water' },
                { value: 'Fire', label: 'Fire' },
                { value: 'Mold', label: 'Mold' },
              ]}
            />
            <Input label="Claim ID *" name="claim.claimId" />
            <Input label="Carrier *" name="claim.carrier" />
            <Input label="Adjuster *" name="claim.adjuster" />
            <Input label="Date of Loss *" name="claim.dateOfLoss" type="date" />
            <div className="md:col-span-2">
              <TextArea label="Summary *" name="claim.summary" rows={4} />
            </div>
          </div>
        </FormSection>

        {/* General Notes */}
        <FormSection title="General Notes">
          <TextArea label="General Notes" name="notes.general" rows={4} />
          <TextArea label="Scope Notes" name="notes.scope" rows={3} />
        </FormSection>

        {/* Log Notes */}
        <FormSection title="Log Notes">
          {logFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-3 mb-3 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <Input label="Author" name={`logNotes.items.${index}.author`} />
                <Select 
                  label="Source" 
                  name={`logNotes.items.${index}.source`}
                  options={[
                    { value: 'note', label: 'Note' },
                    { value: 'email', label: 'Email' },
                    { value: 'call', label: 'Call' },
                  ]}
                />
                <Input 
                  label="Date/Time" 
                  name={`logNotes.items.${index}.atISO`} 
                  type="datetime-local" 
                />
              </div>
              <TextArea label="Log Text" name={`logNotes.items.${index}.text`} rows={2} />
              <button
                type="button"
                onClick={() => removeLog(index)}
                className="text-red-600 text-sm hover:text-red-800"
              >
                Remove Log Note
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addLogNote}
            className="text-blue-600 text-sm font-medium hover:text-blue-800"
          >
            + Add Log Note
          </button>
        </FormSection>

        {/* Rooms */}
        <FormSection title="Room Documentation">
          {roomFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 mb-4 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input label="Room Name" name={`rooms.${index}.name`} />
                <div className="md:col-span-2">
                  <TextArea label="Overview Notes" name={`rooms.${index}.overviewNotes`} rows={2} />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Room Photos
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  onChange={(e) => handlePhotoUpload(e, field.name, index)}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 min-h-[44px]"
                />
                
                {/* Show existing photos */}
                {watch(`rooms.${index}.photos`)?.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                    {watch(`rooms.${index}.photos`).map((photo, photoIndex) => (
                      <div key={photoIndex} className="relative">
                        <img
                          src={photo.file}
                          alt={photo.caption}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const photos = watch(`rooms.${index}.photos`);
                            photos.splice(photoIndex, 1);
                            setValue(`rooms.${index}.photos`, photos);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => removeRoom(index)}
                className="text-red-600 text-sm hover:text-red-800"
              >
                Remove Room
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendRoom({ name: '', overviewNotes: '', photos: [] })}
            className="text-blue-600 text-sm font-medium hover:text-blue-800"
          >
            + Add Room
          </button>
        </FormSection>

        {/* Floor Plan */}
        <FormSection title="Floor Plan">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Floor Plan Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setValue('floorPlan.image', event.target.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 min-h-[44px]"
              />
            </div>
            <TextArea label="Legend/Notes" name="floorPlan.legend" rows={3} />
            
            {watch('floorPlan.image') && (
              <div className="mt-3">
                <img
                  src={watch('floorPlan.image')}
                  alt="Floor Plan"
                  className="max-w-full h-auto border rounded-lg"
                />
              </div>
            )}
          </div>
        </FormSection>

        {/* Videos */}
        <FormSection title="Videos">
          {videoFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-3 mb-3 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <Input label="Video Label" name={`videos.${index}.label`} />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Video File
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    capture="environment"
                    onChange={(e) => handleVideoUpload(e, index)}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 min-h-[44px]"
                  />
                </div>
              </div>
              
              {watch(`videos.${index}.thumbnail`) && (
                <div className="mb-3">
                  <img
                    src={watch(`videos.${index}.thumbnail`)}
                    alt="Video thumbnail"
                    className="w-32 h-24 object-cover border rounded"
                  />
                </div>
              )}
              
              <button
                type="button"
                onClick={() => removeVideo(index)}
                className="text-red-600 text-sm hover:text-red-800"
              >
                Remove Video
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendVideo({ label: '', file: '', thumbnail: '', timeISO: '' })}
            className="text-blue-600 text-sm font-medium hover:text-blue-800"
          >
            + Add Video
          </button>
        </FormSection>

        {/* Psychrometrics */}
        <FormSection title="Moisture - Psychrometrics">
          <div className="overflow-x-auto">
            {psychFields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-3 mb-3 bg-slate-50">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                  <Input label="Date" name={`moisture.psychrometrics.${index}.dateISO`} type="date" />
                  <Input label="Location" name={`moisture.psychrometrics.${index}.location`} />
                  <NumberInput label="Temp °F" name={`moisture.psychrometrics.${index}.tempF`} />
                  <NumberInput label="RH %" name={`moisture.psychrometrics.${index}.rh`} max={100} />
                  <NumberInput label="GPP" name={`moisture.psychrometrics.${index}.gpp`} />
                  <NumberInput label="Grain Depression" name={`moisture.psychrometrics.${index}.grainDepression`} />
                </div>
                <button
                  type="button"
                  onClick={() => removePsych(index)}
                  className="text-red-600 text-sm hover:text-red-800"
                >
                  Remove Reading
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => appendPsych({ dateISO: '', location: '', tempF: 0, rh: 0, gpp: 0, grainDepression: 0 })}
            className="text-blue-600 text-sm font-medium hover:text-blue-800"
          >
            + Add Psychrometric Reading
          </button>
        </FormSection>

        {/* Moisture Points */}
        <FormSection title="Moisture Points">
          {pointFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-3 mb-3 bg-slate-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <NumberInput label="Point #" name={`moisture.points.${index}.point`} min={1} step={1} />
                <Input label="Room" name={`moisture.points.${index}.room`} />
                <Input label="Surface" name={`moisture.points.${index}.surface`} />
                <Input label="Reading" name={`moisture.points.${index}.reading`} />
              </div>
              <TextArea label="Notes" name={`moisture.points.${index}.notes`} rows={2} />
              <button
                type="button"
                onClick={() => removePoint(index)}
                className="text-red-600 text-sm hover:text-red-800"
              >
                Remove Point
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendPoint({ point: pointFields.length + 1, room: '', surface: '', reading: '', notes: '' })}
            className="text-blue-600 text-sm font-medium hover:text-blue-800"
          >
            + Add Moisture Point
          </button>
        </FormSection>

        {/* Unaffected Areas */}
        <FormSection title="Moisture - Unaffected Areas (Optional)">
          {unaffectedFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-3 mb-3 bg-slate-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Input label="Date" name={`moisture.unaffected.${index}.dateISO`} type="date" />
                <Input label="Room" name={`moisture.unaffected.${index}.room`} />
                <NumberInput label="RH %" name={`moisture.unaffected.${index}.rh`} max={100} />
                <NumberInput label="GPP" name={`moisture.unaffected.${index}.gpp`} />
                <NumberInput label="Temp °F" name={`moisture.unaffected.${index}.tempF`} />
              </div>
              <button
                type="button"
                onClick={() => removeUnaffected(index)}
                className="text-red-600 text-sm hover:text-red-800 mt-2"
              >
                Remove Reading
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendUnaffected({ dateISO: '', room: '', rh: 0, gpp: 0, tempF: 0 })}
            className="text-blue-600 text-sm font-medium hover:text-blue-800"
          >
            + Add Unaffected Reading
          </button>
        </FormSection>

        {/* HVAC */}
        <FormSection title="Moisture - HVAC (Optional)">
          {hvacFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-3 mb-3 bg-slate-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Input label="Date" name={`moisture.hvac.${index}.dateISO`} type="date" />
                <Input label="Room" name={`moisture.hvac.${index}.room`} />
                <NumberInput label="RH %" name={`moisture.hvac.${index}.rh`} max={100} />
                <NumberInput label="GPP" name={`moisture.hvac.${index}.gpp`} />
                <NumberInput label="Temp °F" name={`moisture.hvac.${index}.tempF`} />
              </div>
              <button
                type="button"
                onClick={() => removeHvac(index)}
                className="text-red-600 text-sm hover:text-red-800 mt-2"
              >
                Remove Reading
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendHvac({ dateISO: '', room: '', rh: 0, gpp: 0, tempF: 0 })}
            className="text-blue-600 text-sm font-medium hover:text-blue-800"
          >
            + Add HVAC Reading
          </button>
        </FormSection>

        {/* Dehumidifiers */}
        <FormSection title="Equipment - Dehumidifiers">
          {dehuFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-3 mb-3 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <Input label="Name" name={`equipment.dehus.${index}.name`} />
                <Input label="Area" name={`equipment.dehus.${index}.area`} />
                <NumberInput label="Power (kW)" name={`equipment.dehus.${index}.powerKw`} min={0} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <Input 
                  label="Placed" 
                  name={`equipment.dehus.${index}.placedISO`} 
                  type="datetime-local"
                  onChange={() => setTimeout(() => calculateEquipmentEnergy(index, 'dehus'), 100)}
                />
                <Input 
                  label="Removed" 
                  name={`equipment.dehus.${index}.removedISO`} 
                  type="datetime-local"
                  onChange={() => setTimeout(() => calculateEquipmentEnergy(index, 'dehus'), 100)}
                />
                <NumberInput label="Days (auto-calc)" name={`equipment.dehus.${index}.days`} min={0} readOnly />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <NumberInput label="Energy (kWh) (auto-calc)" name={`equipment.dehus.${index}.energyKwh`} min={0} readOnly />
              </div>
              <button
                type="button"
                onClick={() => removeDehu(index)}
                className="text-red-600 text-sm hover:text-red-800 mt-2"
              >
                Remove Dehumidifier
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendDehu({ name: '', placedISO: '', removedISO: '', powerKw: 0, energyKwh: 0, days: 0, area: '' })}
            className="text-blue-600 text-sm font-medium hover:text-blue-800"
          >
            + Add Dehumidifier
          </button>
        </FormSection>

        {/* Air Movers */}
        <FormSection title="Equipment - Air Movers">
          {moverFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-3 mb-3 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <Input label="Name" name={`equipment.movers.${index}.name`} />
                <Input label="Area" name={`equipment.movers.${index}.area`} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <Input 
                  label="Placed" 
                  name={`equipment.movers.${index}.placedISO`} 
                  type="datetime-local"
                  onChange={() => setTimeout(() => calculateEquipmentEnergy(index, 'movers'), 100)}
                />
                <Input 
                  label="Removed" 
                  name={`equipment.movers.${index}.removedISO`} 
                  type="datetime-local"
                  onChange={() => setTimeout(() => calculateEquipmentEnergy(index, 'movers'), 100)}
                />
                <NumberInput label="Days (auto-calc)" name={`equipment.movers.${index}.days`} min={0} readOnly />
              </div>
              <NumberInput label="Energy (kWh)" name={`equipment.movers.${index}.energyKwh`} min={0} />
              <button
                type="button"
                onClick={() => removeMover(index)}
                className="text-red-600 text-sm hover:text-red-800 mt-2"
              >
                Remove Air Mover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendMover({ name: '', placedISO: '', removedISO: '', energyKwh: 0, days: 0, area: '' })}
            className="text-blue-600 text-sm font-medium hover:text-blue-800"
          >
            + Add Air Mover
          </button>
        </FormSection>

        {/* Air Scrubbers */}
        <FormSection title="Equipment - Air Scrubbers">
          {scrubberFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-3 mb-3 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <Input label="Name" name={`equipment.scrubbers.${index}.name`} />
                <Input label="Area" name={`equipment.scrubbers.${index}.area`} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <Input 
                  label="Placed" 
                  name={`equipment.scrubbers.${index}.placedISO`} 
                  type="datetime-local"
                  onChange={() => setTimeout(() => calculateEquipmentEnergy(index, 'scrubbers'), 100)}
                />
                <Input 
                  label="Removed" 
                  name={`equipment.scrubbers.${index}.removedISO`} 
                  type="datetime-local"
                  onChange={() => setTimeout(() => calculateEquipmentEnergy(index, 'scrubbers'), 100)}
                />
                <NumberInput label="Days (auto-calc)" name={`equipment.scrubbers.${index}.days`} min={0} readOnly />
              </div>
              <NumberInput label="Energy (kWh)" name={`equipment.scrubbers.${index}.energyKwh`} min={0} />
              <button
                type="button"
                onClick={() => removeScrubber(index)}
                className="text-red-600 text-sm hover:text-red-800 mt-2"
              >
                Remove Air Scrubber
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendScrubber({ name: '', placedISO: '', removedISO: '', energyKwh: 0, days: 0, area: '' })}
            className="text-blue-600 text-sm font-medium hover:text-blue-800"
          >
            + Add Air Scrubber
          </button>
        </FormSection>
        
        {/* Calculators */}
        <FormSection title="Calculators">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dehu Calculator */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-slate-800 mb-3">Dehumidifier Calculator</h3>
              {dehuCalcFields.map((field, index) => (
                <div key={field.id} className="border rounded p-3 mb-3 bg-slate-50">
                  <div className="grid grid-cols-1 gap-3 mb-3">
                    <Input label="Atmosphere" name={`calculators.dehu.${index}.atmosphere`} />
                    <Select 
                      label="Class of Water" 
                      name={`calculators.dehu.${index}.classOfWater`}
                      options={[
                        { value: 1, label: 'Class 1 - Clean Water' },
                        { value: 2, label: 'Class 2 - Gray Water' },
                        { value: 3, label: 'Class 3 - Black Water' },
                        { value: 4, label: 'Class 4 - Specialty Drying' },
                      ]}
                    />
                    <NumberInput 
                      label="Volume (cu ft)" 
                      name={`calculators.dehu.${index}.volumeFt3`} 
                      min={0}
                      onChange={() => setTimeout(() => runDehuCalculation(index), 100)}
                    />
                    <NumberInput 
                      label="Recommended Pints/Day" 
                      name={`calculators.dehu.${index}.recommendedPintsPerDay`} 
                      readOnly
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => runDehuCalculation(index)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Calculate
                    </button>
                    <button
                      type="button"
                      onClick={() => removeDehuCalc(index)}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendDehuCalc({ atmosphere: '', classOfWater: 1, volumeFt3: 0, recommendedPintsPerDay: 0 })}
                className="text-blue-600 text-sm font-medium hover:text-blue-800"
              >
                + Add Dehu Calculation
              </button>
            </div>

            {/* Air Mover Calculator */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-slate-800 mb-3">Air Mover Calculator</h3>
              {airMoverCalcFields.map((field, index) => (
                <div key={field.id} className="border rounded p-3 mb-3 bg-slate-50">
                  <div className="grid grid-cols-1 gap-3 mb-3">
                    <Input label="Area Name" name={`calculators.airMovers.${index}.area`} />
                    <NumberInput 
                      label="Floor Area (sq ft)" 
                      name={`calculators.airMovers.${index}.floorFt2`} 
                      min={0}
                      onChange={() => setTimeout(() => runAirMoverCalculation(index), 100)}
                    />
                    <NumberInput 
                      label="Insets/Offsets" 
                      name={`calculators.airMovers.${index}.insetsOrOffsets`} 
                      min={0}
                      onChange={() => setTimeout(() => runAirMoverCalculation(index), 100)}
                    />
                    <NumberInput 
                      label="Recommended Movers" 
                      name={`calculators.airMovers.${index}.recommendedMovers`} 
                      readOnly
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => runAirMoverCalculation(index)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Calculate
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAirMoverCalc(index)}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendAirMoverCalc({ area: '', floorFt2: 0, insetsOrOffsets: 0, recommendedMovers: 0 })}
                className="text-blue-600 text-sm font-medium hover:text-blue-800"
              >
                + Add Air Mover Calculation
              </button>
            </div>
          </div>
        </FormSection>

        {/* Attachments */}
        <FormSection title="Attachments">
          <div className="space-y-3">
            {attachmentFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3 p-3 border rounded-lg bg-slate-50">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input label="Title" name={`attachments.${index}.title`} />
                  <Input label="Note" name={`attachments.${index}.note`} />
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="text-red-600 hover:text-red-800 px-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => appendAttachment({ title: '', note: '' })}
            className="text-blue-600 text-sm font-medium hover:text-blue-800 mt-3"
          >
            + Add Attachment
          </button>
        </FormSection>

        {/* Signatures */}
        <FormSection title="Signatures">
          <div className="space-y-6">
            {/* Work Authorization Signature */}
            <SignatureField
              label="Work Authorization Signature"
              signaturePad={workAuthSig}
              canvasRef={workAuthCanvasRef}
              onClear={() => workAuthSig?.clear()}
              onSave={() => {
                if (workAuthSig && !workAuthSig.isEmpty()) {
                  setValue('signatures.workAuth.dataUrl', workAuthSig.toDataURL());
                  setValue('signatures.workAuth.signedAtISO', new Date().toISOString());
                }
              }}
              customerName="signatures.workAuth.customerName"
              signedAt="signatures.workAuth.signedAtISO"
            />

            {/* Health Consent Signature */}
            <SignatureField
              label="Health & Safety Consent Signature"
              signaturePad={healthConsentSig}
              canvasRef={healthConsentCanvasRef}
              onClear={() => healthConsentSig?.clear()}
              onSave={() => {
                if (healthConsentSig && !healthConsentSig.isEmpty()) {
                  setValue('signatures.healthConsent.dataUrl', healthConsentSig.toDataURL());
                  setValue('signatures.healthConsent.signedAtISO', new Date().toISOString());
                }
              }}
              customerName="signatures.healthConsent.customerName"
              signedAt="signatures.healthConsent.signedAtISO"
            />
          </div>
        </FormSection>
        
        {/* Photos */}
        <FormSection title="General Photos">
          {photoFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-3 mb-3 bg-slate-50">
              <Input label="Caption" name={`photos.${index}.caption`} />
              <div className="mb-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Photo File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  onChange={(e) => handlePhotoUpload(e, 'General', null, index)}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 min-h-[44px]"
                />
              </div>
              
              {watch(`photos.${index}.file`) && (
                <div className="mb-2">
                  <img
                    src={watch(`photos.${index}.file`)}
                    alt={watch(`photos.${index}.caption`) || `Photo ${index + 1}`}
                    className="w-32 h-24 object-cover border rounded"
                  />
                </div>
              )}
              
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="text-red-600 text-sm hover:text-red-800"
              >
                Remove Photo
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendPhoto({ caption: '', file: '', timeISO: '' })}
            className="text-blue-600 text-sm font-medium hover:text-blue-800"
          >
            + Add Photo
          </button>
        </FormSection>

        {/* Submit Buttons */}
        <div className="flex flex-col gap-2 mt-6 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border">
          <button
            type="button"
            onClick={onPreview}
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-md bg-blue-600 text-white font-medium disabled:opacity-60 min-h-[44px] hover:bg-blue-700 transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save & Preview Report'}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-md border border-slate-300 text-slate-700 font-medium min-h-[44px] hover:bg-slate-50 transition-colors"
          >
            Save Draft
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewJobForm;
