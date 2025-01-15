import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons for the hamburger menu
import DropDown from "../DropDown";
import dropdownItems from "../DropDownItems";

const Header = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); // State for hamburger menu
    const navigate = useNavigate(); // Initialize navigate function

    const toggleDropdown = () => setDropdownVisible((prev) => !prev);
    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const handleItemClick = (item) => {
        console.log(`Clicked on: ${item.label}`);
        setDropdownVisible(false); // Close dropdown after clicking
        setMenuOpen(false); // Close menu after navigation
        if (item.href) {
            navigate(item.href); // Navigate to the desired route
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-[#001745] text-white shadow-lg">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Logo Section */}
                <img src="/assets/shield.png" alt="Logo" className="w-12 h-12" />

                {/* Hamburger Menu Icon (visible below 1024px) */}
                <div className="lg:hidden">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        {menuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                    </button>
                </div>

                {/* Navigation Section */}
                <nav
                    className={`${menuOpen ? "block" : "hidden"
                        } lg:flex lg:space-x-4 flex-col lg:flex-row space-y-4 lg:space-y-0 absolute lg:static top-full left-0 w-full bg-[#001745] lg:bg-transparent py-4 lg:py-0 lg:justify-center`}
                >
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
                <div className="relative">
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
                    {dropdownVisible && (
                        <DropDown items={dropdownItems} onItemClick={handleItemClick} />
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
