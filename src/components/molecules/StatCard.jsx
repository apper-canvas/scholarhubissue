import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ title, value, icon, trend, trendValue, className }) => {
  const isPositive = trend === "up";
  
  return (
    <Card className={cn("stat-card", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className={cn("flex items-center mt-2", isPositive ? "text-green-600" : "text-red-600")}>
              <ApperIcon 
                name={isPositive ? "TrendingUp" : "TrendingDown"} 
                className="h-4 w-4 mr-1" 
              />
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-lg">
          <ApperIcon name={icon} className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;