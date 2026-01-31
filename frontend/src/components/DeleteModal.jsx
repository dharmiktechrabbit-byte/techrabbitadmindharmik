import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                                    <AlertTriangle className="h-6 w-6 text-red-500" />
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {title}
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {message}
                            </p>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeleteModal;
