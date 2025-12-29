import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { FiLoader } from 'react-icons/fi';

const GitHubCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGitHubCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const apiKey = urlParams.get('apiKey');
      
      if (token && apiKey) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        window.history.replaceState({}, document.title, '/dashboard');
        
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    };

    handleGitHubCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <FiLoader className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Completing GitHub login...</p>
      </div>
    </div>
  );
};

export default GitHubCallback;