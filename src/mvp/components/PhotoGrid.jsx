import React from 'react';
import { formatDateTime } from '../utils/formatters';

/**
 * Photo Grid component for displaying photos in a responsive grid
 */
export const PhotoGrid = ({ photos, cols = { mobile: 2, desktop: 3 }, className = '' }) => {
  if (!photos || photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">No photos available</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-${cols.mobile} md:grid-cols-${cols.desktop} gap-4 ${className}`}>
      {photos.map((photo, index) => (
        <div key={index} className="relative group">
          <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={photo.file}
              alt={photo.caption || `Photo ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          {(photo.caption || photo.timeISO) && (
            <div className="mt-2 text-sm">
              {photo.caption && (
                <p className="text-gray-700 font-medium truncate" title={photo.caption}>
                  {photo.caption}
                </p>
              )}
              {photo.timeISO && (
                <p className="text-gray-500 text-xs">
                  {formatDateTime(photo.timeISO)}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Single Photo component for larger displays
 */
export const PhotoSingle = ({ photo, className = '' }) => {
  if (!photo) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">No photo available</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={photo.file}
          alt={photo.caption || 'Photo'}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </div>
      {(photo.caption || photo.timeISO) && (
        <div className="mt-2 text-sm">
          {photo.caption && (
            <p className="text-gray-700 font-medium">{photo.caption}</p>
          )}
          {photo.timeISO && (
            <p className="text-gray-500 text-xs">
              {formatDateTime(photo.timeISO)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Photo Upload Preview component for forms
 */
export const PhotoUploadPreview = ({ photos, onRemove, className = '' }) => {
  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 ${className}`}>
      {photos.map((photo, index) => (
        <div key={index} className="relative group">
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={photo.file}
              alt={photo.caption || `Upload ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove photo"
            >
              ×
            </button>
          )}
          <div className="mt-1">
            <input
              type="text"
              placeholder="Caption..."
              value={photo.caption || ''}
              onChange={(e) => {
                if (onRemove) {
                  // This would typically be handled by the parent component
                  console.log('Caption change:', index, e.target.value);
                }
              }}
              className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
