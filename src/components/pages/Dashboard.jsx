import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import GradeDistributionChart from "@/components/organisms/GradeDistributionChart";
import AttendanceTrendChart from "@/components/organisms/AttendanceTrendChart";
import SelectField from "@/components/molecules/SelectField";
import { useStudents } from "@/hooks/useStudents";
import { useAttendance } from "@/hooks/useAttendance";
import { useGrades } from "@/hooks/useGrades";
import { studentService } from "@/services/api/studentService";
const Dashboard = () => {
  const { students, loading: studentsLoading, error: studentsError } = useStudents();
  const { attendance, loading: attendanceLoading, error: attendanceError } = useAttendance();
  const { grades, loading: gradesLoading, error: gradesError } = useGrades();
  
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    averageGPA: 0,
    attendanceRate: 0
  });
  const loading = studentsLoading || attendanceLoading || gradesLoading;
  const error = studentsError || attendanceError || gradesError;

useEffect(() => {
    const loadDepartments = async () => {
      try {
        const depts = await studentService.getDepartments();
        setDepartments(depts);
      } catch (error) {
        console.error("Failed to load departments:", error);
      }
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    const filterStudents = async () => {
      if (selectedDepartment) {
        const filtered = await studentService.filterByDepartment(selectedDepartment);
        setFilteredStudents(filtered);
      } else {
        setFilteredStudents(students);
      }
    };
    filterStudents();
  }, [selectedDepartment, students]);

  useEffect(() => {
    if (filteredStudents.length > 0) {
      const totalStudents = filteredStudents.length;
      const activeStudents = filteredStudents.filter(s => s.status === "active").length;
      const averageGPA = filteredStudents.reduce((sum, s) => sum + s.gpa, 0) / totalStudents;
      
      // Calculate attendance rate for today
      const today = new Date().toISOString().split('T')[0];
      const studentIds = filteredStudents.map(s => s.Id);
      const todayAttendance = attendance.filter(a => a.date === today && studentIds.includes(a.studentId));
      const presentCount = todayAttendance.filter(a => a.status === "present").length;
      const attendanceRate = todayAttendance.length > 0 ? (presentCount / todayAttendance.length) * 100 : 0;

      setStats({
        totalStudents,
        activeStudents,
        averageGPA,
        attendanceRate
      });
    }
  }, [filteredStudents, attendance]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome to your student management dashboard
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </p>
        </div>
      </div>

      {/* Department Filter */}
      <div className="flex items-center justify-between">
        <div className="w-64">
          <SelectField
            label="Filter by Department"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </SelectField>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon="Users"
            trend="up"
            trendValue="+2 this week"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Active Students"
            value={stats.activeStudents}
            icon="UserCheck"
            trend="up"
            trendValue="+1 this week"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Average GPA"
            value={stats.averageGPA.toFixed(2)}
            icon="TrendingUp"
            trend="up"
            trendValue="+0.1 this month"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Attendance Rate"
            value={`${stats.attendanceRate.toFixed(1)}%`}
            icon="Calendar"
            trend={stats.attendanceRate > 90 ? "up" : "down"}
            trendValue={stats.attendanceRate > 90 ? "+2% this week" : "-1% this week"}
          />
        </motion.div>
</div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-card p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 font-display">
            Grade Distribution
          </h2>
<GradeDistributionChart department={selectedDepartment} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-card p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 font-display">
            Attendance Trends
          </h2>
<AttendanceTrendChart department={selectedDepartment} />
        </motion.div>
      </div>

      {/* Recent Activity */}
{/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 font-display">
            Recent Students
          </h2>
          <div className="space-y-3">
{filteredStudents.slice(0, 5).map((student, index) => (
              <div key={student.Id} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {student.firstName[0]}{student.lastName[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {student.gradeLevel}th Grade • GPA: {student.gpa}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow-card p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 font-display">
            Recent Grades
          </h2>
          <div className="space-y-3">
{grades.slice(0, 5).map((grade, index) => {
              const student = filteredStudents.find(s => s.Id === grade.studentId);
              const percentage = (grade.score / grade.maxScore) * 100;
              
              return (
                <div key={grade.Id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {student?.firstName} {student?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {grade.assignmentName} • {grade.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {grade.score}/{grade.maxScore}
                    </p>
                    <p className="text-sm text-gray-500">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;