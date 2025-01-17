import { FaCog, FaHeart } from "react-icons/fa";
import ProfileSection from "../Shared/ProfileSection";
import SettingCard from "../Shared/SettingCard";

const AccountSettingComponent = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white p-6">
            {/* Title */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Account Setting</h1>
            </div>

            {/* Profile Section */}
            <ProfileSection />

            {/* Option Cards */}
            <div className="flex flex-col items-center gap-6 mt-6">
                {/* Setting Card */}
                <SettingCard
                    icon={<FaCog />}
                    title="Setting"
                    iconColor="blue-400"
                    onClick={() => console.log("Setting clicked")}
                />
                {/* Favourite List Card */}
                <SettingCard
                    icon={<FaHeart />}
                    title="Favourite List"
                    iconColor="purple-400"
                    onClick={() => console.log("Favourite List clicked")}
                />
            </div>
        </div>
    );
};

export default AccountSettingComponent;
