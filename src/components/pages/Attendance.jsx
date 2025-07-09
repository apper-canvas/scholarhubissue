import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import PrintPreviewModal from "@/components/organisms/PrintPreviewModal";
import { useStudents } from "@/hooks/useStudents";
import { useAttendance } from "@/hooks/useAttendance";
import ApperIcon from "@/components/ApperIcon";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
const Attendance = () => {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const { students, loading: studentsLoading, error: studentsError } = useStudents();
  const { 
    attendance, 
    loading: attendanceLoading, 
    error: attendanceError, 
    markAttendance 
  } = useAttendance();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const loading = studentsLoading || attendanceLoading;
  const error = studentsError || attendanceError;

  const handleMarkAttendance = async (studentId, date, status) => {
    try {
      await markAttendance(studentId, date, status);
      toast.success("Attendance marked successfully");
    } catch (error) {
      toast.error("Failed to mark attendance");
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />;
  }

  if (students.length === 0) {
    return (
      <Empty
        title="No students found"
        message="You need to add students before you can track attendance."
        icon="Users"
        actionLabel="Add Students"
        onAction={() => window.location.href = "/students"}
      />
    );
  }

return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Attendance
          </h1>
          <p className="text-gray-600 mt-1">
            Track daily attendance and monitor student presence
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setIsPrintModalOpen(true)}
            disabled={students.length === 0}
          >
            <ApperIcon name="Printer" className="h-4 w-4 mr-2" />
            Print Attendance Sheet
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-card p-6"
      >
        <AttendanceGrid
          students={students}
          attendance={attendance}
          onMarkAttendance={handleMarkAttendance}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
/>
      </motion.div>

      <PrintPreviewModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        type="attendanceSheet"
        data={attendance}
        students={students}
        selectedDate={selectedDate}
        title="Print Attendance Sheet"
      />
    </div>
  );
};

export default Attendance;