import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add a request interceptor to attach the JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          try {
            // Try to get a new token using the refresh token
            const response = await axios.post('http://localhost:8080/api/auth/refresh-token', {
              refreshToken
            });
            
            if (response.data?.accessToken || response.data?.token) {
              // Handle either naming convention (accessToken or token)
              const newToken = response.data?.accessToken || response.data?.token;
              
              // Save the new token
              localStorage.setItem('token', newToken);
              
              // If a new refresh token was returned, save it too
              if (response.data?.refreshToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken);
              }
              
              // Update the original request with the new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              
              // Update default headers
              api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
              
              // Retry the original request
              return api(originalRequest);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
          }
        }
        
        // If we get here, either we had no refresh token or refresh failed
        // Redirect to login page
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Only redirect if we're not already on the signin page
        if (!window.location.pathname.includes('/signin')) {
          window.location.href = '/signin';
        }
      } catch (error) {
        console.error('Error in auth interceptor:', error);
      }
    }

    // For other errors, just reject the promise
    return Promise.reject(error);
  }
);

export default api;