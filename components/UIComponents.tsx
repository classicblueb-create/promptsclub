import React from 'react';
import { Loader2 } from 'lucide-react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`glass-panel rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: 'peach' | 'mint' | 'lavender' | 'blue' | 'gray'; onClick?: () => void; active?: boolean }> = ({ 
  children, 
  color = 'gray', 
  onClick,
  active = false
}) => {
  const colors = {
    peach: 'bg-pastel-peach/20 text-pink-600 border-pastel-peach/30',
    mint: 'bg-pastel-mint/20 text-emerald-600 border-pastel-mint/30',
    lavender: 'bg-pastel-lavender/30 text-purple-600 border-pastel-lavender/40',
    blue: 'bg-pastel-blue/20 text-blue-600 border-pastel-blue/30',
    gray: 'bg-gray-100 text-gray-600 border-gray-200'
  };

  const activeStyle = active ? 'ring-2 ring-offset-1 ring-gray-200' : '';

  return (
    <span 
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition-all hover:scale-105 ${colors[color]} ${activeStyle}`}
    >
      {children}
    </span>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', loading, className = '', ...props }) => {
  const base = "relative overflow-hidden rounded-xl px-6 py-3 font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-pastel-peach to-pastel-lavender text-gray-800 shadow-lg shadow-pastel-peach/20 hover:shadow-xl hover:shadow-pastel-peach/30 text-white",
    secondary: "bg-white text-gray-700 border border-gray-100 shadow-sm hover:bg-gray-50",
    outline: "border-2 border-pastel-lavender text-gray-600 hover:bg-pastel-lavender/10",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};
