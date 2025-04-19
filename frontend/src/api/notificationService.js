import { API_BASE_URL } from "../config"
import api from './axios';
// Add a mock mode flag for demonstration purposes
const USE_MOCK_MODE = true // Set to false when real backend is available

// Mock data for demonstration
const MOCK_NOTIFICATIONS = [
  {
    id: "mock-1",
    userId: "user-123",
    message: "John Doe liked your post",
    type: "LIKE",
    read: false,
    link: "#",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: "mock-2",
    userId: "user-123",
    message: "Jane Smith commented on your post",
    type: "COMMENT",
    read: false,
    link: "#",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: "mock-3",
    userId: "user-123",
    message: "Alex Johnson liked your comment",
    type: "LIKE",
    read: true,
    link: "#",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
]

// Mock storage for read status
const mockReadStatus = {
  "mock-1": false,
  "mock-2": false,
  "mock-3": true,
}

export const getNotifications = async (userId, page = 0, size = 10, filter = "all") => {
  if (USE_MOCK_MODE) {
    // Return mock data
    let filteredNotifications = [...MOCK_NOTIFICATIONS]

    if (filter === "unread") {
      filteredNotifications = filteredNotifications.filter((n) => !mockReadStatus[n.id])
    }

    // Simulate pagination
    const start = page * size
    const end = start + size
    const paginatedNotifications = filteredNotifications.slice(start, end)

    return {
      notifications: paginatedNotifications,
      hasMore: end < filteredNotifications.length,
      totalCount: filteredNotifications.length,
    }
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications?userId=${userId}&page=${page}&size=${size}&filter=${filter}`,
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch notifications")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching notifications:", error)
    throw error
  }
}

export const markNotificationAsRead = async (notificationId) => {
  if (USE_MOCK_MODE) {
    // Update mock read status
    mockReadStatus[notificationId] = true
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
      method: "PUT",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to mark notification as read")
    }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}

export const markAllNotificationsAsRead = async (userId) => {
  if (USE_MOCK_MODE) {
    // Mark all mock notifications as read
    MOCK_NOTIFICATIONS.forEach((notification) => {
      mockReadStatus[notification.id] = true
    })
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to mark all notifications as read")
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    throw error
  }
}

export const getUnreadCount = async (userId) => {
  if (USE_MOCK_MODE) {
    // Count unread mock notifications
    return MOCK_NOTIFICATIONS.filter((n) => !mockReadStatus[n.id]).length
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/unread-count?userId=${userId}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to get unread count")
    }

    const data = await response.json()
    return data.count
  } catch (error) {
    console.error("Error getting unread count:", error)
    throw error
  }
}
