import PropTypes from "prop-types";

const PlayerCard = ({ name, age, nationality, position, totalGoals, assists, points, image }) => {
    return (
        <div className="bg-[#041139] p-6 rounded-lg flex flex-col items-center shadow-lg">
            {/* Player Image */}
            <img
                src={image}
                alt={name}
                className="w-20 h-20 rounded-full mb-4 border-4 border-blue-700 shadow-md"
            />
            {/* Player Name */}
            <h3 className="text-lg font-bold text-white">{name}</h3>
            <p className="text-sm text-gray-400 mb-2">{age} Years Old</p>
            {/* Player Details */}
            <div className="flex justify-between w-full text-sm text-gray-300 mb-4">
                <p>
                    Nationality: <span className="text-white font-semibold">{nationality}</span>
                </p>
                <p>
                    Position: <span className="text-white font-semibold">{position}</span>
                </p>
            </div>
            {/* Player Stats */}
            <div className="flex justify-between w-full border-t border-blue-800 pt-4">
                <div className="text-center">
                    <p className="text-sm text-gray-300">Total Goals</p>
                    <p className="text-lg font-bold text-red-400">{totalGoals}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-300">Assists</p>
                    <p className="text-lg font-bold text-green-400">{assists}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-300">Points</p>
                    <p className="text-lg font-bold text-blue-400">{points}</p>
                </div>
            </div>
        </div>
    );
};

PlayerCard.propTypes = {
    name: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    nationality: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    totalGoals: PropTypes.number.isRequired,
    assists: PropTypes.number.isRequired,
    points: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
};

export default PlayerCard;
