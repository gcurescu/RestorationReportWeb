import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Job } from '../../../schemas/job';

export const PhotosNotesStep = () => {
  const { register, control, formState: { errors } } = useFormContext<Job>();
  const [activeTab, setActiveTab] = useState('photos');

  const { fields: photoFields, append: appendPhoto, remove: removePhoto } = useFieldArray({
    control,
    name: 'photos',
  });

  const { fields: logFields, append: appendLog, remove: removeLog } = useFieldArray({
    control,
    name: 'logNotes.items',
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          appendPhoto({
            caption: '',
            file: e.target.result as string,
            time: new Date().toISOString(),
          });
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    event.target.value = '';
  };

  const addLogEntry = () => {
    appendLog({
      atISO: new Date().toISOString(),
      author: '',
      source: 'note',
      text: '',
    });
  };

  const tabs = [
    { id: 'photos', name: 'Photos', count: photoFields.length },
    { id: 'notes', name: 'Notes', count: 0 },
    { id: 'log', name: 'Log Entries', count: logFields.length },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Photos & Notes</h2>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name} {tab.count > 0 && `(${tab.count})`}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'photos' && (
          <PhotosSection
            fields={photoFields}
            onUpload={handlePhotoUpload}
            onRemove={removePhoto}
            register={register}
            errors={errors}
          />
        )}

        {activeTab === 'notes' && (
          <NotesSection
            register={register}
            errors={errors}
          />
        )}

        {activeTab === 'log' && (
          <LogSection
            fields={logFields}
            onAdd={addLogEntry}
            onRemove={removeLog}
            register={register}
            errors={errors}
          />
        )}
      </div>
    </div>
  );
};

interface PhotosSectionProps {
  fields: any[];
  onUpload: any;
  onRemove: any;
  register: any;
  errors: any;
}

const PhotosSection: React.FC<PhotosSectionProps> = ({ fields, onUpload, onRemove, register, errors }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-gray-900">Project Photos</h3>
      <div>
        <input
          type="file"
          id="photo-upload"
          multiple
          accept="image/*"
          onChange={onUpload}
          className="hidden"
        />
        <label
          htmlFor="photo-upload"
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 cursor-pointer inline-block"
        >
          Upload Photos
        </label>
      </div>
    </div>

    {fields.length === 0 && (
      <div className="text-center py-8 text-gray-500">
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p>No photos uploaded yet. Click "Upload Photos" to get started.</p>
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fields.map((field, index) => (
        <div key={field.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Photo #{index + 1}</h4>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>

          {field.file && (
            <div className="mb-3">
              <img
                src={field.file}
                alt={`${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
            <textarea
              {...register(`photos.${index}.caption`)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Describe what this photo shows"
            />
          </div>

          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Taken</label>
            <input
              type="datetime-local"
              {...register(`photos.${index}.time`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

interface NotesSectionProps {
  register: any;
  errors: any;
}

const NotesSection: React.FC<NotesSectionProps> = ({ register, errors }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900">Project Notes</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          General Notes
        </label>
        <textarea
          {...register('notes.general')}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="General project notes and observations"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Scope Notes
        </label>
        <textarea
          {...register('notes.scope')}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Scope of work notes"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kitchen Notes
        </label>
        <textarea
          {...register('notes.kitchen')}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Kitchen-specific notes"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Basement Notes
        </label>
        <textarea
          {...register('notes.basement')}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Basement-specific notes"
        />
      </div>
    </div>
  </div>
);

interface LogSectionProps {
  fields: any[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  register: any;
  errors: any;
}

const LogSection: React.FC<LogSectionProps> = ({ fields, onAdd, onRemove, register, errors }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-gray-900">Log Entries</h3>
      <button
        type="button"
        onClick={onAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
      >
        Add Entry
      </button>
    </div>

    {fields.map((field, index) => (
      <div key={field.id} className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Entry #{index + 1}</h4>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Remove
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
            <input
              type="datetime-local"
              {...register(`logNotes.items.${index}.atISO`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input
              type="text"
              {...register(`logNotes.items.${index}.author`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Who made this entry"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <select
              {...register(`logNotes.items.${index}.source`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="note">Note</option>
              <option value="email">Email</option>
              <option value="call">Phone Call</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Entry Text</label>
          <textarea
            {...register(`logNotes.items.${index}.text`)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="Describe what happened, decisions made, communications, etc."
          />
        </div>
      </div>
    ))}
  </div>
);
