import PropTypes from 'prop-types';

const AuthInput = ({ type, placeholder }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className="w-full px-4 py-2 border rounded-lg text-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary mb-4"
        />
    );
};

AuthInput.propTypes = {
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
};

export default AuthInput;
