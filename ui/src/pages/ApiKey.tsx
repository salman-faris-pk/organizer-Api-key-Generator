import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiKey, FiCopy, FiRefreshCw, FiShield, FiCheck, FiLoader } from 'react-icons/fi';

const ApiKey: React.FC = () => {
  const { updateCompany } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  
  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/api-keys',{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      });
      
      setApiKey(response.data.apiKey);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error ?? 'Failed to load API key');
      } else {
        toast.error('Failed to load API key');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateNewKey = async () => {
    if (!window.confirm('Are you sure you want to generate a new API key? The old key will be invalidated.')) {
      return;
    }

    setGenerating(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate-api-key');
      const newApiKey = response.data.apiKey;
      
      setApiKey(newApiKey);
      
      if (updateCompany) {
        updateCompany({ apiKey: newApiKey });
      }
      
      toast.success(response.data.message || 'New API key generated successfully!');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error ?? 'Failed to generate API key');
      } else {
        toast.error('Failed to generate API key');
      }
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success('API key copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Key Management</h1>
          <p className="text-gray-600 mt-2">Manage your API keys for accessing our services</p>
        </div>
      </div>

      {/* Current API Key Card */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FiKey className="text-blue-600 mr-3" size={24} />
              <div>
                <h2 className="text-lg font-semibold">Current API Key</h2>
                <p className="text-sm text-gray-600">Use this key to authenticate API requests</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between">
              <code className="font-mono text-gray-800 break-all">
                {apiKey || 'No API key found'}
              </code>
              {apiKey && (
                <button
                  onClick={copyToClipboard}
                  className="ml-4 shrink-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <FiCheck className="mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <FiCopy className="mr-2" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={generateNewKey}
              disabled={generating}
              className="flex items-center px-5 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <FiRefreshCw className="mr-2" />
                  Generate New Key
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Warning: Generating a new key will invalidate your current key.
            </p>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center mb-4">
          <FiShield className="text-purple-600 mr-3" size={24} />
          <h2 className="text-lg font-semibold">How to Use Your API Key</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">1. Include in API Requests</h3>
            <p className="text-gray-600 text-sm mt-1">
              Add your API key to the Authorization header in all API requests:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mt-2">
              <code className="font-mono text-sm">
                Authorization: Bearer {apiKey.substring(0, Math.min(20, apiKey.length))}...
              </code>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">2. cURL Example</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mt-2">
              <code className="font-mono text-sm whitespace-pre">
{`curl -X GET \\
  -H "Authorization: Bearer ${apiKey}" \\
  https://api.example.com/v1/data`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">3. JavaScript Fetch Example</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mt-2">
              <code className="font-mono text-sm whitespace-pre">
{`fetch('https://api.example.com/v1/data', {
  headers: {
    'Authorization': 'Bearer ${apiKey}'
  }
})
.then(response => response.json())
.then(data => console.log(data));`}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="font-semibold text-yellow-800 mb-3">Security Best Practices</h3>
        <ul className="space-y-2 text-yellow-700">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Never share your API key publicly or commit it to version control</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Store API keys in environment variables on your server</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Rotate your API keys regularly (every 90 days recommended)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Monitor your API usage for any unusual activity</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ApiKey;