import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className, 
  disabled, 
  ...props 
}: ButtonProps) {
  const baseStyles = "relative group w-full py-5 font-label uppercase tracking-[0.2em] text-xs font-bold overflow-hidden transition-all duration-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-on-background text-background border border-on-background hover:text-white hover:border-primary-container",
    outline: "border border-primary-container text-primary-container hover:text-white",
    ghost: "bg-transparent text-primary-container border-b border-transparent hover:border-primary-container hover:text-primary-container",
  };

  const animationFill = {
    primary: "bg-primary-container",
    outline: "bg-primary-container",
    ghost: "bg-transparent",
  };

  return (
    <button 
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      <span className="relative z-10">{isLoading ? 'ĐANG XỬ LÝ...' : children}</span>
      {variant !== 'ghost' && (
        <div className={cn("absolute inset-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out", animationFill[variant])}></div>
      )}
    </button>
  );
}
