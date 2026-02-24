'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { IconType } from 'react-icons';
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: IconType;
  iconPosition?: 'left' | 'right';
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
  isPassword?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon: Icon,
  iconPosition = 'left',
  helperText,
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  helperClassName = '',
  isPassword = false,
  type = 'text',
  disabled = false,
  required = false,
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  // Determine input type
  const inputType = isPassword 
    ? (showPassword ? 'text' : 'password')
    : type;

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Base input classes
  

const baseInputClasses = `
    block w-full rounded-lg border
    text-gray-900 dark:text-gray-100 
    placeholder:text-gray-400        
    bg-white                           // Ensure white background
    focus:outline-none focus:ring-2 focus:ring-offset-0
    transition-all duration-200
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
    }
    ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${(Icon && iconPosition === 'right') || isPassword ? 'pr-10' : ''}
    ${type === 'date' ? 'py-2' : 'py-2.5'}

  `;

  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  // Get size from props or default to md
  const size = (props as any).size || 'md';
  const sizeClass = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md;

  return (
    <div className={`w-full ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
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

      {/* Input wrapper */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
           style={{ color: '#111827' }}
          className={`
            ${baseInputClasses}
            ${sizeClass}
            ${inputClassName}
            ${isFocused ? 'ring-2 ring-offset-0 ' + (error ? 'ring-red-200' : 'ring-primary-200') : ''}
          `}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {/* Right Icon or Password Toggle */}
        {(Icon && iconPosition === 'right') || isPassword ? (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {isPassword ? (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="focus:outline-none focus:text-primary-600 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            ) : (
              Icon && (
                <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
              )
            )}
          </div>
        ) : null}
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

Input.displayName = 'Input';

export default Input;