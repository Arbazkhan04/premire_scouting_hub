import EventsBar from "../EventsBar/EventsBar"
import Header from "../Header&Footer/Header"
import PlayersInsights from "./PlayersInsights"

const PlayersInsightsMain = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900">
            <EventsBar />
            <Header />
            <div className="mt-5">
                <PlayersInsights />
            </div>
        </div>
    )
}
export default PlayersInsightsMain