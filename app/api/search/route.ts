import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // all, projects, users, activities

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results: any = {};

    // Search projects
    if (type === 'all' || type === 'projects') {
      const projectWhere: any = {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      };

      if (user.role !== 'ADMIN') {
        projectWhere.OR = [
          { ...projectWhere.OR[0], createdById: user.id },
          { ...projectWhere.OR[1], assignedToId: user.id }
        ];
      }

      const projects = await prisma.project.findMany({
        where: projectWhere,
        select: {
          id: true,
          name: true,
          status: true,
          priority: true,
          createdBy: {
            select: { name: true }
          }
        },
        take: 10
      });

      results.projects = projects;
    }

    // Search users (admin only)
    if ((type === 'all' || type === 'users') && user.role === 'ADMIN') {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true
        },
        take: 10
      });

      results.users = users;
    }

    // Search activities
    if (type === 'all' || type === 'activities') {
      const activityWhere: any = {
        details: { contains: query, mode: 'insensitive' }
      };

      if (user.role !== 'ADMIN') {
        activityWhere.OR = [
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
        where: activityWhere,
        select: {
          id: true,
          action: true,
          details: true,
          createdAt: true,
          user: {
            select: { name: true }
          },
          project: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      results.activities = activities;
    }

    return NextResponse.json({
      query,
      results
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}