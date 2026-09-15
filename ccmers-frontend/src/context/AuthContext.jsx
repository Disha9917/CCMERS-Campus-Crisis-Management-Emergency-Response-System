import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiRequest } from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ccmers_user');
      return savedUser ? JSON.parse(savedUser) : { role: 'student', name: 'Student User', id: 'STU-2023-4412' };
    } catch {
      return { role: 'student', name: 'Student User', id: 'STU-2023-4412' };
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('ccmers_token') || '');

  const login = async (role, userData = {}) => {
    try {
      // Attempt API backend login
      const res = await apiRequest('/auth/login', 'POST', {
        email: userData.email || `${role}@campus.edu`,
        password: userData.password || 'password123',
        role
      });

      if (res.ok && res.data && res.data.token) {
        const user = {
          ...res.data.user,
          role: res.data.user.role || role,
          id: res.data.user.id || res.data.user.userId || `${role.toUpperCase()}-2023-01`
        };
        setCurrentUser(user);
        setToken(res.data.token);
        localStorage.setItem('ccmers_user', JSON.stringify(user));
        localStorage.setItem('ccmers_token', res.data.token);
        return { success: true, user };
      }
    } catch (e) {
      console.warn('Backend login fallback used', e);
    }

    // Fallback local state setting
    const user = {
      role,
      name: userData.name || `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
      id: userData.id || `${role.toUpperCase()}-2023-01`,
      ...userData
    };
    setCurrentUser(user);
    localStorage.setItem('ccmers_user', JSON.stringify(user));
    return { success: true, user };
  };

  const logout = () => {
    setCurrentUser(null);
    setToken('');
    localStorage.removeItem('ccmers_user');
    localStorage.removeItem('ccmers_token');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
