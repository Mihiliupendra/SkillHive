// src/services/chatService.js
import api from '../api/axios';
import websocketService from './websocketService';

export const chatService = {
  // Get chat messages for a community with pagination
  getCommunityMessages: async (communityId, page = 0, size = 20) => {
    try {
      const response = await api.get(`/api/chat/community/${communityId}?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return { content: [], totalPages: 0 }; // Return empty result object on error
    }
  },

  // Get recent chat messages for a community
  getRecentCommunityMessages: async (communityId) => {
    try {
      const response = await api.get(`/api/chat/community/${communityId}/recent`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent chat messages:', error);
      return []; // Return empty array instead of throwing to prevent UI errors
    }
  },

  // Send a chat message via REST API
  sendMessage: async (communityId, message) => {
    try {
      const response = await api.post(`/api/chat/community/${communityId}`, message);
      return response.data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  },

  // Send a chat message via WebSocket with fallback to REST API
  sendMessageWs: (message) => {
    // Ensure the websocket service is connected or attempting to connect
    if (!websocketService.connected) {
      websocketService.connect();
    }
    
    const success = websocketService.sendMessage('/app/chat.sendMessage', message);
    
    if (!success) {
      // Fallback to REST API if WebSocket send fails
      console.log('WebSocket send failed, falling back to REST API');
      chatService.sendMessage(message.communityId, message)
        .then(response => console.log('Message sent via REST API fallback:', response))
        .catch(err => console.error('Failed to send message via REST fallback:', err));
    }
  },

  // Subscribe to community chat messages with error handling
  subscribeToCommunityChat: (communityId, callback) => {
    try {
      websocketService.subscribe(`/topic/community/${communityId}`, callback);
    } catch (error) {
      console.error('Error subscribing to community chat:', error);
    }
  },
  
  // Unsubscribe from community chat messages with error handling
  unsubscribeFromCommunityChat: (communityId) => {
    try {
      websocketService.unsubscribe(`/topic/community/${communityId}`);
    } catch (error) {
      console.error('Error unsubscribing from community chat:', error);
    }
  }
};

export default chatService;