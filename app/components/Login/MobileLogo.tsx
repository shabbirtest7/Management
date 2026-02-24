'use client';

import { FiBriefcase } from 'react-icons/fi';

const MobileLogo = () => {
  return (
    <div className="lg:hidden text-center mb-8">
      <div className="inline-flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
          <FiBriefcase className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">OpsPortal</h1>
      </div>
      <p className="text-slate-300">Sign in to access your dashboard</p>
    </div>
  );
};

export default MobileLogo;