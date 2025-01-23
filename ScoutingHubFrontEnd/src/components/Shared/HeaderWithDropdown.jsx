import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import PropTypes from "prop-types";
import DropDownMenu from "../Shared/DropDownMenu"; // Import the reusable dropdown component

const HeaderWithDropdown = ({ title, options, defaultLabel, onSelect }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultLabel); // State for selected option
    const dropdownButtonRef = useRef(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option.label); // Update the selected option
        setIsDropdownOpen(false); // Close dropdown after selection
        if (onSelect) onSelect(option); // Trigger the onSelect callback
    };

    const toggleDropdownState = (event) => {
        event.stopPropagation(); // Prevent click propagation to the document
        setIsDropdownOpen((prevState) => !prevState);
    };

    const closeDropdownOnOutsideClick = (event) => {
        if (
            dropdownButtonRef.current &&
            !dropdownButtonRef.current.contains(event.target)
        ) {
            setIsDropdownOpen(false); // Close dropdown if clicked outside
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", closeDropdownOnOutsideClick);
        return () => {
            document.removeEventListener("mousedown", closeDropdownOnOutsideClick);
        };
    }, []);

    return (
        <div className="flex justify-between items-center p-4">
            {/* Left Section: Title */}
            <h2 className="text-lg font-bold text-white">{title}</h2>

            {/* Right Section: Dropdown */}
            <div className="relative w-48">
                <button
                    ref={dropdownButtonRef}
                    onClick={toggleDropdownState}
                    className="flex items-center text-white text-sm focus:outline-none bg-transparent hover:text-gray-300"
                >
                    {selectedOption}
                    {isDropdownOpen ? (
                        <FaChevronUp className="ml-2 text-white" />
                    ) : (
                        <FaChevronDown className="ml-2 text-white" />
                    )}
                </button>

                {/* Use DropDownMenu Component */}
                <DropDownMenu
                    isOpen={isDropdownOpen}
                    options={options}
                    onSelect={(option) => handleOptionSelect(option)}
                    menuClassName="bg-white text-blue-900 mt-2 w-48" // Custom styles
                />
            </div>
        </div>
    );
};

// PropTypes validation
HeaderWithDropdown.propTypes = {
    title: PropTypes.string.isRequired, // Title is required and must be a string
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired, // Options must be an array of objects with 'id' and 'label'
    defaultLabel: PropTypes.string.isRequired, // Default label is required and must be a string
    onSelect: PropTypes.func, // onSelect is optional but must be a function if provided
};

export default HeaderWithDropdown;
