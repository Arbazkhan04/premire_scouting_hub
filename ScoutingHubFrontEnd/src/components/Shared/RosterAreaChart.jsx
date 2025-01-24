import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RosterChartData } from "../TeamInsight/TeamInsightData";

const RosterAreaChart = () => {
    return (
        <div className="bg-blue-950 rounded-lg p-4 shadow-md">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={RosterChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#243b55" />
                    <XAxis dataKey="month" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "none",
                            borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#fff" }}
                        itemStyle={{ color: "#fff" }}
                    />
                    <Line type="monotone" dataKey="wins" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="losses" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RosterAreaChart;
