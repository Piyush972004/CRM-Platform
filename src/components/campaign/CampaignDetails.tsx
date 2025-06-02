
import React from 'react';

interface CampaignDetailsProps {
  campaignName: string;
  setCampaignName: (name: string) => void;
  campaignObjective: string;
  setCampaignObjective: (objective: string) => void;
}

const CampaignDetails = ({
  campaignName,
  setCampaignName,
  campaignObjective,
  setCampaignObjective
}: CampaignDetailsProps) => {
  const objectives = [
    'Bring back inactive users',
    'Increase repeat purchases',
    'Promote new products',
    'Reward loyal customers',
    'Clear inventory',
    'Holiday promotion',
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Campaign Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Name
          </label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="e.g., Summer Sale 2024"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Objective
          </label>
          <select
            value={campaignObjective}
            onChange={(e) => setCampaignObjective(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select objective...</option>
            {objectives.map(objective => (
              <option key={objective} value={objective}>{objective}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
