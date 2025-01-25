import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import PropTypes from "prop-types"; // Import PropTypes for validation

const PlayersPieChart = ({ data }) => {
    // Colors for the chart
    const colorScheme = ["#3B82F6", "#22C55E", "#9CA3AF"]; // Blue, Green, Grey

    return (
        <div className="bg-blue-950 rounded-lg p-4 flex flex-col items-center h-full">
            <PieChart width={450} height={380}>
                <Pie
                    data={data}
                    dataKey="value"
                    cx="50%"
                    cy="45%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={3}
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colorScheme[index % colorScheme.length]} />
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

// Prop validation
PlayersPieChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default PlayersPieChart;
