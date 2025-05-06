import { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = ({ onClose }) => {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();
  const [tab, setTab] = useState('all');

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    onClose();
  };

  // FIX: Move this inside the component body, not outside any block
  const filteredNotifications =
    tab === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  // Add this function for icons
  const renderIcon = (type) => {
    switch (type) {
      case 'LIKE':
        return (
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path fill="currentColor" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
          </span>
        );
      case 'COMMENT':
        return (
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path fill="currentColor" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" />
            </svg>
          </span>
        );
      default:
        return (
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </span>
        );
    }
  };

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case 'LIKE':
        return (
          <span>
            <strong>{notification.senderName}</strong> liked your post
          </span>
        );
      case 'COMMENT':
        return (
          <span>
            <strong>{notification.senderName}</strong> commented on your post
          </span>
        );
      case 'REPLY':
        return (
          <span>
            <strong>{notification.senderName}</strong> replied to your comment
          </span>
        );
      case 'FOLLOW':
        return (
          <span>
            <strong>{notification.senderName}</strong> started following you
          </span>
        );
      case 'COMMUNITY_JOIN':
        return (
          <span>
            <strong>{notification.senderName}</strong> joined your community
          </span>
        );
      case 'POST_SHARE':
        return (
          <span>
            <strong>{notification.senderName}</strong> shared your post
          </span>
        );
      default:
        return (
          <span>
            <strong>{notification.senderName}</strong> {notification.message}
          </span>
        );
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50">
      {/* Tabs and Mark all as read */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-gray-100">
        <div className="flex space-x-2">
          <button
            className={`px-2 py-1 text-sm rounded font-medium ${tab === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
            onClick={() => setTab('all')}
          >
            All
          </button>
          <button
            className={`px-2 py-1 text-sm rounded font-medium ${tab === 'unread' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
            onClick={() => setTab('unread')}
          >
            Unread
          </button>
        </div>
        {filteredNotifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>
      {/* Notifications */}
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="py-6 text-center">
            <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No notifications</div>
        ) : (
          <div>
            {filteredNotifications.map((notification) => (
              <Link
                key={notification.id}
                to={notification.link || '#'}
                onClick={() => handleNotificationClick(notification)}
                className={`flex items-start px-4 py-3 transition ${
                  !notification.read ? 'bg-blue-50' : 'bg-white'
                } hover:bg-gray-50`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {renderIcon(notification.type)}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="text-sm text-gray-900">{renderNotificationContent(notification)}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Close button */}
      <div className="px-4 py-3 border-t border-gray-100 text-center">
        <button
          onClick={onClose}
          className="text-base text-gray-500 hover:text-blue-600 font-medium focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;