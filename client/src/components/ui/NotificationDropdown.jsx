// client/src/components/ui/NotificationDropdown.jsx

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationsAPI } from '../../services/api';
import { onNotification, offNotification } from '../../services/socket';
import {
  HiOutlineBell,
  HiOutlineCheck,
  HiOutlineCheckCircle,
  HiOutlineUserAdd,
  HiOutlineClipboardCheck,
  HiOutlineTrash,
} from 'react-icons/hi';

function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  // Listen for real-time notifications
  useEffect(() => {
    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    onNotification(handleNewNotification);

    return () => {
      offNotification(handleNewNotification);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationsAPI.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationsAPI.getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationsAPI.clearAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_completed':
        return <HiOutlineClipboardCheck className='w-5 h-5 text-green-500' />;
      case 'phase_completed':
        return <HiOutlineCheckCircle className='w-5 h-5 text-blue-500' />;
      case 'collaborator_added':
        return <HiOutlineUserAdd className='w-5 h-5 text-purple-500' />;
      default:
        return <HiOutlineBell className='w-5 h-5 text-gray-500' />;
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <div className='relative' ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
      >
        <HiOutlineBell className='w-5 h-5' />
        {unreadCount > 0 && (
          <span className='absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className='absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50'
          >
            {/* Header */}
            <div className='p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
              <h3 className='font-semibold text-gray-900 dark:text-white'>
                Notifications
              </h3>
              <div className='flex items-center space-x-2'>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className='text-xs text-blue-600 dark:text-blue-400 hover:underline'
                  >
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className='p-1 text-gray-400 hover:text-red-500 transition-colors'
                    title='Clear all'
                  >
                    <HiOutlineTrash className='w-4 h-4' />
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className='max-h-80 overflow-y-auto'>
              {isLoading ? (
                <div className='p-8 text-center'>
                  <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto' />
                </div>
              ) : notifications.length === 0 ? (
                <div className='p-8 text-center'>
                  <HiOutlineBell className='w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2' />
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      !notification.isRead
                        ? 'bg-blue-50/50 dark:bg-blue-900/20'
                        : ''
                    }`}
                  >
                    <div className='flex items-start space-x-3'>
                      <div className='flex-shrink-0 mt-0.5'>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm text-gray-900 dark:text-white'>
                          {notification.message}
                        </p>
                        <div className='flex items-center justify-between mt-1'>
                          <p className='text-xs text-gray-500 dark:text-gray-400'>
                            {formatTime(notification.createdAt)}
                          </p>
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className='text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center'
                            >
                              <HiOutlineCheck className='w-3 h-3 mr-0.5' />
                              Mark read
                            </button>
                          )}
                        </div>
                        {notification.project && (
                          <Link
                            to={`/projects/${
                              notification.project._id || notification.project
                            }`}
                            onClick={() => setIsOpen(false)}
                            className='text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block'
                          >
                            View project →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationDropdown;
