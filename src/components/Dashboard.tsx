
import React from 'react';
import { Users, MessageSquare, TrendingUp, Target, BarChart3, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useCustomers } from '@/hooks/useCustomers';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useSegments } from '@/hooks/useSegments';

const Dashboard = () => {
  const { data: customers = [] } = useCustomers();
  const { data: campaigns = [] } = useCampaigns();
  const { data: segments = [] } = useSegments();

  // Calculate real stats from user data
  const totalCustomers = customers.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'draft').length;
  const completedCampaigns = campaigns.filter(c => c.status === 'completed');
  const totalDelivered = completedCampaigns.reduce((sum, c) => sum + (c.delivered_count || 0), 0);
  const totalSent = completedCampaigns.reduce((sum, c) => sum + (c.sent_count || 0), 0);
  const deliveryRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : '0.0';
  const totalRevenue = customers.reduce((sum, c) => sum + (c.total_spend || 0), 0);

  const stats = [
    {
      label: 'Total Customers',
      value: totalCustomers.toLocaleString(),
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Active Campaigns',
      value: activeCampaigns.toString(),
      change: '+2',
      icon: MessageSquare,
      color: 'bg-green-500',
    },
    {
      label: 'Delivery Rate',
      value: `${deliveryRate}%`,
      change: '+1.2%',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      label: 'Revenue This Month',
      value: `₹${(totalRevenue / 100000).toFixed(1)}L`,
      change: '+18%',
      icon: DollarSign,
      color: 'bg-orange-500',
    },
  ];

  // Generate chart data from real campaigns
  const campaignData = campaigns.slice(0, 6).map((campaign, index) => ({
    month: new Date(campaign.created_at).toLocaleDateString('en-US', { month: 'short' }),
    campaigns: 1,
    delivered: campaign.delivered_count || 0,
    failed: campaign.failed_count || 0
  }));

  // If no campaigns, show placeholder data
  const chartData = campaignData.length > 0 ? campaignData : [
    { month: 'Jan', campaigns: 0, delivered: 0, failed: 0 },
    { month: 'Feb', campaigns: 0, delivered: 0, failed: 0 },
    { month: 'Mar', campaigns: 0, delivered: 0, failed: 0 },
  ];

  // Generate revenue data from customers
  const revenueData = customers.slice(0, 6).map((customer, index) => ({
    month: new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short' }),
    revenue: customer.total_spend || 0
  }));

  const chartRevenueData = revenueData.length > 0 ? revenueData : [
    { month: 'Jan', revenue: 0 },
    { month: 'Feb', revenue: 0 },
    { month: 'Mar', revenue: 0 },
  ];

  // Generate segment data
  const segmentData = segments.length > 0 ? segments.map(segment => ({
    name: segment.name,
    value: segment.customer_count || 0,
    color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color
  })) : [
    { name: 'No segments yet', value: 1, color: '#8884d8' }
  ];

  const chartConfig = {
    campaigns: { label: 'Campaigns', color: '#3b82f6' },
    delivered: { label: 'Delivered', color: '#10b981' },
    failed: { label: 'Failed', color: '#ef4444' },
    revenue: { label: 'Revenue', color: '#8b5cf6' },
  };

  // Get recent campaigns
  const recentCampaigns = campaigns
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)
    .map(campaign => ({
      name: campaign.name,
      audience: `${campaign.segments?.customer_count || 0} customers`,
      sent: campaign.sent_count || 0,
      delivered: campaign.delivered_count || 0,
      status: campaign.status === 'completed' ? 'Completed' : 'Active',
      date: new Date(campaign.created_at).toLocaleDateString(),
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your campaigns.</p>
        </div>
        <Link
          to="/campaigns/new"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          Create Campaign
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Performance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Performance</h2>
          <ChartContainer config={chartConfig} className="h-80">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="delivered" fill="var(--color-delivered)" radius={4} />
              <Bar dataKey="failed" fill="var(--color-failed)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Trend</h2>
          <ChartContainer config={chartConfig} className="h-80">
            <LineChart data={chartRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value) => [`₹${(value as number).toLocaleString()}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-revenue)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-revenue)', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>

      {/* Customer Segments and Recent Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Segments Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Segments</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  formatter={(value) => [`${(value as number).toLocaleString()}`, 'Customers']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {segmentData.map((segment, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-sm text-gray-600">{segment.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Campaigns - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Campaigns</h2>
              <Link
                to="/campaigns"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {recentCampaigns.length > 0 ? (
              recentCampaigns.map((campaign, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{campaign.audience}</p>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{campaign.sent}</div>
                        <div className="text-gray-500">Sent</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{campaign.delivered}</div>
                        <div className="text-gray-500">Delivered</div>
                      </div>
                      <div className="text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          campaign.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                      <div className="text-gray-500">{campaign.date}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No campaigns yet. Create your first campaign to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/segments"
          className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 transform hover:scale-105"
        >
          <Users className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Build Segments</h3>
          <p className="text-sm text-gray-600">Create targeted customer segments with advanced filtering</p>
        </Link>
        
        <Link
          to="/campaigns/new"
          className="bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 transform hover:scale-105"
        >
          <MessageSquare className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Create Campaign</h3>
          <p className="text-sm text-gray-600">Design and launch personalized marketing campaigns</p>
        </Link>
        
        <Link
          to="/customers"
          className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 transform hover:scale-105"
        >
          <BarChart3 className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Manage Customers</h3>
          <p className="text-sm text-gray-600">View and manage your customer database</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
