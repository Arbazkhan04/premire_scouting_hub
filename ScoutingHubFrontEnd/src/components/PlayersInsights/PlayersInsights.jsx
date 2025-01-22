import PlayerInsightSearchBar from "./PlayerInsightSearchBar";
import PerformanceUpdates from "./PerformanceUpdates";
import PlayersAreaChart from "../Shared/PlayersAreaChart";
import PlayersComparison from "./PlayersComparison";
import PlayersPieChart from "../Shared/PlayersPieChart";
import PlayCard from "../Shared/PlayCard";
import PlayersComparisonTable from "../Shared/PlayersComparisonTable";
import AlertCard from "./AlertCard";


const PlayersInsights = () => {
    return (
        <div className="text-white overflow-clip">

            {/* Grid Section */}
            <div className="px-6 py-6 grid grid-cols-12 gap-6">
                {/* Player Insight Search Bar */}
                <div className="col-span-12">
                    <PlayerInsightSearchBar />
                </div>

                {/* Player Card */}
                <div className="col-span-4">
                    <PlayCard />
                </div>

                {/* Alerts Section */}
                <div className="col-span-8">
                    <AlertCard />
                </div>

                {/* Performance Updates */}
                <div className="col-span-12">
                    <PerformanceUpdates />
                </div>

                {/* Performance Chart */}
                <div className="col-span-12">
                    <PlayersAreaChart />
                </div>

                <div className="col-span-12">
                    <PlayersComparison />
                </div>

                {/* Table Section */}
                <div className="col-span-8">
                    <PlayersComparisonTable />
                </div>

                {/* Pie Chart Section */}
                <div className="col-span-4">
                    <PlayersPieChart />
                </div>
            </div>
        </div>
    );
};

export default PlayersInsights;
