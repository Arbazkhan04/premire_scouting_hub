import { Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import DashboardPage from '../pages/DashboardPage';
import PlayerTeamFavourites from '../components/PlayerTeamFavComponent/PlayerTeamFavorites';
import AccountSetting from '../components/AccountSettingComponent/AccountSettingComponent';
import SettingsPage from '../pages/SettingsPage';
import ProtectedRoute from './ProtectedRoutes.jsx';
import GuestRoute from './GuestRoutes.jsx';
import { useSelector } from 'react-redux';
import PlayersInsightsMain from '../components/PlayersInsights/PlayersInsightsMain.jsx';
import TeamInsightMain from '../components/TeamInsight/TeamInsightMain.jsx';

const AppRoutes = () => {
    const { userInfo } = useSelector((state) => state.auth);

    return (
        <Routes>
            {/* Authentication Routes */}
            <Route path="/" element={<GuestRoute><SignInPage /></GuestRoute>} />
            <Route path="/signin" element={<GuestRoute><SignInPage /></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><SignUpPage /></GuestRoute>} />
            <Route path="/player-insight" element={<GuestRoute><PlayersInsightsMain /></GuestRoute>} />
            <Route path="/team-insight" element={<GuestRoute><TeamInsightMain /></GuestRoute>} />


            {/* Dashboard and Protected Routes */}
            <Route path="/dashboard" element={userInfo ? (<ProtectedRoute><DashboardPage /></ProtectedRoute>) : <Navigate to="/signin" replace />} >
                {/* Default redirect to account-setting */}
                <Route index element={<Navigate to="/dashboard/account-setting" replace />} />
                <Route path="player-team-favourites" element={<PlayerTeamFavourites />} />
                <Route path="account-setting" element={<AccountSetting />} />
                <Route path="setting" element={<SettingsPage />} />
            </Route>

            {/* Catch-all route to redirect unauthenticated users to signin */}
            <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
    );
};

export default AppRoutes;
