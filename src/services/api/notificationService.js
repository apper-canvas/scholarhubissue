import notificationsData from '@/services/mockData/notifications.json';

const notifications = [...notificationsData];
let nextId = Math.max(...notifications.map(n => n.Id)) + 1;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const notificationService = {
  getAll: async () => {
    await delay(200);
    return [...notifications];
  },

  getById: async (id) => {
    await delay(100);
    const notification = notifications.find(n => n.Id === id);
    if (!notification) {
      throw new Error('Notification not found');
    }
    return { ...notification };
  },

  markAsRead: async (id) => {
    await delay(150);
    const notification = notifications.find(n => n.Id === id);
    if (!notification) {
      throw new Error('Notification not found');
    }
    notification.isRead = true;
    return { ...notification };
  },

  markAllAsRead: async () => {
    await delay(200);
    notifications.forEach(n => n.isRead = true);
    return [...notifications];
  },

  dismiss: async (id) => {
    await delay(150);
    const index = notifications.findIndex(n => n.Id === id);
    if (index === -1) {
      throw new Error('Notification not found');
    }
    notifications.splice(index, 1);
    return { success: true };
  },

  create: async (notificationData) => {
    await delay(200);
    const newNotification = {
      Id: nextId++,
      ...notificationData,
      isRead: false,
      createdAt: new Date().toISOString(),
      emailSent: false
    };
    notifications.push(newNotification);
    return { ...newNotification };
  },

  generateNotifications: async (attendanceAlerts = [], gradeAlerts = []) => {
    await delay(300);
    const newNotifications = [];
    
    // Process attendance alerts
    attendanceAlerts.forEach(alert => {
      const notification = {
        Id: nextId++,
        type: 'attendance',
        title: 'Low Attendance Alert',
        message: alert.message,
        studentId: alert.studentId,
        priority: alert.priority,
        isRead: false,
        createdAt: new Date().toISOString(),
        emailSent: true
      };
      notifications.push(notification);
      newNotifications.push(notification);
    });
    
    // Process grade alerts
    gradeAlerts.forEach(alert => {
      const notification = {
        Id: nextId++,
        type: 'grade',
        title: 'Failing Grade Alert',
        message: alert.message,
        studentId: alert.studentId,
        priority: alert.priority,
        isRead: false,
        createdAt: new Date().toISOString(),
        emailSent: true
      };
      notifications.push(notification);
      newNotifications.push(notification);
    });
    
    return [...newNotifications];
  },

  getUnreadCount: async () => {
    await delay(100);
    return notifications.filter(n => !n.isRead).length;
  }
};