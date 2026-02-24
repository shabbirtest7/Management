// components/Login/BrandSection.tsx
'use client';

import { FiBriefcase } from 'react-icons/fi';
import { FaChartLine, FaTasks, FaUsers, FaShieldAlt } from 'react-icons/fa';

const BrandSection = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute top-1/2 -right-4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center px-16 text-white">
        {/* Logo and Brand */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg shadow-primary-500/30">
              <FiBriefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                OpsPortal
              </h1>
              <p className="text-slate-300 mt-1">Enterprise Operations Management</p>
            </div>
          </div>
          <p className="text-lg text-slate-300 leading-relaxed">
            Streamline your operations, track projects in real-time, and boost team productivity with our comprehensive management solution.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-2xl font-bold text-white">10k+</p>
            <p className="text-xs text-slate-400 mt-1">Active Users</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-2xl font-bold text-white">5k+</p>
            <p className="text-xs text-slate-400 mt-1">Projects</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-2xl font-bold text-white">99.9%</p>
            <p className="text-xs text-slate-400 mt-1">Uptime</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4">
          <FeatureCard
            icon={<FaTasks className="w-5 h-5 text-primary-400" />}
            title="Project Tracking"
            description="Real-time monitoring"
            color="primary"
          />
          <FeatureCard
            icon={<FaChartLine className="w-5 h-5 text-blue-400" />}
            title="Analytics"
            description="Insights & reports"
            color="blue"
          />
          <FeatureCard
            icon={<FaUsers className="w-5 h-5 text-purple-400" />}
            title="Team Management"
            description="Resource allocation"
            color="purple"
          />
          <FeatureCard
            icon={<FaShieldAlt className="w-5 h-5 text-green-400" />}
            title="Secure Access"
            description="Role-based control"
            color="green"
          />
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const FeatureCard = ({ icon, title, description, color }: FeatureCardProps) => {
  const colorClasses = {
    primary: 'bg-primary-500/20',
    blue: 'bg-blue-500/20',
    purple: 'bg-purple-500/20',
    green: 'bg-green-500/20'
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
      <div className={`p-2 ${colorClasses[color as keyof typeof colorClasses]} rounded-lg`}>
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-white">{title}</h3>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
};

export default BrandSection;