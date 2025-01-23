import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import DropDownMenu from "../Shared/DropDownMenu"; // Reuse the shared dropdown component
import playersData from "./PlayerData"; // Reuse player data
import "./PlayerInsights.css"; // Import the CSS for styling

const PlayersComparison = () => {
    const [isPlayerADropdownOpen, setIsPlayerADropdownOpen] = useState(false);
    const [isPlayerBDropdownOpen, setIsPlayerBDropdownOpen] = useState(false);

    const [selectedPlayerA, setSelectedPlayerA] = useState("Player A"); // State for Player A
    const [selectedPlayerB, setSelectedPlayerB] = useState("Player B"); // State for Player B

    const playerADropdownRef = useRef(null);
    const playerBDropdownRef = useRef(null);

    const handleSelectPlayerA = (player) => {
        setSelectedPlayerA(player.label);
        setIsPlayerADropdownOpen(false); // Close dropdown after selection
    };

    const handleSelectPlayerB = (player) => {
        setSelectedPlayerB(player.label);
        setIsPlayerBDropdownOpen(false); // Close dropdown after selection
    };

    const handleOutsideClick = (event) => {
        // Close Player A dropdown if clicked outside
        if (playerADropdownRef.current && !playerADropdownRef.current.contains(event.target)) {
            setIsPlayerADropdownOpen(false);
        }

        // Close Player B dropdown if clicked outside
        if (playerBDropdownRef.current && !playerBDropdownRef.current.contains(event.target)) {
            setIsPlayerBDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <div className="bg-transparent p-4 rounded-lg col-span-12 flex justify-between items-center">
            {/* Left Section: Title */}
            <h2 className="text-lg font-bold text-white">Players Comparison</h2>

            {/* Right Section: Dropdowns */}
            <div className="flex space-x-4 me-16">
                {/* Player A Dropdown */}
                <div className="relative player-a-dropdown" ref={playerADropdownRef}>
                    <button
                        className="flex items-center text-white text-sm focus:outline-none bg-transparent hover:text-gray-300"
                        onClick={() => setIsPlayerADropdownOpen((prev) => !prev)}
                    >
                        {selectedPlayerA}
                        {isPlayerADropdownOpen ? (
                            <FaChevronUp className="ml-2" />
                        ) : (
                            <FaChevronDown className="ml-2" />
                        )}
                    </button>
                    <DropDownMenu
                        isOpen={isPlayerADropdownOpen}
                        options={playersData}
                        onSelect={(player) => handleSelectPlayerA(player)}
                        menuClassName="bg-white text-blue-900 mt-2 w-[180%]" // Increased width
                    />
                </div>

                {/* Player B Dropdown */}
                <div className="relative player-b-dropdown" ref={playerBDropdownRef}>
                    <button
                        className="flex items-center text-white text-sm focus:outline-none bg-transparent hover:text-gray-300"
                        onClick={() => setIsPlayerBDropdownOpen((prev) => !prev)}
                    >
                        {selectedPlayerB}
                        {isPlayerBDropdownOpen ? (
                            <FaChevronUp className="ml-2" />
                        ) : (
                            <FaChevronDown className="ml-2" />
                        )}
                    </button>
                    <DropDownMenu
                        isOpen={isPlayerBDropdownOpen}
                        options={playersData}
                        onSelect={(player) => handleSelectPlayerB(player)}
                        menuClassName="bg-white text-blue-900 mt-2 w-[180%]" // Increased width
                    />
                </div>
            </div>
        </div>
    );
};

export default PlayersComparison;
