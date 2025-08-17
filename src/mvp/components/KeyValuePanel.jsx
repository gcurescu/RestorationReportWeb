import React from 'react';

/**
 * Key-Value Panel component for displaying structured data
 */
export const KeyValuePanel = ({ title, data, className = '' }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-[#0C2D48] mb-3 border-b border-gray-200 pb-2">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex flex-col sm:flex-row">
            <div className="font-medium text-gray-700 min-w-0 sm:min-w-[140px] sm:mr-4 mb-1 sm:mb-0">
              {key}:
            </div>
            <div className="text-gray-900 flex-1 break-words">
              {value || '--'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Two-panel layout for claim summary
 */
export const TwoPanelLayout = ({ leftPanel, rightPanel, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      <div>{leftPanel}</div>
      <div>{rightPanel}</div>
    </div>
  );
};

export default KeyValuePanel;
