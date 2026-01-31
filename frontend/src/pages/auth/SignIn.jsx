import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.png';
import { loginApi } from '../../api/api';

function SignIn() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await loginApi(formData);
            // Check for token as the primary indicator of success based on user feedback
            if (response.token) {
                localStorage.setItem('token', response.token);
                if (response.admin) {
                    localStorage.setItem('user', JSON.stringify(response.admin));
                }
                toast.success(response.message || 'Welcome back!');
                navigate('/dashboard');
            } else {
                toast.error(response.message || 'Invalid credentials');
            }
        } catch (error) {
            toast.error(error || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Blobs - Updated to match theme colors */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-[#25b485] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[440px] z-10"
            >
                <div className="glass-effect rounded-3xl p-8 md:p-10">
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-sm mb-6"
                        >
                            <img src={logo} alt="Tech Rabbit" className="h-12 w-12 object-contain" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Welcome Back</h1>
                        <p className="text-gray-500 font-medium">Sign in to manage your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#25b485]">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25b485]/20 focus:border-[#25b485] transition-all duration-200 placeholder:text-gray-400"
                                    placeholder="admin@techrabbit.com"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                                {/* <button type="button" className="text-xs font-bold text-[#25b485] hover:text-[#219972] transition-colors">
                                    Forgot password?
                                </button> */}
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#25b485]">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25b485]/20 focus:border-[#25b485] transition-all duration-200 placeholder:text-gray-400"
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* <div className="flex items-center gap-2 ml-1">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 rounded border-gray-300 text-[#25b485] focus:ring-[#25b485] cursor-pointer"
                            />
                            <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">
                                Remember for 30 days
                            </label>
                        </div> */}

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full bg-[#25b485] hover:bg-[#219972] disabled:bg-[#25b485]/60 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#25b485]/25 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 text-xs font-medium">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Secure Enterprise Login</span>
                    </div>
                </div>

                <p className="text-center text-gray-400 text-sm mt-8 font-medium">
                    © 2026 Tech Rabbit. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}

export default SignIn;