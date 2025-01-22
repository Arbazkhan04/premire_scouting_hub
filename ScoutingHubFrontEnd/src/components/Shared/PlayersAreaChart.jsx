import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { areaChartData } from "../PlayersInsights/PlayerData"; // Import the area chart data

const PlayersAreaChart = () => {
    return (
        <div className="bg-blue-950 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={areaChartData} // Use the imported data
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                    <CartesianGrid
                        strokeDasharray="2 2"
                        stroke="#3b4c7c"
                        horizontal={true}
                        vertical={false}
                    />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: "#d1d5db", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: "#d1d5db", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "none",
                            color: "#fff",
                        }}
                        cursor={{ fill: "rgba(96,165,250,0.2)" }}
                    />
                    <Area
                        type="monotone"
                        dataKey="teamA"
                        stroke="#60a5fa"
                        fill="url(#colorTeamA)"
                        strokeWidth={2}
                    />
                    <Area
                        type="monotone"
                        dataKey="teamB"
                        stroke="#34d399"
                        fill="url(#colorTeamB)"
                        strokeWidth={2}
                    />
                    <defs>
                        <linearGradient id="colorTeamA" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorTeamB" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#065f46" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PlayersAreaChart;
