import { Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import DashboardPage from '../pages/DashboardPage';
import PlayerTeamFavourites from '../components/PlayerTeamFavComponent/PlayerTeamFavorites';
import AccountSetting from '../components/AccountSettingComponent/AccountSettingComponent';
import SettingsPage from '../pages/SettingsPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Authentication Routes */}
            <Route path="/" element={<SignInPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardPage />}>
                {/* Redirect to account-setting */}
                <Route index element={<Navigate to="/dashboard/account-setting" replace />} />
                <Route path="player-team-favourites" element={<PlayerTeamFavourites />} />
                <Route path="account-setting" element={<AccountSetting />} />
                <Route path="setting" element={<SettingsPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
