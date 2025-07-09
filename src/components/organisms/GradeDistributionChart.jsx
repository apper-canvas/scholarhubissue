import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useGrades } from "@/hooks/useGrades";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";

const GradeDistributionChart = () => {
  const { grades, loading, error, getGradeDistribution } = useGrades();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (grades.length > 0) {
      const distribution = getGradeDistribution();
      const labels = Object.keys(distribution);
      const series = Object.values(distribution);

      setChartData({
        series,
        options: {
          chart: {
            type: 'donut',
            height: 350,
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
  }, [grades, getGradeDistribution]);

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