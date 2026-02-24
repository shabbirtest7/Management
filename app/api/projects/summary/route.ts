import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';


type ProjectsOverTimeItem = {
  createdAt: Date | null;
  _count: number;
};

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || 'month'; // week, month, year

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (timeframe) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // Build where clause
    const where: any = {
      createdAt: { gte: startDate }
    };

    if (user.role !== 'ADMIN') {
      where.OR = [
        { createdById: user.id },
        { assignedToId: user.id }
      ];
    }

    // Get projects created over time
    const projectsOverTime = await prisma.project.groupBy({
      by: ['createdAt'],
      where,
      _count: true,
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Get status changes over time
    const statusChanges = await prisma.activity.findMany({
      where: {
        action: { in: ['UPDATE', 'COMPLETE'] },
        createdAt: { gte: startDate },
        ...(user.role !== 'ADMIN' ? {
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
        } : {})
      },
      select: {
        action: true,
        createdAt: true,
        project: {
          select: {
            name: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Get upcoming deadlines
    const upcomingDeadlines = await prisma.project.findMany({
      where: {
        ...where,
        status: { notIn: ['COMPLETED', 'CANCELLED'] },
        dueDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
        }
      },
      select: {
        id: true,
        name: true,
        dueDate: true,
        priority: true,
        assignedTo: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });

    // Get overdue projects
    const overdueProjects = await prisma.project.count({
      where: {
        ...where,
        status: { notIn: ['COMPLETED', 'CANCELLED'] },
        dueDate: {
          lt: new Date()
        }
      }
    });

    

    return NextResponse.json({
      timeframe,
      // projectsOverTime: projectsOverTime.map(item => ({
      //   date: item.createdAt?.toISOString().split('T')[0],
      //   count: item._count
      // })),

      projectsOverTime: (projectsOverTime as ProjectsOverTimeItem[]).map(
  (item) => ({
    date: item.createdAt
      ? item.createdAt.toISOString().split('T')[0]
      : null,
    count: item._count,
  })
),

      statusChanges: statusChanges.map(item => ({
        date: item.createdAt?.toISOString().split('T')[0],
        action: item.action,
        project: item.project?.name
      })),
      upcomingDeadlines,
      overdueProjects,
      summary: {
        totalCreated: projectsOverTime.reduce((sum, item) => sum + item._count, 0),
        completedInPeriod: statusChanges.filter(s => s.action === 'COMPLETE').length,
        upcomingDeadlines: upcomingDeadlines.length,
        overdue: overdueProjects
      }
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching project summary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}