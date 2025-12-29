import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import axios from '../utils/axiosConfig';
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
      const response = await axios.get('/api-keys',{
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
      const response = await axios.post('/generate-api-key');
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-0 sm:px-2 lg:px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Key Management</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage your API keys for accessing our services</p>
        </div>
      </div>

      {/* Current API Key Card */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center">
              <FiKey className="text-blue-600 mr-3 shrink-0" size={24} />
              <div>
                <h2 className="text-lg font-semibold">Current API Key</h2>
                <p className="text-sm text-gray-600">Use this key to authenticate API requests</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <code className="font-mono text-gray-800 break-all text-sm sm:text-base">
                {apiKey || 'No API key found'}
              </code>
              {apiKey && (
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="shrink-0 flex items-center justify-center sm:justify-start px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors min-w-11 sm:min-w-auto"
                    aria-label={copied ? "Copied" : "Copy API key"}
                  >
                    {copied ? (
                      <>
                        <FiCheck className="sm:mr-2" />
                        <span className="hidden sm:inline">Copied</span>
                      </>
                    ) : (
                      <>
                        <FiCopy className="sm:mr-2" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={generateNewKey}
                    disabled={generating}
                    className="shrink-0 flex items-center justify-center sm:justify-start px-3 sm:px-5 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-11 sm:min-w-auto"
                    aria-label={generating ? "Generating..." : "Generate new API key"}
                  >
                    {generating ? (
                      <>
                        <FiLoader className="animate-spin sm:mr-2" />
                        <span className="hidden sm:inline">Generating...</span>
                      </>
                    ) : (
                      <>
                        <FiRefreshCw className="sm:mr-2" />
                        <span className="hidden sm:inline">Generate New Key</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {apiKey && (
            <div className="mt-4 sm:mt-6">
              <p className="text-sm text-gray-500">
                Warning: Generating a new key will invalidate your current key.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <FiShield className="text-purple-600 mr-3 shrink-0" size={24} />
          <h2 className="text-lg font-semibold">How to Use Your API Key</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 text-sm sm:text-base">1. Include in API Requests</h3>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">
              Add your API key to the X-API-KEY header in all API requests:
            </p>
            <div className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg mt-2 overflow-x-auto">
              <code className="font-mono text-xs sm:text-sm">
                X-API-KEY: {apiKey.substring(0, Math.min(20, apiKey.length))}...
              </code>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 text-sm sm:text-base">2. cURL Example</h3>
            <div className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg mt-2 overflow-x-auto">
              <code className="font-mono text-xs sm:text-sm whitespace-pre">
{`curl -X GET \\
  -H "X-API-KEY: ${apiKey}" \\
  https://api.example.com/v1/data`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 text-sm sm:text-base">3. JavaScript Fetch Example</h3>
            <div className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg mt-2 overflow-x-auto">
              <code className="font-mono text-xs sm:text-sm whitespace-pre">
{`fetch('https://api.example.com/v1/data', {
  headers: {
    'X-API-KEY': '${apiKey}'
  }
})
.then(response => response.json())
.then(data => console.log(data));`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 text-sm sm:text-base">4. Python Requests Example</h3>
            <div className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg mt-2 overflow-x-auto">
              <code className="font-mono text-xs sm:text-sm whitespace-pre">
{`import requests

headers = {
    'X-API-KEY': '${apiKey}'
}

response = requests.get('https://api.example.com/v1/data', headers=headers)
print(response.json())`}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold text-yellow-800 mb-3 text-sm sm:text-base">Security Best Practices</h3>
        <ul className="space-y-2 text-yellow-700 text-xs sm:text-sm">
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







