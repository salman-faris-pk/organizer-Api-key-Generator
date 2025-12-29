import { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import type { ReactNode } from 'react';
import { AuthContext, type Company } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
   const [company, setCompany] = useState<Company | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await axios.get('/dashboard');
        setCompany(res.data.company);
      } catch (err) {
        console.error('Auth failed:', err);
        localStorage.removeItem('token');
        setToken(null);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await axios.post('/login', {
      email,
      password,
    });

    const { token, company } = res.data;
    localStorage.setItem('token', token);
    setToken(token);
    setCompany(company);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await axios.post('/register', {
      name,
      email,
      password,
    });

    const { token, company } = res.data;
    localStorage.setItem('token', token);
    setToken(token);
    setCompany(company);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  const updateCompany = (updatedCompany: Partial<Company>) => {
     setCompany(prev => prev ? { ...prev, ...updatedCompany } : null);
   };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCompany(null);
    delete axios.defaults.headers.common.Authorization;
  };

  return (
    <AuthContext.Provider
      value={{
        company,
        token,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!token,
        updateCompany
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
