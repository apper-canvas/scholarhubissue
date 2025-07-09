import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = () => {
  const navigation = [
    { name: "Dashboard", to: "/", icon: "LayoutDashboard" },
    { name: "Students", to: "/students", icon: "Users" },
    { name: "Attendance", to: "/attendance", icon: "Calendar" },
    { name: "Grades", to: "/grades", icon: "BookOpen" },
    { name: "Reports", to: "/reports", icon: "BarChart3" },
  ];
  
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-gray-200 z-30">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-display">ScholarHub</h2>
            <p className="text-sm text-gray-500">Student Management</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 px-3">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )
                }
              >
                <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-emerald-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Teacher Account</p>
            <p className="text-xs text-gray-500">educator@school.edu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;