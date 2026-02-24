'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FiBriefcase } from 'react-icons/fi';
import LoginLayout from '@/app/components/Login/LoginLayout';
import LoginForm from '@/app/components/Login/LoginForm';
import BrandSection from '@/app/components/Login/BrandSection';
import MobileLogo from '@/app/components/Login/MobileLogo';
import LoginFooter from '@/app/components/Login/LoginFooter';


export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  // Load saved email if "Remember Me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field as keyof typeof touched]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const validateForm = () => {
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);
    
    setErrors({
      email: emailError,
      password: passwordError
    });
    
    setTouched({
      email: true,
      password: true
    });

    return !emailError && !passwordError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Handle remember me
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', formData.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setFormData({
        email: 'admin@example.com',
        password: 'admin123'
      });
    } else {
      setFormData({
        email: 'user@example.com',
        password: 'user123'
      });
    }
    setErrors({ email: '', password: '' });
  };

  const isFormValid = formData.email && formData.password && !errors.email && !errors.password;

  const formProps = {
    formData,
    errors,
    touched,
    isLoading,
    rememberMe,
    isFormValid,
    onFieldChange: handleChange,
    onFieldBlur: handleBlur,
    onRememberMeChange: setRememberMe,
    onSubmit: handleSubmit,
    onDemoFill: handleDemoFill
  };

  return (
    <LoginLayout>
      {/* Left Side - Branding & Features */}
      <BrandSection />

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <MobileLogo />
          <LoginForm {...formProps as any} />
          <LoginFooter />
        </div>
      </div>
    </LoginLayout>
  );
}