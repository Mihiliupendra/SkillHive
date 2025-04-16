import api from './axios';

export const userService = {
  // ... existing functions ...

  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put(`/api/users/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ... other functions ...
}; 