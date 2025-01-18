import { FaUserEdit } from "react-icons/fa";
import { useSelector } from "react-redux";

const ProfileSection = () => {
    const { userInfo } = useSelector((state) => state.auth);
    return (
        <div className="flex flex-col items-center mb-12">
            <div className="relative">
                <img
                    src="/assets/accountsetting.jpg"
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full">
                    <FaUserEdit
                        className="text-white w-4 h-4 cursor-pointer"
                        onClick={() => console.log("Edit Profile Picture")}
                    />
                </div>
            </div>
            <h2 className="text-xl font-semibold mt-4">{userInfo.user.name}</h2>
            <p className="text-gray-300 hover:underline hover:text-blue-400 cursor-pointer">
                {userInfo.user.email}
            </p>
        </div>
    );
};

export default ProfileSection;
