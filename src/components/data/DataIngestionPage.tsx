
import React, { useState } from 'react';
import { Upload, Users, ShoppingCart, FileText, CheckCircle, Plus, Trash2, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useBulkCreateCustomers, useCreateCustomer } from '@/hooks/useCustomers';
import { useToast } from '@/hooks/use-toast';

const DataIngestionPage = () => {
  const [customerFile, setCustomerFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualCustomer, setManualCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    total_spend: '',
    total_orders: '',
  });
  
  const bulkCreateCustomers = useBulkCreateCustomers();
  const createCustomer = useCreateCustomer();
  const { toast } = useToast();

  const downloadSampleCSV = () => {
    const sampleData = [
      ['name', 'email', 'phone', 'total_spend', 'total_orders', 'last_order_date'],
      ['John Doe', 'john@example.com', '+1234567890', '5000', '10', '2024-01-15'],
      ['Jane Smith', 'jane@example.com', '+9876543210', '3500', '7', '2024-01-10'],
      ['Bob Johnson', 'bob@example.com', '', '1200', '3', '2023-12-20']
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + sampleData.map(row => row.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded!",
      description: "Sample CSV file downloaded successfully.",
    });
  };

  const validateCustomerData = (customers: any[]) => {
    const errors: string[] = [];
    
    customers.forEach((customer, index) => {
      if (!customer.name || !customer.email) {
        errors.push(`Row ${index + 2}: Name and email are required`);
      }
      if (customer.email && !/\S+@\S+\.\S+/.test(customer.email)) {
        errors.push(`Row ${index + 2}: Invalid email format`);
      }
      if (customer.total_spend && isNaN(parseFloat(customer.total_spend))) {
        errors.push(`Row ${index + 2}: Total spend must be a number`);
      }
      if (customer.total_orders && isNaN(parseInt(customer.total_orders))) {
        errors.push(`Row ${index + 2}: Total orders must be a number`);
      }
    });
    
    return errors;
  };

  const handleCustomerUpload = async (file: File) => {
    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const customers = lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',').map(v => v.trim());
      return {
        name: values[headers.indexOf('name')] || '',
        email: values[headers.indexOf('email')] || '',
        phone: values[headers.indexOf('phone')] || null,
        total_spend: parseFloat(values[headers.indexOf('total_spend')] || '0'),
        total_orders: parseInt(values[headers.indexOf('total_orders')] || '0'),
        last_order_date: values[headers.indexOf('last_order_date')] || null,
      };
    });

    return customers;
  };

  const handleFileSelect = async (file: File) => {
    setCustomerFile(file);
    try {
      const customers = await handleCustomerUpload(file);
      setPreviewData(customers.slice(0, 5)); // Show first 5 rows for preview
      const errors = validateCustomerData(customers);
      setValidationErrors(errors);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse CSV file. Please check the format.",
        variant: "destructive",
      });
    }
  };

  const handleBulkUpload = async () => {
    if (!customerFile) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const customers = await handleCustomerUpload(customerFile);
      const errors = validateCustomerData(customers);
      
      if (errors.length > 0) {
        toast({
          title: "Validation Error",
          description: `${errors.length} errors found. Please fix them first.`,
          variant: "destructive",
        });
        setUploading(false);
        return;
      }
      
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      await bulkCreateCustomers.mutateAsync(customers);
      setUploadProgress(100);
      
      toast({
        title: "Success!",
        description: `Uploaded ${customers.length} customers successfully.`,
      });
      
      setCustomerFile(null);
      setPreviewData([]);
      setValidationErrors([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload data. Please check your file format.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualCustomer.name || !manualCustomer.email) {
      toast({
        title: "Error",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCustomer.mutateAsync({
        name: manualCustomer.name,
        email: manualCustomer.email,
        phone: manualCustomer.phone || null,
        total_spend: parseFloat(manualCustomer.total_spend) || 0,
        total_orders: parseInt(manualCustomer.total_orders) || 0,
      });

      toast({
        title: "Success!",
        description: "Customer added successfully.",
      });

      setManualCustomer({
        name: '',
        email: '',
        phone: '',
        total_spend: '',
        total_orders: '',
      });
      setShowManualForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add customer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Data Management</h1>
        <div className="flex items-center space-x-3">
          <Button
            onClick={downloadSampleCSV}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Sample CSV</span>
          </Button>
          <Button
            onClick={() => setShowManualForm(!showManualForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Customer Manually
          </Button>
        </div>
      </div>

      {/* Manual Customer Form */}
      {showManualForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Add Customer Manually</span>
            </CardTitle>
            <CardDescription>
              Add a single customer to your database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={manualCustomer.name}
                  onChange={(e) => setManualCustomer({...manualCustomer, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Customer name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={manualCustomer.email}
                  onChange={(e) => setManualCustomer({...manualCustomer, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="customer@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={manualCustomer.phone}
                  onChange={(e) => setManualCustomer({...manualCustomer, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Spent (₹)
                </label>
                <input
                  type="number"
                  value={manualCustomer.total_spend}
                  onChange={(e) => setManualCustomer({...manualCustomer, total_spend: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Orders
                </label>
                <input
                  type="number"
                  value={manualCustomer.total_orders}
                  onChange={(e) => setManualCustomer({...manualCustomer, total_orders: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button onClick={handleManualSubmit} disabled={createCustomer.isPending}>
                {createCustomer.isPending ? 'Adding...' : 'Add Customer'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowManualForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Bulk Customer Upload</span>
            </CardTitle>
            <CardDescription>
              Upload CSV file with customer information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Drop your CSV file here or click to browse
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="customer-upload"
                />
                <label htmlFor="customer-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
              </div>
            </div>
            
            {customerFile && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>{customerFile.name}</span>
                </div>
                
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                {validationErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-red-800 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Validation Errors:</span>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {validationErrors.slice(0, 5).map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                      {validationErrors.length > 5 && (
                        <li>... and {validationErrors.length - 5} more errors</li>
                      )}
                    </ul>
                  </div>
                )}
                
                {previewData.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-2">Preview (First 5 rows):</h4>
                    <div className="text-xs space-y-1">
                      {previewData.map((customer, index) => (
                        <div key={index} className="text-gray-600">
                          {customer.name} - {customer.email} - ₹{customer.total_spend}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="text-xs text-gray-500">
              <p className="font-medium mb-1">Required columns:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>name</li>
                <li>email</li>
                <li>phone (optional)</li>
                <li>total_spend</li>
                <li>total_orders</li>
                <li>last_order_date (optional)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>API Documentation</span>
            </CardTitle>
            <CardDescription>
              Use our REST APIs to import data programmatically
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Customer Import API</h4>
              <code className="text-sm text-gray-600 block">
                POST /api/customers/bulk
              </code>
              <p className="text-xs text-gray-500 mt-1">
                Bulk import customer data with JSON payload
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Orders Import API</h4>
              <code className="text-sm text-gray-600 block">
                POST /api/orders/bulk
              </code>
              <p className="text-xs text-gray-500 mt-1">
                Bulk import order data with JSON payload
              </p>
            </div>

            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              View Full API Documentation
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Ready to upload?</h3>
              <p className="text-sm text-gray-600">
                {customerFile ? `${customerFile.name} selected` : 'No files selected'}
                {validationErrors.length > 0 && ` - ${validationErrors.length} validation errors`}
              </p>
            </div>
            <Button 
              onClick={handleBulkUpload}
              disabled={!customerFile || uploading || validationErrors.length > 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {uploading ? 'Uploading...' : 'Upload Data'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataIngestionPage;
