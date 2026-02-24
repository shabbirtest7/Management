'use client';

import { FiActivity, FiUser, FiMail, FiClock, FiCheckCircle, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';
import Modal from '@/app/components/UI/Modal';
import { Activity } from '@/app/types/project';

interface AllActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
}

export default function AllActivitiesModal({
  isOpen,
  onClose,
  activities
}: AllActivitiesModalProps) {
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="All Activities"
      size="lg"
    >
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities && activities.length > 0 ? (
          activities.map((activity: Activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`p-2 rounded-full ${getActivityBgColor(activity.action)} flex-shrink-0`}>
                {getActivityIcon(activity.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 mb-1">{activity.details}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiUser className="h-3 w-3" />
                    {activity.user.name}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FiMail className="h-3 w-3" />
                    {activity.user.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FiClock className="h-3 w-3" />
                    {format(new Date(activity.createdAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FiActivity className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No activities recorded</p>
          </div>
        )}
      </div>
    </Modal>
  );
}