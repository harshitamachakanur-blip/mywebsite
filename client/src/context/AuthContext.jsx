import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Use proxy (set in client/package.json) so /api/* → localhost:5000
const API = axios.create({ baseURL: 'http://localhost:5000' });

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token    = localStorage.getItem('agrifert_token');
    const userData = localStorage.getItem('agrifert_user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        localStorage.removeItem('agrifert_token');
        localStorage.removeItem('agrifert_user');
      }
    }
    setLoading(false);
  }, []);

  const persistSession = (token, user) => {
    localStorage.setItem('agrifert_token', token);
    localStorage.setItem('agrifert_user', JSON.stringify(user));
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
  };

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/api/auth/login', { email, password });
      // Backend returns { success, token, user }
      if (!data.success) throw new Error(data.message);
      persistSession(data.token, data.user);
      toast.success('Login successful! Welcome back 🌱');
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Login failed';
      toast.error(msg);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await API.post('/api/auth/register', { name, email, password });
      if (!data.success) throw new Error(data.message);
      persistSession(data.token, data.user);
      toast.success('Account created successfully! 🎉');
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(msg);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('agrifert_token');
    localStorage.removeItem('agrifert_user');
    delete API.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('agrifert_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
