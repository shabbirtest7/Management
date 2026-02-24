'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX, FiFlag, FiClock } from 'react-icons/fi';
// import Input from '@/components/UI/Input';
// import Select from '@/components/UI/Select';
// import Button from '@/components/UI/Button';

import Button from '../UI/Button';
import Select from '../UI/Select';
import Input from '../UI/Input';
export interface FilterValues {
  search: string;
  status: string;
  priority: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface ProjectFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  initialFilters?: Partial<FilterValues>;
  showSort?: boolean;
  className?: string;
}

const ProjectFilters = ({ 
  onFilterChange, 
  initialFilters = {}, 
  showSort = true,
  className = '' 
}: ProjectFiltersProps) => {
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    status: '',
    priority: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialFilters
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.priority) count++;
    if (filters.sortBy !== 'createdAt') count++;
    if (filters.sortOrder !== 'desc') count++;
    setActiveFilterCount(count);
  }, [filters]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setIsExpanded(false);
  };

  const handleClearSearch = () => {
    setFilters(prev => ({ ...prev, search: '' }));
  };

  // Status options
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  // Priority options
  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'CRITICAL', label: 'Critical' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'createdAt', label: 'Created Date' },
    { value: 'name', label: 'Name' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'status', label: 'Status' },
    { value: 'priority', label: 'Priority' }
  ];

  // Sort order options
  const sortOrderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' }
  ];

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header with search and toggle */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input - Always visible */}
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search projects by name or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              icon={FiSearch}
              containerClassName="w-full"
              inputClassName="pr-10"
            />
            {filters.search && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            leftIcon={FiFilter}
            className="sm:w-auto w-full justify-center"
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full text-xs font-medium">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      {isExpanded && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="space-y-4">
            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <Select
                label="Status"
                options={statusOptions}
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                icon={FiClock}
                placeholder="All Statuses"
              />

              {/* Priority Filter */}
              <Select
                label="Priority"
                options={priorityOptions}
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                icon={FiFlag}
                placeholder="All Priorities"
              />

              {/* Sort By (if enabled) */}
              {showSort && (
                <>
                  <Select
                    label="Sort By"
                    options={sortOptions}
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    placeholder="Sort by"
                  />

                  <Select
                    label="Sort Order"
                    options={sortOrderOptions}
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                    placeholder="Order"
                  />
                </>
              )}
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                
                {filters.status && (
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(filters.status)}`}>
                    <FiClock className="h-3 w-3" />
                    {statusOptions.find(opt => opt.value === filters.status)?.label}
                    <button
                      onClick={() => handleFilterChange('status', '')}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {filters.priority && (
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(filters.priority)}`}>
                    <FiFlag className="h-3 w-3" />
                    {priorityOptions.find(opt => opt.value === filters.priority)?.label}
                    <button
                      onClick={() => handleFilterChange('priority', '')}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {filters.sortBy !== 'createdAt' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    Sort: {sortOptions.find(opt => opt.value === filters.sortBy)?.label} 
                    ({filters.sortOrder === 'asc' ? 'Asc' : 'Desc'})
                    <button
                      onClick={() => handleFilterChange('sortBy', 'createdAt')}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {/* Clear All Button */}
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium ml-auto"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter Summary (when collapsed) */}
      {!isExpanded && activeFilterCount > 0 && (
        <div className="px-4 py-2 bg-primary-50 border-b border-primary-100 flex flex-wrap items-center gap-2">
          <FiFilter className="h-4 w-4 text-primary-500" />
          <span className="text-sm text-primary-700">
            {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}
          </span>
          <button
            onClick={handleClearFilters}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium ml-auto"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;