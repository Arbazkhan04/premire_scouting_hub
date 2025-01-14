import PropTypes from 'prop-types';
import SocialAuthButtons from './SocialAuthButtons';
import ToggleButton from '../Shared/ToggleButton';
import { useState } from 'react';

const AuthForm = ({ formType, buttonText, footerText, footerLink, onLogin, onSignup }) => {


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formType === 'signup' && onSignup) {
            onSignup(name, email, password); // Pass name, email, and password for signup
        } else if (formType === 'signin' && onLogin) {
            onLogin(email, password); // Pass email and password for login
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <SocialAuthButtons />
            <div className="text-center my-4 text-gray-500">or</div>

            {/* Conditionally render the Name input for signup */}
            {formType === 'signup' && (
                <div className="mb-4">
                    <label className="block text-white text-sm mb-2" htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                    />
                </div>
            )}

            <div className="mb-4">
                <label className="block text-white text-sm mb-2" htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                />
            </div>

            <div className="mb-4">
                <label className="block text-white text-sm mb-2" htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                />
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
    onSignup: PropTypes.func, // Signup handler
    onLogin: PropTypes.func,  // Login handler
};

export default AuthForm;
