import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const action = searchParams.get('action');
    const days = searchParams.get('days');
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId');

    // Build where clause
    const where: any = {};

    if (action && action !== 'ALL') {
      where.action = action;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    if (userId) {
      where.userId = userId;
    }

    // Date filter
    if (days && days !== 'ALL') {
      const date = new Date();
      date.setDate(date.getDate() - parseInt(days));
      where.createdAt = {
        gte: date
      };
    }

    // If not admin, only show activities related to user's projects
    if (user.role !== 'ADMIN') {
      where.OR = [
        { userId: user.id },
        {
          project: {
            OR: [
              { createdById: user.id },
              { assignedToId: user.id }
            ]
          }
        }
      ];
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Get activity statistics
    const stats = await prisma.activity.groupBy({
      by: ['action'],
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
        }
      },
      _count: true
    });

    return NextResponse.json({
      activities,
      stats: stats.reduce((acc: any, curr) => {
        acc[curr.action] = curr._count;
        return acc;
      }, {})
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const body = await request.json();
    const { action, details, projectId } = body;

    if (!action || !details) {
      return NextResponse.json(
        { error: 'Action and details are required' },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        action,
        details,
        userId: user.id,
        projectId
      },
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
      }
    });

    return NextResponse.json(activity);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}