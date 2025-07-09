import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StudentTable from "@/components/organisms/StudentTable";
import StudentModal from "@/components/organisms/StudentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useStudents } from "@/hooks/useStudents";

const Students = () => {
  const { 
    students, 
    loading, 
    error, 
    loadStudents, 
    createStudent, 
    updateStudent, 
    deleteStudent, 
    searchStudents 
  } = useStudents();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleViewStudent = (student) => {
    // For now, just edit - in a real app, this would open a read-only view
    handleEditStudent(student);
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        toast.success("Student deleted successfully");
      } catch (error) {
        toast.error("Failed to delete student");
      }
    }
  };

  const handleSaveStudent = async (studentData) => {
    if (selectedStudent) {
      await updateStudent(selectedStudent.Id, studentData);
    } else {
      await createStudent(studentData);
    }
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    if (query.trim()) {
      searchStudents(query);
    } else {
      loadStudents();
    }
  };

  const handleRetry = () => {
    loadStudents();
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Students
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your student roster and information
          </p>
        </div>
        <Button variant="primary" onClick={handleAddStudent}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search students by name or email..."
          />
        </div>
      </div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-card overflow-hidden"
      >
        {students.length === 0 ? (
          <Empty
            title="No students found"
            message={searchTerm ? "No students match your search criteria." : "Get started by adding your first student to the system."}
            icon="Users"
            actionLabel="Add Student"
            onAction={handleAddStudent}
          />
        ) : (
          <StudentTable
            students={students}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            onView={handleViewStudent}
          />
        )}
      </motion.div>

      {/* Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
        onSave={handleSaveStudent}
      />
    </div>
  );
};

export default Students;