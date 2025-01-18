import SettingCard from "../Shared/SettingCard";
import { FaLanguage, FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { logout } from "../../slices/authSlice";

const PreferencesSection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
                    onClick={() => {
                        dispatch(logout());
                        navigate('/');
                    }}
                />
            </div>
        </div>
    );
};

export default PreferencesSection;
