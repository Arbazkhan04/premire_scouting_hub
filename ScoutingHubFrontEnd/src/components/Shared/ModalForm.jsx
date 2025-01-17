import PropTypes from "prop-types";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ModalForm = ({ fields, onClose, onSubmit }) => {
    const [visibility, setVisibility] = useState(
        fields.map(() => false) // Keep track of visibility for each field
    );

    const toggleVisibility = (index) => {
        setVisibility((prevVisibility) =>
            prevVisibility.map((visible, i) => (i === index ? !visible : visible))
        );
    };

    return (
        <form onSubmit={onSubmit}>
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
                                defaultValue={field.defaultValue}
                                placeholder={field.placeholder}
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
                    </div>
                ))}
            </div>

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
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                    Save Changes
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
};

export default ModalForm;
