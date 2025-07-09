import { useState } from 'react';
import { motion } from 'framer-motion';
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
import { useAttendance } from '@/hooks/useAttendance';
import { useGrades } from '@/hooks/useGrades';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';

const Notifications = () => {
  const { 
    notifications, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead, 
    dismissNotification,
    generateNotifications 
  } = useNotifications();
  const { students } = useStudents();
  const { generateNotifications: generateAttendanceNotifications } = useAttendance();
  const { generateNotifications: generateGradeNotifications } = useGrades();
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

  const handleGenerateNotifications = async () => {
    try {
      const attendanceAlerts = generateAttendanceNotifications();
      const gradeAlerts = generateGradeNotifications();
      await generateNotifications(attendanceAlerts, gradeAlerts);
      toast.success('Notifications generated successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ApperIcon name="Bell" className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All notifications read'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleGenerateNotifications}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="RefreshCw" className="h-4 w-4" />
            <span>Generate Alerts</span>
          </Button>
          
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead}>
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
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
              {filterType === 'unread' && unreadCount > 0 && (
                <Badge className="ml-2 bg-red-100 text-red-800">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Empty message="No notifications found" />
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.Id}
              className={cn(
                'p-6 transition-all duration-200',
                !notification.isRead && 'border-l-4 border-l-blue-500 bg-blue-50/50'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={cn(
                    'p-3 rounded-full',
                    notification.type === 'attendance' && 'bg-green-100',
                    notification.type === 'grade' && 'bg-blue-100',
                    notification.type === 'system' && 'bg-gray-100'
                  )}>
                    <ApperIcon 
                      name={getTypeIcon(notification.type)} 
                      className={cn(
                        'h-5 w-5',
                        notification.type === 'attendance' && 'text-green-600',
                        notification.type === 'grade' && 'text-blue-600',
                        notification.type === 'system' && 'text-gray-600'
                      )}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {notification.title}
                      </h3>
                      <Badge className={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">
                      {notification.message}
                    </p>
                    
                    {notification.studentId && (
                      <p className="text-sm text-gray-500 mb-3">
                        Student: {getStudentName(notification.studentId)}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                      </span>
                      {notification.emailSent && (
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Mail" className="h-4 w-4" />
                          <span>Email notification sent</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.isRead && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.Id)}
                      className="flex items-center space-x-1"
                    >
                      <ApperIcon name="Check" className="h-4 w-4" />
                      <span>Mark as Read</span>
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(notification.Id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <ApperIcon name="X" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Notifications;