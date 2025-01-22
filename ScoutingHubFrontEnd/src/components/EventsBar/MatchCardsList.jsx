import { useState, useRef, useEffect } from "react";
import MatchCard from "./MatchCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MatchCardsData from "./MatchCardsData";

const MatchCardsList = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const updateVisibleCount = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const cardWidth = 150; // Adjusted card width
                const newVisibleCount = Math.floor((containerWidth - 40) / cardWidth); // Subtract 40px for arrow padding
                setVisibleCount(newVisibleCount);
            }
        };

        window.addEventListener("resize", updateVisibleCount);
        updateVisibleCount();

        return () => {
            window.removeEventListener("resize", updateVisibleCount);
        };
    }, []);

    const handleScroll = (direction) => {
        if (direction === "left" && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else if (direction === "right" && currentIndex < MatchCardsData.length - visibleCount) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const visibleCards = MatchCardsData.slice(currentIndex, currentIndex + visibleCount);

    return (
        <div className="relative w-full h-full bg-transparent rounded-lg overflow-hidden flex items-center">
            {/* Left Arrow */}
            {currentIndex > 0 && (
                <button
                    onClick={() => handleScroll("left")}
                    className="absolute left-[-2px] top-1/2 transform -translate-y-1/2 bg-blue-900 text-white p-2 rounded-full shadow-md hover:bg-blue-700 z-10"
                >
                    <FaChevronLeft />
                </button>
            )}

            {/* Match Cards */}
            <div
                ref={containerRef}
                className="grid gap-2 w-full h-full px-10" // Added padding to prevent overlap
                style={{
                    gridTemplateColumns: `repeat(${visibleCount}, 1fr)`,
                }}
            >
                {visibleCards.map((match, index) => (
                    <MatchCard
                        key={index}
                        team1={match.team1}
                        team1Flag={match.team1Flag}
                        score1={match.score1}
                        team2={match.team2}
                        team2Flag={match.team2Flag}
                        score2={match.score2}
                        overs={match.overs}
                    />
                ))}
            </div>

            {/* Right Arrow */}
            {currentIndex < MatchCardsData.length - visibleCount && (
                <button
                    onClick={() => handleScroll("right")}
                    className="absolute right-[-2px] top-1/2 transform -translate-y-1/2 bg-blue-900 text-white p-2 rounded-full shadow-md hover:bg-blue-700 z-10"
                >
                    <FaChevronRight />
                </button>
            )}
        </div>
    );
};

export default MatchCardsList;
