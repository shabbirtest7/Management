import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Priority } from '@prisma/client';

type ProjectsByPriorityItem = {
  priority: Priority;
  _count: number;
};

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // Build project where clause based on user role
    const projectWhere: any = {};
    
    if (user.role !== 'ADMIN') {
      projectWhere.OR = [
        { createdById: user.id },
        { assignedToId: user.id }
      ];
    }

    // Get project statistics
    const [
      totalProjects,
      completedProjects,
      inProgressProjects,
      pendingProjects,
      cancelledProjects,
      monthlyProjects,
      projectsByPriority,
      recentActivities
    ] = await Promise.all([
      // Total projects
      prisma.project.count({ where: projectWhere }),
      
      // Completed projects
      prisma.project.count({
        where: {
          ...projectWhere,
          status: 'COMPLETED'
        }
      }),
      
      // In progress projects
      prisma.project.count({
        where: {
          ...projectWhere,
          status: 'IN_PROGRESS'
        }
      }),
      
      // Pending projects
      prisma.project.count({
        where: {
          ...projectWhere,
          status: 'PENDING'
        }
      }),
      
      // Cancelled projects
      prisma.project.count({
        where: {
          ...projectWhere,
          status: 'CANCELLED'
        }
      }),
      
      // Monthly projects
      prisma.project.count({
        where: {
          ...projectWhere,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      
      // Projects by priority
      prisma.project.groupBy({
        by: ['priority'],
        where: projectWhere,
        _count: true
      }),
      
      // Recent activities
      prisma.activity.findMany({
        where: user.role !== 'ADMIN' ? {
          OR: [
            { userId: user.id },
            {
              project: {
                OR: [
                  { createdById: user.id },
                  { assignedToId: user.id }
                ]
              }
            }
          ]
        } : {},
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          project: {
            select: {
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    // Get user statistics (admin only)
    let userStats = null;
    if (user.role === 'ADMIN') {
      const [totalUsers, activeUsers, adminUsers] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.user.count({ where: { role: 'ADMIN' } })
      ]);
      
      userStats = {
        totalUsers,
        activeUsers,
        adminUsers,
        regularUsers: totalUsers - adminUsers
      };
    }

    // Format priority data
    const priorityDistribution = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0
    };
    
 projectsByPriority.forEach((item: ProjectsByPriorityItem) => {
  priorityDistribution[item.priority] = item._count;
});

    return NextResponse.json({
      projects: {
        total: totalProjects,
        completed: completedProjects,
        inProgress: inProgressProjects,
        pending: pendingProjects,
        cancelled: cancelledProjects,
        monthly: monthlyProjects,
        completionRate: totalProjects > 0 
          ? Math.round((completedProjects / totalProjects) * 100) 
          : 0,
        priorityDistribution
      },
      activities: recentActivities,
      users: userStats
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}