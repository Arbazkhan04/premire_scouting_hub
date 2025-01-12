import SignUpComponent from '../components/Auth/SignUpComponent/SignUpComponent';
import loginImage from '../assets/loginpageimage.jpg'; // Correctly import the image

const SignUpPage = () => {
    return (
        <div className="h-screen grid grid-cols-2">
            {/* Left Section */}
            <div className="relative overflow-hidden">
                <img
                    src={loginImage}
                    alt="Signup"
                    className="w-full h-full object-cover"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>

            {/* Right Section */}
            <div className="flex items-center justify-center bg-gradient-to-b from-blue-800 to-blue-900">
                <SignUpComponent />
            </div>
        </div>
    );
};

export default SignUpPage;
