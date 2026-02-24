'use client';

import { FiArrowLeft, FiEdit2, FiTrash2, FiRefreshCw, FiActivity,
FiCheckCircle,
FiClock,
FiXCircle,
FiAlertCircle,
FiFlag,
FiTag

 } from 'react-icons/fi';
import Button from '@/app/components/UI/Button';

interface ProjectHeaderProps {
  onBack: () => void;
  onRefresh: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
  isRefreshing: boolean;
}

export default function ProjectHeader({
  onBack,
  onRefresh,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  isRefreshing
}: ProjectHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
      >
        <div className="p-2 rounded-full group-hover:bg-gray-100">
          <FiArrowLeft className="h-5 w-5" />
        </div>
        <span>Back to Projects</span>
      </button>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          leftIcon={FiRefreshCw}
          isLoading={isRefreshing}
        >
          Refresh
        </Button>
        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={FiEdit2}
            onClick={onEdit}
          >
            Edit
          </Button>
        )}
        {canDelete && (
          <Button
            variant="danger"
            size="sm"
            leftIcon={FiTrash2}
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}

// Sub-component for status badges
ProjectHeader.StatusBadges = function StatusBadges({ status, priority }: { status: string; priority: string }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <FiCheckCircle className="h-4 w-4" />;
      case 'IN_PROGRESS': return <FiClock className="h-4 w-4" />;
      case 'PENDING': return <FiClock className="h-4 w-4" />;
      case 'CANCELLED': return <FiXCircle className="h-4 w-4" />;
      default: return <FiActivity className="h-4 w-4" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return <FiAlertCircle className="h-4 w-4" />;
      case 'HIGH': return <FiFlag className="h-4 w-4" />;
      case 'MEDIUM': return <FiFlag className="h-4 w-4" />;
      case 'LOW': return <FiFlag className="h-4 w-4" />;
      default: return <FiTag className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
        {getStatusIcon(status)}
        {status.replace('_', ' ')}
      </span>
      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border ${getPriorityColor(priority)}`}>
        {getPriorityIcon(priority)}
        {priority}
      </span>
    </div>
  );
};