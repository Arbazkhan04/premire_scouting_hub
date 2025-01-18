import AuthCard from '../../Shared/AuthCard';
import AuthForm from '../../Shared/AuthForm';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../../slices/usersApiSlice';
import { setCredentials } from '../../../slices/authSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

const SignInComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();
    const [error, setError] = useState(null); // State to track errors

    const handleLogin = async (email, password) => {
        setError(null);
        try {
            const response = await login({ email, password }).unwrap();
            if (response.error) {
                console.error('Login failed:', response.error);
                setError(response.error);
                return;
            }
            dispatch(setCredentials(response));
            navigate('/dashboard'); // Redirect after successful login
        } catch (error) {
            console.error('Login failed:', error);
            setError(error.data?.error || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center px-2 py-8 md:px-16 md:py-12 lg:py-16">
            <div className="text-center mt-6 ">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome Back!</h1>
                <p className="text-white/75 text-sm md:text-base">
                    Please enter your email and password to sign in.
                </p>
            </div>
            <div className="w-full 2xl:w-[80%] p-6 md:p-10 rounded-lg">
                <AuthCard>
                    <AuthForm
                        formType="signin"
                        buttonText="SIGN IN"
                        footerText="Don't have an account?"
                        footerLink="/signup"
                        onLogin={handleLogin}
                        error={error} // Pass the error state to AuthForm
                        isLoading={isLoading} // Disable the submit button during loading
                    />
                </AuthCard>
            </div>
        </div>
    );
};

export default SignInComponent;
