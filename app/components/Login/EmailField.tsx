// components/Login/EmailField.tsx
'use client';

import { FiMail, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
}

const EmailField = ({ value, onChange, onBlur, error, touched, disabled }: EmailFieldProps) => {
  const showSuccess = touched && !error && value;
  const showError = touched && error;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium  text-gray-700">
        Email Address
        <span className="text-red-500 ml-1">*</span>
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiMail className={`h-5 w-5 transition-colors duration-200 ${
            showSuccess ? 'text-green-500' : showError ? 'text-red-400' : 'text-gray-400'
          }`} />
        </div>
        
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder="you@company.com"
          disabled={disabled}
          className={`
            block w-full pl-10 pr-10 py-3 text-base
            border rounded-xl
            dark:text-gray-800
            transition-all duration-200
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
        
        {showSuccess && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <FiCheckCircle className="h-5 w-5 text-green-500" />
          </div>
        )}
        {showError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <FiAlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      
      {error && touched && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
};

export default EmailField;