import { FiCheckCircle, FiClock, FiXCircle, FiActivity, FiAlertCircle, FiFlag, FiTag, FiTrash2, FiEdit2 } from 'react-icons/fi';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
    case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
    case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'MEDIUM': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED': return FiCheckCircle;
    case 'IN_PROGRESS': return FiClock;
    case 'PENDING': return FiClock;
    case 'CANCELLED': return FiXCircle;
    default: return FiActivity;
  }
};

export const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'CRITICAL': return FiAlertCircle;
    case 'HIGH': return FiFlag;
    case 'MEDIUM': return FiFlag;
    case 'LOW': return FiFlag;
    default: return FiTag;
  }
};

export const getActivityIcon = (action: string) => {
  switch (action) {
    case 'CREATE': return FiCheckCircle;
    case 'UPDATE': return FiEdit2;
    case 'COMPLETE': return FiCheckCircle;
    case 'DELETE': return FiTrash2;
    default: return FiActivity;
  }
};

export const getActivityBgColor = (action: string) => {
  switch (action) {
    case 'CREATE': return 'bg-green-100';
    case 'UPDATE': return 'bg-blue-100';
    case 'COMPLETE': return 'bg-green-100';
    case 'DELETE': return 'bg-red-100';
    default: return 'bg-gray-100';
  }
};