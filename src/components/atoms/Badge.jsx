import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "badge bg-gray-100 text-gray-800",
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error",
    info: "badge-info",
  };
  
  return (
    <span
      ref={ref}
      className={cn(variants[variant], className)}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;