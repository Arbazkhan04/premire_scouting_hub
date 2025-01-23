import EventsBar from "../EventsBar/EventsBar";
import Header from "../Header&Footer/Header";
import TeamInsight from "./TeamInsight";




const TeamInsightMain = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900">
            <EventsBar />
            <Header />

            <div className="mt-5">
                < TeamInsight />
            </div>
        </div>
    )
}
export default TeamInsightMain