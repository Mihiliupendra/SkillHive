"use client"

import { useState, useEffect, useRef } from "react"
import { FiBell } from "react-icons/fi"
import NotificationList from "./NotificationList.jsx"
import { getUnreadCount } from "../../services/notificationService.js"

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
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
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

  const containerStyle = {
    position: "relative",
  }

  const buttonStyle = {
    background: "none",
    border: "none",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    position: "relative",
  }

  const bellIconStyle = {
    fontSize: "20px",
    color: "#65676b",
  }

  const badgeStyle = {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#e41e3f",
    color: "white",
    fontSize: "11px",
    fontWeight: 600,
    minWidth: "18px",
    height: "18px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
  }

  const dropdownStyle = {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    zIndex: 1000,
    animation: "fadeIn 0.2s ease", // NOTE: still needs to be defined via CSS or keyframes
  }

  return (
    <div style={containerStyle} ref={bellRef}>
      <button
        style={buttonStyle}
        onClick={toggleNotifications}
        aria-label="Notifications"
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "none")}
      >
        <FiBell style={bellIconStyle} />
        {!isLoading && unreadCount > 0 && (
          <span style={badgeStyle}>{unreadCount > 99 ? "99+" : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div style={dropdownStyle}>
          <NotificationList userId={userId} onClose={handleClose} />
        </div>
      )}
    </div>
  )
}

export default NotificationBell
