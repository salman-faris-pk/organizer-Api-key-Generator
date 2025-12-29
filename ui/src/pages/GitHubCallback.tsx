import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { FiLoader } from 'react-icons/fi';

const GitHubCallback: React.FC = () => {
  const navigate = useNavigate();
   const location = useLocation();

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
     
    const from = (location.state)?.from?.pathname || '/dashboard';
     window.history.replaceState({}, document.title, window.location.pathname);
     navigate(from, {replace: true})
    
  } else {
    navigate('/login', { replace: true });
  }
 }, []);


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