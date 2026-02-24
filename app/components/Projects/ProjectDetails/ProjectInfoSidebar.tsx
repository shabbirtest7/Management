'use client';

import { FiUser, FiUsers, FiCalendar, FiClock, FiFileText } from 'react-icons/fi';
import { format, formatDistanceToNow } from 'date-fns';
import Button from '@/app/components/UI/Button';

interface ProjectInfoSidebarProps {
  createdBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  assignedTo: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  canAssign: boolean;
  onAssignToSelf: () => void;
}

export default function ProjectInfoSidebar({
  createdBy,
  assignedTo,
  dueDate,
  createdAt,
  updatedAt,
  canAssign,
  onAssignToSelf
}: ProjectInfoSidebarProps) {
  const UserAvatar = ({ name, color }: { name: string; color: string }) => (
    <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-full flex items-center justify-center flex-shrink-0`}>
      <span className="text-white font-medium text-lg">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FiFileText className="h-5 w-5 text-gray-500" />
          Project Details
        </h2>
      </div>
      <div className="p-6 space-y-5">
        {/* Created By */}
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <FiUser className="h-3 w-3" />
            Created By
          </div>
          <div className="flex items-center gap-3">
            <UserAvatar name={createdBy.name} color="from-primary-500 to-primary-600" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{createdBy.name}</p>
              <p className="text-xs text-gray-500 truncate">{createdBy.email}</p>
              <p className="text-xs text-gray-400 mt-1">Role: {createdBy.role}</p>
            </div>
          </div>
        </div>

        {/* Assigned To */}
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <FiUsers className="h-3 w-3" />
            Assigned To
          </div>
          {assignedTo ? (
            <div className="flex items-center gap-3">
              <UserAvatar name={assignedTo.name} color="from-blue-500 to-blue-600" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{assignedTo.name}</p>
                <p className="text-xs text-gray-500 truncate">{assignedTo.email}</p>
                <p className="text-xs text-gray-400 mt-1">Role: {assignedTo.role}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400 italic">Unassigned</p>
              {canAssign && (
                <Button size="sm" variant="outline" onClick={onAssignToSelf}>
                  Assign to me
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Due Date */}
        {dueDate && (
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <FiCalendar className="h-3 w-3" />
              Due Date
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                new Date(dueDate) < new Date() && assignedTo
                  ? 'text-red-600'
                  : 'text-gray-900'
              }`}>
                {format(new Date(dueDate), 'MMMM d, yyyy')}
              </span>
              {new Date(dueDate) < new Date() && assignedTo && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                  Overdue
                </span>
              )}
            </div>
          </div>
        )}

        {/* Created At */}
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <FiCalendar className="h-3 w-3" />
            Created
          </div>
          <p className="text-sm text-gray-900">
            {format(new Date(createdAt), 'MMMM d, yyyy')}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>

        {/* Last Updated */}
        {updatedAt && updatedAt !== createdAt && (
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <FiClock className="h-3 w-3" />
              Last Updated
            </div>
            <p className="text-sm text-gray-900">
              {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}