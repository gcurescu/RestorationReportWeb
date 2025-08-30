import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

export const EquipmentReadingsStep = () => {
  const { register, control, formState: { errors } } = useFormContext();
  const [activeTab, setActiveTab] = useState('dehumidifiers');

  // Equipment field arrays
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

  // Moisture reading field arrays
  const { fields: psychFields, append: appendPsych, remove: removePsych } = useFieldArray({
    control,
    name: 'moisture.psychrometrics',
  });

  const { fields: pointFields, append: appendPoint, remove: removePoint } = useFieldArray({
    control,
    name: 'moisture.points',
  });

  const addEquipment = (type) => {
    const baseEquipment = {
      name: '',
      placedISO: '',
      removedISO: '',
      area: '',
    };

    if (type === 'dehu') {
      appendDehu({ ...baseEquipment, powerKw: 0, energyKwh: 0, days: 0 });
    } else if (type === 'mover') {
      appendMover({ ...baseEquipment, energyKwh: 0, days: 0 });
    } else if (type === 'scrubber') {
      appendScrubber({ ...baseEquipment, energyKwh: 0, days: 0 });
    }
  };

  const addPsychReading = () => {
    appendPsych({
      dateISO: '',
      location: '',
      tempF: 0,
      rh: 0,
      gpp: 0,
      grainDepression: 0,
    });
  };

  const addMoisturePoint = () => {
    appendPoint({
      point: pointFields.length + 1,
      room: '',
      surface: '',
      reading: '',
      notes: '',
    });
  };

  const tabs = [
    { id: 'dehumidifiers', name: 'Dehumidifiers', count: dehuFields.length },
    { id: 'movers', name: 'Air Movers', count: moverFields.length },
    { id: 'scrubbers', name: 'Air Scrubbers', count: scrubberFields.length },
    { id: 'psychrometric', name: 'Psychrometric', count: psychFields.length },
    { id: 'moisture', name: 'Moisture Points', count: pointFields.length },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Equipment & Readings</h2>
      
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
              {tab.name} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'dehumidifiers' && (
          <EquipmentSection
            title="Dehumidifiers"
            fields={dehuFields}
            onAdd={() => addEquipment('dehu')}
            onRemove={removeDehu}
            register={register}
            errors={errors}
            fieldPath="equipment.dehus"
            includeFields={['powerKw']}
          />
        )}

        {activeTab === 'movers' && (
          <EquipmentSection
            title="Air Movers"
            fields={moverFields}
            onAdd={() => addEquipment('mover')}
            onRemove={removeMover}
            register={register}
            errors={errors}
            fieldPath="equipment.movers"
          />
        )}

        {activeTab === 'scrubbers' && (
          <EquipmentSection
            title="Air Scrubbers"
            fields={scrubberFields}
            onAdd={() => addEquipment('scrubber')}
            onRemove={removeScrubber}
            register={register}
            errors={errors}
            fieldPath="equipment.scrubbers"
          />
        )}

        {activeTab === 'psychrometric' && (
          <PsychrometricSection
            fields={psychFields}
            onAdd={addPsychReading}
            onRemove={removePsych}
            register={register}
            errors={errors}
          />
        )}

        {activeTab === 'moisture' && (
          <MoisturePointsSection
            fields={pointFields}
            onAdd={addMoisturePoint}
            onRemove={removePoint}
            register={register}
            errors={errors}
          />
        )}
      </div>
    </div>
  );
};

const EquipmentSection = ({ title, fields, onAdd, onRemove, register, errors, fieldPath, includeFields = [] }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <button
        type="button"
        onClick={onAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
      >
        Add {title.slice(0, -1)}
      </button>
    </div>

    {fields.map((field, index) => (
      <div key={field.id} className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">{title.slice(0, -1)} #{index + 1}</h4>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Remove
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              {...register(`${fieldPath}.${index}.name`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Equipment name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Placed Date</label>
            <input
              type="datetime-local"
              {...register(`${fieldPath}.${index}.placedISO`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Removed Date</label>
            <input
              type="datetime-local"
              {...register(`${fieldPath}.${index}.removedISO`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
            <input
              type="text"
              {...register(`${fieldPath}.${index}.area`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Area/Room"
            />
          </div>

          {includeFields.includes('powerKw') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Power (kW)</label>
              <input
                type="number"
                step="0.1"
                {...register(`${fieldPath}.${index}.powerKw`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Energy (kWh)</label>
            <input
              type="number"
              step="0.1"
              {...register(`${fieldPath}.${index}.energyKwh`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
            <input
              type="number"
              {...register(`${fieldPath}.${index}.days`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const PsychrometricSection = ({ fields, onAdd, onRemove, register, errors }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-gray-900">Psychrometric Readings</h3>
      <button
        type="button"
        onClick={onAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
      >
        Add Reading
      </button>
    </div>

    {fields.map((field, index) => (
      <div key={field.id} className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Reading #{index + 1}</h4>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Remove
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="datetime-local"
              {...register(`moisture.psychrometrics.${index}.dateISO`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              {...register(`moisture.psychrometrics.${index}.location`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Location/Room"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temp (°F)</label>
            <input
              type="number"
              step="0.1"
              {...register(`moisture.psychrometrics.${index}.tempF`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RH (%)</label>
            <input
              type="number"
              step="0.1"
              {...register(`moisture.psychrometrics.${index}.rh`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GPP</label>
            <input
              type="number"
              step="0.1"
              {...register(`moisture.psychrometrics.${index}.gpp`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grain Depression</label>
            <input
              type="number"
              step="0.1"
              {...register(`moisture.psychrometrics.${index}.grainDepression`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const MoisturePointsSection = ({ fields, onAdd, onRemove, register, errors }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-gray-900">Moisture Points</h3>
      <button
        type="button"
        onClick={onAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
      >
        Add Point
      </button>
    </div>

    {fields.map((field, index) => (
      <div key={field.id} className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Point #{index + 1}</h4>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Remove
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Point #</label>
            <input
              type="number"
              {...register(`moisture.points.${index}.point`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
            <input
              type="text"
              {...register(`moisture.points.${index}.room`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Room/Area"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Surface</label>
            <input
              type="text"
              {...register(`moisture.points.${index}.surface`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Surface type"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reading</label>
            <input
              type="text"
              {...register(`moisture.points.${index}.reading`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Reading value"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <input
              type="text"
              {...register(`moisture.points.${index}.notes`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Additional notes"
            />
          </div>
        </div>
      </div>
    ))}
  </div>
);
