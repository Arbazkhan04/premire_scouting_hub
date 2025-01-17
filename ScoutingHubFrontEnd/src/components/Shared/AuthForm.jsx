import PropTypes from 'prop-types';
import SocialAuthButtons from './SocialAuthButtons';
import ToggleButton from '../Shared/ToggleButton';
import { useState } from 'react';
import AuthInput from './AuthInput';

const AuthForm = ({ formType, buttonText, footerText, footerLink, onLogin, onSignup }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formType === 'signup' && onSignup) {
            onSignup(name, email, password);
        } else if (formType === 'signin' && onLogin) {
            onLogin(email, password);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center space-y-4 w-full"
        >
            <SocialAuthButtons />
            <div className="text-center my-2 text-gray-500">or</div>

            {formType === 'signup' && (
                <AuthInput
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            )}
            <AuthInput
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <AuthInput
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {formType === 'signin' && (
                <div className="flex items-center justify-between w-full mb-4">
                    <ToggleButton label="Remember Me" />
                </div>
            )}

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-1 rounded-lg hover:bg-blue-700"
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

AuthForm.propTypes = {
    formType: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    footerText: PropTypes.string.isRequired,
    footerLink: PropTypes.string.isRequired,
    onSignup: PropTypes.func,
    onLogin: PropTypes.func,
};

export default AuthForm;
