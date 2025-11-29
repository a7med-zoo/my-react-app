/* eslint-disable import/no-anonymous-default-export */
class NotificationService {
  constructor() {
    this.notifications = this.loadNotifications();
  }

  loadNotifications() {
    return JSON.parse(localStorage.getItem('notifications')) || [];
  }

  saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  addNotification(type, message, priority = 'medium') {
    const notification = {
      id: Date.now(),
      type,
      message,
      priority,
      date: new Date().toLocaleString('ar-EG'),
      read: false
    };

    this.notifications.unshift(notification);
    this.saveNotifications();
    
    // إشعار بالمتصفح إذا كان مسموحاً
    if (Notification.permission === 'granted') {
      new Notification('MicroManage - إشعار جديد', {
        body: message,
        icon: '/favicon.ico'
      });
    }

    return notification;
  }

  markAsRead(id) {
    this.notifications = this.notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    this.saveNotifications();
  }

  markAllAsRead() {
    this.notifications = this.notifications.map(notif => ({ ...notif, read: true }));
    this.saveNotifications();
  }

  deleteNotification(id) {
    this.notifications = this.notifications.filter(notif => notif.id !== id);
    this.saveNotifications();
  }

  clearAll() {
    this.notifications = [];
    this.saveNotifications();
  }

  getUnreadCount() {
    return this.notifications.filter(notif => !notif.read).length;
  }

  getNotifications() {
    return this.notifications;
  }

  // فحص المنتجات المنخفضة
  checkLowStock(products) {
    const lowStockProducts = products.filter(product => product.quantity < 5);
    
    if (lowStockProducts.length > 0) {
      lowStockProducts.forEach(product => {
        this.addNotification(
          'warning',
          `المنتج "${product.name}" كميته منخفضة (${product.quantity} فقط)`,
          'high'
        );
      });
    }
  }

  // فحص العملاء الجدد
  checkNewCustomers(customers) {
    const today = new Date().toLocaleDateString('ar-EG');
    const newCustomers = customers.filter(customer => customer.joinDate === today);
    
    if (newCustomers.length > 0) {
      this.addNotification(
        'info',
        `لديك ${newCustomers.length} عميل جديد اليوم`,
        'medium'
      );
    }
  }

  // طلب إذن الإشعارات
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }
}

export default new NotificationService();