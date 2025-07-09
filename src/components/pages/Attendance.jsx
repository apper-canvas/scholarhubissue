import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useStudents } from "@/hooks/useStudents";
import { useAttendance } from "@/hooks/useAttendance";

const Attendance = () => {
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
    </div>
  );
};

export default Attendance;