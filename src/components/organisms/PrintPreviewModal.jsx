import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PrintPreviewModal = ({ 
  isOpen, 
  onClose, 
  type = "reportCard", // "reportCard" or "attendanceSheet"
  data,
  students,
  selectedDate,
  title
}) => {
  const [printOptions, setPrintOptions] = useState({
    includeHeader: true,
    includeFooter: true,
    orientation: "portrait"
  });

  const handlePrint = () => {
    window.print();
  };

  const getStudentName = (studentId) => {
    const student = students?.find(s => s.Id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "Unknown";
  };

  const getStudentGrades = (studentId) => {
    return data?.filter(grade => grade.studentId === studentId) || [];
  };

  const calculateGPA = (grades) => {
    if (!grades.length) return 0;
    const total = grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0);
    return (total / grades.length).toFixed(1);
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getAttendanceStats = (studentId) => {
    const studentAttendance = data?.filter(record => record.studentId === studentId) || [];
    const present = studentAttendance.filter(record => record.status === "present").length;
    const absent = studentAttendance.filter(record => record.status === "absent").length;
    const late = studentAttendance.filter(record => record.status === "late").length;
    const total = studentAttendance.length;
    
    return { present, absent, late, total, percentage: total > 0 ? ((present / total) * 100).toFixed(1) : 0 };
  };

  const renderReportCard = (student) => {
    const grades = getStudentGrades(student.Id);
    const gpa = calculateGPA(grades);
    const attendanceStats = getAttendanceStats(student.Id);

    return (
      <div key={student.Id} className="print-page bg-white p-8 mb-8 shadow-lg">
        {/* Header */}
        {printOptions.includeHeader && (
          <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ScholarHub Academy</h1>
            <h2 className="text-xl text-gray-700">Student Report Card</h2>
            <p className="text-sm text-gray-500 mt-2">
              Academic Year 2024-2025 | Generated on {format(new Date(), "MMMM d, yyyy")}
            </p>
          </div>
        )}

        {/* Student Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
              <p><strong>Student ID:</strong> {student.Id}</p>
              <p><strong>Grade Level:</strong> {student.gradeLevel}th Grade</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Phone:</strong> {student.phone}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Summary</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Overall GPA:</strong> <span className={cn("font-semibold", getGradeColor(parseFloat(gpa)))}>{gpa}%</span></p>
              <p><strong>Total Assignments:</strong> {grades.length}</p>
              <p><strong>Attendance Rate:</strong> {attendanceStats.percentage}%</p>
              <p><strong>Status:</strong> <span className={cn("font-semibold", parseFloat(gpa) >= 70 ? "text-green-600" : "text-red-600")}>{parseFloat(gpa) >= 70 ? "Passing" : "Needs Improvement"}</span></p>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Performance</h3>
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Assignment</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Category</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Score</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Percentage</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => {
                const percentage = (grade.score / grade.maxScore) * 100;
                return (
                  <tr key={grade.Id}>
                    <td className="border border-gray-300 px-3 py-2">{grade.assignmentName}</td>
                    <td className="border border-gray-300 px-3 py-2 capitalize">{grade.category}</td>
                    <td className="border border-gray-300 px-3 py-2">{grade.score}/{grade.maxScore}</td>
                    <td className={cn("border border-gray-300 px-3 py-2 font-semibold", getGradeColor(percentage))}>
                      {percentage.toFixed(1)}%
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {format(new Date(grade.date), "MMM d, yyyy")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Attendance Summary */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
              <div className="text-gray-600">Present</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded">
              <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
              <div className="text-gray-600">Absent</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded">
              <div className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</div>
              <div className="text-gray-600">Late</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{attendanceStats.total}</div>
              <div className="text-gray-600">Total Days</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {printOptions.includeFooter && (
          <div className="border-t-2 border-gray-300 pt-4 mt-8">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>
                <p>Teacher: [Teacher Name]</p>
                <p>Signature: _____________________</p>
              </div>
              <div>
                <p>Parent/Guardian: [Parent Name]</p>
                <p>Signature: _____________________</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAttendanceSheet = () => {
    const monthName = format(selectedDate, "MMMM yyyy");
    
    return (
      <div className="print-page bg-white p-8 shadow-lg">
        {/* Header */}
        {printOptions.includeHeader && (
          <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ScholarHub Academy</h1>
            <h2 className="text-xl text-gray-700">Attendance Sheet - {monthName}</h2>
            <p className="text-sm text-gray-500 mt-2">
              Generated on {format(new Date(), "MMMM d, yyyy")}
            </p>
          </div>
        )}

        {/* Attendance Table */}
        <div className="mb-8">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Student Name</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Grade</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Present</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Absent</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Late</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Total</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {students?.map((student) => {
                const stats = getAttendanceStats(student.Id);
                return (
                  <tr key={student.Id}>
                    <td className="border border-gray-300 px-3 py-2 font-medium">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {student.gradeLevel}th
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-green-600 font-semibold">
                      {stats.present}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-red-600 font-semibold">
                      {stats.absent}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-yellow-600 font-semibold">
                      {stats.late}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center font-semibold">
                      {stats.total}
                    </td>
                    <td className={cn("border border-gray-300 px-3 py-2 text-center font-semibold", 
                      parseFloat(stats.percentage) >= 90 ? "text-green-600" : 
                      parseFloat(stats.percentage) >= 80 ? "text-blue-600" : 
                      parseFloat(stats.percentage) >= 70 ? "text-yellow-600" : "text-red-600"
                    )}>
                      {stats.percentage}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{students?.length || 0}</div>
            <div className="text-gray-600">Total Students</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              {students?.reduce((avg, student) => avg + parseFloat(getAttendanceStats(student.Id).percentage), 0) / (students?.length || 1)}%
            </div>
            <div className="text-gray-600">Average Attendance</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{monthName}</div>
            <div className="text-gray-600">Reporting Period</div>
          </div>
        </div>

        {/* Footer */}
        {printOptions.includeFooter && (
          <div className="border-t-2 border-gray-300 pt-4 mt-8">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>
                <p>Teacher: [Teacher Name]</p>
                <p>Signature: _____________________</p>
              </div>
              <div>
                <p>Principal: [Principal Name]</p>
                <p>Signature: _____________________</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 no-print">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {type === "reportCard" ? "Preview student report cards before printing" : "Preview attendance sheet before printing"}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Print Options */}
              <div className="flex items-center space-x-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={printOptions.includeHeader}
                    onChange={(e) => setPrintOptions(prev => ({ ...prev, includeHeader: e.target.checked }))}
                    className="mr-2"
                  />
                  Include Header
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={printOptions.includeFooter}
                    onChange={(e) => setPrintOptions(prev => ({ ...prev, includeFooter: e.target.checked }))}
                    className="mr-2"
                  />
                  Include Footer
                </label>
              </div>
              
              <Button variant="primary" onClick={handlePrint}>
                <ApperIcon name="Printer" className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={onClose}>
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {type === "reportCard" ? (
              <div className="space-y-8">
                {students?.map(student => renderReportCard(student))}
              </div>
            ) : (
              renderAttendanceSheet()
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PrintPreviewModal;