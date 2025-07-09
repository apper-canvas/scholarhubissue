import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { useStudents } from "@/hooks/useStudents";
import { useAttendance } from "@/hooks/useAttendance";
import { useGrades } from "@/hooks/useGrades";
import { cn } from "@/utils/cn";

const Reports = () => {
  const { students, loading: studentsLoading, error: studentsError } = useStudents();
  const { attendance, loading: attendanceLoading, error: attendanceError } = useAttendance();
  const { grades, loading: gradesLoading, error: gradesError } = useGrades();
  
  const [reportData, setReportData] = useState({
    classOverview: {},
    gradeDistribution: {},
    attendanceStats: {},
    performanceMetrics: {}
  });

  const loading = studentsLoading || attendanceLoading || gradesLoading;
  const error = studentsError || attendanceError || gradesError;

  useEffect(() => {
    if (students.length > 0 && attendance.length > 0 && grades.length > 0) {
      generateReports();
    }
  }, [students, attendance, grades]);

  const generateReports = () => {
    // Class Overview
    const classOverview = {
      totalStudents: students.length,
      activeStudents: students.filter(s => s.status === "active").length,
      gradeDistribution: students.reduce((acc, student) => {
        acc[student.gradeLevel] = (acc[student.gradeLevel] || 0) + 1;
        return acc;
      }, {}),
      averageGPA: students.reduce((sum, s) => sum + s.gpa, 0) / students.length
    };

    // Grade Distribution
    const gradeDistribution = grades.reduce((acc, grade) => {
      const percentage = (grade.score / grade.maxScore) * 100;
      let letterGrade = "F";
      if (percentage >= 90) letterGrade = "A";
      else if (percentage >= 80) letterGrade = "B";
      else if (percentage >= 70) letterGrade = "C";
      else if (percentage >= 60) letterGrade = "D";
      
      acc[letterGrade] = (acc[letterGrade] || 0) + 1;
      return acc;
    }, {});

    // Attendance Stats
    const totalAttendanceRecords = attendance.length;
    const presentCount = attendance.filter(a => a.status === "present").length;
    const absentCount = attendance.filter(a => a.status === "absent").length;
    const lateCount = attendance.filter(a => a.status === "late").length;

    const attendanceStats = {
      totalRecords: totalAttendanceRecords,
      presentRate: totalAttendanceRecords > 0 ? (presentCount / totalAttendanceRecords) * 100 : 0,
      absentRate: totalAttendanceRecords > 0 ? (absentCount / totalAttendanceRecords) * 100 : 0,
      lateRate: totalAttendanceRecords > 0 ? (lateCount / totalAttendanceRecords) * 100 : 0
    };

    // Performance Metrics
    const performanceMetrics = {
      averageScore: grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length,
      highestScore: Math.max(...grades.map(g => (g.score / g.maxScore) * 100)),
      lowestScore: Math.min(...grades.map(g => (g.score / g.maxScore) * 100)),
      totalAssignments: grades.length
    };

    setReportData({
      classOverview,
      gradeDistribution,
      attendanceStats,
      performanceMetrics
    });
  };

  const handleExportReport = () => {
    const reportContent = `
Class Report - ${format(new Date(), "MMMM d, yyyy")}

CLASS OVERVIEW
Total Students: ${reportData.classOverview.totalStudents}
Active Students: ${reportData.classOverview.activeStudents}
Average GPA: ${reportData.classOverview.averageGPA?.toFixed(2)}

ATTENDANCE STATISTICS
Present Rate: ${reportData.attendanceStats.presentRate?.toFixed(1)}%
Absent Rate: ${reportData.attendanceStats.absentRate?.toFixed(1)}%
Late Rate: ${reportData.attendanceStats.lateRate?.toFixed(1)}%

PERFORMANCE METRICS
Average Score: ${reportData.performanceMetrics.averageScore?.toFixed(1)}%
Highest Score: ${reportData.performanceMetrics.highestScore?.toFixed(1)}%
Lowest Score: ${reportData.performanceMetrics.lowestScore?.toFixed(1)}%
Total Assignments: ${reportData.performanceMetrics.totalAssignments}

GRADE DISTRIBUTION
${Object.entries(reportData.gradeDistribution || {}).map(([grade, count]) => `${grade}: ${count} students`).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `class-report-${format(new Date(), "yyyy-MM-dd")}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Reports
          </h1>
          <p className="text-gray-600 mt-1">
            Analyze performance data and generate comprehensive reports
          </p>
        </div>
        <Button variant="primary" onClick={handleExportReport}>
          <ApperIcon name="Download" className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Students"
            value={reportData.classOverview.totalStudents || 0}
            icon="Users"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Average GPA"
            value={reportData.classOverview.averageGPA?.toFixed(2) || "0.00"}
            icon="TrendingUp"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Present Rate"
            value={`${reportData.attendanceStats.presentRate?.toFixed(1) || 0}%`}
            icon="CheckCircle"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Average Score"
            value={`${reportData.performanceMetrics.averageScore?.toFixed(1) || 0}%`}
            icon="Award"
          />
        </motion.div>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 font-display">
              Grade Distribution
            </h2>
            <div className="space-y-3">
              {Object.entries(reportData.gradeDistribution || {}).map(([grade, count]) => (
                <div key={grade} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold",
                      grade === "A" ? "bg-green-500" :
                      grade === "B" ? "bg-blue-500" :
                      grade === "C" ? "bg-yellow-500" :
                      grade === "D" ? "bg-orange-500" : "bg-red-500"
                    )}>
                      {grade}
                    </span>
                    <span className="font-medium text-gray-900">{grade} Grade</span>
                  </div>
                  <span className="text-gray-600">{count} students</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Attendance Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 font-display">
              Attendance Breakdown
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Present</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {reportData.attendanceStats.presentRate?.toFixed(1) || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Absent</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {reportData.attendanceStats.absentRate?.toFixed(1) || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Late</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {reportData.attendanceStats.lateRate?.toFixed(1) || 0}%
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 font-display">
              Performance Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Highest Score</span>
                <span className="font-semibold text-green-600">
                  {reportData.performanceMetrics.highestScore?.toFixed(1) || 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Lowest Score</span>
                <span className="font-semibold text-red-600">
                  {reportData.performanceMetrics.lowestScore?.toFixed(1) || 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Assignments</span>
                <span className="font-semibold text-gray-900">
                  {reportData.performanceMetrics.totalAssignments || 0}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Grade Level Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 font-display">
              Grade Level Distribution
            </h2>
            <div className="space-y-3">
              {Object.entries(reportData.classOverview.gradeDistribution || {}).map(([grade, count]) => (
                <div key={grade} className="flex items-center justify-between">
                  <span className="text-gray-700">{grade}th Grade</span>
                  <span className="font-semibold text-gray-900">{count} students</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;