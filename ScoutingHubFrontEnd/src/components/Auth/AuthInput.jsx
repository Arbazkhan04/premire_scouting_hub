import PropTypes from 'prop-types';

const AuthInput = ({ type, placeholder }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
        />
    );
};

AuthInput.propTypes = {
    type: PropTypes.string.isRequired,        // Type must be a string and is required
    placeholder: PropTypes.string.isRequired, // Placeholder must be a string and is required
};

export default AuthInput;
