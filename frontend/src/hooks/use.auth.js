import { useState } from 'react';
import { login, register, logout } from '../api/auth';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await login(credentials);
      localStorage.setItem('accessToken', res.data.token);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await register(userData);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, handleRegister, handleLogout: logout, loading, error };
}
