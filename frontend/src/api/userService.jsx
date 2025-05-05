import api from './axios';

export const userService = {
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error.response?.data || error.message;
    }
  },

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

  getPendingFriendRequestStatus: async (userId, otherUserId) => {
    try {
      const [sentRequests, receivedRequests] = await Promise.all([
        api.get(`/api/users/${userId}/friend-requests/sent`),
        api.get(`/api/users/${userId}/friend-requests/received`)
      ]);
      
      // Check both sender and receiver IDs in both sent and received requests
      const hasSentPending = sentRequests.data.some(request => {
        const receiverId = request.receiver?.id || request.receiverId;
        return receiverId === otherUserId;
      });
      
      const hasReceivedPending = receivedRequests.data.some(request => {
        const senderId = request.sender?.id || request.senderId;
        return senderId === otherUserId;
      });
      
      return hasSentPending || hasReceivedPending;
    } catch (error) {
      console.error('Error checking friend request status:', error);
      throw error.response?.data || error.message;
    }
  },

  
};