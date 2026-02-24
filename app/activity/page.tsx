'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { 
  FiFile,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiUser,
  FiCalendar,
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';
import LayoutWrapper from '../components/Layout/LayoutWrapper';
import Select from '../components/UI/Select';
import Button from '../components/UI/Button';


interface Activity {
  id: string;
  action: string;
  details: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  project?: {
    id: string;
    name: string;
  };
}

export default function ActivityPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [timeRange, setTimeRange] = useState('7');

  const fetchActivities = async () => {
    try {
      const params = new URLSearchParams({
        limit: '50',
        ...(filter !== 'ALL' && { action: filter }),
        ...(timeRange !== 'ALL' && { days: timeRange })
      });

      const res = await fetch(`/api/activities?${params}`, {
        credentials: 'include'
      });
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch activities');
      }

      const data = await res.json();
      setActivities(data.activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [filter, timeRange]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchActivities();
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <FiFile className="text-green-500" />;
      case 'UPDATE':
        return <FiEdit2 className="text-blue-500" />;
      case 'DELETE':
        return <FiTrash2 className="text-red-500" />;
      case 'COMPLETE':
        return <FiCheckCircle className="text-green-500" />;
      default:
        return <FiEdit2 className="text-gray-500" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100';
      case 'UPDATE': return 'bg-blue-100';
      case 'DELETE': return 'bg-red-100';
      case 'COMPLETE': return 'bg-green-100';
      default: return 'bg-gray-100';
    }
  };

  const filterOptions = [
    { value: 'ALL', label: 'All Activities' },
    { value: 'CREATE', label: 'Creation' },
    { value: 'UPDATE', label: 'Updates' },
    { value: 'COMPLETE', label: 'Completions' },
    { value: 'DELETE', label: 'Deletions' }
  ];

  const timeRangeOptions = [
    { value: '1', label: 'Last 24 hours' },
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 90 days' },
    { value: 'ALL', label: 'All time' }
  ];

const groupedActivities = React.useMemo(() => {
  if (!activities || !Array.isArray(activities)) {
    return {};
  }

  return activities.reduce((groups: { [key: string]: Activity[] }, activity) => {
    const date = new Date(activity.createdAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});
}, [activities]);

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Activity History</h1>
            <p className="text-gray-600">Track all actions and changes in the system</p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            leftIcon={FiRefreshCw}
            isLoading={refreshing}
          >
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Activity Type"
              options={filterOptions}
              value={filter}
              onChange={(e:any) => setFilter(e.target.value)}
              icon={FiFilter}
            />
            <Select
              label="Time Range"
              options={timeRangeOptions}
              value={timeRange}
              onChange={(e:any) => setTimeRange(e.target.value)}
              icon={FiCalendar}
            />
            <div className="flex items-end">
              <p className="text-sm text-gray-500">
                Showing {activities.length} activities
              </p>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No activities found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {Object.entries(groupedActivities).map(([date, dateActivities]) => (
                <div key={date} className="p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">
                    {new Date(date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <div className="space-y-4">
                    {dateActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className={`p-2 rounded-full ${getActivityColor(activity.action)}`}>
                          {getActivityIcon(activity.action)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-900">
                              {activity.user.name}
                            </span>
                            <span className="text-gray-600">{activity.details}</span>
                            {activity.project && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                                {activity.project.name}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            <span>{activity.user.email}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(activity.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
}