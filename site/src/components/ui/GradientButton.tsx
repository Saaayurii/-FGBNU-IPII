'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface GradientButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: 'gray' | 'blue' | 'slate';
}

export function GradientButton({ 
  href, 
  children, 
  className = '', 
  variant = 'gray' 
}: GradientButtonProps) {
  
  const variants = {
    gray: 'bg-gradient-to-r from-gray-700 to-slate-600 hover:from-gray-800 hover:to-slate-700',
    blue: 'bg-gradient-to-r from-blue-600 to-slate-600 hover:from-blue-700 hover:to-slate-700',
    slate: 'bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800'
  };

  const baseStyles = "inline-flex items-center justify-center gap-2 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105";

  return (
    <Link
      href={href}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}