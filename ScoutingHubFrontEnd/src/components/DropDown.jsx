import PropTypes from "prop-types";

const DropDown = ({ items, onItemClick }) => {
    return (
        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="block px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => onItemClick(item)} // Pass clicked item to parent handler
                >
                    {item.label}
                </div>
            ))}
        </div>
    );
};

// PropTypes validation
DropDown.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            href: PropTypes.string, // Optional
        })
    ).isRequired,
    onItemClick: PropTypes.func.isRequired,
};

export default DropDown;
