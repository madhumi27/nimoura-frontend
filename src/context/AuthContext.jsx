import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem('nimoura_token');
    const savedUser = localStorage.getItem('nimoura_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await loginUser({ email, password });
      const { token, name, role } = res.data;
      localStorage.setItem('nimoura_token', token);
      localStorage.setItem('nimoura_user', JSON.stringify({ email, name, role, isAdmin: role === 'ADMIN' }));
      setUser({ email, name, role, isAdmin: role === 'ADMIN' });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Invalid email or password' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await registerUser({ name, email, password });
      const { token, role } = res.data;
      localStorage.setItem('nimoura_token', token);
      localStorage.setItem('nimoura_user', JSON.stringify({ email, name, role, isAdmin: role === 'ADMIN' }));
      setUser({ email, name, role, isAdmin: role === 'ADMIN' });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('nimoura_token');
    localStorage.removeItem('nimoura_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);