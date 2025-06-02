import React, { useState } from 'react';
import { Plus, Trash2, Users, Zap, Brain, History, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCreateSegment, useGetMatchingCustomers, useSegments } from '@/hooks/useSegments';
import { useToast } from '@/hooks/use-toast';
import { Rule } from '@/types/campaign';

const SegmentBuilder = () => {
  const [rules, setRules] = useState<Rule[]>([
    { id: '1', field: 'total_spend', operator: '>', value: '10000' }
  ]);
  const [audienceName, setAudienceName] = useState('');
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [isProcessingNL, setIsProcessingNL] = useState(false);
  const [estimatedAudience, setEstimatedAudience] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const navigate = useNavigate();
  const createSegment = useCreateSegment();
  const getMatchingCustomers = useGetMatchingCustomers();
  const { data: segments = [], isLoading: segmentsLoading } = useSegments();
  const { toast } = useToast();

  const fields = [
    { value: 'total_spend', label: 'Total Spent (₹)' },
    { value: 'last_purchase', label: 'Days Since Last Purchase' },
    { value: 'total_orders', label: 'Total Orders' },
    { value: 'avg_order_value', label: 'Average Order Value (₹)' },
    { value: 'customer_since', label: 'Customer Since (days)' },
    { value: 'category', label: 'Preferred Category' },
  ];

  const operators = [
    { value: '>', label: 'Greater than' },
    { value: '<', label: 'Less than' },
    { value: '=', label: 'Equals' },
    { value: '>=', label: 'Greater than or equal' },
    { value: '<=', label: 'Less than or equal' },
    { value: 'contains', label: 'Contains' },
  ];

  const addRule = () => {
    const newRule: Rule = {
      id: Date.now().toString(),
      field: 'total_spend',
      operator: '>',
      value: '',
      logicalOperator: 'AND'
    };
    setRules([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const updateRule = (id: string, field: keyof Rule, value: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const updateEstimatedAudience = async () => {
    try {
      const customers = await getMatchingCustomers.mutateAsync(rules as any);
      setEstimatedAudience(customers.length);
    } catch (error) {
      console.error('Error estimating audience:', error);
    }
  };

  React.useEffect(() => {
    if (rules.length > 0) {
      updateEstimatedAudience();
    }
  }, [rules]);

  const processNaturalLanguage = async () => {
    setIsProcessingNL(true);
    
    setTimeout(() => {
      const nlRules = parseNaturalLanguage(naturalLanguageInput);
      setRules(nlRules);
      setIsProcessingNL(false);
      setNaturalLanguageInput('');
    }, 2000);
  };

  const parseNaturalLanguage = (input: string): Rule[] => {
    const parsedRules: Rule[] = [];
    
    if (input.toLowerCase().includes('spent over') || input.toLowerCase().includes('spend >')) {
      const match = input.match(/(\d+)/);
      if (match) {
        parsedRules.push({
          id: Date.now().toString(),
          field: 'total_spend',
          operator: '>',
          value: match[1]
        });
      }
    }
    
    if (input.toLowerCase().includes("haven't shopped") || input.toLowerCase().includes('inactive')) {
      const match = input.match(/(\d+)\s*(months?|days?)/);
      if (match) {
        const days = match[2].includes('month') ? parseInt(match[1]) * 30 : parseInt(match[1]);
        parsedRules.push({
          id: (Date.now() + 1).toString(),
          field: 'last_purchase',
          operator: '>',
          value: days.toString(),
          logicalOperator: 'AND'
        });
      }
    }
    
    return parsedRules.length > 0 ? parsedRules : [
      { id: Date.now().toString(), field: 'total_spend', operator: '>', value: '5000' }
    ];
  };

  const saveAudience = async () => {
    if (!audienceName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a segment name.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createSegment.mutateAsync({
        name: audienceName,
        rules: rules as any,
        customer_count: estimatedAudience,
        description: `Segment with ${rules.length} rule(s)`
      });

      toast({
        title: "Success!",
        description: "Customer segment created successfully.",
      });

      setAudienceName('');
      setRules([{ id: '1', field: 'total_spend', operator: '>', value: '10000' }]);
      setShowHistory(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create customer segment.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Segment Builder</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <History className="h-4 w-4" />
            <span>{showHistory ? 'Hide History' : 'Show History'}</span>
          </button>
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Estimated: {estimatedAudience.toLocaleString()} customers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Segment History */}
      {showHistory && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Segment History</h2>
          </div>
          <div className="p-6">
            {segmentsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : segments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {segments.map((segment) => (
                  <div key={segment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-gray-900 mb-2">{segment.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{segment.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600 font-medium">
                        {segment.customer_count?.toLocaleString() || 0} customers
                      </span>
                      <span className="text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(segment.created_at || '').toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No segments created yet.</p>
            )}
          </div>
        </div>
      )}

      {/* AI-Powered Segment Creation */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-6 w-6 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">AI-Powered Segment Creation</h2>
        </div>
        
        <div className="space-y-4">
          <textarea
            value={naturalLanguageInput}
            onChange={(e) => setNaturalLanguageInput(e.target.value)}
            placeholder="Describe your segment in plain English, e.g., 'People who haven't shopped in 6 months and spent over ₹5,000'"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={3}
          />
          
          <button
            onClick={processNaturalLanguage}
            disabled={!naturalLanguageInput.trim() || isProcessingNL}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
          >
            {isProcessingNL ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Generate Rules</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Manual Rule Builder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Manual Rule Builder</h2>
          <p className="text-gray-600 mt-1">Create precise customer segments with custom conditions</p>
        </div>
        
        <div className="p-6 space-y-4">
          {rules.map((rule, index) => (
            <div key={rule.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                {index > 0 && (
                  <select
                    value={rule.logicalOperator}
                    onChange={(e) => updateRule(rule.id, 'logicalOperator', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                )}
                
                <select
                  value={rule.field}
                  onChange={(e) => updateRule(rule.id, 'field', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {fields.map(field => (
                    <option key={field.value} value={field.value}>{field.label}</option>
                  ))}
                </select>
                
                <select
                  value={rule.operator}
                  onChange={(e) => updateRule(rule.id, 'operator', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {operators.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                
                <input
                  type="text"
                  value={rule.value}
                  onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                {rules.length > 1 && (
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <button
            onClick={addRule}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>Add Rule</span>
          </button>
        </div>
      </div>

      {/* Save Segment */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Customer Segment</h3>
        
        <div className="space-y-4">
          <input
            type="text"
            value={audienceName}
            onChange={(e) => setAudienceName(e.target.value)}
            placeholder="Enter segment name (e.g., High-Value Inactive Customers)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              This segment will include approximately <span className="font-semibold text-gray-900">{estimatedAudience.toLocaleString()}</span> customers
            </div>
            
            <button
              onClick={saveAudience}
              disabled={!audienceName.trim() || createSegment.isPending}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {createSegment.isPending ? 'Saving...' : 'Save Segment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegmentBuilder;
