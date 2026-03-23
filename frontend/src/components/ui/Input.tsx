import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, placeholder, ...props }, ref) => {
    return (
      <div className="flex flex-col group relative w-full">
        {label && (
          <label className="font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant/60 mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full bg-transparent border-t-0 border-x-0 border-b py-2 focus:ring-0 transition-all duration-500",
            "border-outline-variant/30 text-sm",
            "placeholder:text-outline-variant/40 placeholder:font-display placeholder:italic placeholder:tracking-normal placeholder:normal-case", 
            "focus:border-primary-container",
            type !== 'password' ? "uppercase tracking-widest" : "tracking-[0.2em]",
            error && "border-error focus:border-error",
            className
          )}
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-error text-xs mt-2 uppercase tracking-widest absolute -bottom-5 left-0">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
