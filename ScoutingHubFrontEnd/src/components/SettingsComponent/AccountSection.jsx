import EditProfileModal from "../EditProfileModal/EditProfileModal";
import ChangePasswordModal from "../ChagePasswordModal/ChangePasswordModal";
import SettingCard from "../Shared/SettingCard";
import { FaBell, FaQuestionCircle } from "react-icons/fa";

const AccountSection = () => {
    return (
        <div className="w-[90vw] mx-auto">
            <h2 className="text-lg font-bold mb-4 text-left">Account</h2>
            <div className="space-y-4">
                <EditProfileModal />
                <ChangePasswordModal />
                <SettingCard icon={<FaBell />} title="Notification" iconColor="blue-400" />
                <SettingCard icon={<FaQuestionCircle />} title="Contact Support" iconColor="pink-400" />
            </div>
        </div>
    );
};

export default AccountSection;
