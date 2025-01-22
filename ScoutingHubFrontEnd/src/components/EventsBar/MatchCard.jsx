import PropTypes from "prop-types";

const MatchCard = ({ team1, team1Flag, team2, team2Flag, score1, score2, overs }) => {
    return (
        <div className="bg-blue-900 text-white p-3 rounded-lg flex flex-col items-start w-full max-w-[200px]">
            <div className="text-sm font-semibold mb-2">Result</div>
            <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center space-x-2">
                    <img src={team1Flag} alt={team1} className="w-5 h-5 rounded-full" />
                    <span className="text-sm">{team1}</span>
                </div>
                <span className="font-bold">{score1}</span>
            </div>
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                    <img src={team2Flag} alt={team2} className="w-5 h-5 rounded-full" />
                    <span className="text-sm">{team2}</span>
                </div>
                <span className="font-bold">{score2}</span>
            </div>
            {overs && <div className="text-gray-300 text-xs mt-1">{overs}</div>}
        </div>
    );
};

MatchCard.propTypes = {
    team1: PropTypes.string.isRequired,
    team1Flag: PropTypes.string.isRequired,
    team2: PropTypes.string.isRequired,
    team2Flag: PropTypes.string.isRequired,
    score1: PropTypes.string.isRequired,
    score2: PropTypes.string.isRequired,
    overs: PropTypes.string,
};

export default MatchCard;
