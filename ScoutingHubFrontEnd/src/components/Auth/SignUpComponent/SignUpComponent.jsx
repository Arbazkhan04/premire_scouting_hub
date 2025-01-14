import AuthCard from '../../Shared/AuthCard';
import AuthForm from '../../Shared/AuthForm';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../../slices/usersApiSlice';
import { setCredentials } from '../../../slices/authSlice';

const SignUpComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();

    const handleSignup = async (name, email, password) => {
        try {
            const response = await register({ name, email, password }).unwrap();
            dispatch(setCredentials(response));
            navigate('/welcome'); // Redirect to the welcome page after signup
        } catch (error) {
            console.error('Signup failed:', error);
        }
    };


    return (
        <div className="h-full flex flex-col items-center justify-center space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome!</h1>
                <p className="text-white/75">
                    Use these awesome forms to login or create a new account in your project for free.
                </p>
            </div>
            <AuthCard>
                <AuthForm
                    formType="signup"
                    buttonText="SIGN UP"
                    footerText="Already have an account?"
                    footerLink="/signin"
                    onSignup={handleSignup} // Pass the signup handler
                />
            </AuthCard>
        </div>
    );
};

export default SignUpComponent;
