import SignIn from '../components/Auth/SignInComponent/SignInComponent';
import loginImage from '../assets/loginpageimage.jpg'; // Correctly import the image

const SignInPage = () => {
    return (
        <div className="h-screen grid grid-cols-2">
            {/* Left Section */}
            <div className="relative ">
                <img src={loginImage} alt="Login" className="w-full max-h-screen object-cover bg-top" />
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
