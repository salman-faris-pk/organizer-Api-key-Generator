import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { FiLoader } from 'react-icons/fi';
import { useAuth } from '../auth/useAuth';

const GitHubCallback: React.FC = () => {
  const navigate = useNavigate();
  const { setToken }=useAuth()

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
     setToken(token)

    window.history.replaceState(null, '', '/dashboard');
     navigate('/dashboard', {replace: true})

    
  } else {
    window.history.replaceState(null, '', '/login');
    navigate('/login', { replace: true });

  }
 }, [navigate,setToken]);


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