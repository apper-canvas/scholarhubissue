import { useState, useEffect } from "react";
import { studentService } from "@/services/api/studentService";

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData) => {
    try {
      const newStudent = await studentService.create(studentData);
      setStudents(prev => [...prev, newStudent]);
      return newStudent;
    } catch (err) {
      throw new Error(err.message || "Failed to create student");
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      const updatedStudent = await studentService.update(id, studentData);
      setStudents(prev => 
        prev.map(student => student.Id === id ? updatedStudent : student)
      );
      return updatedStudent;
    } catch (err) {
      throw new Error(err.message || "Failed to update student");
    }
  };

  const deleteStudent = async (id) => {
    try {
      await studentService.delete(id);
      setStudents(prev => prev.filter(student => student.Id !== id));
    } catch (err) {
      throw new Error(err.message || "Failed to delete student");
    }
  };

  const searchStudents = async (query) => {
    setLoading(true);
    setError("");
    try {
      const results = await studentService.search(query);
      setStudents(results);
    } catch (err) {
      setError(err.message || "Failed to search students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

const generateNotifications = (grades = []) => {
    const notifications = [];
    
    // Generate notifications for students with failing grades
    const studentGrades = {};
    grades.forEach(grade => {
      if (!studentGrades[grade.studentId]) {
        studentGrades[grade.studentId] = [];
      }
      studentGrades[grade.studentId].push(grade);
    });
    
    Object.entries(studentGrades).forEach(([studentId, studentGradeList]) => {
      const avgGrade = studentGradeList.reduce((sum, g) => sum + g.score, 0) / studentGradeList.length;
      if (avgGrade < 60) {
        notifications.push({
          type: 'grade',
          studentId: parseInt(studentId),
          message: `Failing grade alert: ${avgGrade.toFixed(1)}% average score`,
          priority: avgGrade < 40 ? 'high' : 'medium'
        });
      }
    });
    
    return notifications;
  };

  return {
    students,
    loading,
    error,
    loadStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    generateNotifications
  };
};