
import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

interface AIMessageGeneratorProps {
  campaignObjective: string;
  isGeneratingMessage: boolean;
  suggestedMessages: string[];
  onGenerateMessages: () => void;
  onSelectMessage: (message: string) => void;
}

const AIMessageGenerator = ({
  campaignObjective,
  isGeneratingMessage,
  suggestedMessages,
  onGenerateMessages,
  onSelectMessage
}: AIMessageGeneratorProps) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI Message Generator</h2>
        </div>
        
        <button
          onClick={onGenerateMessages}
          disabled={!campaignObjective || isGeneratingMessage}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          {isGeneratingMessage ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              <span>Generate Messages</span>
            </>
          )}
        </button>
      </div>
      
      {suggestedMessages.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">AI-Generated Message Suggestions:</h3>
          {suggestedMessages.map((suggestedMessage, index) => (
            <div
              key={index}
              onClick={() => onSelectMessage(suggestedMessage)}
              className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200"
            >
              <p className="text-gray-800">{suggestedMessage}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIMessageGenerator;
