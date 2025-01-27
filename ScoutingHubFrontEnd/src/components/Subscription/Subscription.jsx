import SubscriptionCard from "../Shared/SubscriptionCard";
import SubscriptionData from "./SubscriptionData";


const Subscription = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white py-10 px-6">
            <h1 className="text-center text-3xl font-bold mb-8">Subscription Plan</h1>
            {/* Subscription Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-7xl mx-auto mb-8">
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
            {/* Action Buttons */}
            <div className="flex justify-end gap-4 w-full max-w-7xl mx-auto">
                <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded-full shadow-lg transition-all">
                    Changes
                </button>
                <button className="flex items-center bg-blue-900 hover:bg-blue-950 text-white font-bold py-2 px-10 rounded-full shadow-lg transition-all">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default Subscription;
