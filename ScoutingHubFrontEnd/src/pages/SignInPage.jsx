import SignIn from '../components/Auth/SignIn';

const SignInPage = () => {
    return (
        <div className="h-screen grid grid-cols-2">
            {/* Left Section */}
            <div
                className="relative bg-cover bg-center"
                style={{ backgroundImage: "url('/path-to-your-football-image.jpg')" }}
            >
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>

            {/* Right Section */}
            <div className="flex items-center justify-center bg-gradient-to-b from-blue-800 to-blue-900">
                <SignIn />
            </div>
        </div>
    );
};

export default SignInPage;
