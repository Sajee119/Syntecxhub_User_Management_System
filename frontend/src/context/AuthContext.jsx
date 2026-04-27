/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const toast = useToast();
  const initialToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(initialToken));
  const [token, setToken] = useState(initialToken);

  useEffect(() => {
    if (!token) {
      return;
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        delete api.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password, rememberMe) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;
      
      setToken(accessToken);
      setUser(user);
      
      if (rememberMe) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
      }
      
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      toast.success('Login successful');
      toast.info(`Welcome, ${user?.name || 'User'}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
    let logoutFailed = false;

    if (refreshToken) {
      try {
        await api.post('/auth/logout', { refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
        logoutFailed = true;
      }
    }
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);

    if (logoutFailed) {
      toast.error('Logout request failed, but local session was cleared');
      return;
    }

    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};