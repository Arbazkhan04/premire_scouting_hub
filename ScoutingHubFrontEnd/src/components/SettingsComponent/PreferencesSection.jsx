import SettingCard from "../Shared/SettingCard";
import { FaLanguage, FaSignOutAlt } from "react-icons/fa";

const PreferencesSection = () => {
    return (
        <div className="w-[90vw] mx-auto">
            <h2 className="text-lg font-bold mb-4 text-left">Preferences</h2>
            <div className="space-y-4">
                <SettingCard
                    icon={<FaLanguage />}
                    title="Language"
                    iconColor="green-400"
                />
                <SettingCard
                    icon={<FaSignOutAlt />}
                    title="Logout"
                    iconColor="purple-400"
                />
            </div>
        </div>
    );
};

export default PreferencesSection;
