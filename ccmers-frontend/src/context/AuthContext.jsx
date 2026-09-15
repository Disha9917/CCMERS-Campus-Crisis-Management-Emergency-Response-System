import React, { createContext, useState, useContext, useEffect } from 'react';

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

  const login = (role, userData = {}) => {
    const user = {
      role,
      name: userData.name || `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
      id: userData.id || `${role.toUpperCase()}-2023-01`,
      ...userData
    };
    setCurrentUser(user);
    localStorage.setItem('ccmers_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ccmers_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
