
import React from 'react';
import { Eye } from 'lucide-react';

interface MessageComposerProps {
  message: string;
  setMessage: (message: string) => void;
}

const MessageComposer = ({ message, setMessage }: MessageComposerProps) => {
  const previewMessage = (messageText: string) => {
    return messageText
      .replace(/\{\{name\}\}/g, 'Rajesh Kumar')
      .replace(/\{\{totalSpent\}\}/g, '₹15,420')
      .replace(/\{\{lastPurchase\}\}/g, 'December 15, 2024');
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Compose Message</h2>
        
        <div className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your personalized message here. Use {{name}} for customer name personalization."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Available variables:</span> {"{{name}}, {{totalSpent}}, {{lastPurchase}}"}
            </div>
            
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
              <Eye className="h-4 w-4" />
              <span>Preview Message</span>
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Preview</h3>
          <div className="bg-white rounded-lg border border-gray-300 p-4">
            <p className="text-gray-800">
              {previewMessage(message)}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageComposer;
