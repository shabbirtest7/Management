'use client';

import { FiFileText } from 'react-icons/fi';

interface ProjectDescriptionProps {
  description: string | null;
}

export default function ProjectDescription({ description }: ProjectDescriptionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FiFileText className="h-5 w-5 text-gray-500" />
          Description
        </h2>
      </div>
      <div className="p-6">
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {description || (
            <span className="text-gray-400 italic">No description provided.</span>
          )}
        </p>
      </div>
    </div>
  );
}