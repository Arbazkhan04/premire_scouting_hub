import PropTypes from "prop-types";
import { FaTrash } from "react-icons/fa"; // Import delete icon

const CardList = ({ title, items, onDelete }) => {
    return (
        <div>
            <h2 className="text-lg font-bold mb-4">{title}</h2>
            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between px-6 py-4 bg-blue-900 rounded-lg"
                    >
                        <div className="flex items-center space-x-4">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <span>{item.name}</span>
                        </div>
                        <button
                            className="text-red-500 hover:text-red-600 transition"
                            onClick={() => onDelete(item)}
                        >
                            <FaTrash className="w-5 h-5" /> {/* Delete icon */}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

CardList.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            image: PropTypes.string.isRequired,
        })
    ).isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default CardList;
