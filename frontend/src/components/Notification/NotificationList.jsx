"use client"

import { useState, useEffect } from "react"
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationService.js"
import NotificationItem from "./NotificationItem.jsx"

function NotificationList({ userId, onClose }) {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [filter, setFilter] = useState("all")

  const fetchNotifications = async (pageNum, reset = false) => {
    if (pageNum === 0) setIsLoading(true)

    try {
      const result = await getNotifications(userId, pageNum, 10, filter)
      reset
        ? setNotifications(result.notifications)
        : setNotifications((prev) => [...prev, ...result.notifications])
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
      await markNotificationAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      )
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(userId)
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (err) {
      console.error("Error marking all notifications as read:", err)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const styles = {
    list: {
      width: "100%",
      maxWidth: "400px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15)",
      maxHeight: "500px",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      padding: "16px",
      borderBottom: "1px solid #eaeaea",
      position: "sticky",
      top: 0,
      backgroundColor: "white",
      zIndex: 1,
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    },
    headerTitle: {
      margin: "0 0 8px 0",
      fontSize: "18px",
    },
    actions: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    filters: {
      display: "flex",
      gap: "8px",
    },
    filterButton: (active) => ({
      background: "none",
      border: "none",
      padding: "4px 8px",
      fontSize: "14px",
      cursor: "pointer",
      borderRadius: "4px",
      color: active ? "#1877f2" : "#65676b",
      fontWeight: active ? 600 : 400,
      backgroundColor: active ? "rgba(24, 119, 242, 0.1)" : "transparent",
    }),
    markAllReadButton: {
      background: "none",
      border: "none",
      color: "#1877f2",
      fontSize: "14px",
      cursor: "pointer",
    },
    items: {
      overflowY: "auto",
      flexGrow: 1,
    },
    loading: {
      padding: "24px",
      textAlign: "center",
      color: "#65676b",
    },
    error: {
      padding: "16px",
      textAlign: "center",
      color: "#e41e3f",
      backgroundColor: "rgba(228, 30, 63, 0.1)",
      margin: "8px",
      borderRadius: "8px",
    },
    empty: {
      padding: "32px 16px",
      textAlign: "center",
      color: "#65676b",
      fontStyle: "italic",
    },
    loadMoreButton: {
      margin: "16px auto",
      padding: "8px 16px",
      backgroundColor: "#f0f2f5",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer",
      color: "#65676b",
      display: "block",
      width: "80%",
    },
    loadMoreButtonHover: {
      backgroundColor: "#e4e6eb",
    },
    loadMoreDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
    closeButton: {
      padding: "12px",
      backgroundColor: "#f0f2f5",
      border: "none",
      borderTop: "1px solid #eaeaea",
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
      color: "#65676b",
      borderBottomLeftRadius: "8px",
      borderBottomRightRadius: "8px",
    },
  }

  return (
    <div style={styles.list}>
      <div style={styles.header}>
        <h3 style={styles.headerTitle}>Notifications</h3>
        <div style={styles.actions}>
          <div style={styles.filters}>
            <button style={styles.filterButton(filter === "all")} onClick={() => setFilter("all")}>
              All
            </button>
            <button style={styles.filterButton(filter === "unread")} onClick={() => setFilter("unread")}>
              Unread
            </button>
          </div>
          {unreadCount > 0 && (
            <button style={styles.markAllReadButton} onClick={handleMarkAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {isLoading && page === 0 ? (
        <div style={styles.loading}>Loading notifications...</div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : notifications.length === 0 ? (
        <div style={styles.empty}>No notifications to display.</div>
      ) : (
        <>
          <div style={styles.items}>
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
            ))}
          </div>
          {hasMore && (
            <button
              style={{
                ...styles.loadMoreButton,
                ...(isLoading ? styles.loadMoreDisabled : {}),
              }}
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Load More"}
            </button>
          )}
        </>
      )}

      {onClose && <button style={styles.closeButton} onClick={onClose}>Close</button>}
    </div>
  )
}

export default NotificationList
