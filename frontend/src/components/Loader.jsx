import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'default', className = '' }) => {
    const sizeClasses = {
        small: 'h-4 w-4',
        default: 'h-8 w-8',
        large: 'h-12 w-12'
    };

    return (
        <div className={`flex items-center justify-center ${className} text-[#25b485]  `}>
            <Loader2 className={`${sizeClasses[size]} animate-spin `} />
        </div>
    );
};

export default Loader;
