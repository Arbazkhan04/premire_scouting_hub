import PlayerInsightSearchBar from "../Shared/PlayerInsightSearchBar";
import BarcelonaPlayersHeader from "./BarcelonaPlayersHeader";
import PlayerCardsList from "../Shared/PlayerCardsList";
import RosterAreaChart from "../Shared/RosterAreaChart";
import PlayersAreaChart from "../Shared/PlayersAreaChart";
import PlayerTable from "./PlayerTable";
import { AreaChartData, TeamInsightTableData } from "./TeamInsightData"; // Import TeamInsightTableData
import PerformanceUpdates from "../Shared/PerformanceUpdates";
import EarningBarChart from "../Shared/EarningBarChart";
import PlayersPieChart from "../Shared/PlayersPieChart";

const TeamInsight = () => {
    return (
        <div className="text-white overflow-clip">
            <div className="px-6 py-6 grid grid-cols-12 gap-6">
                {/* Player Insight Search Bar */}
                <div className="col-span-12">
                    <PlayerInsightSearchBar />
                </div>

                {/* Header */}
                <div className="col-span-12">
                    <BarcelonaPlayersHeader />
                </div>

                {/* Player Cards */}
                <div className="col-span-12">
                    <PlayerCardsList />
                </div>

                {/* Roster Details */}
                <div className="col-span-12">
                    <h1 className="text-xl font-bold text-white">Roster Details:</h1>
                </div>

                {/* Player Table */}
                <div className="col-span-6">
                    <PlayerTable
                        headers={TeamInsightTableData.headers} // Pass headers
                        rows={TeamInsightTableData.rows} // Pass rows
                    />
                </div>

                {/* Roster Area Chart */}
                <div className="col-span-6">
                    <RosterAreaChart />
                </div>

                {/* Performance Updates */}
                <div className="col-span-12">
                    <PerformanceUpdates />
                </div>

                {/* Players Area Chart */}
                <div className="col-span-12">
                    <PlayersAreaChart data={AreaChartData} />
                </div>

                {/* Performance Chart */}
                <div className="col-span-12">
                    <h1 className="text-xl font-bold text-white">Performance Chart:</h1>
                </div>

                {/* Earning Bar Chart */}
                <div className="col-span-8">
                    <EarningBarChart />
                </div>

                {/* Players Pie Chart */}
                <div className="col-span-4">
                    <PlayersPieChart />
                </div>

            </div>
        </div>
    );
};

export default TeamInsight;
