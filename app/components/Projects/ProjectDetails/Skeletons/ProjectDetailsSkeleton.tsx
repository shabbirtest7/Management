'use client';

export default function ProjectDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button skeleton */}
      <div className="mb-6">
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-10 w-96 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="flex gap-3">
          <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-6">
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}