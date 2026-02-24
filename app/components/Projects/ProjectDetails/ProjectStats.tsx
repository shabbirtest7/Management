'use client';

import { FiActivity } from 'react-icons/fi';

interface ProjectStatsProps {
  activitiesCount: number;
  createdAt: string;
  hasAssignee: boolean;
  status: string;
}

export default function ProjectStats({
  activitiesCount,
  createdAt,
  hasAssignee,
  status
}: ProjectStatsProps) {
  const daysActive = Math.ceil(
    (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 3600 * 24)
  );

  const getProgressPercentage = () => {
    switch (status) {
      case 'COMPLETED': return '100';
      case 'IN_PROGRESS': return '50';
      case 'PENDING': return '0';
      case 'CANCELLED': return '0';
      default: return '0';
    }
  };

  const stats = [
    { label: 'Total Activities', value: activitiesCount, color: 'text-primary-600' },
    { label: 'Days Active', value: daysActive, color: 'text-blue-600' },
    { label: 'Team Members', value: hasAssignee ? '1' : '0', color: 'text-green-600' },
    { label: 'Progress', value: `${getProgressPercentage()}%`, color: 'text-purple-600' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FiActivity className="h-5 w-5 text-gray-500" />
          Statistics
        </h2>
      </div>
      <div className="p-6 grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}