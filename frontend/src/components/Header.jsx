import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, User, ChevronDown, KeyRound, LogOut, X, Loader2, Lock, ShieldCheck, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPasswordApi } from "../api/api";

function Header({ title, setIsSidebarOpen }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetData, setResetData] = useState({ oldPassword: "", newPassword: "" });
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPasswordApi(resetData);
      toast.success("Password updated successfully!");
      setShowResetModal(false);
      setResetData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      toast.error(error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.clear();
    setShowProfile(false);
    navigate("/signin");
  };

  return (
    <header className="h-16 bg-[#f7f7f7] border-b border-gray-200 md:left-64 z-30 transition-all duration-300">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg md:hidden text-gray-600"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate max-w-[150px] md:max-w-none">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-[linear-gradient(135deg,#22d3ee,#2dd4bf,#34d399)] flex items-center justify-center text-black text-sm font-semibold">
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
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      setShowResetModal(true);
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <KeyRound className="h-4 w-4" />
                    Reset Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
                <button
                  onClick={() => setShowResetModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleResetPassword} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Current Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#25b485]" />
                    <input
                      type="password"
                      required
                      value={resetData.oldPassword}
                      onChange={(e) => setResetData({ ...resetData, oldPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25b485]/20 focus:border-[#25b485] transition-all"
                      placeholder="Enter current password"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#25b485]" />
                    <input
                      type="password"
                      required
                      value={resetData.newPassword}
                      onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25b485]/20 focus:border-[#25b485] transition-all"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-[#25b485] hover:bg-[#219972] disabled:bg-[#25b485]/60 text-white font-bold py-3 rounded-xl shadow-lg shadow-[#25b485]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;

