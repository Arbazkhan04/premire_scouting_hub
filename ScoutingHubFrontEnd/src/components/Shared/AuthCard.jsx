import PropTypes from 'prop-types';

const AuthCard = ({ children }) => {
    return (
        <div className="p-8 rounded-lg border border-white/50 backdrop-blur-sm w-[450px] h-[70vh]">
            {children}
        </div>
    );
};

AuthCard.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthCard;
