import SubscriptionCard from "../Shared/SubscriptionCard";
import SubscriptionData from "./SubscriptionData";
import { FaArrowRight } from "react-icons/fa";

const Subscription = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white py-10 px-6">
            <h1 className="text-center text-3xl font-bold mb-8">Subscription Plan</h1>
            {/* Center Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl mx-auto justify-items-center">
                {SubscriptionData.map((plan, index) => (
                    <SubscriptionCard
                        key={index}
                        planName={plan.planName}
                        price={plan.price}
                        duration={plan.duration}
                        features={plan.features}
                        buttonText={plan.buttonText}
                        isActive={plan.isActive}
                    />
                ))}
            </div>
            {/* Buttons Section */}
            <div className="mt-8 w-full max-w-7xl mx-auto grid grid-cols-1 md:flex md:justify-end gap-4">
                <button className="w-full md:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all">
                    Changes <FaArrowRight className="ml-2" />
                </button>
                <button className="w-full md:w-auto flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all">
                    Cancel <FaArrowRight className="ml-2" />
                </button>
            </div>
        </div>
    );
};

export default Subscription;