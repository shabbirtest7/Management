'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FiFolder, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import StatsCard from '../components/Dashboard/StatsCard';
import StatusChart from '../components/Dashboard/StatusChart';
import RecentActivity from '../components/Dashboard/RecentActivity';
import LayoutWrapper from '../components/Layout/LayoutWrapper';

interface DashboardStats {
  totalProjects: number;
  completedProjects: number;
  pendingProjects: number;
  inProgressProjects: number;
  monthlyProjects: number;
  statusDistribution: {
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/projects?limit=1000`, {
        credentials: 'include',
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch projects');
      }
      
      const data = await res.json();
      
      const projects = data.projects || [];
      
      const statusDistribution = {
        pending: projects.filter((p: any) => p.status === 'PENDING').length,
        inProgress: projects.filter((p: any) => p.status === 'IN_PROGRESS').length,
        completed: projects.filter((p: any) => p.status === 'COMPLETED').length,
        cancelled: projects.filter((p: any) => p.status === 'CANCELLED').length,
      };

      const currentMonth = new Date().getMonth();
      const monthlyProjects = projects.filter((p: any) => {
        const projectDate = new Date(p.createdAt);
        return projectDate.getMonth() === currentMonth;
      }).length;

      setStats({
        totalProjects: projects.length,
        completedProjects: statusDistribution.completed,
        pendingProjects: statusDistribution.pending,
        inProgressProjects: statusDistribution.inProgress,
        monthlyProjects,
        statusDistribution
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // Show loading state while checking auth or fetching data
  if (authLoading || dataLoading) {
    return (
      <LayoutWrapper>
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header with User Info */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, <span className="font-medium text-primary-600">{user?.name}</span>
            </p>
          </div>
          
          {/* User Role Badge */}
          <div className="px-3 py-1 bg-primary-100  text-black rounded-full text-sm font-medium">
            {user?.role === 'ADMIN' ? 'Administrator' : 'Operations User'}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Projects"
            value={stats?.totalProjects || 0}
            icon={FiFolder}
            color="bg-blue-500"
            change={stats?.totalProjects ? `+${stats.monthlyProjects} this month` : undefined}
          />
          <StatsCard
            title="Completed"
            value={stats?.completedProjects || 0}
            icon={FiCheckCircle}
            color="bg-green-500"
            change={stats?.completedProjects ? `${Math.round((stats.completedProjects / stats.totalProjects) * 100)}% completion rate` : undefined}
          />
          <StatsCard
            title="In Progress"
            value={stats?.inProgressProjects || 0}
            icon={FiClock}
            color="bg-yellow-500"
          />
          <StatsCard
            title="Monthly Projects"
            value={stats?.monthlyProjects || 0}
            icon={FiTrendingUp}
            color="bg-purple-500"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusChart 
            data={stats?.statusDistribution || {
              pending: 0,
              inProgress: 0,
              completed: 0,
              cancelled: 0
            }} 
          />
          <RecentActivity />
        </div>

        {/* Quick Stats Summary */}
        {stats && stats.totalProjects > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{stats.pendingProjects}</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.inProgressProjects}</div>
                <div className="text-sm text-gray-500">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completedProjects}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.statusDistribution.cancelled}</div>
                <div className="text-sm text-gray-500">Cancelled</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
}