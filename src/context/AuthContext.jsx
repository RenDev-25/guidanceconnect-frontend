import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginWithDemoAccount, logout as authLogout } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedUser = getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (role) => {
    const loggedInUser = await loginWithDemoAccount(role);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};