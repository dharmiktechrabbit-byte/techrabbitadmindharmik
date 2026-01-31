import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Header({ title }) {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ clear auth
    localStorage.removeItem("token");
    localStorage.removeItem("admin"); // if you stored admin data
    localStorage.clear(); // optional (remove if you store other keys)

    setShowProfile(false);

    navigate("/signin");
  };

  return (
    <header className="h-16 bg-[#f7f7f7] border-b border-gray-200 fixed top-0 right-0 left-64 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div
                className="
  h-8 w-8 rounded-full
  bg-[linear-gradient(135deg,#22d3ee,#2dd4bf,#34d399)]
  flex items-center justify-center
  text-black text-sm font-semibold
"
              >
                A
              </div>

              <span className="text-sm font-medium text-gray-700 hidden md:block">
                Admin
              </span>
              <ChevronDown className="h-4 w-4 text-gray-600 hidden md:block" />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="inline h-4 w-4 mr-2" />
                    Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Settings
                  </a>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
