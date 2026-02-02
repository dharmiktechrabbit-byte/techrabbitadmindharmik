import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

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
        <div className="min-h-screen bg-[#f7f7f7] flex">
            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            <div className="flex-1 flex flex-col min-w-0 md:ml-64">
                <Header title={getPageTitle()} setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;

