import PropTypes from 'prop-types';

const AuthCard = ({ children }) => {
    return (
        <div className="relative h-auto lg:h-[70vh] w-full  p-3 lg:p-10 rounded-lg border border-white/50 backdrop-blur-sm flex flex-col justify-center">
            {children}
        </div>
    );
};

AuthCard.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthCard;
