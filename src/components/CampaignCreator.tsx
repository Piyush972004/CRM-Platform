
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CampaignDetails from './campaign/CampaignDetails';
import AudienceSelector from './campaign/AudienceSelector';
import AIMessageGenerator from './campaign/AIMessageGenerator';
import MessageComposer from './campaign/MessageComposer';
import { useCreateCampaign, useLaunchCampaign } from '@/hooks/useCampaigns';
import { useSegments } from '@/hooks/useSegments';
import { useToast } from '@/hooks/use-toast';

const CampaignCreator = () => {
  const [campaignName, setCampaignName] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('');
  const [message, setMessage] = useState('');
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [campaignObjective, setCampaignObjective] = useState('');

  const navigate = useNavigate();
  const createCampaign = useCreateCampaign();
  const launchCampaign = useLaunchCampaign();
  const { data: segments } = useSegments();
  const { toast } = useToast();

  const generateAIMessages = async () => {
    setIsGeneratingMessage(true);
    
    // Simulate AI message generation
    setTimeout(() => {
      const messages = [
        `Hi {{name}}, we miss you! Get 20% off your next order and rediscover what you love. Shop now!`,
        `{{name}}, your favorites are waiting! Enjoy exclusive 20% savings on your next purchase. Limited time offer!`,
        `Hello {{name}}! Come back and save big with 20% off. Plus, free shipping on orders over ₹1,000!`,
      ];
      
      setSuggestedMessages(messages);
      setIsGeneratingMessage(false);
    }, 2000);
  };

  const launchCampaignHandler = async () => {
    if (!campaignName || !selectedAudience || !message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create campaign
      const campaign = await createCampaign.mutateAsync({
        name: campaignName,
        segment_id: selectedAudience,
        message,
        description: campaignObjective,
        status: 'draft'
      });

      // Launch campaign
      await launchCampaign.mutateAsync(campaign.id);

      toast({
        title: "Success!",
        description: "Campaign launched successfully!",
      });

      navigate('/campaigns');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to launch campaign.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Create Campaign</h1>
        <button
          onClick={launchCampaignHandler}
          disabled={!campaignName || !selectedAudience || !message || createCampaign.isPending || launchCampaign.isPending}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
        >
          <Send className="h-4 w-4" />
          <span>
            {createCampaign.isPending || launchCampaign.isPending ? 'Launching...' : 'Launch Campaign'}
          </span>
        </button>
      </div>

      <CampaignDetails
        campaignName={campaignName}
        setCampaignName={setCampaignName}
        campaignObjective={campaignObjective}
        setCampaignObjective={setCampaignObjective}
      />

      <AudienceSelector
        selectedAudience={selectedAudience}
        setSelectedAudience={setSelectedAudience}
        segments={segments || []}
      />

      <AIMessageGenerator
        campaignObjective={campaignObjective}
        isGeneratingMessage={isGeneratingMessage}
        suggestedMessages={suggestedMessages}
        onGenerateMessages={generateAIMessages}
        onSelectMessage={setMessage}
      />

      <MessageComposer
        message={message}
        setMessage={setMessage}
      />
    </div>
  );
};

export default CampaignCreator;
