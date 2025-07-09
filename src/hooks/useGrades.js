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

  return {
    grades,
    loading,
    error,
    loadGrades,
    createGrade,
    updateGrade,
    deleteGrade,
    getGradesByStudent,
    getStudentGPA
  };
};