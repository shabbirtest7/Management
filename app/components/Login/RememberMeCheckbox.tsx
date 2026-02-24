'use client';

import { FiCheckCircle } from 'react-icons/fi';

interface RememberMeCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const RememberMeCheckbox = ({ checked, onChange, disabled }: RememberMeCheckboxProps) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`
          w-5 h-5 border-2 rounded-md transition-all duration-200
          flex items-center justify-center
          ${checked 
            ? 'bg-blue-600 border-blue-600' 
            : 'border-gray-300 group-hover:border-primary-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}>
          {checked && <FiCheckCircle className="w-4 h-4 text-white" />}
        </div>
      </div>
      <span className={`text-sm transition-colors ${
        disabled 
          ? 'text-gray-400 cursor-not-allowed' 
          : 'text-gray-600 group-hover:text-gray-900'
      }`}>
        Remember me
      </span>
    </label>
  );
};

export default RememberMeCheckbox;