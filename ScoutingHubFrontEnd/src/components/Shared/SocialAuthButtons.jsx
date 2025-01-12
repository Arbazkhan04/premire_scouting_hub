import { FaFacebook, FaApple, FaGoogle } from 'react-icons/fa';

const SocialAuthButtons = () => {
    return (
        <div className="flex justify-center space-x-4 mb-4">
            {/* Facebook Button */}
            <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-white to-gray-400 p-[2px]">
                <button className="w-full h-full bg-blue-900 text-white rounded-lg flex items-center justify-center hover:bg-blue-700">
                    <FaFacebook size={28} />
                </button>
            </div>

            {/* Apple Button */}
            <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-white to-gray-400 p-[2px]">
                <button className="w-full h-full bg-blue-900 text-white rounded-lg flex items-center justify-center hover:bg-black">
                    <FaApple size={28} />
                </button>
            </div>

            {/* Google Button */}
            <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-white to-gray-400 p-[2px]">
                <button className="w-full h-full bg-blue-900 text-white rounded-lg flex items-center justify-center hover:bg-red-600">
                    <FaGoogle size={28} />
                </button>
            </div>
        </div>
    );
};

export default SocialAuthButtons;
