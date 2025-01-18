import PropTypes from "prop-types";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ModalForm = ({ fields, onClose, onSubmit, isSubmitting, error }) => {
    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => ({ ...acc, [field.label.toLowerCase()]: field.defaultValue }), {})
    );

    const [visibility, setVisibility] = useState(fields.map(() => false));
    const [fieldErrors, setFieldErrors] = useState({}); // Track field-specific errors

    const toggleVisibility = (index) => {
        setVisibility((prevVisibility) =>
            prevVisibility.map((visible, i) => (i === index ? !visible : visible))
        );
    };

    const handleChange = (field, value) => {
        setFormData((prevData) => ({ ...prevData, [field.toLowerCase()]: value }));
        setFieldErrors((prevErrors) => ({ ...prevErrors, [field.toLowerCase()]: null })); // Clear field errors on change
    };

    const validateFields = () => {
        const errors = {};

        // Example validations for passwords
        if (fields.some((field) => field.type === "password")) {
            if (!formData["current password"]) { 
                errors["current password"] = "Current password is required.";
            }
            if (!formData["new password"]) {
                errors["new password"] = "New password is required.";
            }
            if (formData["new password"] && formData["new password"].length < 8) {
                errors["new password"] = "Password must be at least 8 characters long.";
            }
            if (
                formData["new password"] &&
                !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData["new password"])
            ) {
                errors["new password"] =
                    "Password must include uppercase, lowercase, number, and special character.";
            }
            if (!formData["confirm password"]) {
                errors["confirm password"] = "Confirm password is required.";
            }
            if (
                formData["new password"] &&
                formData["confirm password"] &&
                formData["new password"] !== formData["confirm password"]
            ) {
                errors["confirm password"] = "Passwords do not match.";
            }
        }
        
        if (formData["name"] && formData["name"].length < 1) { 
            errors["name"] = "Name is required.";
        }

        console.log(formData);
        console.log("errors: ",errors);

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Run validations
        const errors = validateFields();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return; // Stop submission if there are validation errors
        }

        onSubmit(formData); // Submit data to the parent handler
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={index} className="relative">
                        <label className="block text-sm font-medium mb-2">{field.label}</label>
                        <div className="relative">
                            <input
                                type={
                                    field.type === "password" && !visibility[index]
                                        ? "password"
                                        : "text"
                                }
                                value={formData[field.label.toLowerCase()]}
                                placeholder={field.placeholder}
                                onChange={(e) => handleChange(field.label, e.target.value)}
                                className="w-full px-4 py-2 rounded-md bg-blue-800 text-white focus:outline-none"
                            />
                            {field.type === "password" && (
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility(index)}
                                    className="absolute right-3 top-2/4 transform -translate-y-2/4 text-white"
                                >
                                    {visibility[index] ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            )}
                        </div>
                        {/* Field-specific error messages */}
                        {fieldErrors[field.label.toLowerCase()] && (
                            <p className="text-red-500 text-sm mt-1">
                                {fieldErrors[field.label.toLowerCase()]}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Backend error message */}
            {error && (
                <div className="mt-4 text-red-500 text-sm">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <div className="flex justify-end gap-4 mt-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-md text-white ${
                        isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
};

ModalForm.propTypes = {
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            type: PropTypes.string,
            defaultValue: PropTypes.string,
            placeholder: PropTypes.string,
        })
    ).isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    error: PropTypes.string,
};

export default ModalForm;
