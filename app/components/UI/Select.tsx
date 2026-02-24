'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { IconType } from 'react-icons';
import { FiChevronDown, FiAlertCircle } from 'react-icons/fi';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  icon?: IconType;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options,
  icon: Icon,
  helperText,
  containerClassName = '',
  labelClassName = '',
  selectClassName = '',
  errorClassName = '',
  helperClassName = '',
  placeholder,
  disabled = false,
  required = false,
  id,
  value,
  defaultValue,
  ...props
}, ref) => {
  // Generate unique ID if not provided
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  // Base select classes
  const baseSelectClasses = `
    block w-full rounded-lg border border-gray-300 bg-white
    focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500
    transition-all duration-200 appearance-none
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : ''}
    ${Icon ? 'pl-10' : 'pl-4'}
    pr-10 py-2.5
  `;

  return (
    <div className={`w-full ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className={`
            block text-sm font-medium text-gray-700 mb-1
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${required ? "after:content-['*'] after:ml-1 after:text-red-500" : ''}
            ${labelClassName}
          `}
        >
          {label}
        </label>
      )}

      {/* Select wrapper */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
        )}

        {/* Select */}
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          value={value}
          defaultValue={defaultValue}
           style={{ color: '#111827' }}
          className={`
            ${baseSelectClasses}
            ${selectClassName}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown Icon */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <FiChevronDown className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          id={errorId}
          className={`
            mt-1 text-sm text-red-600 flex items-center gap-1
            ${errorClassName}
          `}
        >
          <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p
          id={helperId}
          className={`
            mt-1 text-sm text-gray-500
            ${helperClassName}
          `}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;