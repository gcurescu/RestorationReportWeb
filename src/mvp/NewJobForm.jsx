import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { reportSchema, defaultValues } from './ReportSchema';
import { saveJob } from './storage';

const NewJobForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const { fields: psychFields, append: appendPsych, remove: removePsych } = useFieldArray({
    control,
    name: 'moisture.psychrometrics',
  });

  const { fields: pointFields, append: appendPoint, remove: removePoint } = useFieldArray({
    control,
    name: 'moisture.points',
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

  const handlePhotoUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const currentPhotos = watch('photos') || [];
        currentPhotos[index] = {
          ...currentPhotos[index],
          file: event.target.result,
        };
        // Force form update
        setValue('photos', currentPhotos);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const jobId = saveJob(data);
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

  const FormSection = ({ title, children }) => (
    <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
      <h2 className="text-lg font-semibold text-slate-900 mb-3">{title}</h2>
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
        className="w-full border rounded-lg px-3 py-2 text-sm border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
        className="w-full border rounded-lg px-3 py-2 text-sm border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        {...props}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
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
            className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Preview'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-4 max-w-2xl mx-auto">
        {/* Company Info */}
        <FormSection title="Company Information">
          <Input label="Company Name *" name="company.name" />
          <Input label="Phone *" name="company.phone" type="tel" />
          <Input label="Email *" name="company.email" type="email" />
          <TextArea label="Address *" name="company.address" rows={2} />
          <Input label="Logo URL" name="company.logoUrl" type="url" />
        </FormSection>

        {/* Policyholder */}
        <FormSection title="Policyholder Information">
          <Input label="Name *" name="policyholder.name" />
          <Input label="Phone *" name="policyholder.phone" type="tel" />
          <TextArea label="Address *" name="policyholder.address" rows={2} />
        </FormSection>

        {/* Claim */}
        <FormSection title="Claim Details">
          <div className="mb-3">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Type of Loss *
            </label>
            <select
              {...register('claim.typeOfLoss')}
              className="w-full border rounded-lg px-3 py-2 text-sm border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="Water">Water</option>
              <option value="Fire">Fire</option>
              <option value="Mold">Mold</option>
            </select>
          </div>
          <Input label="Claim ID *" name="claim.claimId" />
          <Input label="Carrier *" name="claim.carrier" />
          <Input label="Adjuster *" name="claim.adjuster" />
          <Input label="Date of Loss *" name="claim.dateOfLoss" type="date" />
          <TextArea label="Summary *" name="claim.summary" rows={4} />
        </FormSection>

        {/* Notes */}
        <FormSection title="Notes">
          <TextArea label="General Notes" name="notes.general" />
          <TextArea label="Kitchen Notes" name="notes.kitchen" />
          <TextArea label="Basement Notes" name="notes.basement" />
          <TextArea label="Scope Notes" name="notes.scope" />
        </FormSection>

        {/* Psychrometrics */}
        <FormSection title="Moisture - Psychrometrics">
          <div className="overflow-x-auto">
            {psychFields.map((field, index) => (
              <div key={field.id} className="border rounded p-3 mb-3 min-w-full">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Input label="Date" name={`moisture.psychrometrics.${index}.date`} type="date" />
                  <Input label="Location" name={`moisture.psychrometrics.${index}.location`} />
                  <Input label="Temp °F" name={`moisture.psychrometrics.${index}.tempF`} />
                  <Input label="RH %" name={`moisture.psychrometrics.${index}.rh`} />
                  <Input label="GPP" name={`moisture.psychrometrics.${index}.gpp`} />
                  <Input label="GD" name={`moisture.psychrometrics.${index}.gd`} />
                </div>
                <button
                  type="button"
                  onClick={() => removePsych(index)}
                  className="text-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => appendPsych({ date: '', location: '', tempF: '', rh: '', gpp: '', gd: '' })}
            className="text-blue-600 text-sm font-medium"
          >
            + Add Psychrometric Reading
          </button>
        </FormSection>

        {/* Moisture Points */}
        <FormSection title="Moisture Points">
          {pointFields.map((field, index) => (
            <div key={field.id} className="border rounded p-3 mb-3">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Input label="Point" name={`moisture.points.${index}.point`} />
                <Input label="Room" name={`moisture.points.${index}.room`} />
                <Input label="Surface" name={`moisture.points.${index}.surface`} />
                <Input label="Reading" name={`moisture.points.${index}.reading`} />
              </div>
              <TextArea label="Notes" name={`moisture.points.${index}.notes`} rows={2} />
              <button
                type="button"
                onClick={() => removePoint(index)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendPoint({ point: '', room: '', surface: '', reading: '', notes: '' })}
            className="text-blue-600 text-sm font-medium"
          >
            + Add Moisture Point
          </button>
        </FormSection>

        {/* Equipment sections would follow similar patterns... */}
        
        {/* Dehumidifiers */}
        <FormSection title="Equipment - Dehumidifiers">
          {dehuFields.map((field, index) => (
            <div key={field.id} className="border rounded p-3 mb-3">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Input label="Name" name={`equipment.dehus.${index}.name`} />
                <Input label="Placed" name={`equipment.dehus.${index}.placed`} type="date" />
                <Input label="Removed" name={`equipment.dehus.${index}.removed`} type="date" />
                <Input label="Power (kW)" name={`equipment.dehus.${index}.powerKw`} />
                <Input label="Energy (kWh)" name={`equipment.dehus.${index}.energyKwh`} />
                <Input label="Days" name={`equipment.dehus.${index}.days`} />
              </div>
              <button
                type="button"
                onClick={() => removeDehu(index)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendDehu({ name: '', placed: '', removed: '', powerKw: '', energyKwh: '', days: '' })}
            className="text-blue-600 text-sm font-medium"
          >
            + Add Dehumidifier
          </button>
        </FormSection>

        {/* Air Movers */}
        <FormSection title="Equipment - Air Movers">
          {moverFields.map((field, index) => (
            <div key={field.id} className="border rounded p-3 mb-3">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Input label="Name" name={`equipment.movers.${index}.name`} />
                <Input label="Placed" name={`equipment.movers.${index}.placed`} type="date" />
                <Input label="Removed" name={`equipment.movers.${index}.removed`} type="date" />
                <Input label="Energy (kWh)" name={`equipment.movers.${index}.energyKwh`} />
                <Input label="Days" name={`equipment.movers.${index}.days`} />
              </div>
              <button
                type="button"
                onClick={() => removeMover(index)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendMover({ name: '', placed: '', removed: '', energyKwh: '', days: '' })}
            className="text-blue-600 text-sm font-medium"
          >
            + Add Air Mover
          </button>
        </FormSection>

        {/* Air Scrubbers */}
        <FormSection title="Equipment - Air Scrubbers">
          {scrubberFields.map((field, index) => (
            <div key={field.id} className="border rounded p-3 mb-3">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Input label="Name" name={`equipment.scrubbers.${index}.name`} />
                <Input label="Placed" name={`equipment.scrubbers.${index}.placed`} type="date" />
                <Input label="Removed" name={`equipment.scrubbers.${index}.removed`} type="date" />
                <Input label="Energy (kWh)" name={`equipment.scrubbers.${index}.energyKwh`} />
                <Input label="Days" name={`equipment.scrubbers.${index}.days`} />
              </div>
              <button
                type="button"
                onClick={() => removeScrubber(index)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendScrubber({ name: '', placed: '', removed: '', energyKwh: '', days: '' })}
            className="text-blue-600 text-sm font-medium"
          >
            + Add Air Scrubber
          </button>
        </FormSection>
        
        {/* Photos */}
        <FormSection title="Photos">
          {photoFields.map((field, index) => (
            <div key={field.id} className="border rounded p-3 mb-3">
              <Input label="Caption" name={`photos.${index}.caption`} />
              <div className="mb-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Photo File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, index)}
                  className="w-full text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendPhoto({ caption: '', file: '' })}
            className="text-blue-600 text-sm font-medium"
          >
            + Add Photo
          </button>
        </FormSection>

        {/* Submit Buttons */}
        <div className="flex flex-col gap-2 mt-6">
          <button
            type="button"
            onClick={onPreview}
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-md bg-blue-600 text-white font-medium disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Save & Preview Report'}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-md border border-slate-300 text-slate-700 font-medium"
          >
            Save Draft
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewJobForm;
