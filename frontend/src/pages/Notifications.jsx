import { useEffect, useState } from "react"
import NotificationList from "../components/Notification/NotificationList.jsx"
import "../components/Notification/NotificationList.css"

function NotificationsPage({ userId }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Optional: simulate fetch or auth check before showing
    const timeout = setTimeout(() => setReady(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  if (!userId) {
    return <div className="p-4 text-center">You need to be logged in to view notifications.</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Notifications</h1>
      {ready ? (
        <NotificationList userId={userId} />
      ) : (
        <div className="text-center text-gray-500">Loading...</div>
      )}
    </div>
  )
}

export default NotificationsPage
