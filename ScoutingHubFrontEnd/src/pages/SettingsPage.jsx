import ProfileSection from "../components/Shared/ProfileSection";
import AccountSection from "../components/SettingsComponent/AccountSection";
import PreferencesSection from "../components/SettingsComponent/PreferencesSection";

const SettingsPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white p-6">
            {/* Title */}
            <h1 className="text-3xl font-bold mb-8">Setting</h1>

            {/* Profile Section */}
            <ProfileSection />

            {/* Account Section */}
            <AccountSection />

            {/* Preferences Section */}
            <PreferencesSection />
        </div>
    );
};

export default SettingsPage;
