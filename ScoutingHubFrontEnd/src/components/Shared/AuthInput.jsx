import PropTypes from 'prop-types';

const AuthInput = ({ type, placeholder, value, onChange }) => {
    return (
        <div className="w-full">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full px-2 py-1 lg:px-4 lg:py-2 border border-gray-300 rounded-lg text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-4 placeholder:text-xs lg:placeholder:text-base"
            />
        </div>
    );
};

AuthInput.propTypes = {
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default AuthInput;
