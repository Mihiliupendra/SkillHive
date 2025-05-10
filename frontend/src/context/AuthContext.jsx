import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Create the context and export it directly
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        const userData = localStorage.getItem('user');
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Set Authorization header if token exists
          if (token) {
            api.defaults.headers.common['Authorization'] = token.startsWith('Bearer ') 
              ? token 
              : `Bearer ${token}`;
            
            // Verify token and refresh user data
            try {
              const response = await api.get(`/api/users/${parsedUser.id}/profile`);
              if (response.data) {
                const updatedUser = { ...parsedUser, ...response.data };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
              }
            } catch (error) {
              console.error('Error refreshing user data:', error);
              
              // If token is invalid but we have refresh token, try to get new token
              if (error.response?.status === 401 && refreshToken) {
                try {
                  const refreshResponse = await axios.post('http://localhost:8080/api/auth/refresh-token', {
                    refreshToken
                  });
                  
                  if (refreshResponse.data?.token) {
                    // Update tokens
                    const newToken = refreshResponse.data.token;
                    localStorage.setItem('token', newToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                    
                    // Retry fetching user data
                    const retryResponse = await api.get(`/api/users/${parsedUser.id}/profile`);
                    if (retryResponse.data) {
                      const updatedUser = { ...parsedUser, ...retryResponse.data };
                      setUser(updatedUser);
                      localStorage.setItem('user', JSON.stringify(updatedUser));
                    }
                  } else {
                    // If refresh failed, logout
                    await logout();
                  }
                } catch (refreshError) {
                  console.error('Token refresh failed:', refreshError);
                  await logout();
                }
              } else if (error.response?.status === 401) {
                // If no refresh token or other issue, logout
                await logout();
              }
            }
          } else if (refreshToken) {
            // Try to get a new token using refresh token
            try {
              const refreshResponse = await axios.post('http://localhost:8080/api/auth/refresh-token', {
                refreshToken
              });
              
              if (refreshResponse.data?.token) {
                // Set new token
                const newToken = refreshResponse.data.token;
                localStorage.setItem('token', newToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                
                // Fetch user data
                const response = await api.get(`/api/users/${parsedUser.id}/profile`);
                if (response.data) {
                  const updatedUser = { ...parsedUser, ...response.data };
                  setUser(updatedUser);
                  localStorage.setItem('user', JSON.stringify(updatedUser));
                }
              } else {
                await logout();
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              await logout();
            }
          } else {
            // No tokens, logout
            await logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);const login = async (userData) => {
    try {
      // Extract tokens - support both naming conventions
      const token = userData.accessToken || userData.token || '';
      const refreshToken = userData.refreshToken || '';
      
      // Store tokens separately
      if (token) {
        localStorage.setItem('token', token);
      }
      
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      // Remove tokens from the user object before storing
      const { token: _token, accessToken: _access, refreshToken: _refresh, tokenType: _type, ...userDataWithoutTokens } = userData;
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(userDataWithoutTokens));
      setUser(userDataWithoutTokens);

      // Set the token in axios defaults
      api.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
      
      // Initialize websocket connection if available
      if (window.websocketService) {
        window.websocketService.connect();
      }
      
      console.log('Login successful. User data stored.');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };const logout = async () => {
    try {
      // Try to call the logout API endpoint to invalidate tokens on the server
      try {
        await api.post('/api/auth/logout');
      } catch (apiError) {
        console.error('Error calling logout API:', apiError);
        // Continue with local logout even if API call fails
      }
      
      // Clear auth state
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];
      
      // Disconnect websocket if available
      if (window.websocketService) {
        window.websocketService.disconnect();
      }
      
      // Redirect to signin
      navigate('/signin');
      
      console.log('Logout successful. All authentication data cleared.');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 

console.log('AuthContext instance ID:', Math.random()); // Should log ONCE