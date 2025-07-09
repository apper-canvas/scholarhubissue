import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import { useGrades } from "@/hooks/useGrades";
import { useStudents } from "@/hooks/useStudents";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";

const GradeDistributionChart = ({ department }) => {
  const { grades, loading: gradesLoading, error: gradesError } = useGrades();
  const { students, loading: studentsLoading, error: studentsError } = useStudents();
  const [chartData, setChartData] = useState(null);

  const loading = gradesLoading || studentsLoading;
  const error = gradesError || studentsError;

  useEffect(() => {
    if (grades.length > 0 && students.length > 0) {
      const gradeRanges = { A: 0, B: 0, C: 0, D: 0, F: 0 };
      
      // Filter students by department if provided
      const filteredStudents = department 
        ? students.filter(s => s.department === department)
        : students;
      
      const filteredStudentIds = filteredStudents.map(s => s.Id);
      
      grades.forEach(grade => {
        if (filteredStudentIds.includes(grade.studentId)) {
          const percentage = (grade.score / grade.maxScore) * 100;
          if (percentage >= 90) gradeRanges.A++;
          else if (percentage >= 80) gradeRanges.B++;
          else if (percentage >= 70) gradeRanges.C++;
          else if (percentage >= 60) gradeRanges.D++;
          else gradeRanges.F++;
        }
      });

      const labels = Object.keys(gradeRanges);
      const series = Object.values(gradeRanges);

      setChartData({
        series,
        options: {
          chart: {
            type: 'donut',
            fontFamily: 'Inter, system-ui, sans-serif'
          },
          labels,
          colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6B7280'],
          legend: {
            position: 'bottom',
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif'
          },
          plotOptions: {
            pie: {
              donut: {
                size: '65%',
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: 'Total Grades',
                    fontSize: '16px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    color: '#374151'
                  }
                }
              }
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val.toFixed(1) + '%';
            },
            style: {
              fontSize: '12px',
              fontFamily: 'Inter, system-ui, sans-serif'
            }
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + ' students';
              }
            }
          },
          responsive: [
            {
              breakpoint: 768,
              options: {
                chart: {
                  height: 300
                },
                legend: {
                  position: 'bottom'
                }
              }
            }
          ]
        }
      });
    }
  }, [grades, students, department]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Error message={error} />
      </div>
    );
  }

  if (!chartData || chartData.series.every(val => val === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <ApperIcon name="BarChart3" size={48} />
        <p className="mt-2 text-sm">No grade data available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="donut"
        height={350}
      />
    </div>
  );
};

export default GradeDistributionChart;