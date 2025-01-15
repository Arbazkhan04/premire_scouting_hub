import { useState } from "react";
import SearchAndAdd from "../SearchAndAdd";
import CardList from "../CardList";
import PlayerData from "./PlayerData";
import TeamData from "./TeamData";

const PlayerTeamFavourites = () => {
  const [players, setPlayers] = useState(PlayerData);
  const [teams, setTeams] = useState(TeamData);

  const handleAddTeam = () => {
    // Example placeholder logic
    const newTeam = {
      id: teams.length + 1,
      name: `New Team ${teams.length + 1}`,
      image: "/assets/default-team.jpg",
    };
    setTeams([...teams, newTeam]);
  };

  const handleAddPlayer = () => {
    // Example placeholder logic
    const newPlayer = {
      id: players.length + 1,
      name: `New Player ${players.length + 1}`,
      image: "/assets/default-player.jpg",
    };
    setPlayers([...players, newPlayer]);
  };

  const handleDeleteTeam = (team) => {
    setTeams(teams.filter((t) => t.id !== team.id));
  };

  const handleDeletePlayer = (player) => {
    setPlayers(players.filter((p) => p.id !== player.id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">Player And Team Favourites</h1>

      {/* Your Team Section */}
      <SearchAndAdd
        placeholder="Search..."
        buttonLabel="+ Add Favourite Team"
        onAdd={handleAddTeam}
      />
      <CardList title="Your Team" items={teams} onDelete={handleDeleteTeam} />

      {/* Your Player Section */}
      <div className="mt-12">
        <SearchAndAdd
          placeholder="Search..."
          buttonLabel="+ Add Favourite Player"
          onAdd={handleAddPlayer}
        />
        <CardList title="Your Player" items={players} onDelete={handleDeletePlayer} />
      </div>
    </div>
  );
};

export default PlayerTeamFavourites;
