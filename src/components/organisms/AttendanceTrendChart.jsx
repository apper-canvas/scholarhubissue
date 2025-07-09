import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import { format, startOfDay, subDays } from "date-fns";
import { useAttendance } from "@/hooks/useAttendance";
import { useStudents } from "@/hooks/useStudents";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";

const AttendanceTrendChart = ({ department }) => {
  const [chartData, setChartData] = useState(null);
  const { attendance, loading, error } = useAttendance();
  const { students } = useStudents();

  useEffect(() => {
    if (attendance.length > 0 && students.length > 0) {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(startOfDay(new Date()), i);
        return format(date, "yyyy-MM-dd");
      }).reverse();

      // Filter students by department if provided
      const filteredStudents = department 
        ? students.filter(s => s.department === department)
        : students;
      
      const filteredStudentIds = filteredStudents.map(s => s.Id);

      const trendData = last7Days.map(date => {
        const dayAttendance = attendance.filter(a => a.date === date && filteredStudentIds.includes(a.studentId));
        const totalStudents = filteredStudents.length;
        const presentCount = dayAttendance.filter(a => a.status === 'present').length;
        const absentCount = totalStudents - presentCount;
        const attendanceRate = totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;

        return {
          date,
          presentCount,
          absentCount,
          attendanceRate
        };
      });

      const categories = trendData.map(d => format(new Date(d.date), "MMM dd"));
      const attendanceRates = trendData.map(d => Math.round(d.attendanceRate));
      const presentCounts = trendData.map(d => d.presentCount);
      const absentCounts = trendData.map(d => d.absentCount);

      setChartData({
        series: [
          {
            name: 'Attendance Rate (%)',
            type: 'line',
            data: attendanceRates,
            color: '#10B981'
          },
          {
            name: 'Present',
            type: 'column',
            data: presentCounts,
            color: '#3B82F6'
          },
          {
            name: 'Absent',
            type: 'column',
            data: absentCounts,
            color: '#EF4444'
          }
        ],
        options: {
          chart: {
            type: 'line',
            height: 350,
            fontFamily: 'Inter, system-ui, sans-serif',
            toolbar: {
              show: false
            }
          },
          stroke: {
            width: [3, 0, 0],
            curve: 'smooth'
          },
          plotOptions: {
            bar: {
              columnWidth: '50%'
            }
          },
          fill: {
            opacity: [1, 0.8, 0.8]
          },
          labels: categories,
          markers: {
            size: [6, 0, 0],
            strokeWidth: 2,
            fillOpacity: 1,
            strokeOpacity: 1,
            hover: {
              size: 8
            }
          },
          xaxis: {
            type: 'category',
            labels: {
              style: {
                fontSize: '12px',
                fontFamily: 'Inter, system-ui, sans-serif'
              }
            }
          },
          yaxis: [
            {
              title: {
                text: 'Attendance Rate (%)',
                style: {
                  fontSize: '14px',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }
              },
              min: 0,
              max: 100,
              labels: {
                style: {
                  fontSize: '12px',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }
              }
            },
            {
              opposite: true,
              title: {
                text: 'Student Count',
                style: {
                  fontSize: '14px',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }
              },
              labels: {
                style: {
                  fontSize: '12px',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }
              }
            }
          ],
          tooltip: {
            shared: true,
            intersect: false,
            y: [
              {
                formatter: function (val) {
                  return val + '%';
                }
              },
              {
                formatter: function (val) {
                  return val + ' students';
                }
              },
              {
                formatter: function (val) {
                  return val + ' students';
                }
              }
            ]
          },
          legend: {
            position: 'top',
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif'
          },
          responsive: [
            {
              breakpoint: 768,
              options: {
                chart: {
                  height: 300
                },
                plotOptions: {
                  bar: {
                    columnWidth: '70%'
                  }
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
  }, [attendance, students, department]);

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

  if (!chartData || chartData.series.every(s => s.data.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <ApperIcon name="TrendingUp" size={48} />
        <p className="mt-2 text-sm">No attendance data available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default AttendanceTrendChart;