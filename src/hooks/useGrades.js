import { useState, useEffect } from "react";
import { gradeService } from "@/services/api/gradeService";

export const useGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadGrades = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await gradeService.getAll();
      setGrades(data);
    } catch (err) {
      setError(err.message || "Failed to load grades");
    } finally {
      setLoading(false);
    }
  };

  const createGrade = async (gradeData) => {
    try {
      const newGrade = await gradeService.create(gradeData);
      setGrades(prev => [...prev, newGrade]);
      return newGrade;
    } catch (err) {
      throw new Error(err.message || "Failed to create grade");
    }
  };

  const updateGrade = async (id, gradeData) => {
    try {
      const updatedGrade = await gradeService.update(id, gradeData);
      setGrades(prev => 
        prev.map(grade => grade.Id === id ? updatedGrade : grade)
      );
      return updatedGrade;
    } catch (err) {
      throw new Error(err.message || "Failed to update grade");
    }
  };

  const deleteGrade = async (id) => {
    try {
      await gradeService.delete(id);
      setGrades(prev => prev.filter(grade => grade.Id !== id));
    } catch (err) {
      throw new Error(err.message || "Failed to delete grade");
    }
  };

  const getGradesByStudent = async (studentId) => {
    try {
      const studentGrades = await gradeService.getByStudentId(studentId);
      return studentGrades;
    } catch (err) {
      throw new Error(err.message || "Failed to get student grades");
    }
  };

  const getStudentGPA = async (studentId) => {
    try {
      const gpa = await gradeService.getStudentGPA(studentId);
      return gpa;
    } catch (err) {
      throw new Error(err.message || "Failed to calculate GPA");
    }
  };

  useEffect(() => {
    loadGrades();
  }, []);

const generateNotifications = () => {
    const notifications = [];
    
    // Generate notifications for failing grades
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

  const getGradeDistribution = () => {
    const distribution = {
      'A (90-100%)': 0,
      'B (80-89%)': 0,
      'C (70-79%)': 0,
      'D (60-69%)': 0,
      'F (0-59%)': 0
    };

    grades.forEach(grade => {
      const percentage = (grade.score / grade.maxScore) * 100;
      if (percentage >= 90) distribution['A (90-100%)']++;
      else if (percentage >= 80) distribution['B (80-89%)']++;
      else if (percentage >= 70) distribution['C (70-79%)']++;
      else if (percentage >= 60) distribution['D (60-69%)']++;
      else distribution['F (0-59%)']++;
    });

    return distribution;
  };

  const getGradesByCategory = () => {
    const categories = {};
    grades.forEach(grade => {
      if (!categories[grade.category]) {
        categories[grade.category] = [];
      }
      categories[grade.category].push(grade);
    });

    return Object.entries(categories).map(([category, gradeList]) => ({
      category,
      average: gradeList.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / gradeList.length,
      count: gradeList.length
    }));
  };
return {
    grades,
    loading,
    error,
    loadGrades,
    createGrade,
    updateGrade,
    deleteGrade,
    getGradesByStudent,
    getStudentGPA,
    generateNotifications,
    getGradeDistribution,
    getGradesByCategory
  };
};