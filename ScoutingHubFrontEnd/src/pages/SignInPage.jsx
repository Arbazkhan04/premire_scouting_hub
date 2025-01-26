import SignInComponent from '../components/Auth/SignInComponent/SignInComponent';

const SignInPage = () => {
    return (
        <div className="h-screen flex flex-col-reverse lg:grid lg:grid-cols-2 overflow-hidden">
            {/* Left Section */}
            <div className="relative h-[40vh] lg:h-screen">
                <img
                    src="/assets/sign-in.png" // Updated path
                    alt="Login"
                    className="w-full h-full object-cover bg-top"
                    loading="lazy" // Added lazy loading
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>

            {/* Right Section */}
            <div className="flex items-center justify-center bg-gradient-to-b from-blue-800 to-blue-900 h-[60vh] lg:h-screen">
                <SignInComponent />
            </div>
        </div>
    );
};

export default SignInPage;
