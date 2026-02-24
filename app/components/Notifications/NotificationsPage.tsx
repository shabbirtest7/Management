'use client';

import { useState } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { format } from 'date-fns';
import { 
  FiBell, 
  FiCheck, 
  FiTrash2, 
  FiFilter,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';
import LayoutWrapper from '../Layout/LayoutWrapper';
import Button from '../UI/Button';
import Select from '../UI/Select';


export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    refreshNotifications 
  } = useNotifications();

  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleBulkMarkRead = async () => {
    for (const id of selectedNotifications) {
      await markAsRead(id);
    }
    setSelectedNotifications([]);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedNotifications.length} notifications?`)) {
      for (const id of selectedNotifications) {
        await deleteNotification(id);
      }
      setSelectedNotifications([]);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'PROJECT_CREATED':
        return '🆕';
      case 'PROJECT_COMPLETED':
        return '✅';
      case 'PROJECT_ASSIGNED':
        return '👤';
      case 'DUE_DATE_APPROACHING':
        return '⏰';
      case 'DUE_DATE_OVERDUE':
        return '⚠️';
      case 'STATUS_CHANGED':
        return '🔄';
      default:
        return '📌';
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' }
  ];

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="max-w-4xl mx-auto py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <Select
              options={filterOptions}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              icon={FiFilter}
              selectClassName="w-40"
            />
            <Button
              variant="outline"
              onClick={refreshNotifications}
              size="sm"
            >
              Refresh
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={markAllAsRead}
                size="sm"
                leftIcon={FiCheck}
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedNotifications.length} selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={FiCheck}
                onClick={handleBulkMarkRead}
              >
                Mark as read
              </Button>
              <Button
                variant="danger"
                size="sm"
                leftIcon={FiTrash2}
                onClick={handleBulkDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center">
              <FiBell className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No notifications found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Checkbox */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedNotifications([...selectedNotifications, notification.id]);
                          } else {
                            setSelectedNotifications(selectedNotifications.filter(id => id !== notification.id));
                          }
                        }}
                        className="h-4 w-4 text-primary-600 rounded border-gray-300"
                      />
                    </div>

                    {/* Icon */}
                    <div className="flex-shrink-0 text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`text-sm ${!notification.isRead ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200"
                              title="Mark as read"
                            >
                              <FiCheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-200"
                            title="Delete"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
}