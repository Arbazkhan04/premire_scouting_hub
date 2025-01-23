import HeaderWithDropdown from "../Shared/HeaderWithDropdown";
import TeamInsightData from "../TeamInsight/TeamInsightData"; // Import the options data

const BarcelonaPlayersHeader = () => {
    const handlePlayerSelect = (selectedPlayer) => {
        console.log("Selected Player:", selectedPlayer.label);
    };

    return (
        <div className="bg-transparent text-white rounded-lg">
            <HeaderWithDropdown
                title="Barcelona FC Players"
                options={TeamInsightData} // Use the imported options
                defaultLabel="See all"
                onSelect={handlePlayerSelect}
            />
        </div>
    );
};

export default BarcelonaPlayersHeader;
