import PlayerCard from "../Shared/PlayerCard";
import { PlayerCardData, pieChartData } from "./PlayerData"; // Import data
import AlertCard from "./AlertCard";
import PlayerInsightSearchBar from "../Shared/PlayerInsightSearchBar";
import PlayersAreaChart from "../Shared/PlayersAreaChart";
import PlayersComparison from "./PlayersComparison";
import PlayersPieChart from "../Shared/PlayersPieChart";
import PlayerTable from "./PlayerTable";
import { AreaChartData } from "./PlayerData";

const PlayersInsights = () => {
    return (
        <div className="text-white overflow-clip">
            {/* Grid Section */}
            <div className="px-6 py-6 grid grid-cols-12 gap-6">
                {/* Player Insight Search Bar */}
                <div className="col-span-12">
                    <PlayerInsightSearchBar />
                </div>

                {/* Single Player Card */}
                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                    <PlayerCard
                        name={PlayerCardData.name}
                        age={PlayerCardData.age}
                        nationality={PlayerCardData.nationality}
                        position={PlayerCardData.position}
                        totalGoals={PlayerCardData.totalGoals}
                        assists={PlayerCardData.assists}
                        points={PlayerCardData.points}
                        image={PlayerCardData.image}
                    />
                </div>

                {/* Alerts Section */}
                <div className="col-span-12 sm:col-span-6 lg:col-span-8">
                    <AlertCard />
                </div>

                {/* Performance Updates */}
                <div className="col-span-12">
                    <PlayersAreaChart data={AreaChartData} />
                </div>

                <div className="col-span-12">
                    <PlayersComparison />
                </div>

                {/* Table Section */}
                <div className="col-span-12 xl:col-span-8">
                    <PlayerTable />
                </div>

                {/* Pie Chart Section */}
                <div className="col-span-12 xl:col-span-4">
                    <PlayersPieChart data={pieChartData} /> {/* Pass pieChartData as prop */}
                </div>
            </div>
        </div>
    );
};

export default PlayersInsights;
