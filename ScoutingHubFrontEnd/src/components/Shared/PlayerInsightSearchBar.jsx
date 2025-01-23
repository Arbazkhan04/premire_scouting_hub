import { FaSearch, FaSlidersH } from "react-icons/fa";

const PlayerInsightSearchBar = () => {
    return (
        <div className="flex items-center bg-gradient-to-r from-blue-800 to-blue-900 px-4 py-2 rounded-lg mx-aut">
            {/* Search Icon */}
            <div className="text-white mr-2 text-2xl"> {/* Increased icon size */}
                <FaSearch />
            </div>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search By Player/Team/Game..."
                className="flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none px-2"
            />

            {/* Filter Button */}
            <button className="bg-blue-800 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none ml-2 text-2xl"> {/* Increased icon size */}
                <FaSlidersH />
            </button>
        </div>
    );
};

export default PlayerInsightSearchBar;
