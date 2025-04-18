import { WS_BASE_URL } from "../config"

// Add a mock mode flag for demonstration purposes
const USE_MOCK_MODE = true // Set to false when real backend is available

class WebSocketService {
  constructor() {
    this.socket = null
    this.messageHandlers = []
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectTimeout = null
    this.userId = null
    this.mockInterval = null
  }

  connect(userId) {
    this.userId = userId

    if (USE_MOCK_MODE) {
      console.log("WebSocket running in mock mode")
      this.setupMockNotifications()
      return
    }

    if (this.socket?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      this.socket = new WebSocket(`${WS_BASE_URL}?userId=${userId}`)

      this.socket.onopen = () => {
        console.log("WebSocket connection established")
        this.reconnectAttempts = 0
      }

      this.socket.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data)
          this.messageHandlers.forEach((handler) => handler(notification))
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      this.socket.onclose = (event) => {
        console.log("WebSocket connection closed:", event.code, event.reason)
        this.attemptReconnect()
      }

      this.socket.onerror = (error) => {
        console.error("WebSocket connection failed:", error)
        // Don't close the socket here, let the onclose handler deal with reconnection
      }
    } catch (error) {
      console.error("Error creating WebSocket connection:", error)
      this.attemptReconnect()
    }
  }

  setupMockNotifications() {
    // Clear any existing mock interval
    if (this.mockInterval) {
      window.clearInterval(this.mockInterval)
    }

    // Send a mock notification every 15-30 seconds
    this.mockInterval = window.setInterval(
      () => {
        const shouldSend = Math.random() > 0.5
        if (shouldSend && this.userId) {
          const mockNotification = {
            id: `mock-${Date.now()}`,
            userId: this.userId,
            message: `Mock notification: ${Math.random() > 0.5 ? "Someone liked your post" : "New comment on your post"}`,
            type: Math.random() > 0.5 ? "LIKE" : "COMMENT",
            read: false,
            link: "#",
            createdAt: new Date().toISOString(),
          }

          this.messageHandlers.forEach((handler) => handler(mockNotification))
        }
      },
      Math.floor(Math.random() * 15000) + 15000,
    ) // Random interval between 15-30 seconds
  }

  attemptReconnect() {
    if (USE_MOCK_MODE) {
      return // Don't attempt reconnection in mock mode
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Max reconnect attempts reached, switching to mock mode")
      this.setupMockNotifications()
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    this.reconnectTimeout = window.setTimeout(() => {
      if (this.userId) {
        this.connect(this.userId)
      }
    }, delay)
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.mockInterval) {
      clearInterval(this.mockInterval)
      this.mockInterval = null
    }

    this.messageHandlers = []
  }

  addMessageHandler(handler) {
    this.messageHandlers.push(handler)
  }

  removeMessageHandler(handler) {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler)
  }

  isConnected() {
    if (USE_MOCK_MODE) {
      return true // Always report as connected in mock mode
    }
    return this.socket?.readyState === WebSocket.OPEN
  }
}

// Singleton instance
export const websocketService = new WebSocketService()
