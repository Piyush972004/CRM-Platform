
import React, { useState } from 'react';
import { BarChart3, TrendingUp, Eye, Filter, Download } from 'lucide-react';
import { useCampaigns } from '@/hooks/useCampaigns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const CampaignHistory = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const { data: campaigns = [], isLoading } = useCampaigns();
  const { toast } = useToast();
  
  const filteredCampaigns = campaigns.filter(campaign => 
    filterStatus === 'all' || campaign.status.toLowerCase() === filterStatus
  );

  const totalStats = {
    totalCampaigns: campaigns.length,
    totalSent: campaigns.reduce((sum, c) => sum + (c.sent_count || 0), 0),
    totalDelivered: campaigns.reduce((sum, c) => sum + (c.delivered_count || 0), 0),
    avgDeliveryRate: campaigns.length > 0 
      ? campaigns.reduce((sum, c) => {
          const rate = c.sent_count ? (c.delivered_count || 0) / c.sent_count * 100 : 0;
          return sum + rate;
        }, 0) / campaigns.length 
      : 0,
  };

  const exportCampaigns = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Status,Segment,Messages Sent,Delivered,Failed,Delivery Rate,Created Date,Sent Date\n"
      + filteredCampaigns.map(campaign => {
          const deliveryRate = campaign.sent_count 
            ? ((campaign.delivered_count || 0) / campaign.sent_count * 100).toFixed(1)
            : '0';
          return `"${campaign.name}","${campaign.status}","${campaign.segments?.name || 'Unknown'}",${campaign.sent_count || 0},${campaign.delivered_count || 0},${campaign.failed_count || 0},"${deliveryRate}%","${campaign.created_at || ''}","${campaign.sent_at || ''}"`;
        }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "campaigns.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success!",
      description: "Campaign data exported successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Campaign History</h1>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={exportCampaigns}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-lg"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Campaigns</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalStats.totalCampaigns}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Messages Sent</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalStats.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalStats.totalDelivered.toLocaleString()}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Delivery Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalStats.avgDeliveryRate.toFixed(1)}%</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Filter className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">AI Campaign Insights</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• Your campaigns achieve an average delivery rate of {totalStats.avgDeliveryRate.toFixed(1)}%</p>
          <p>• Total of {totalStats.totalCampaigns} campaigns launched with {totalStats.totalSent.toLocaleString()} messages sent</p>
          <p>• Recommended: Monitor delivery rates and optimize messaging for better engagement</p>
          <p>• Consider A/B testing message length and timing for optimal results</p>
        </div>
      </div>

      {/* Campaign List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Campaign Details</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredCampaigns.map((campaign) => {
            const deliveryRate = campaign.sent_count 
              ? ((campaign.delivered_count || 0) / campaign.sent_count * 100).toFixed(1) + '%'
              : '0%';
            
            return (
              <div key={campaign.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        campaign.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : campaign.status === 'active'
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Audience:</span>
                        <div className="font-medium text-gray-900">{campaign.segments?.name || 'Unknown'}</div>
                        <div className="text-gray-500">{(campaign.segments?.customer_count || 0).toLocaleString()} customers</div>
                      </div>
                      
                      <div>
                        <span className="text-gray-500">Sent:</span>
                        <div className="font-medium text-gray-900">{(campaign.sent_count || 0).toLocaleString()}</div>
                        <div className="text-gray-500">messages</div>
                      </div>
                      
                      <div>
                        <span className="text-gray-500">Delivered:</span>
                        <div className="font-medium text-green-600">{(campaign.delivered_count || 0).toLocaleString()}</div>
                        <div className="text-gray-500">({deliveryRate})</div>
                      </div>
                      
                      <div>
                        <span className="text-gray-500">Failed:</span>
                        <div className="font-medium text-red-600">{campaign.failed_count || 0}</div>
                        <div className="text-gray-500">messages</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm">
                      <span className="text-gray-500">Message:</span>
                      <div className="text-gray-700 italic mt-1">"{campaign.message}"</div>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-500">
                      Created on {new Date(campaign.created_at || '').toLocaleDateString()}
                      {campaign.sent_at && ` • Sent on ${new Date(campaign.sent_at).toLocaleDateString()}`}
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: deliveryRate }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-center">
                      {deliveryRate} delivered
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredCampaigns.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-500">No campaigns found.</p>
              <p className="text-sm text-gray-400 mt-1">Create your first campaign to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignHistory;
