const PlayCard = () => {
    return (
        <>
            {/* Player Card */}
            <div className="bg-blue-950 p-6 rounded-lg flex flex-col items-center">
                <img
                    src="/public/assets/user-2.jpg"
                    alt="Player"
                    className="w-24 h-24 rounded-full mb-4"
                />
                <h3 className="text-xl font-bold">John Deo</h3>
                <p className="text-sm text-gray-300">36 Years Old</p>
                <p className="text-sm text-gray-300">
                    Nationality: <span className="text-white">Argentina</span>
                </p>
                <p className="text-sm text-gray-300">
                    Position: <span className="text-white">Forward</span>
                </p>
                <div className="mt-4 flex gap-6">
                    <div>
                        <p className="text-sm text-gray-300">Total Goals</p>
                        <p className="text-lg font-bold text-red-400">10</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-300">Assists</p>
                        <p className="text-lg font-bold text-green-400">5</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-300">Points</p>
                        <p className="text-lg font-bold text-blue-400">8</p>
                    </div>
                </div>
            </div>
        </>


    )
}
export default PlayCard