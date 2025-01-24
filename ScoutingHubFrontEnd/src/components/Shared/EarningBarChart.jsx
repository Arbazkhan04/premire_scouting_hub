import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { EarningChartData } from "../TeamInsight/TeamInsightData";

const EarningBarChart = () => {
    return (
        <div className="bg-blue-950 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-xl font-semibold">Accounting</h2>
                <div className="text-blue-300 text-sm flex items-center space-x-2">
                    <span>Sort By:</span>
                    <select className="bg-blue-950 text-blue-300 border-none outline-none">
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
            </div>
            <p className="text-blue-300 text-sm mb-4">Overall Earnings</p>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={EarningChartData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#374151"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 2500]} // Adjust according to your data range
                    />
                    <Tooltip
                        cursor={{ fill: "rgba(59,130,246,0.2)" }}
                        contentStyle={{
                            backgroundColor: "#1E293B",
                            border: "none",
                            borderRadius: "5px",
                            color: "#FFFFFF",
                        }}
                        labelStyle={{ color: "#FFFFFF" }}
                        formatter={(value) => [`$${value}`, "Earnings"]}
                    />
                    <Bar
                        dataKey="earning"
                        fill="url(#colorEarnings)"
                        barSize={20}
                        radius={[5, 5, 0, 0]}
                    />
                    <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#1E40AF" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EarningBarChart;
