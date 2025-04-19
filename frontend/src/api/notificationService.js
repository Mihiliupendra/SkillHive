import api from './axios' // Axios instance with baseURL and interceptors configured

const notificationService = {
  getNotifications: async (userId, page = 0, size = 10, filter = "all") => {
    try {
      const response = await api.get('/api/notifications', {
        params: { userId, page, size, filter },
      })
      return response.data
    } catch (error) {
      console.error("Error fetching notifications:", error)
      throw error.response?.data?.message || "Failed to fetch notifications"
    }
  },

  markNotificationAsRead: async (notificationId) => {
    try {
      await api.put(`/api/notifications/${notificationId}/read`)
    } catch (error) {
      console.error("Error marking notification as read:", error)
      throw error.response?.data?.message || "Failed to mark notification as read"
    }
  },

  markAllNotificationsAsRead: async (userId) => {
    try {
      await api.put('/api/notifications/read-all', { userId })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      throw error.response?.data?.message || "Failed to mark all notifications as read"
    }
  },

  getUnreadCount: async (userId) => {
    try {
      const response = await api.get('/api/notifications/unread-count', {
        params: { userId },
      })
      return response.data.count
    } catch (error) {
      console.error("Error getting unread count:", error)
      throw error.response?.data?.message || "Failed to get unread count"
    }
  },
}

export default notificationService
