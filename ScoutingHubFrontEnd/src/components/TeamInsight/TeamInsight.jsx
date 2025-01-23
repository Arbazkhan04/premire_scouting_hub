import PlayerInsightSearchBar from "../Shared/PlayerInsightSearchBar";
import BarcelonaPlayersHeader from "./BarcelonaPlayersHeader";
import PlayerCardsList from "../Shared/PlayerCardsList";

const TeamInsight = () => {
    return (
        <div className="text-white overflow-clip">
            <div className="px-6 py-6 grid grid-cols-12 gap-6">
                {/* Player Insight Search Bar */}
                <div className="col-span-12">
                    <PlayerInsightSearchBar />
                </div>

                <div className="col-span-12">
                    <BarcelonaPlayersHeader />
                </div>

                {/* Player Card */}
                <div className="col-span-12">
                    <PlayerCardsList />
                </div>

                {/* Roster Details */}
                <div className="col-span-12">
                    <h1 className="text-xl font-bold text-white">Roster Details:</h1>
                </div>


            </div>
        </div>
    );
};

export default TeamInsight;
