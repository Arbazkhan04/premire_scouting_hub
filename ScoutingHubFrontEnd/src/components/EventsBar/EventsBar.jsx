import MatchCardsList from "./MatchCardsList";
import EventBarDropDown from "./EventBarDropDown";

const EventsBar = () => {
    return (
        <div className="bg-blue-900 text-white py-2 px-4 flex items-center justify-between h-[15vh]">
            {/* Left Section */}
            <div className="flex flex-col items-center space-y-2 w-[200px] ">
                <EventBarDropDown />
                <span className="text-xs mt-1">AUS v IND [W]</span>
            </div>

            {/* Middle Section */}
            <div className="flex-1 mx-4 h-full flex items-center overflow-hidden">
                <MatchCardsList />
            </div>
        </div>
    );
};

export default EventsBar;
