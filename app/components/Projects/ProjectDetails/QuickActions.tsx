'use client';

import { FiBell, FiUsers, FiActivity, FiArrowLeft } from 'react-icons/fi';

interface QuickActionsProps {
  currentStatus: string;
  hasAssignee: boolean;
  canEdit: boolean;
  onStatusUpdate: (status: string) => void;
  onAssignToSelf: () => void;
  onViewAllActivities: () => void;
  onBackToProjects: () => void;
}

export default function QuickActions({
  currentStatus,
  hasAssignee,
  canEdit,
  onStatusUpdate,
  onAssignToSelf,
  onViewAllActivities,
  onBackToProjects
}: QuickActionsProps) {
  const getNextStatus = () => {
    switch (currentStatus) {
      case 'PENDING': return 'IN_PROGRESS';
      case 'IN_PROGRESS': return 'COMPLETED';
      case 'COMPLETED': return 'PENDING';
      default: return 'PENDING';
    }
  };

  const getNextStatusLabel = () => {
    switch (currentStatus) {
      case 'PENDING': return 'In Progress';
      case 'IN_PROGRESS': return 'Completed';
      case 'COMPLETED': return 'Pending';
      default: return 'In Progress';
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl shadow-sm border border-primary-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-primary-200">
        <h2 className="text-lg font-semibold text-primary-800 flex items-center gap-2">
          <FiBell className="h-5 w-5" />
          Quick Actions
        </h2>
      </div>
      <div className="p-6 space-y-3">
        {canEdit && (
          <>
            <ActionButton
              onClick={() => onStatusUpdate(getNextStatus())}
              title={`Mark as ${getNextStatusLabel()}`}
              description={`Change status to ${getNextStatusLabel()}`}
            />
            
            {!hasAssignee && (
              <ActionButton
                onClick={onAssignToSelf}
                title="Assign to Me"
                description="Take ownership of this project"
                icon={FiUsers}
              />
            )}
          </>
        )}
        
        <ActionButton
          onClick={onViewAllActivities}
          title="View All Activities"
          description="See complete project history"
          icon={FiActivity}
        />
        
        <ActionButton
          onClick={onBackToProjects}
          title="Back to Projects"
          description="Return to projects list"
          icon={FiArrowLeft}
        />
      </div>
    </div>
  );
}

function ActionButton({ 
  onClick, 
  title, 
  description,
  icon: Icon
}: { 
  onClick: () => void; 
  title: string; 
  description: string;
  icon?: React.ElementType;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors border border-gray-200 shadow-sm"
    >
      <div className="font-medium flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-gray-500" />}
        {title}
      </div>
      <div className="text-xs text-gray-500 mt-1">{description}</div>
    </button>
  );
}