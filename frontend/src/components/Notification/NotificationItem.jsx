"use client"

import { formatDistanceToNow } from "date-fns"
import { FiHeart, FiMessageSquare, FiCheck } from "react-icons/fi"
import "./NotificationItem.css"

function NotificationItem({ notification, onMarkAsRead }) {
  const getIcon = () => {
    switch (notification.type) {
      case "LIKE":
        return <FiHeart className="notification-icon like" />
      case "COMMENT":
        return <FiMessageSquare className="notification-icon comment" />
      default:
        return null
    }
  }

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id)
    }

    // Navigate to the relevant content if needed
    if (notification.link) {
      window.location.href = notification.link
    }
  }

  const handleMarkAsRead = (e) => {
    e.stopPropagation()
    if (!notification.read) {
      onMarkAsRead(notification.id)
    }
  }

  return (
    <div className={`notification-item ${notification.read ? "read" : "unread"}`} onClick={handleClick}>
      <div className="notification-content">
        <div className="notification-icon-container">{getIcon()}</div>
        <div className="notification-details">
          <p className="notification-message">{notification.message}</p>
          <span className="notification-time">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      {!notification.read && (
        <button className="mark-read-button" onClick={handleMarkAsRead} aria-label="Mark as read">
          <FiCheck />
        </button>
      )}
    </div>
  )
}

export default NotificationItem
