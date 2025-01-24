import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const DropDownMenu = ({ isOpen, options, onSelect, menuClassName = "bg-white text-blue-900" }) => {
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
                    <ul className="py-2 bg-blue-950">
                        {options.map((item) => (
                            <li
                                key={item.id}
                                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-white hover:text-blue-950"
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

export default DropDownMenu;
