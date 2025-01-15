import { FaUserEdit, FaCog, FaHeart } from "react-icons/fa";
import { AiOutlineRight } from "react-icons/ai";

const AccountSetting = () => {
    return (
        <div className=" min-h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white p-6">
            {/* Title */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-start">Account Setting</h1>
            </div>

            {/* Profile Section */}
            <div className="flex flex-col items-center mb-12">
                <div className="relative">
                    <img
                        src="/assets/accountsetting.jpg" // Replace with actual profile image URL
                        alt="profile"
                        className="w-28 h-28 rounded-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full">
                        <FaUserEdit className="text-white w-4 h-4" />
                    </div>
                </div>
                <h2 className="text-xl font-semibold mt-4">John Deo</h2>
                <p className="text-gray-300 hover:underline hover:text-blue-400 cursor-pointer">
                    johndoe@gmail.com
                </p>
            </div>

            {/* Option Cards */}
            <div className="flex flex-col items-center gap-4">
                {/* Setting Card */}
                <div className="w-3/4 bg-blue-950 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-blue-800 transition">
                    <div className="flex items-center gap-4">
                        <FaCog className="text-blue-400 w-6 h-6" />
                        <span className="text-lg font-semibold">Setting</span>
                    </div>
                    <AiOutlineRight className="text-white w-5 h-5" />
                </div>

                {/* Favourite List Card */}
                <div className="w-3/4 bg-blue-950 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-blue-800 transition">
                    <div className="flex items-center gap-4">
                        <FaHeart className="text-purple-400 w-6 h-6" />
                        <span className="text-lg font-semibold">Favourite List</span>
                    </div>
                    <AiOutlineRight className="text-white w-5 h-5" />
                </div>
            </div>
        </div>
    );
};

export default AccountSetting;
