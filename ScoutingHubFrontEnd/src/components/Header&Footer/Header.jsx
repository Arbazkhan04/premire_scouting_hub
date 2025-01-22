import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate and Link
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons for the hamburger menu
import DropDown from "../DropDown";
import dropdownItems from "../DropDownItems";

const Header = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false); // State for dropdown visibility
    const [menuOpen, setMenuOpen] = useState(false); // State for sidebar menu
    const navigate = useNavigate(); // Initialize navigate function

    const toggleDropdown = () => setDropdownVisible((prev) => !prev);
    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const handleItemClick = (item) => {
        console.log(`Clicked on: ${item.label}`);
        setDropdownVisible(false); // Close dropdown after clicking
        setMenuOpen(false); // Close sidebar menu after navigation
        if (item.href) {
            navigate(item.href); // Navigate to the desired route
        }
    };

    // Automatically close the sidebar when the screen size is large or higher
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMenuOpen(false);
            }
        };

        // Attach event listener
        window.addEventListener("resize", handleResize);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <header className="sticky top-0 z-20 bg-[#001745] text-white shadow-lg">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Hamburger Menu Icon (visible below 1024px, on the left) */}
                <div className="lg:hidden">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        {menuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                    </button>
                </div>

                {/* Logo Section */}
                <Link to="/dashboard/account-setting"> {/* Wrap the image in a Link */}
                    <img
                        src="/assets/shield.png"
                        alt="Logo"
                        className="w-12 h-12 hidden lg:block" // Show only on large screens
                    />
                </Link>

                {/* Navigation Section (only visible on large screens) */}
                <nav className="hidden lg:flex lg:space-x-4 lg:justify-center">
                    <a
                        href="#"
                        className="px-4 py-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition"
                    >
                        Dashboard
                    </a>
                    <a
                        href="#"
                        className="px-4 py-2 rounded-full hover:bg-blue-700 hover:text-white transition"
                    >
                        Players Insights
                    </a>
                    <a
                        href="#"
                        className="px-4 py-2 rounded-full hover:bg-blue-700 hover:text-white transition"
                    >
                        Teams Insights
                    </a>
                    <a
                        href="#"
                        className="px-4 py-2 rounded-full hover:bg-blue-700 hover:text-white transition"
                    >
                        Games Insights
                    </a>
                    <a
                        href="#"
                        className="px-4 py-2 rounded-full hover:bg-blue-700 hover:text-white transition"
                    >
                        Subscription
                    </a>
                    <a
                        href="#"
                        className="px-4 py-2 rounded-full hover:bg-blue-700 hover:text-white transition"
                    >
                        Betting Odds
                    </a>
                </nav>

                {/* Profile Section */}
                <div>
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={toggleDropdown}
                    >
                        <img
                            src="/assets/accountsetting.jpg"
                            alt="Profile"
                            className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        />
                    </div>

                    {/* Use DropDown Component */}
                    <DropDown
                        items={dropdownItems}
                        onItemClick={handleItemClick}
                        isOpen={dropdownVisible}
                        onClose={() => setDropdownVisible(false)}
                    />
                </div>
            </div>

            {/* Backdrop */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleMenu} // Close sidebar when clicking outside
                ></div>
            )}

            {/* Sidebar Navigation (visible only on medium and smaller screens) */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-[#001745] text-white z-50 shadow-lg transform ${menuOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <Link to="/dashboard/account-setting"> {/* Add navigation to the sidebar logo */}
                        <img src="/assets/shield.png" alt="Sidebar Logo" className="w-8 h-" />
                    </Link>
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <a
                                href="#"
                                className="block px-4 py-2 rounded-md hover:bg-blue-800 transition"
                                onClick={toggleMenu}
                            >
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block px-4 py-2 rounded-md hover:bg-blue-800 transition"
                                onClick={toggleMenu}
                            >
                                Players Insights
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block px-4 py-2 rounded-md hover:bg-blue-800 transition"
                                onClick={toggleMenu}
                            >
                                Teams Insights
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block px-4 py-2 rounded-md hover:bg-blue-800 transition"
                                onClick={toggleMenu}
                            >
                                Games Insights
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block px-4 py-2 rounded-md hover:bg-blue-800 transition"
                                onClick={toggleMenu}
                            >
                                Subscription
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block px-4 py-2 rounded-md hover:bg-blue-800 transition"
                                onClick={toggleMenu}
                            >
                                Betting Odds
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;
