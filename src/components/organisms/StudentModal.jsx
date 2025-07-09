import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import SelectField from "@/components/molecules/SelectField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const StudentModal = ({ isOpen, onClose, student, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gradeLevel: 9,
    status: "active",
    gpa: 0.0,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gradeLevel: 9,
        status: "active",
        gpa: 0.0,
      });
    }
    setErrors({});
  }, [student, isOpen]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    if (formData.gpa < 0 || formData.gpa > 4) {
      newErrors.gpa = "GPA must be between 0.0 and 4.0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      toast.success(student ? "Student updated successfully" : "Student created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to save student");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 font-display">
                    {student ? "Edit Student" : "Add New Student"}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <ApperIcon name="X" className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    error={errors.firstName}
                    required
                  />
                  <FormField
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    error={errors.lastName}
                    required
                  />
                </div>
                
                <FormField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={errors.email}
                  required
                />
                
                <FormField
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  error={errors.phone}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <SelectField
                    label="Grade Level"
                    value={formData.gradeLevel}
                    onChange={(e) => handleInputChange("gradeLevel", parseInt(e.target.value))}
                    error={errors.gradeLevel}
                  >
                    {[9, 10, 11, 12].map(grade => (
                      <option key={grade} value={grade}>{grade}th Grade</option>
                    ))}
                  </SelectField>
                  
                  <SelectField
                    label="Status"
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    error={errors.status}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                  </SelectField>
                </div>
                
                <FormField
                  label="GPA"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={formData.gpa}
                  onChange={(e) => handleInputChange("gpa", parseFloat(e.target.value) || 0)}
                  error={errors.gpa}
                />
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                        {student ? "Update" : "Create"} Student
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StudentModal;