const PlayerData = [
    { id: 1, label: "Player A" },
    { id: 2, label: "Player B" },
    { id: 3, label: "Player C" },
    { id: 4, label: "Player D" },
];

export const tableData = [
    { metric: "Goals Scored", playerA: 15, playerB: 12 },
    { metric: "Assists", playerA: 17, playerB: 7 },
    { metric: "Minutes Played", playerA: 1600, playerB: 1600 },
    { metric: "Pass Accuracy", playerA: "85%", playerB: "80%" },
    { metric: "Shots on Target", playerA: 25, playerB: 18 },
    { metric: "Fouls Committed", playerA: 5, playerB: 7 },
    { metric: "Yellow Cards", playerA: 2, playerB: 1 },
    { metric: "Red Cards", playerA: 0, playerB: 1 },
    { metric: "Saves", playerA: 8, playerB: 10 },
    { metric: "Offsides", playerA: 3, playerB: 2 },
    { metric: "Corners Taken", playerA: 7, playerB: 9 },
];

export const pieChartData = [
    { name: "Goals", value: 60, color: "#3b82f6" }, // Blue
    { name: "Green", value: 30, color: "#10b981" }, // Green
    { name: "Grey", value: 10, color: "#6b7280" },  // Grey
];

export const areaChartData = [
    { name: "Match 1", teamA: 20, teamB: 30, date: "Dec 2" },
    { name: "Match 2", teamA: 40, teamB: 50, date: "Dec 3" },
    { name: "Match 3", teamA: 60, teamB: 40, date: "Dec 4" },
    { name: "Match 4", teamA: 50, teamB: 70, date: "Dec 5" },
    { name: "Match 5", teamA: 70, teamB: 60, date: "Dec 6" },
    { name: "Match 6", teamA: 30, teamB: 20, date: "Dec 7" },
];

export const PlayerCardData = {
    name: "John Deo",
    age: 36,
    nationality: "Argentina",
    position: "Forward",
    totalGoals: 10,
    assists: 5,
    points: 8,
    image: "/public/assets/accountsetting.jpg",
};

export default PlayerData;
