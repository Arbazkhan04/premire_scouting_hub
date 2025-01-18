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
            navigate('/dashboard');
        } catch (error) {
            console.error('Signup failed:', error);
        }
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center px-2 py-8 md:px-16 md:py-12 lg:py-16">
            <div className="text-center mt-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome!</h1>
                <p className="text-white/75 text-sm md:text-base">
                    Use these awesome forms to login or create a new account in your project for free.
                </p>
            </div>
            <div className="w-full 2xl:w-[80%] p-6 md:p-10 rounded-lg">
                <AuthCard>
                    <AuthForm
                        formType="signup"
                        buttonText="SIGN UP"
                        footerText="Already have an account?"
                        footerLink="/signin"
                        onSignup={handleSignup}
                    />
                </AuthCard>
            </div>
        </div>
    );
};

export default SignUpComponent;
