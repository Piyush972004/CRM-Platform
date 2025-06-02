
import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Key, Mail, Save } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
  });
  const [notifications, setNotifications] = useState({
    campaigns: true,
    emailReports: true,
    systemUpdates: false,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'api', label: 'API Keys', icon: Key },
  ];

  const saveProfile = () => {
    // In a real app, you would update the user profile here
    toast({
      title: "Success!",
      description: "Profile updated successfully.",
    });
  };

  const saveNotifications = () => {
    // In a real app, you would save notification preferences here
    toast({
      title: "Success!",
      description: "Notification preferences saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-4 mr-6">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200">
          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {profileData.fullName || 'User'}
                    </h3>
                    <p className="text-gray-600">{profileData.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled
                    />
                  </div>
                </div>
                
                <Button onClick={saveProfile} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h3 className="font-medium text-gray-900">Campaign Notifications</h3>
                    <p className="text-sm text-gray-600">Get notified when campaigns are completed</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.campaigns}
                    onChange={(e) => setNotifications({...notifications, campaigns: e.target.checked})}
                    className="h-4 w-4 text-blue-600" 
                  />
                </div>
                
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h3 className="font-medium text-gray-900">Email Delivery Reports</h3>
                    <p className="text-sm text-gray-600">Receive daily email delivery summaries</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.emailReports}
                    onChange={(e) => setNotifications({...notifications, emailReports: e.target.checked})}
                    className="h-4 w-4 text-blue-600" 
                  />
                </div>
                
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h3 className="font-medium text-gray-900">System Updates</h3>
                    <p className="text-sm text-gray-600">Get notified about system maintenance and updates</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.systemUpdates}
                    onChange={(e) => setNotifications({...notifications, systemUpdates: e.target.checked})}
                    className="h-4 w-4 text-blue-600" 
                  />
                </div>
                
                <Button onClick={saveNotifications} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Password</h3>
                  <p className="text-sm text-gray-600 mb-4">Change your account password</p>
                  <Button variant="outline">Change Password</Button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Active Sessions</h3>
                  <p className="text-sm text-gray-600 mb-4">Manage your active login sessions</p>
                  <Button variant="outline">View Sessions</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Integrations</h2>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Email Service Provider</h3>
                      <p className="text-sm text-gray-600">Connect your email delivery service</p>
                    </div>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Database className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Database Sync</h3>
                      <p className="text-sm text-gray-600">Sync customer data from external sources</p>
                    </div>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">API Keys</h2>
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-800 mb-2">API Access</h3>
                  <p className="text-sm text-yellow-700">Use these keys to integrate with our API. Keep them secure and never share them publicly.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Production API Key</h4>
                      <Button variant="outline" size="sm">Regenerate</Button>
                    </div>
                    <code className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      sk_prod_****************************
                    </code>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Test API Key</h4>
                      <Button variant="outline" size="sm">Regenerate</Button>
                    </div>
                    <code className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      sk_test_****************************
                    </code>
                  </div>
                </div>
                
                <Button>Create New API Key</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
