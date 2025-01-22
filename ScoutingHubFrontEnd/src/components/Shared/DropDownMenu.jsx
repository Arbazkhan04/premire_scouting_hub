import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const DropDownMenu = ({ isOpen, options, onSelect, menuClassName }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute left-0 mt-1 w-full rounded-lg shadow-lg z-50 ${menuClassName}`}
                >
                    <ul className="py-2 px-">
                        {options.map((item) => (
                            <li
                                key={item.id}
                                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                onClick={() => onSelect(item)}
                            >
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

DropDownMenu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    onSelect: PropTypes.func.isRequired,
    menuClassName: PropTypes.string,
};

DropDownMenu.defaultProps = {
    menuClassName: "bg-white text-blue-900",
};

export default DropDownMenu;
