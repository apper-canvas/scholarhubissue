import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, type = "student" }) => {
  const getStatusConfig = (status, type) => {
    switch (type) {
      case "student":
        switch (status) {
          case "active":
            return { variant: "success", text: "Active" };
          case "inactive":
            return { variant: "error", text: "Inactive" };
          case "graduated":
            return { variant: "info", text: "Graduated" };
          default:
            return { variant: "default", text: status };
        }
      case "attendance":
        switch (status) {
          case "present":
            return { variant: "success", text: "Present" };
          case "absent":
            return { variant: "error", text: "Absent" };
          case "late":
            return { variant: "warning", text: "Late" };
          case "excused":
            return { variant: "info", text: "Excused" };
          default:
            return { variant: "default", text: status };
        }
      case "grade":
        switch (status) {
          case "A":
          case "B":
            return { variant: "success", text: status };
          case "C":
            return { variant: "warning", text: status };
          case "D":
          case "F":
            return { variant: "error", text: status };
          default:
            return { variant: "default", text: status };
        }
      default:
        return { variant: "default", text: status };
    }
  };
  
  const { variant, text } = getStatusConfig(status, type);
  
  return <Badge variant={variant}>{text}</Badge>;
};

export default StatusBadge;