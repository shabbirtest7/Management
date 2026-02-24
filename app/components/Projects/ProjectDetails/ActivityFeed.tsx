'use client';

import { useState } from 'react';
import { FiActivity, FiUser, FiClock, FiCheckCircle, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from '@/app/types/project';


interface ActivityFeedProps {
  activities: Activity[];
  onViewAll: () => void;
}

export default function ActivityFeed({ activities, onViewAll }: ActivityFeedProps) {
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <FiCheckCircle className="text-green-600" />;
      case 'UPDATE': return <FiEdit2 className="text-blue-600" />;
      case 'COMPLETE': return <FiCheckCircle className="text-green-600" />;
      case 'DELETE': return <FiTrash2 className="text-red-600" />;
      default: return <FiActivity className="text-gray-600" />;
    }
  };

  const getActivityBgColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100';
      case 'UPDATE': return 'bg-blue-100';
      case 'COMPLETE': return 'bg-green-100';
      case 'DELETE': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FiActivity className="h-5 w-5 text-gray-500" />
          Activity Timeline
        </h2>
        <button
          onClick={onViewAll}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View All
        </button>
      </div>
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {activities && activities.length > 0 ? (
          activities.slice(0, 5).map((activity: Activity) => (
            <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${getActivityBgColor(activity.action)} flex-shrink-0`}>
                  {getActivityIcon(activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 mb-1">{activity.details}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiUser className="h-3 w-3" />
                      {activity.user.name}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FiClock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <FiActivity className="h-8 w-8 mx-auto mb-3 text-gray-400" />
            <p>No activity recorded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}