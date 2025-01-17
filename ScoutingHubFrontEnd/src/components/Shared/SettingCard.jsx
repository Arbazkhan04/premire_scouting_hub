import PropTypes from "prop-types";
import { AiOutlineRight } from "react-icons/ai";

const SettingCard = ({ icon, title, onClick, iconColor }) => {
    return (
        <div
            className="flex items-center justify-between w-full bg-blue-950 p-4 rounded-lg cursor-pointer hover:bg-blue-800 transition"
            onClick={(e) => {
                e.preventDefault(); // Prevent default browser behavior
                onClick(); // Call the provided onClick handler
            }}
        >
            <div className="flex items-center gap-4">
                <div className={`text-${iconColor} w-6 h-6`}>{icon}</div>
                <span className="text-lg font-semibold">{title}</span>
            </div>
            <AiOutlineRight className="text-white w-5 h-5" />
        </div>
    );
};

SettingCard.propTypes = {
    icon: PropTypes.element.isRequired,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired, // onClick is required to ensure it's handled properly
    iconColor: PropTypes.string,
};

SettingCard.defaultProps = {
    iconColor: "white",
};

export default SettingCard;
