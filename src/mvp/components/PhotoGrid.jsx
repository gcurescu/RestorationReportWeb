import React, { useState, useEffect } from 'react';
import { formatDateTime } from '../utils/formatters';
import { getPhotoBlob } from '../imageStore';

/**
 * Photo Renderer component that handles both old (file) and new (id+thumbDataUrl) photo formats
 */
const PhotoRenderer = ({ photo, alt, className, loading = "lazy" }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let objectUrl = null;

    const loadImage = async () => {
      try {
        if (photo.file) {
          // Legacy format - direct data URL
          setImageUrl(photo.file);
          setIsLoading(false);
        } else if (photo.id) {
          // New format - fetch from IndexedDB, fallback to thumbnail
          try {
            const blob = await getPhotoBlob(photo.id);
            if (blob) {
              objectUrl = URL.createObjectURL(blob);
              setImageUrl(objectUrl);
            } else if (photo.thumbDataUrl) {
              // Fallback to thumbnail if full image not available
              setImageUrl(photo.thumbDataUrl);
            }
          } catch (error) {
            console.error('Error loading photo blob:', error);
            // Fallback to thumbnail
            if (photo.thumbDataUrl) {
              setImageUrl(photo.thumbDataUrl);
            }
          }
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading photo:', error);
        setIsLoading(false);
      }
    };

    loadImage();

    // Cleanup object URL when component unmounts
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [photo.file, photo.id, photo.thumbDataUrl]);

  if (isLoading) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 ${className}`}>
        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
          Image unavailable
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      loading={loading}
    />
  );
};

/**
 * Placeholder tile component for empty photo slots
 */
const PhotoPlaceholder = ({ index, className = '' }) => {
  return (
    <div className={`relative group ${className}`}>
      <div className="aspect-w-4 aspect-h-3 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
          <svg 
            className="w-12 h-12 mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <span className="text-sm font-medium">Photo</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Photo Grid component for displaying photos in a responsive grid
 * 
 * Supports two prop styles for backward compatibility:
 * 1. Legacy: cols={{ mobile: 2, desktop: 3 }}
 * 2. New: columns={3} (uses responsive defaults)
 * 
 * Also supports placeholder tiles to fill up to a specific count
 */
export const PhotoGrid = ({ 
  photos, 
  cols, 
  columns, 
  showPlaceholders,
  className = '' 
}) => {
  // Determine column configuration
  let mobileCols, desktopCols;
  
  if (cols) {
    // Legacy cols prop - use as-is
    mobileCols = cols.mobile === 3 ? 'grid-cols-3' : 
                 cols.mobile === 4 ? 'grid-cols-4' :
                 cols.mobile === 1 ? 'grid-cols-1' : 'grid-cols-2';
    desktopCols = cols.desktop === 4 ? 'md:grid-cols-4' :
                  cols.desktop === 5 ? 'md:grid-cols-5' :
                  cols.desktop === 2 ? 'md:grid-cols-2' :
                  cols.desktop === 1 ? 'md:grid-cols-1' : 'md:grid-cols-3';
  } else if (columns) {
    // New columns prop - use for desktop, calculate mobile
    const mobileCount = columns >= 3 ? 2 : columns; // Use 2 cols on mobile for 3+ desktop cols
    mobileCols = mobileCount === 3 ? 'grid-cols-3' : 
                 mobileCount === 4 ? 'grid-cols-4' :
                 mobileCount === 1 ? 'grid-cols-1' : 'grid-cols-2';
    desktopCols = columns === 4 ? 'md:grid-cols-4' :
                  columns === 5 ? 'md:grid-cols-5' :
                  columns === 2 ? 'md:grid-cols-2' :
                  columns === 1 ? 'md:grid-cols-1' : 'md:grid-cols-3';
  } else {
    // Default fallback
    mobileCols = 'grid-cols-2';
    desktopCols = 'md:grid-cols-3';
  }

  // Prepare items array with photos and placeholders
  const photoArray = photos || [];
  const items = [...photoArray];
  
  // Add placeholders if needed
  if (showPlaceholders && items.length < showPlaceholders) {
    const placeholderCount = showPlaceholders - items.length;
    for (let i = 0; i < placeholderCount; i++) {
      items.push({ isPlaceholder: true, index: items.length + i });
    }
  }

  // Handle empty state
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">No photos available</p>
      </div>
    );
  }

  return (
    <div className={`grid ${mobileCols} ${desktopCols} gap-4 ${className}`}>
      {items.map((item, index) => {
        if (item.isPlaceholder) {
          return <PhotoPlaceholder key={`placeholder-${item.index}`} index={item.index} />;
        }
        
        const photo = item;
        return (
          <div key={index} className="relative group">
            <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
              <PhotoRenderer
                photo={photo}
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
        );
      })}
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
        <PhotoRenderer
          photo={photo}
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
            <PhotoRenderer
              photo={photo}
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
