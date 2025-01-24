const TeamInsightData = [
    { id: 1, label: "Player A" },
    { id: 2, label: "Player B" },
    { id: 3, label: "Player C" },
    { id: 4, label: "Player D" },
];

export const TeamInsightTableData = {
    headers: ["Player Name", "Position", "Score/Assists"],
    rows: [
        { "Player Name": "Lionel Messi", Position: "Forward", "Score/Assists": "25/10" },
        { "Player Name": "Frenkie De Jong", Position: "Midfielder", "Score/Assists": "3-2" },
        { "Player Name": "Kylian Mbappe", Position: "Forward", "Score/Assists": "20/5" },
        { "Player Name": "Neymar Jr", Position: "Forward", "Score/Assists": "15/5" },
        { "Player Name": "Cristiano Ronaldo", Position: "Forward", "Score/Assists": "10/3" },
        { "Player Name": "Luka Modric", Position: "Midfielder", "Score/Assists": "8/2" },
        { "Player Name": "Robert Lewandowski", Position: "Forward", "Score/Assists": "5/2" },
        { "Player Name": "Sadio Mane", Position: "Forward", "Score/Assists": "3/1" },
        { "Player Name": "Luis Suarez", Position: "Forward", "Score/Assists": "2/1" },
        { "Player Name": "Mohamed Salah", Position: "Forward", "Score/Assists": "1/1" },
        { "Player Name": "Neymar Jr", Position: "Forward", "Score/Assists": "15/5" },
    ],
};

export const RosterChartData = [
    { month: "JAN", wins: 1, losses: 0 },
    { month: "FEB", wins: 0, losses: 0 },
    { month: "MAR", wins: 2, losses: 0 },
    { month: "APR", wins: 1, losses: 0 },
    { month: "MAY", wins: 1, losses: 1 },
    { month: "JUN", wins: 1, losses: 2 },
    { month: "JUL", wins: 2, losses: 2 },
    { month: "AUG", wins: 3, losses: 1 },
    { month: "SEP", wins: 3, losses: 1 },
    { month: "OCT", wins: 4, losses: 1 },
    { month: "NOV", wins: 4, losses: 2 },
    { month: "DEC", wins: 5, losses: 2 },
];

export const TeamPlayerCardData = [
    {
        name: "John Deo",
        age: 36,
        nationality: "Argentina",
        position: "Forward",
        totalGoals: 10,
        assists: 5,
        points: 8,
        image: "/public/assets/accountsetting.jpg",
    },
    {
        name: "Leo Messi",
        age: 34,
        nationality: "Argentina",
        position: "Midfielder",
        totalGoals: 15,
        assists: 10,
        points: 20,
        image: "/public/assets/user-2.jpg",
    },
    {
        name: "Cristiano Ronaldo",
        age: 38,
        nationality: "Portugal",
        position: "Forward",
        totalGoals: 25,
        assists: 7,
        points: 30,
        image: "/public/assets/user-3.jpg",
    },
    {
        name: "Neymar Jr.",
        age: 31,
        nationality: "Brazil",
        position: "Winger",
        totalGoals: 12,
        assists: 8,
        points: 15,
        image: "/public/assets/user-4.jpg",
    },
    {
        name: "Lionel Messi",
        age: 34,
        nationality: "Argentina",
        position: "Midfielder",
        totalGoals: 15,
        assists: 10,
        points: 20,
        image: "/public/assets/user-5.jpg",
    },
    {
        name: "Robert Lewandowski",
        age: 31,
        nationality: "Poland",
        position: "Forward",
        totalGoals: 20,
        assists: 5,
        points: 25,
        image: "/public/assets/user-6.jpg",
    },
    {
        name: "Kylian Mbappe",
        age: 23,
        nationality: "France",
        position: "Forward",
        totalGoals: 18,
        assists: 8,
        points: 22,
        image: "/public/assets/user-7.avif",
    },
    {
        name: "Neymar Jr.",
        age: 31,
        nationality: "Brazil",
        position: "Winger",
        totalGoals: 12,
        assists: 8,
        points: 15,
        image: "/public/assets/user-8.avif",
    },
    {
        name: "Sadio Mane",
        age: 31,
        nationality: "Nigeria",
        position: "Forward",
        totalGoals: 12,
        assists: 8,
        points: 15,
        image: "/public/assets/user-9.avif",
    },
    {
        name: "Mohamed Salah",
        age: 31,
        nationality: "Egypt",
        position: "Forward",
        totalGoals: 12,
        assists: 8,
        points: 15,
        image: "/public/assets/user-10.avif",
    },
];

export const AreaChartData = [
    { name: "Match 1", teamA: 80, teamB: 30 },
    { name: "Match 2", teamA: 40, teamB: 50 },
    { name: "Match 3", teamA: 60, teamB: 40 },
    { name: "Match 4", teamA: 50, teamB: 70 },
    { name: "Match 5", teamA: 70, teamB: 60 },
    { name: "Match 6", teamA: 30, teamB: 20 },
];

// Adding your new earnings data
export const EarningChartData = [
    { month: "Jan", earning: 500 },
    { month: "Feb", earning: 700 },
    { month: "Mar", earning: 1200 },
    { month: "Apr", earning: 200 },
    { month: "May", earning: 2075 },
    { month: "Jun", earning: 400 },
    { month: "Jul", earning: 300 },
    { month: "Aug", earning: 800 },
    { month: "Sep", earning: 1000 },
    { month: "Oct", earning: 2500 },
    { month: "Nov", earning: 1500 },
];

export const TeamPieChartData = [
    { name: "Team A", value: 40 },
    { name: "Team B", value: 30 },
    { name: "Team C", value: 20 },
    { name: "Team D", value: 10 },
];

export default TeamInsightData;
