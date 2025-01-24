import { TeamPlayerCardData } from "../TeamInsight/TeamInsightData";
import PlayerCard from "./PlayerCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRef, useState } from "react";

const PlayerCardsList = () => {
    const containerRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    const cardWidth = 300; // Approximate width of each card
    const visibleCardsCount = 4; // Number of cards visible by default
    const containerWidth = visibleCardsCount * cardWidth;

    const scrollLeft = () => {
        if (containerRef.current) {
            const newScrollPosition = Math.max(0, scrollPosition - cardWidth);
            setScrollPosition(newScrollPosition);
            containerRef.current.scrollTo({ left: newScrollPosition, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            const maxScroll =
                containerRef.current.scrollWidth - containerRef.current.clientWidth;
            const newScrollPosition = Math.min(maxScroll, scrollPosition + cardWidth);
            setScrollPosition(newScrollPosition);
            containerRef.current.scrollTo({ left: newScrollPosition, behavior: "smooth" });
        }
    };

    return (
        <div className="relative w-full">
            {/* Left Arrow */}
            {scrollPosition > 0 && (
                <button
                    onClick={scrollLeft}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-blue-950 text-white p-2 rounded-full shadow-md hover:bg-blue-800 z-10"
                >
                    <FaChevronLeft />
                </button>
            )}

            {/* Card Container */}
            <div
                ref={containerRef}
                className="flex gap-6 overflow-hidden mx-auto"
                style={{
                    maxWidth: "100%", // Full width of the parent container
                }}
            >
                {TeamPlayerCardData.map((player, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-[280px] flex-grow-0"
                        style={{ flexBasis: `${100 / visibleCardsCount}%` }} // Adjust card width based on visible cards
                    >
                        <PlayerCard
                            name={player.name}
                            age={player.age}
                            nationality={player.nationality}
                            position={player.position}
                            totalGoals={player.totalGoals}
                            assists={player.assists}
                            points={player.points}
                            image={player.image}
                        />
                    </div>
                ))}
            </div>

            {/* Right Arrow */}
            {scrollPosition + containerWidth <
                containerRef.current?.scrollWidth && (
                    <button
                        onClick={scrollRight}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-950 text-white p-2 rounded-full shadow-md hover:bg-blue-800 z-10"
                    >
                        <FaChevronRight />
                    </button>
                )}
        </div>
    );
};

export default PlayerCardsList;
