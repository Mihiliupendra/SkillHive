import { useNotifications } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = ({ onClose }) => {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    onClose();
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
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-sm font-medium">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="py-4 text-center">
            <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-6 text-center text-gray-500">No notifications</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                to={notification.link || '#'}
                onClick={() => handleNotificationClick(notification)}
                className={`block px-4 py-3 hover:bg-gray-50 transition ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {/* Avatar placeholder */}
                    <div className="w-9 h-9 rounded-full bg-gray-200"></div>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <div className="text-sm text-gray-900">
                      {renderNotificationContent(notification)}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <div className="px-4 py-3 border-t border-gray-100 text-center">
        <Link
          to="/notifications"
          onClick={onClose}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;