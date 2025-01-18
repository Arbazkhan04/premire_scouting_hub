import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const GuestRoute = ({ children }) => {
    const { userInfo } = useSelector((state) => state.auth);

    if (userInfo) {
        // Redirect to dashboard if userInfo exists
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

GuestRoute.propTypes = {
    children: PropTypes.node.isRequired, // Ensure children are provided
};

export default GuestRoute;
