import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const renderNotificationIcon = () => {
    switch (notification.type) {
      case 'LIKE':
        return (
          <div className="p-2 bg-red-100 text-red-500 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'COMMENT':
        return (
          <div className="p-2 bg-blue-100 text-blue-500 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'REPLY':
        return (
          <div className="p-2 bg-green-100 text-green-500 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'FOLLOW':
        return (
          <div className="p-2 bg-purple-100 text-purple-500 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 bg-gray-100 text-gray-500 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
        );
    }
  };

  const renderNotificationContent = () => {
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
      case 'FRIEND_REQUEST':
        return (
          <span>
            <strong>{notification.senderName || notification.actorName}</strong> sent you a friend request
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
    <Link
      to={notification.link || '#'}
      onClick={handleClick}
      className={`block px-4 py-4 transition hover:bg-gray-50 ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {renderNotificationIcon()}
        </div>
        <div className="ml-3 w-0 flex-1">
          <div className="text-sm text-gray-900">
            {renderNotificationContent()}
          </div>
          {notification.content && (
            <div className="mt-1 text-sm text-gray-600 line-clamp-2">
              {notification.content}
            </div>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NotificationItem;