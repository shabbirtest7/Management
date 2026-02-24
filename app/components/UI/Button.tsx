'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { IconType } from 'react-icons';
import { FiLoader } from 'react-icons/fi';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: IconType;
  rightIcon?: IconType;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}, ref) => {
  // Variant styles
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-primary-700 focus:ring-primary-500 border-transparent',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 border-transparent',
    outline: 'bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-primary-500 border-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-transparent',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border-transparent',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500 border-transparent',
  };

  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        border focus:outline-none focus:ring-2 focus:ring-offset-2
        transition-all duration-200 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
        transform active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <FiLoader className={`${iconSizes[size]} animate-spin`} />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {LeftIcon && <LeftIcon className={iconSizes[size]} />}
          {children}
          {RightIcon && <RightIcon className={iconSizes[size]} />}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;