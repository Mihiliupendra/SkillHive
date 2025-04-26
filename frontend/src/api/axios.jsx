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
    const token = localStorage.getItem('skillhive-jwt');
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
    // const originalRequest = error.config;

    // // If the error is a 401 and we haven't tried to refresh the token yet
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;

    //   try {
    //     // Try to refresh the token
    //     const response = await api.post('/api/v1/auth/refresh-token');
    //     const { token } = response.data;
        
    //     // Save the new token
    //     localStorage.setItem('token', token);
        
    //     // Update the original request with the new token
    //     originalRequest.headers.Authorization = `Bearer ${token}`;
        
    //     // Retry the original request
    //     return api(originalRequest);
    //   } catch (refreshError) {
    //     // If refresh token fails, logout the user
    //     localStorage.removeItem('token');
    //     window.location.href = '/signin';
    //     return Promise.reject(refreshError);
    //   }
    // }

    // // For other errors, just reject the promise
    // return Promise.reject(error);
  }
);

export default api; 