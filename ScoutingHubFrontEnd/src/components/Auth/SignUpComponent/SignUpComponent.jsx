import AuthCard from '../../Shared/AuthCard';
import AuthForm from '../../Shared/AuthForm';

const SignUpComponent = () => {
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
                />
            </AuthCard>
        </div>
    );
};

export default SignUpComponent;
