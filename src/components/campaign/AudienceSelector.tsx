
import React from 'react';

interface Segment {
  id: string;
  name: string;
  customer_count: number | null;
}

interface AudienceSelectorProps {
  selectedAudience: string;
  setSelectedAudience: (audienceId: string) => void;
  segments: Segment[];
}

const AudienceSelector = ({ selectedAudience, setSelectedAudience, segments }: AudienceSelectorProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Audience</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {segments.map(segment => (
          <div
            key={segment.id}
            onClick={() => setSelectedAudience(segment.id)}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              selectedAudience === segment.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <h3 className="font-medium text-gray-900">{segment.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {(segment.customer_count || 0).toLocaleString()} customers
            </p>
          </div>
        ))}
        
        {segments.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No audience segments available.</p>
            <p className="text-sm text-gray-400 mt-1">Create segments in the Audience Builder first.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudienceSelector;
