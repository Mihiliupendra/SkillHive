import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { formatDistanceToNow } from 'date-fns';

const renderIcon = (type) => {
  switch (type) {
    case 'LIKE':
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 20 20">
            <path fill="currentColor" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
        </span>
      );
    case 'COMMENT':
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 20 20">
            <path fill="currentColor" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" />
          </svg>
        </span>
      );
    default:
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </span>
      );
  }
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, [page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotificationHistory(page);
      if (page === 0) {
        setNotifications(data.content);
      } else {
        setNotifications(prev => [...prev, ...data.content]);
      }
      setHasMore(!data.last);
      setLoading(false);
    } catch (err) {
      setError('Failed to load notifications');
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const filteredNotifications =
    tab === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications;

  return (
    <div className="max-w-md mx-auto py-8 px-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded font-medium ${tab === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
            onClick={() => setTab('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 text-sm rounded font-medium ${tab === 'unread' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
            onClick={() => setTab('unread')}
          >
            Unread
          </button>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white shadow rounded-xl">
        {error && (
          <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>
        )}
        {filteredNotifications.length === 0 && !loading ? (
          <div className="py-8 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`flex items-start px-4 py-4 border-b last:border-b-0 transition ${
                !notification.read ? 'bg-blue-50' : 'bg-white'
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {renderIcon(notification.type)}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  {notification.type === 'LIKE' && 'liked your post'}
                  {notification.type === 'COMMENT' && 'commented on your post'}
                  {/* Add more types as needed */}
                </div>
                <div className="text-sm text-gray-700">
                  {notification.senderName} {notification.content}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="py-8 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
          </div>
        )}
      </div>

      {!loading && hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMore}
            className="px-4 py-2 text-sm text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50"
          >
            Load more
          </button>
        </div>
      )}

      {/* Optional Close button for page */}
      {/* <div className="mt-6 text-center">
        <button
          onClick={() => window.history.back()}
          className="text-base text-gray-500 hover:text-blue-600 font-medium focus:outline-none"
        >
          Close
        </button>
      </div> */}
    </div>
  );
};

export default NotificationsPage;