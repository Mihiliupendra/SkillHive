"use client"

import { useState, useEffect, useRef } from "react"
import { FiBell } from "react-icons/fi"
import NotificationList from "./NotificationList.jsx"
import notificationService from "../../api/notificationService.js"
import "./NotificationBell.css"

function NotificationBell({ userId }) {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const bellRef = useRef(null)

  const fetchUnreadCount = async () => {
    setIsLoading(true)
    try {
      const count = await getUnreadCount(userId)
      setUnreadCount(count)
    } catch (error) {
      console.error("Error getting unread count:", error)
      // Don't update the count on error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUnreadCount()

    // Set up polling for unread count
    const interval = setInterval(fetchUnreadCount, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [userId])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleNotifications = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <div className="notification-bell-container" ref={bellRef}>
      <button className="notification-bell-button" onClick={toggleNotifications} aria-label="Notifications">
        <FiBell className="bell-icon" />
        {!isLoading && unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <NotificationList userId={userId} onClose={handleClose} />
        </div>
      )}
    </div>
  )
}

export default NotificationBell
