import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: (SelectOption | string)[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', id, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-[#8e8e8c] mb-1.5 uppercase tracking-wider"
          >
            {label}
            {props.required && <span className="text-[#f87171] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`
              w-full appearance-none rounded-[2px] border bg-[#0e0f0d] px-3.5 py-2 pr-9 text-sm text-[#faf8f9]
              transition-colors duration-150 outline-none
              focus:ring-1 focus:ring-[#f0c45a] focus:border-[#f0c45a]
              disabled:bg-[#151613] disabled:text-[#676865] disabled:cursor-not-allowed
              ${error ? 'border-[#b91c1c] focus:ring-[#b91c1c] focus:border-[#b91c1c]' : 'border-[#232321]'}
              ${className}
            `}
            {...props}
          >
            {options
              ? options.map((opt) => {
                  const val = typeof opt === 'string' ? opt : opt.value;
                  const lbl = typeof opt === 'string' ? opt : opt.label;
                  return (
                    <option key={val} value={val} className="bg-[#121311] text-[#faf8f9]">
                      {lbl}
                    </option>
                  );
                })
              : children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#8e8e8c]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-[#f87171] font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-[#676865]">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
