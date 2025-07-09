import { useState, useEffect } from "react";
import { notificationService } from "@/services/api/notificationService";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification.Id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch (err) {
      throw new Error(err.message || "Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      throw new Error(err.message || "Failed to mark all notifications as read");
    }
  };

  const dismissNotification = async (id) => {
    try {
      await notificationService.dismiss(id);
      setNotifications(prev => prev.filter(notification => notification.Id !== id));
    } catch (err) {
      throw new Error(err.message || "Failed to dismiss notification");
    }
  };

  const createNotification = async (notificationData) => {
    try {
      const newNotification = await notificationService.create(notificationData);
      setNotifications(prev => [newNotification, ...prev]);
      return newNotification;
    } catch (err) {
      throw new Error(err.message || "Failed to create notification");
    }
  };

  const generateNotifications = async (attendanceAlerts = [], gradeAlerts = []) => {
    try {
      const newNotifications = await notificationService.generateNotifications(attendanceAlerts, gradeAlerts);
      setNotifications(prev => [...newNotifications, ...prev]);
      return newNotifications;
    } catch (err) {
      throw new Error(err.message || "Failed to generate notifications");
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    createNotification,
    generateNotifications,
    getUnreadCount
  };
};