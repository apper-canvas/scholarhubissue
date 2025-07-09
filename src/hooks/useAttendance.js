import { useState, useEffect } from "react";
import { attendanceService } from "@/services/api/attendanceService";

export const useAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await attendanceService.getAll();
      setAttendance(data);
    } catch (err) {
      setError(err.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (studentId, date, status, reason = "") => {
    try {
      const record = await attendanceService.markAttendance(studentId, date, status, reason);
      setAttendance(prev => {
        const existingIndex = prev.findIndex(a => 
          a.studentId === studentId && a.date === (typeof date === 'string' ? date : date.toISOString().split('T')[0])
        );
        
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = record;
          return updated;
        } else {
          return [...prev, record];
        }
      });
      return record;
    } catch (err) {
      throw new Error(err.message || "Failed to mark attendance");
    }
  };

  const getAttendanceByDate = async (date) => {
    try {
      const records = await attendanceService.getByDate(date);
      return records;
    } catch (err) {
      throw new Error(err.message || "Failed to get attendance by date");
    }
  };

  const getAttendanceByStudent = async (studentId) => {
    try {
      const records = await attendanceService.getByStudentId(studentId);
      return records;
    } catch (err) {
      throw new Error(err.message || "Failed to get student attendance");
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

const generateNotifications = () => {
    const notifications = [];
    
    // Get unique students from attendance data
    const studentAttendance = {};
    attendance.forEach(record => {
      if (!studentAttendance[record.studentId]) {
        studentAttendance[record.studentId] = { total: 0, present: 0 };
      }
      studentAttendance[record.studentId].total++;
      if (record.status === 'present') {
        studentAttendance[record.studentId].present++;
      }
    });
    
    // Generate notifications for low attendance
    Object.entries(studentAttendance).forEach(([studentId, data]) => {
      const attendanceRate = (data.present / data.total) * 100;
      if (attendanceRate < 80) {
        notifications.push({
          type: 'attendance',
          studentId: parseInt(studentId),
          message: `Low attendance alert: ${attendanceRate.toFixed(1)}% attendance rate`,
          priority: attendanceRate < 60 ? 'high' : 'medium'
        });
      }
    });
    
return notifications;
  };

  const getAttendanceTrends = () => {
    const trends = {};
    attendance.forEach(record => {
      if (!trends[record.date]) {
        trends[record.date] = { present: 0, absent: 0, late: 0, total: 0 };
      }
      trends[record.date][record.status]++;
      trends[record.date].total++;
    });

    return Object.entries(trends)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, data]) => ({
        date,
        attendanceRate: (data.present / data.total) * 100,
        present: data.present,
        absent: data.absent,
        late: data.late,
        total: data.total
      }));
  };

  const getMonthlyAttendance = () => {
    const monthly = {};
    attendance.forEach(record => {
      const month = record.date.substring(0, 7); // YYYY-MM
      if (!monthly[month]) {
        monthly[month] = { present: 0, absent: 0, late: 0, total: 0 };
      }
      monthly[month][record.status]++;
      monthly[month].total++;
    });

    return Object.entries(monthly)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([month, data]) => ({
        month,
        attendanceRate: (data.present / data.total) * 100,
        present: data.present,
        absent: data.absent,
        late: data.late,
        total: data.total
      }));
  };
return {
    attendance,
    loading,
    error,
    loadAttendance,
    markAttendance,
    getAttendanceByDate,
    getAttendanceByStudent,
    generateNotifications,
    getAttendanceTrends,
    getMonthlyAttendance
  };
};