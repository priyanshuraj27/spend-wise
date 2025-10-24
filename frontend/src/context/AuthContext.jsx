import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3000/api/v1';

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const register = async (fullName, email, username, password) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          username,
          password,
        }),
      });

      const data = await response.json();
      console.log('Register response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Backend returns: { statusCode, message: { user, accessToken }, data, success }
      const userData = data.message?.user || data.data?.user;
      const accessToken = data.message?.accessToken || data.data?.accessToken;
      
      if (!accessToken || !userData) {
        throw new Error('Invalid response format from server');
      }
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(accessToken);
      setUser(userData);

      return { success: true, data: userData };
    } catch (err) {
      const errorMsg = err.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Backend returns: { statusCode, message: { user, accessToken }, data, success }
      const userData = data.message?.user || data.data?.user;
      const accessToken = data.message?.accessToken || data.data?.accessToken;
      
      if (!accessToken || !userData) {
        throw new Error('Invalid response format from server');
      }
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(accessToken);
      setUser(userData);

      return { success: true, data: userData };
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/users/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setError(null);
    }
  };

  const getCurrentUser = async () => {
    if (!token) return null;
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/current-user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        const userData = data.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
    } catch (err) {
      console.error('Get current user error:', err);
    }
    return null;
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    getCurrentUser,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
