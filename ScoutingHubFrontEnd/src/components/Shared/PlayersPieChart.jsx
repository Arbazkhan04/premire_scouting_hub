import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { pieChartData } from "../PlayersInsights/PlayerData"; // Import pie chart data

const PlayersPieChart = () => {
    return (
        <div className="bg-blue-950 rounded-lg p-4 flex flex-col items-center h-full">
            <PieChart width={450} height={380}>
                <Pie
                    data={pieChartData}
                    dataKey="value"
                    cx="50%"
                    cy="45%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={3}
                    fill="#8884d8"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                >
                    {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        color: "#fff",
                    }}
                />
                <Legend
                    align="center"
                    verticalAlign="bottom"
                    layout="horizontal"
                    iconType="circle"
                    wrapperStyle={{
                        fontSize: "12px",
                        color: "white",
                    }}
                />
            </PieChart>
        </div>
    );
};

export default PlayersPieChart;
