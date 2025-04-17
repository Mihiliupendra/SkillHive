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

  sendFriendRequest: async (senderId, receiverId) => {
    try {
      const response = await api.post(`/api/users/${senderId}/friend-request/${receiverId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  cancelFriendRequest: async (senderId, receiverId) => {
    try {
      const response = await api.delete(`/api/users/${senderId}/friend-request/${receiverId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  acceptFriendRequest: async (requestId) => {
    try {
      const response = await api.post(`/api/users/friend-requests/${requestId}/accept`);
      return response.data;
    } catch (error) {
      console.error('Accept friend request error:', error);
      throw error.response?.data || error.message;
    }
  },

  declineFriendRequest: async (requestId) => {
    try {
      const response = await api.post(`/api/users/friend-requests/${requestId}/decline`);
      return response.data;
    } catch (error) {
      console.error('Decline friend request error:', error);
      throw error.response?.data || error.message;
    }
  },

  getPendingSentFriendRequests: async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}/friend-requests/sent`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPendingReceivedFriendRequests: async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}/friend-requests/received`);
      console.log('Received friend requests response:', response);
      return response.data;
    } catch (error) {
      console.error('Get received friend requests error:', error);
      throw error.response?.data || error.message;
    }
  },

  // ... other functions ...
}; 