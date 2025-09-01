'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'button';
}

export function BackButton({ className = '', variant = 'default' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const baseStyles = "inline-flex items-center gap-2 font-medium transition-all duration-200";
  
  const variants = {
    default: `${baseStyles} text-white hover:text-gray-100 hover:bg-white/10 px-3 py-2 rounded-lg`,
    minimal: `${baseStyles} text-gray-500 hover:text-gray-700`,
    button: `${baseStyles} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-4 py-2 rounded-lg shadow-sm`
  };

  return (
    <button 
      onClick={handleBack} 
      className={`${variants[variant]} ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Назад</span>
    </button>
  );
}