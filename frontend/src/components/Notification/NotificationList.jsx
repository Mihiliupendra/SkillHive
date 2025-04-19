"use client"

import notificationService from "../../api/notificationService.js"
import { useState, useEffect } from "react"
import NotificationItem from "./NotificationItem.jsx"
import "./NotificationList.css"

function NotificationList({ userId, onClose }) {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [filter, setFilter] = useState("all")

  const fetchNotifications = async (pageNum, reset = false) => {
    if (pageNum === 0) {
      setIsLoading(true)
    }

    try {
      // Corrected: Using notificationService instead of getNotifications
      const result = await notificationService.getNotifications(userId, pageNum, 10, filter)

      if (reset) {
        setNotifications(result.notifications)
      } else {
        setNotifications((prev) => [...prev, ...result.notifications])
      }

      setHasMore(result.hasMore)
      setError(null)
    } catch (err) {
      setError("Failed to load notifications. Please try again.")
      console.error("Error fetching notifications:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications(0, true)
  }, [userId, filter])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchNotifications(nextPage)
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      // Corrected: Using notificationService instead of markNotificationAsRead
      await notificationService.markNotificationAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        ),
      )
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      // Corrected: Using notificationService instead of markAllNotificationsAsRead
      await notificationService.markAllNotificationsAsRead(userId)
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    } catch (err) {
      console.error("Error marking all notifications as read:", err)
    }
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="notification-list">
      <div className="notification-header">
        <h3>Notifications</h3>
        <div className="notification-actions">
          <div className="notification-filters">
            <button
              className={`filter-button ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`filter-button ${filter === "unread" ? "active" : ""}`}
              onClick={() => setFilter("unread")}
            >
              Unread
            </button>
          </div>

          {unreadCount > 0 && (
            <button className="mark-all-read-button" onClick={handleMarkAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {isLoading && page === 0 ? (
        <div className="notification-loading">Loading notifications...</div>
      ) : error ? (
        <div className="notification-error">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="no-notifications">No notifications to display.</div>
      ) : (
        <>
          <div className="notification-items">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>

          {hasMore && (
            <button className="load-more-button" onClick={handleLoadMore} disabled={isLoading}>
              {isLoading ? "Loading..." : "Load More"}
            </button>
          )}
        </>
      )}

      {onClose && (
        <button className="close-notifications-button" onClick={onClose}>
          Close
        </button>
      )}
    </div>
  )
}

export default NotificationList
