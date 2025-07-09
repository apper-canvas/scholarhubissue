import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import SelectField from "@/components/molecules/SelectField";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const GradeTable = ({ grades, students, onAddGrade, onUpdateGrade, onDeleteGrade }) => {
  const [isAddingGrade, setIsAddingGrade] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    assignmentName: "",
    category: "assignment",
    score: "",
    maxScore: "100",
    date: format(new Date(), "yyyy-MM-dd"),
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const gradeData = {
      ...formData,
      score: parseFloat(formData.score),
      maxScore: parseFloat(formData.maxScore),
    };
    
    if (editingGrade) {
      await onUpdateGrade(editingGrade.Id, gradeData);
      setEditingGrade(null);
    } else {
      await onAddGrade(gradeData);
      setIsAddingGrade(false);
    }
    
    setFormData({
      studentId: "",
      assignmentName: "",
      category: "assignment",
      score: "",
      maxScore: "100",
      date: format(new Date(), "yyyy-MM-dd"),
    });
  };
  
  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setFormData({
      studentId: grade.studentId,
      assignmentName: grade.assignmentName,
      category: grade.category,
      score: grade.score.toString(),
      maxScore: grade.maxScore.toString(),
      date: grade.date,
    });
    setIsAddingGrade(true);
  };
  
  const handleCancel = () => {
    setIsAddingGrade(false);
    setEditingGrade(null);
    setFormData({
      studentId: "",
      assignmentName: "",
      category: "assignment",
      score: "",
      maxScore: "100",
      date: format(new Date(), "yyyy-MM-dd"),
    });
  };
  
  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "Unknown";
  };
  
  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };
  
return (
    <div className="space-y-6">
      {/* Add Grade Button */}
      {!isAddingGrade && (
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => window.print()}>
            <ApperIcon name="Printer" className="h-4 w-4 mr-2" />
            Print Report Cards
          </Button>
          <Button variant="primary" onClick={() => setIsAddingGrade(true)}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Grade
          </Button>
        </div>
      )}
      
      {/* Add/Edit Grade Form */}
      {isAddingGrade && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingGrade ? "Edit Grade" : "Add New Grade"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Student"
                value={formData.studentId}
                onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                required
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.Id} value={student.Id}>
                    {student.firstName} {student.lastName} - {student.gradeLevel}th Grade
                  </option>
                ))}
              </SelectField>
              
              <FormField
                label="Assignment Name"
                value={formData.assignmentName}
                onChange={(e) => setFormData(prev => ({ ...prev, assignmentName: e.target.value }))}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="assignment">Assignment</option>
                <option value="quiz">Quiz</option>
                <option value="test">Test</option>
                <option value="project">Project</option>
                <option value="exam">Exam</option>
              </SelectField>
              
              <FormField
                label="Score"
                type="number"
                min="0"
                step="0.1"
                value={formData.score}
                onChange={(e) => setFormData(prev => ({ ...prev, score: e.target.value }))}
                required
              />
              
              <FormField
                label="Max Score"
                type="number"
                min="1"
                step="0.1"
                value={formData.maxScore}
                onChange={(e) => setFormData(prev => ({ ...prev, maxScore: e.target.value }))}
                required
              />
            </div>
            
            <FormField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
            
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingGrade ? "Update Grade" : "Add Grade"}
              </Button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Grades Table */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Assignment</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Percentage</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, index) => {
                const percentage = (grade.score / grade.maxScore) * 100;
                
                return (
                  <motion.tr
                    key={grade.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="table-row border-b border-gray-100"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {getStudentName(grade.studentId)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900">{grade.assignmentName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {grade.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900 font-medium">
                        {grade.score}/{grade.maxScore}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className={cn("font-semibold", getGradeColor(percentage))}>
                        {percentage.toFixed(1)}%
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-600">
                        {format(new Date(grade.date), "MMM d, yyyy")}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(grade)}
                        >
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteGrade(grade.Id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GradeTable;