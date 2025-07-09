import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { useNotifications } from '@/hooks/useNotifications';
import { useStudents } from '@/hooks/useStudents';
import { cn } from '@/utils/cn';

const NotificationCenter = ({ isOpen, onClose }) => {
  const { notifications, loading, error, markAsRead, markAllAsRead, dismissNotification } = useNotifications();
  const { students } = useStudents();
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'attendance': return 'UserCheck';
      case 'grade': return 'BookOpen';
      case 'system': return 'Settings';
      default: return 'Bell';
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      toast.success('Notification marked as read');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await dismissNotification(id);
      toast.success('Notification dismissed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Notification Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Bell" className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                {unreadCount > 0 && (
                  <Badge className="bg-red-100 text-red-800">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {['all', 'unread', 'attendance', 'grade', 'system'].map((filterType) => (
                  <Button
                    key={filterType}
                    variant={filter === filterType ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(filterType)}
                    className="capitalize"
                  >
                    {filterType}
                  </Button>
                ))}
              </div>
              
              {unreadCount > 0 && (
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="w-full"
                  >
                    Mark All as Read
                  </Button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="p-4">
                  <Loading />
                </div>
              )}

              {error && (
                <div className="p-4">
                  <Error message={error} />
                </div>
              )}

              {!loading && !error && filteredNotifications.length === 0 && (
                <div className="p-4">
                  <Empty message="No notifications found" />
                </div>
              )}

              {!loading && !error && filteredNotifications.length > 0 && (
                <div className="p-4 space-y-3">
                  {filteredNotifications.map((notification) => (
                    <Card
                      key={notification.Id}
                      className={cn(
                        'p-4 transition-all duration-200',
                        !notification.isRead && 'border-l-4 border-l-blue-500 bg-blue-50/50'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={cn(
                            'p-2 rounded-full',
                            notification.type === 'attendance' && 'bg-green-100',
                            notification.type === 'grade' && 'bg-blue-100',
                            notification.type === 'system' && 'bg-gray-100'
                          )}>
                            <ApperIcon 
                              name={getTypeIcon(notification.type)} 
                              className={cn(
                                'h-4 w-4',
                                notification.type === 'attendance' && 'text-green-600',
                                notification.type === 'grade' && 'text-blue-600',
                                notification.type === 'system' && 'text-gray-600'
                              )}
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-gray-900 text-sm truncate">
                                {notification.title}
                              </h3>
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            
                            {notification.studentId && (
                              <p className="text-xs text-gray-500 mb-2">
                                Student: {getStudentName(notification.studentId)}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>
                                {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                              </span>
                              {notification.emailSent && (
                                <div className="flex items-center space-x-1">
                                  <ApperIcon name="Mail" className="h-3 w-3" />
                                  <span>Email sent</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.Id)}
                              className="h-8 w-8 p-0"
                            >
                              <ApperIcon name="Check" className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDismiss(notification.Id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <ApperIcon name="X" className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;