import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa"; // Import the arrow icon
import DropdownMenu from "../Shared/DropDownMenu";
import EventDropDownData from "./EventDropDownData";

const EventBarDropDown = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSelect = (selectedItem) => {
        console.log("Selected:", selectedItem.label);
        setIsDropdownOpen(false); // Close dropdown after selection
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const closeDropdownOnOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", closeDropdownOnOutsideClick);
        return () => {
            document.removeEventListener("mousedown", closeDropdownOnOutsideClick);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Button */}
            <button
                onClick={toggleDropdown}
                className="flex items-center justify-between bg-blue-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
            >
                TOP EVENTS
                <FaChevronDown className="ml-2" />
            </button>

            {/* Dropdown Menu */}
            <DropdownMenu
                isOpen={isDropdownOpen}
                options={EventDropDownData}
                onSelect={handleSelect}
                menuClassName="bg-white text-blue-900 mt-2"
            />
        </div>
    );
};

export default EventBarDropDown;
