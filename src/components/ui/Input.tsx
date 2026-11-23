import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[#8e8e8c] mb-1.5 uppercase tracking-wider"
          >
            {label}
            {props.required && <span className="text-[#f87171] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#676865]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`
              w-full rounded-[2px] border bg-[#0e0f0d] px-3.5 py-2 text-sm text-[#faf8f9] placeholder-[#676865]
              transition-colors duration-150 outline-none
              focus:ring-1 focus:ring-[#f0c45a] focus:border-[#f0c45a]
              disabled:bg-[#151613] disabled:text-[#676865] disabled:cursor-not-allowed
              ${leftIcon ? 'pl-9' : ''}
              ${rightIcon ? 'pr-9' : ''}
              ${error ? 'border-[#b91c1c] focus:ring-[#b91c1c] focus:border-[#b91c1c]' : 'border-[#232321]'}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#676865]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-[#f87171] font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-[#676865]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
