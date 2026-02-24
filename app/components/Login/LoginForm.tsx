'use client';

import { useState } from 'react';
import { FiLogIn, FiArrowRight } from 'react-icons/fi';
import Button from '@/app/components/UI/Button';
import FormCard from './FormCard';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import RememberMeCheckbox from './RememberMeCheckbox';
interface LoginFormProps {
  formData: {
    email: string;
    password: string;
  };
  errors: {
    email: string;
    password: string;
  };
  touched: {
    email: boolean;
    password: boolean;
  };
  isLoading: boolean;
  rememberMe: boolean;
  isFormValid: boolean;
  onFieldChange: (field: string, value: string) => void;
  onFieldBlur: (field: string) => void;
  onRememberMeChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onDemoFill: (type: 'admin' | 'user') => void;
}

const LoginForm = ({
  formData,
  errors,
  touched,
  isLoading,
  rememberMe,
  isFormValid,
  onFieldChange,
  onFieldBlur,
  onRememberMeChange,
  onSubmit,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormCard onSubmit={onSubmit}>
      {/* Email Field */}
      <EmailField
        value={formData.email}
        onChange={(value:any) => onFieldChange('email', value)}
        onBlur={() => onFieldBlur('email')}
        error={errors.email}
        touched={touched.email}
        disabled={isLoading}
      />

      {/* Password Field */}
      <PasswordField
        value={formData.password}
        onChange={(value:any) => onFieldChange('password', value)}
        onBlur={() => onFieldBlur('password')}
        error={errors.password}
        touched={touched.password}
        disabled={isLoading}
        showPassword={showPassword}
        onToggleVisibility={togglePasswordVisibility}
      />

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <RememberMeCheckbox
          checked={rememberMe}
          onChange={onRememberMeChange}
          disabled={isLoading}
        />
    
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        loadingText="Signing in..."
        leftIcon={FiLogIn}
        rightIcon={FiArrowRight}
        fullWidth
        disabled={!isFormValid}
        className={`
          bg-gradient-to-r from-primary-600 to-primary-700
          hover:from-primary-700 hover:to-primary-800
          transform hover:scale-[1.02] active:scale-[0.98]
          transition-all duration-200
          shadow-lg shadow-primary-500/25
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        `}
      >
        Sign In
      </Button>

   
    </FormCard>
  );
};

export default LoginForm;