// src/components/Auth/SignIn.jsx
import AuthCard from './AuthCard';
import SignInForm from './SignInForm';

const SignIn = () => {
    return (
        <div className="h-full flex items-center justify-center bg-gradient-to-r from-primary to-secondary">
            <AuthCard
                title="Nice To See You!"
                subtitle="Enter your email and password to sign in"
            >
                <SignInForm />
            </AuthCard>
        </div>
    );
};

export default SignIn;
