import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function AdminLayout() {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        const titles = {
            '/dashboard': 'Dashboard',
            '/portfolio/categories': 'Portfolio Categories',
            '/portfolio/create': 'Create Portfolio',
            '/jobs/create': 'Create Job Post',
            '/jobs/applications': 'Career Applications',
            '/blogs/categories': 'Blog Categories',
            '/blogs/tags': 'Blog Tags',
            '/blogs/create': 'Create Blog Post'
        };
        return titles[path] || 'Admin Panel';
    };

    return (
        <div className="min-h-screen bg-[#f7f7f7]">


            <Sidebar />
            <div className="ml-64">
                <Header title={getPageTitle()} />
                <main className="pt-24 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
