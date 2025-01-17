import PropTypes from "prop-types";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";

Modal.setAppElement("#root"); // Accessibility binding

const ModalComponent = ({ isOpen, onClose, children }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            className="w-[90vw] max-w-lg p-0 mx-auto mt-20"
            closeTimeoutMS={300} // Matches the exit animation duration
        >
            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        key="modal-content"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }} // Closing animation
                        transition={{ duration: 0.3 }}
                        className="bg-blue-950 text-white w-full p-6 rounded-lg shadow-lg"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
};

ModalComponent.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default ModalComponent;
