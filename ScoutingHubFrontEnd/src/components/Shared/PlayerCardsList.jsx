import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import PlayerCard from "./PlayerCard";
import { TeamPlayerCardData } from "../TeamInsight/TeamInsightData";
import "../../styles/App.css";

const PlayerCardsList = () => {
    return (
        <div className="relative w-full">
            <Swiper
                modules={[Navigation]}
                spaceBetween={24}
                slidesPerView={1} // Default for the smallest screen sizes
                navigation={{
                    prevEl: ".custom-prev",
                    nextEl: ".custom-next",
                }}
                breakpoints={{
                    0: {
                        slidesPerView: 1, // From 0px to 767px, show 1 card
                    },

                    768: {
                        slidesPerView: 2, // From 768px to 1023px, show 2 cards
                    },
                    1024: {
                        slidesPerView: 4, // From 1024px and above, show 4 cards
                    },
                }}
            >
                {TeamPlayerCardData.map((player, index) => (
                    <SwiperSlide key={index}>
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
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button className="custom-prev custom-arrow left-[-30px]">
                &lt;
            </button>
            <button className="custom-next custom-arrow right-[-30px]">
                &gt;
            </button>
        </div>
    );
};

export default PlayerCardsList;
