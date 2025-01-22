import { FaExclamationTriangle, FaTrophy, FaCloudRain } from "react-icons/fa";

const AlertCard = () => {
    return (
        <>
            <div className="bg-blue-950 p-6 rounded-lg h-full">
                <div className="flex justify-between">
                    <h3 className="text-lg font-bold mb-4">⚠️ Alerts</h3>
                    <p className="mt-4 text-sm text-gray-400">2 Hours Ago</p>
                </div>
                <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                        <FaExclamationTriangle className="mr-2 text-yellow-400" />
                        Player X Is Out Due To Injury.
                    </li>
                    <li className="flex items-center">
                        <FaCloudRain className="mr-2 text-blue-400" />
                        Match A Vs B Delayed Due To Weather.
                    </li>
                    <li className="flex items-center">
                        <FaTrophy className="mr-2 text-yellow-500" />
                        Player Of The Month Announced!
                    </li>
                </ul>
            </div>
        </>
    )
}
export default AlertCard