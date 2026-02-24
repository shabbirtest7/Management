// components/Login/PasswordField.tsx
'use client';

import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  showPassword: boolean;
  onToggleVisibility: () => void;
}

const PasswordField = ({
  value,
  onChange,
  onBlur,
  error,
  touched,
  disabled,
  showPassword,
  onToggleVisibility
}: PasswordFieldProps) => {
  const showSuccess = touched && !error && value;
  const showError = touched && error;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        Password
        <span className="text-red-500 ml-1">*</span>
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiLock className={`h-5 w-5 transition-colors duration-200 ${
            showSuccess ? 'text-green-500' : showError ? 'text-red-400' : 'text-gray-400'
          }`} />
        </div>
        
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder="Enter your password"
          disabled={disabled}
          className={`
            block w-full pl-10 pr-12 py-3 text-base
            border rounded-xl
            transition-all duration-200
            dark:text-gray-800
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${showSuccess 
              ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50/30'
              : showError
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/30'
              : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200 hover:border-gray-300'
            }
          `}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            type="button"
            onClick={onToggleVisibility}
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {error && touched && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
      
      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
        <span>ℹ️</span> Minimum 6 characters
      </p>
    </div>
  );
};

export default PasswordField;