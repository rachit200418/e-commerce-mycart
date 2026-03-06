import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('flitcart_token'));

  useEffect(() => {
    if (token) {
      getMe()
        .then(res => setUser(res.data))
        .catch(() => { localStorage.removeItem('flitcart_token'); setToken(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const loginUser = (data) => {
    localStorage.setItem('flitcart_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logoutUser = () => {
    localStorage.removeItem('flitcart_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, loginUser, logoutUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
