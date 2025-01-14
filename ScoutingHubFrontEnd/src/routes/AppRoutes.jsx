import { Routes, Route } from 'react-router-dom';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage'; // Ensure default export is used


const AppRoutes = () => {
    

    return (
        <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/welcome" element={<h1>Welcome</h1>} />
            
        </Routes>
    );
};

export default AppRoutes;
