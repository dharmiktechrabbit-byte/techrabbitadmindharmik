import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Loader2, ShieldCheck, QrCode, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.png';
import { enable2FAApi, verify2FAApi } from '../../api/api';

function TwoFA() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [otp, setOtp] = useState('');
    const [isSetup, setIsSetup] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const tempUserStr = localStorage.getItem('tempUser');
        if (!tempUserStr) {
            navigate('/signin');
            return;
        }
        const tempUser = JSON.parse(tempUserStr);
        setUser(tempUser);
        setIsSetup(!tempUser.twoFAEnabled);

        if (!tempUser.twoFAEnabled) {
            const fetchQRCode = async () => {
                try {
                    const response = await enable2FAApi({ userId: tempUser.id });
                    setQrCode(response.qrCode);
                } catch (error) {
                    toast.error('Failed to load QR code');
                }
            };
            fetchQRCode();
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp) {
            toast.error('Please enter the verification code');
            return;
        }

        setIsLoading(true);
        try {
            const response = await verify2FAApi({ userId: user.id, token: otp });
            
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.admin));
                
                // Clear temp storage
                localStorage.removeItem('tempUser');
                
                toast.success('Authentication successful!');
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error || 'Invalid verification code');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
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
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-sm mb-6"
                        >
                            <img src={logo} alt="Tech Rabbit" className="h-12 w-12 object-contain" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                            {isSetup ? 'Setup 2FA' : 'Verify Login'}
                        </h1>
                        <p className="text-gray-500 font-medium">
                            {isSetup 
                                ? 'Scan the QR code and enter the OTP' 
                                : 'Enter the code from your authenticator app'}
                        </p>
                    </div>

                    {isSetup && qrCode && (
                        <div className="mb-8 flex flex-col items-center">
                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">
                                <img src={qrCode} alt="2FA QR Code" className="w-[180px] h-[180px]" />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                                <QrCode className="h-3.5 w-3.5" />
                                <span>Scan with Google Authenticator</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 ml-1">
                                Verification Code
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#25b485]">
                                    <KeyRound className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25b485]/20 focus:border-[#25b485] transition-all duration-200 placeholder:text-gray-400 tracking-[0.5em] text-center text-lg font-bold"
                                    placeholder="000000"
                                    required
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>
                        </div>

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
                                    <span>{isSetup ? 'Verify and Enable' : 'Authenticate'}</span>
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 text-xs font-medium">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Two-Step Verification Protected</span>
                    </div>
                </div>

                <p className="text-center text-gray-400 text-sm mt-8 font-medium">
                    © 2026 Tech Rabbit. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}

export default TwoFA;
