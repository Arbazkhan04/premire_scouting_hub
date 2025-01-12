import PropTypes from 'prop-types';
import AuthInput from './AuthInput';
import SocialAuthButtons from './SocialAuthButtons';
import ToggleButton from '../Shared/ToggleButton';

const AuthForm = ({ formType, buttonText, footerText, footerLink }) => {
    return (
        <form>
            <SocialAuthButtons />
            <div className="text-center my-4 text-gray-500">or</div>

            {/* Conditionally render the Name input for signup */}
            {formType === 'signup' && (
                <div className="mb-4">
                    <label className="block text-white text-sm mb-2" htmlFor="name">Name</label>
                    <AuthInput id="name" type="text" placeholder="Your full name" />
                </div>
            )}

            <div className="mb-4">
                <label className="block text-white text-sm mb-2" htmlFor="email">Email</label>
                <AuthInput id="email" type="email" placeholder="Your email address" />
            </div>

            <div className="mb-4">
                <label className="block text-white text-sm mb-2" htmlFor="password">Password</label>
                <AuthInput id="password" type="password" placeholder="Your password" />
            </div>

            {/* Only render the ToggleButton for signin */}
            {formType === 'signin' && (
                <div className="flex items-center justify-between mb-4">
                    <ToggleButton label="Remember Me" />
                </div>
            )}


            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
                {buttonText}
            </button>

            <p className="text-center mt-4 text-sm text-gray-500">
                {footerText}{' '}
                <a href={footerLink} className="text-blue-500 hover:underline">
                    {formType === 'signin' ? 'Sign up' : 'Sign in'}
                </a>
            </p>
        </form>
    );
};

// Add PropTypes validation
AuthForm.propTypes = {
    formType: PropTypes.string.isRequired,     // Ensures the formType is passed and is a string
    buttonText: PropTypes.string.isRequired,  // Ensures buttonText is passed and is a string
    footerText: PropTypes.string.isRequired,  // Ensures footerText is passed and is a string
    footerLink: PropTypes.string.isRequired,  // Ensures footerLink is passed and is a string
};

export default AuthForm;
