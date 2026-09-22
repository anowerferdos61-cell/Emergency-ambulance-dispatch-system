import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate current user profile if token exists
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          const userData = {
            id: res.data.id,
            username: res.data.username,
            email: res.data.email,
            role: res.data.role,
            phone_number: res.data.phone_number,
            is_verified: res.data.is_verified,
            driving_license: res.data.driving_license,
            vehicle_number: res.data.vehicle_number,
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        })
        .catch(() => {
          logout(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      // FastAPI OAuth2PasswordRequestForm expects URLSearchParams or FormData
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const res = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const accessToken = res.data.access_token;
      const userData = {
        id: res.data.user_id,
        username: res.data.username,
        role: res.data.role,
        is_verified: res.data.is_verified,
      };

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);

      toast.success(`Welcome back, ${userData.username}!`);
      return userData;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Invalid username or password';
      toast.error(msg);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const res = await api.post('/auth/signup', userData);
      toast.success(res.data?.message || 'Account created successfully! Please login.');
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Signup failed. Please try again.';
      toast.error(msg);
      throw error;
    }
  };

  const logout = (showToast = true) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    if (showToast) {
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      const updated = res.data.user;
      const userData = {
        id: updated.id,
        username: updated.username,
        email: updated.email,
        role: updated.role,
        phone_number: updated.phone_number,
        driving_license: updated.driving_license,
        vehicle_number: updated.vehicle_number,
        is_verified: updated.is_verified,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success(res.data?.message || 'Profile updated successfully!');
      return updated;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Failed to update profile';
      toast.error(msg);
      throw error;
    }
  };

  const changePassword = async (current_password, new_password) => {
    try {
      const res = await api.put('/auth/change-password', {
        current_password,
        new_password,
      });
      toast.success(res.data?.message || 'Password changed successfully!');
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Failed to change password';
      toast.error(msg);
      throw error;
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
