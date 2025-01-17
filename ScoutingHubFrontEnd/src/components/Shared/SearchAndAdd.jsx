import PropTypes from "prop-types";
import { FaSearch } from "react-icons/fa"; // Import the magnifying icon

const SearchAndAdd = ({ placeholder, buttonLabel, onAdd }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center mb-4">
            {/* Search Input */}
            <div className="relative w-full">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300">
                    <FaSearch />
                </span>
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full px-12 py-4 rounded-full bg-blue-700 placeholder-gray-300 text-white focus:outline-none"
                />
            </div>

            {/* Add Button */}
            <button
                className="w-full sm:w-auto px-6 py-2 bg-blue-500 rounded-full hover:bg-blue-600 transition"
                onClick={onAdd}
            >
                {buttonLabel}
            </button>
        </div>
    );
};

// PropTypes validation
SearchAndAdd.propTypes = {
    placeholder: PropTypes.string.isRequired,
    buttonLabel: PropTypes.string.isRequired,
    onAdd: PropTypes.func.isRequired,
};

export default SearchAndAdd;
