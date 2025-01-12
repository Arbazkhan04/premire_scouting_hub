// src/components/Auth/SignInForm.jsx
import AuthInput from './AuthInput';
import SocialAuthButtons from './SocialAuthButtons';

const SignInForm = () => {
    return (
        <form>
            <SocialAuthButtons />
            <div className="text-center my-4 text-gray-500">or</div>
            <AuthInput type="email" placeholder="Your Email Address" />
            <AuthInput type="password" placeholder="Your Password" />
            <div className="flex items-center justify-between mb-4">
                <label className="flex items-center text-sm text-gray-700">
                    <input type="checkbox" className="form-checkbox mr-2" />
                    Remember Me
                </label>
                <a href="#" className="text-sm text-blue-500 hover:underline">
                    Forgot Password?
                </a>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
                SIGN IN
            </button>
            <p className="text-center mt-4 text-sm text-gray-500">
                Don’t Have An Account?{' '}
                <a href="/signup" className="text-blue-500 hover:underline">
                    Sign Up
                </a>
            </p>
        </form>
    );
};

export default SignInForm;
