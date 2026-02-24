'use client';

import { FiAlertCircle } from 'react-icons/fi';
import Modal from '@/app/components/UI/Modal';
import Button from '@/app/components/UI/Button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  projectName
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Project"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
          <FiAlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">
            This action cannot be undone. This will permanently delete the project and all associated activities.
          </p>
        </div>
        <p className="text-gray-700">
          Are you sure you want to delete <span className="font-semibold">{projectName}</span>?
        </p>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete Project
          </Button>
        </div>
      </div>
    </Modal>
  );
}