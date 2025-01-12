import { useState } from 'react';
import PropTypes from 'prop-types';

const ToggleButton = ({ label }) => {
    const [enabled, setEnabled] = useState(false);

    return (
        <div className="flex items-center space-x-2">
            <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${enabled ? 'bg-blue-600' : 'bg-gray-400'
                    }`}
            >
                <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                ></div>
            </button>
            <span className="text-white text-sm">{label}</span>
        </div>
    );
};

// Add PropTypes validation for the label prop
ToggleButton.propTypes = {
    label: PropTypes.string.isRequired,
};

export default ToggleButton;
