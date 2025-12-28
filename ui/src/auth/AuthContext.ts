import { createContext } from 'react';

export interface Company {
  id: string;
  name: string;
  email: string;
  apiKey: string;
  active: boolean;
  createdAt: string;
}

export interface AuthContextType {
  company: Company | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  updateCompany: (updatedCompany: Partial<Company>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
