// src/services/notificationService.js
import api from '../api/axios';


export const notificationService = {
  // Get unread notifications
  getUnreadNotifications: async () => {
    try {
      const response = await api.get('/api/notifications/unread');
      console.log('Unread notifications:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  },

//   // Get notification history
//   // filepath: c:\Users\mihil\OneDrive\Desktop\test2\frontend\src\services\notificationService.js
getNotificationHistory: async (page = 0, size = 10) => {
  try {
    const response = await api.get(`/api/notifications?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notification history:', error);
    throw error;
  }
},

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
       console.log('Marking as read notificationId:', notificationId); // Add this line
      const response = await api.put(`/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.put('/api/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
};