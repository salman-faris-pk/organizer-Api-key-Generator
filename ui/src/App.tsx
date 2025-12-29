import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider.tsx';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ApiKey from './pages/ApiKey.tsx';
import Settings from './pages/Settings.tsx';
import Companies from './pages/Companies.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import Layout from './components/Layout.tsx';
import GitHubCallback from './pages/GitHubCallback.tsx';


function App() {


  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right"/>
        <Routes>
          
           <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />

           <Route path="/auth/github/callback" element={<GitHubCallback />} />

           <Route element={<PrivateRoute />}> 
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/api-key" element={<ApiKey />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/companies" element={<Companies />} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;