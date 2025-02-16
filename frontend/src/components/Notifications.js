import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    fetchNotifications();
    connectWebSocket();
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    ws.current = new WebSocket(`ws://localhost:5000/notifications?userId=${user.id}`);
    
    ws.current.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    ws.current.onclose = () => {
      // Attempt to reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [notificationsRes, countRes] = await Promise.all([
        axios.get('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/notifications/unread-count', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setNotifications(notificationsRes.data.notifications);
      setUnreadCount(countRes.data.count);
    } catch (error) {
      setError('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        'http://localhost:5000/api/notifications/mark-all-read',
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-icon" onClick={() => setShowDropdown(!showDropdown)}>
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {showDropdown && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="mark-all-read">
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading-spinner" />
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="no-notifications">
              No notifications
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map(notification => (
                <Link
                  key={notification._id}
                  to={notification.actionUrl || '#'}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to get notification icon
const getNotificationIcon = (type) => {
  const icons = {
    NEW_INTEREST: '👋',
    INTEREST_ACCEPTED: '✅',
    INTEREST_REJECTED: '❌',
    TASK_ASSIGNED: '📋',
    TASK_COMPLETED: '🎉',
    NEW_MESSAGE: '💬',
    PAYMENT_RECEIVED: '💰',
    REVIEW_RECEIVED: '⭐',
    TASK_DEADLINE: '⏰',
    DISPUTE_UPDATE: '⚠️'
  };
  return icons[type] || '📢';
};

// Helper function to format time
const formatTime = (date) => {
  const now = new Date();
  const notifDate = new Date(date);
  const diff = now - notifDate;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff/86400000)}d ago`;
  return notifDate.toLocaleDateString();
};

export default Notifications; 