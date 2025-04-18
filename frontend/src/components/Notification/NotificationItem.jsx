"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { FiHeart, FiMessageSquare, FiCheck } from "react-icons/fi"

function NotificationItem({ notification, onMarkAsRead }) {
  const [isHovered, setIsHovered] = useState(false)

  const getIcon = () => {
    const baseStyle = {
      fontSize: "16px",
    }

    const iconStyle = {
      ...baseStyle,
      color: notification.type === "LIKE" ? "#e41e3f" : notification.type === "COMMENT" ? "#1877f2" : "#000",
    }

    switch (notification.type) {
      case "LIKE":
        return <FiHeart style={iconStyle} />
      case "COMMENT":
        return <FiMessageSquare style={iconStyle} />
      default:
        return null
    }
  }

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id)
    }

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

  const itemStyle = {
    padding: "12px 16px",
    borderBottom: "1px solid #eaeaea",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "background-color 0.2s ease",
    backgroundColor: notification.read
      ? isHovered
        ? "#f7f8fa"
        : "transparent"
      : isHovered
      ? "#d9ecff"
      : "#e7f3ff",
  }

  const contentStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    flex: 1,
  }

  const iconContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    backgroundColor: "#f0f2f5",
    borderRadius: "50%",
    flexShrink: 0,
  }

  const detailsStyle = {
    flex: 1,
  }

  const messageStyle = {
    margin: "0 0 4px 0",
    fontSize: "14px",
    lineHeight: 1.4,
  }

  const timeStyle = {
    fontSize: "12px",
    color: "#65676b",
  }

  const markReadButtonStyle = {
    background: "none",
    border: "none",
    color: isHovered ? "#1877f2" : "#65676b",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    opacity: isHovered ? 1 : 0,
    transition: "opacity 0.2s ease, background-color 0.2s ease",
    backgroundColor: isHovered ? "rgba(0, 0, 0, 0.05)" : "transparent",
  }

  return (
    <div
      style={itemStyle}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={contentStyle}>
        <div style={iconContainerStyle}>{getIcon()}</div>
        <div style={detailsStyle}>
          <p style={messageStyle}>{notification.message}</p>
          <span style={timeStyle}>
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      {!notification.read && (
        <button
          style={markReadButtonStyle}
          onClick={handleMarkAsRead}
          aria-label="Mark as read"
        >
          <FiCheck />
        </button>
      )}
    </div>
  )
}

export default NotificationItem
