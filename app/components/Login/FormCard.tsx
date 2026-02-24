// components/Login/FormCard.tsx
'use client';

import { ReactNode } from 'react';

interface FormCardProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

const FormCard = ({ children, onSubmit }: FormCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Card Header with Decorative Element */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500"></div>
        <div className="px-8 py-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-1">Please enter your credentials to continue</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="p-8 space-y-6">
        {children}
      </form>
    </div>
  );
};

export default FormCard;