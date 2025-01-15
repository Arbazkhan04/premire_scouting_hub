import { Outlet } from 'react-router-dom';
import Header from '../components/Header&Footer/Header';

const DashboardPage = () => {
    return (
        <div className="overflow-clip">
            <Header />
            <div >
                {/* Render nested routes dynamically */}
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardPage;
