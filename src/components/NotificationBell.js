import React, { useState, useEffect } from 'react';
import notificationService from '../services/notificationService';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    // طلب إذن الإشعارات عند التحميل
    notificationService.requestPermission();
  }, []);

  const loadNotifications = () => {
    const allNotifications = notificationService.getNotifications();
    setNotifications(allNotifications);
    setUnreadCount(notificationService.getUnreadCount());
  };

  const markAsRead = (id) => {
    notificationService.markAsRead(id);
    loadNotifications();
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
    loadNotifications();
  };

  const deleteNotification = (id) => {
    notificationService.deleteNotification(id);
    loadNotifications();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return 'fas fa-check-circle text-success';
      case 'warning': return 'fas fa-exclamation-triangle text-warning';
      case 'error': return 'fas fa-times-circle text-danger';
      case 'info': return 'fas fa-info-circle text-info';
      default: return 'fas fa-bell text-primary';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'badge bg-danger';
      case 'medium': return 'badge bg-warning';
      case 'low': return 'badge bg-info';
      default: return 'badge bg-secondary';
    }
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-outline-light position-relative"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="dropdown-menu dropdown-menu-end show" style={{ width: '350px', maxHeight: '400px', overflowY: 'auto' }}>
          <div className="dropdown-header d-flex justify-content-between align-items-center">
            <span>الإشعارات</span>
            <div>
              {unreadCount > 0 && (
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={markAllAsRead}
                >
                  تعليم الكل كمقروء
                </button>
              )}
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setShowDropdown(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          {notifications.length > 0 ? (
            notifications.slice(0, 10).map(notification => (
              <div key={notification.id} className={`dropdown-item ${!notification.read ? 'bg-light' : ''}`}>
                <div className="d-flex align-items-start">
                  <i className={`${getNotificationIcon(notification.type)} me-2 mt-1`}></i>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <span className="fw-medium">{notification.message}</span>
                      <span className={getPriorityBadge(notification.priority)}>
                        {notification.priority === 'high' ? 'عالي' : 
                         notification.priority === 'medium' ? 'متوسط' : 'منخفض'}
                      </span>
                    </div>
                    <small className="text-muted d-block">{notification.date}</small>
                    <div className="mt-2">
                      {!notification.read && (
                        <button
                          className="btn btn-sm btn-outline-success me-1"
                          onClick={() => markAsRead(notification.id)}
                        >
                          مقروء
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="dropdown-item text-center text-muted py-3">
              <i className="fas fa-bell-slash fa-2x mb-2"></i>
              <p>لا توجد إشعارات</p>
            </div>
          )}

          {notifications.length > 10 && (
            <>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item text-center">
                <small className="text-muted">
                  عرض {Math.min(10, notifications.length)} من {notifications.length} إشعار
                </small>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;