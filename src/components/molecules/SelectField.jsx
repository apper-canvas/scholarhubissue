import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const SelectField = ({ label, error, className, children, ...props }) => {
  return (
    <div className={cn("space-y-1", className)}>
      {label && <Label>{label}</Label>}
      <Select error={error} {...props}>
        {children}
      </Select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default SelectField;