import AuthCard from '../../Shared/AuthCard';
import AuthForm from '../../Shared/AuthForm';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../../slices/usersApiSlice';
import { setCredentials } from '../../../slices/authSlice';
import { useDispatch } from 'react-redux';


const SignInComponent = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();

    const handleLogin = async (email, password) => {
        try {
            const response = await login({ email, password }).unwrap();
            dispatch(setCredentials(response));
            navigate('/welcome'); // Redirect after successful login
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        
            <div className="h-full flex flex-col items-center justify-center space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
                    <p className="text-white/75">Please enter your email and password to sign in.</p>
                </div>
                <AuthCard>
                    <AuthForm
                        formType="signin"
                        buttonText="SIGN IN"
                        footerText="Don't have an account?"
                    footerLink="/signup"
                    onLogin={handleLogin} // Pass handleLogin here
                    />
                </AuthCard>
            </div>
    );
};

export default SignInComponent;
