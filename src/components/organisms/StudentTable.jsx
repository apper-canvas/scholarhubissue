import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";

const StudentTable = ({ students, onEdit, onDelete, onView }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const sortedStudents = [...students].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === "asc" 
      ? aValue - bValue
      : bValue - aValue;
  });
  
  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ApperIcon name="ArrowUpDown" className="h-4 w-4 text-gray-400" />;
    }
    return (
      <ApperIcon 
        name={sortDirection === "asc" ? "ArrowUp" : "ArrowDown"} 
        className="h-4 w-4 text-primary" 
      />
    );
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-3 px-4 font-medium text-gray-900">
              <button
                onClick={() => handleSort("firstName")}
                className="flex items-center space-x-2 hover:text-primary"
              >
                <span>Name</span>
                <SortIcon field="firstName" />
              </button>
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">
              <button
                onClick={() => handleSort("gradeLevel")}
                className="flex items-center space-x-2 hover:text-primary"
              >
                <span>Grade</span>
                <SortIcon field="gradeLevel" />
              </button>
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">
              <button
                onClick={() => handleSort("gpa")}
                className="flex items-center space-x-2 hover:text-primary"
              >
                <span>GPA</span>
                <SortIcon field="gpa" />
              </button>
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((student, index) => (
            <motion.tr
              key={student.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="table-row border-b border-gray-100"
            >
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {student.firstName[0]}{student.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge variant="info">{student.gradeLevel}th Grade</Badge>
              </td>
              <td className="py-3 px-4">
                <span className="font-medium text-gray-900">
                  {student.gpa.toFixed(2)}
                </span>
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={student.status} type="student" />
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(student)}
                  >
                    <ApperIcon name="Eye" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(student)}
                  >
                    <ApperIcon name="Edit" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(student.Id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;