"use client"

import { useState, useEffect } from "react"
import { websocketService } from "../api/websocketService.js"

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!userId) return

    // Connect to WebSocket
    websocketService.connect(userId)

    // Handle incoming notifications
    const handleNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev])
    }

    websocketService.addMessageHandler(handleNotification)

    // Cleanup on unmount
    return () => {
      websocketService.removeMessageHandler(handleNotification)
    }
  }, [userId])

  return { notifications }
}
