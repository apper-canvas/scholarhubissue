import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  message = "Get started by adding your first item.", 
  icon = "Database",
  actionLabel = "Add Item",
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="h-8 w-8 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2 font-display">
        {title}
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onAction && (
        <Button variant="primary" onClick={onAction}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;