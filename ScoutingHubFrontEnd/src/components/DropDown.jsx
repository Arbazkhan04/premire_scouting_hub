import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";

const DropDown = ({ items, onItemClick, isOpen, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Hide body scroll on small and lower screens
            document.body.style.overflow = window.innerWidth <= 640 ? "hidden" : "auto";
        } else {
            // Restore scroll on close
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto"; // Ensure scroll is restored on unmount
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Delay to allow fade-out animation
    };

    if (!isOpen && !isVisible) return null; // Render nothing if not open or visible

    return (
        <div
            className={`fixed inset-0 z-50 bg-[#001745] bg-opacity-50 flex items-center justify-center ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                } transition-all duration-300`}
        >
            {/* Dropdown Container */}
            <div className="w-full h-full lg:w-1/2 lg:h-1/2 bg-[#001745] p-4 rounded-lg shadow-lg relative">
                {/* Close Button */}
                <div className="absolute top-4 right-4">
                    <button onClick={handleClose} className="text-white focus:outline-none">
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Dropdown Items */}
                <nav className="flex flex-col items-center justify-center h-full space-y-6 text-xl">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="cursor-pointer hover:text-orange-500"
                            onClick={() => {
                                onItemClick(item);
                                handleClose();
                            }}
                        >
                            {item.label}
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
};

DropDown.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            href: PropTypes.string,
        })
    ).isRequired,
    onItemClick: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default DropDown;
