import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import PrintPreviewModal from "@/components/organisms/PrintPreviewModal";
import { useStudents } from "@/hooks/useStudents";
import { useGrades } from "@/hooks/useGrades";
import ApperIcon from "@/components/ApperIcon";
import GradeTable from "@/components/organisms/GradeTable";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
const Grades = () => {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const { students, loading: studentsLoading, error: studentsError } = useStudents();
  const { 
    grades, 
    loading: gradesLoading, 
    error: gradesError,
    createGrade,
    updateGrade,
    deleteGrade
  } = useGrades();
  const loading = studentsLoading || gradesLoading;
  const error = studentsError || gradesError;

  const handleAddGrade = async (gradeData) => {
    try {
      await createGrade(gradeData);
      toast.success("Grade added successfully");
    } catch (error) {
      toast.error("Failed to add grade");
    }
  };

  const handleUpdateGrade = async (id, gradeData) => {
    try {
      await updateGrade(id, gradeData);
      toast.success("Grade updated successfully");
    } catch (error) {
      toast.error("Failed to update grade");
    }
  };

  const handleDeleteGrade = async (id) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      try {
        await deleteGrade(id);
        toast.success("Grade deleted successfully");
      } catch (error) {
        toast.error("Failed to delete grade");
      }
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
        message="You need to add students before you can manage grades."
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
            Grades
          </h1>
          <p className="text-gray-600 mt-1">
            Manage assignments, tests, and track student performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setIsPrintModalOpen(true)}
            disabled={students.length === 0}
          >
            <ApperIcon name="Printer" className="h-4 w-4 mr-2" />
            Print Report Cards
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {grades.length === 0 ? (
          <div className="bg-white rounded-lg shadow-card">
            <Empty
              title="No grades recorded"
              message="Start by adding grades for your students' assignments and tests."
              icon="BookOpen"
              actionLabel="Add Grade"
              onAction={() => {}}
            />
          </div>
        ) : (
          <GradeTable
            grades={grades}
            students={students}
            onAddGrade={handleAddGrade}
            onUpdateGrade={handleUpdateGrade}
            onDeleteGrade={handleDeleteGrade}
          />
)}
      </motion.div>

      <PrintPreviewModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        type="reportCard"
        data={grades}
        students={students}
        title="Print Report Cards"
      />
    </div>
  );
};

export default Grades;