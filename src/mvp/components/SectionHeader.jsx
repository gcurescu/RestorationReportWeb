import React from 'react';

/**
 * Section Header component for consistent styling across the report
 */
export const SectionHeader = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center mb-2">
        <div className="bg-[#0C2D48] h-8 w-1 mr-3"></div>
        <h2 className="text-2xl font-bold text-[#0C2D48]">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-gray-600 ml-4 text-sm">{subtitle}</p>
      )}
      <div className="ml-4 mt-2 h-px bg-[#0C2D48] w-full"></div>
    </div>
  );
};

export default SectionHeader;
