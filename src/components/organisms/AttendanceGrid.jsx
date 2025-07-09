import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from "date-fns";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AttendanceGrid = ({ students, attendance, onMarkAttendance, selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const getAttendanceForDate = (studentId, date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return attendance.find(a => a.studentId === studentId && a.date === dateStr);
  };
  
  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  return (
    <div className="space-y-6">
      {/* Calendar Header */}
<div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handlePrevMonth}>
            <ApperIcon name="ChevronLeft" className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-bold text-gray-900">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ApperIcon name="ChevronRight" className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => window.print()}>
            <ApperIcon name="Printer" className="h-4 w-4 mr-2" />
            Print Sheet
          </Button>
          <Button variant="primary" onClick={() => onDateChange(new Date())}>
            Today
          </Button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
        
        {monthDays.map(date => {
          const isSelected = selectedDate && format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
          const isCurrentMonth = isSameMonth(date, currentMonth);
          
          return (
            <motion.button
              key={date.toISOString()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDateChange(date)}
              className={cn(
                "p-2 text-sm rounded-lg transition-colors duration-200",
                isSelected && "bg-primary text-white",
                !isSelected && isToday(date) && "bg-accent text-white",
                !isSelected && !isToday(date) && isCurrentMonth && "hover:bg-gray-100 text-gray-900",
                !isCurrentMonth && "text-gray-400"
              )}
            >
              {format(date, "d")}
            </motion.button>
          );
        })}
      </div>
      
      {/* Attendance List for Selected Date */}
      {selectedDate && (
        <div className="bg-white rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Attendance for {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          
          <div className="space-y-3">
            {students.map((student, index) => {
              const attendanceRecord = getAttendanceForDate(student.Id, selectedDate);
              
              return (
                <motion.div
                  key={student.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {student.firstName[0]}{student.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{student.gradeLevel}th Grade</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {attendanceRecord ? (
                      <StatusBadge status={attendanceRecord.status} type="attendance" />
                    ) : (
                      <span className="text-sm text-gray-500">Not marked</span>
                    )}
                    
                    <div className="flex space-x-1">
                      <Button
                        variant={attendanceRecord?.status === "present" ? "accent" : "outline"}
                        size="sm"
                        onClick={() => onMarkAttendance(student.Id, selectedDate, "present")}
                      >
                        <ApperIcon name="Check" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={attendanceRecord?.status === "absent" ? "danger" : "outline"}
                        size="sm"
                        onClick={() => onMarkAttendance(student.Id, selectedDate, "absent")}
                      >
                        <ApperIcon name="X" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={attendanceRecord?.status === "late" ? "warning" : "outline"}
                        size="sm"
                        onClick={() => onMarkAttendance(student.Id, selectedDate, "late")}
                      >
                        <ApperIcon name="Clock" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceGrid;