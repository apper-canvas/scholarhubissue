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

  return {
    attendance,
    loading,
    error,
    loadAttendance,
    markAttendance,
    getAttendanceByDate,
    getAttendanceByStudent
  };
};