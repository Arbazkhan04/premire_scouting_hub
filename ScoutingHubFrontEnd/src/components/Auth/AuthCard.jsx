// src/components/Auth/AuthCard.jsx
import PropTypes from 'prop-types';

const AuthCard = ({ title, subtitle, children }) => {
    return (
        <div className="p-8 rounded-lg shadow-xl w-full max-w-lg bg-transparent">
            <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">{title}</h1>
            <p className="text-gray-500 text-center mb-6">{subtitle}</p>
            {children}
        </div>
    );
};

AuthCard.propTypes = {
    title: PropTypes.string.isRequired,    // title must be a string and required
    subtitle: PropTypes.string,           // subtitle is a string but optional
    children: PropTypes.node.isRequired,  // children must be a valid React node
};

export default AuthCard;
