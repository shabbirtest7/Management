  import { NextRequest, NextResponse } from 'next/server';
  import { requireAuth, requireAdmin } from '@/lib/auth';
  import { prisma } from '@/lib/prisma';
import { notifyProjectCreated, notifyActivityCreated } from '@/lib/notifications';


  export async function GET(request: NextRequest) {
    try {
      const user = await requireAuth(request);
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const search = searchParams.get('search') || '';
      const status = searchParams.get('status');
      const priority = searchParams.get('priority');

      const skip = (page - 1) * limit;

      const where: any = {};
      
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } }
        ];
      }
      
      if (status) where.status = status;
      if (priority) where.priority = priority;

      // If user is not admin, only show their projects
      if (user.role !== 'ADMIN') {
        where.OR = [
          { createdById: user.id },
          { assignedToId: user.id }
        ];
      }

      const [projects, total] = await Promise.all([
        prisma.project.findMany({
          where,
          include: {
            createdBy: {
              select: { id: true, name: true, email: true }
            },
            assignedTo: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.project.count({ where })
      ]);

      return NextResponse.json({
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      console.error('Error fetching projects:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  export async function POST(request: NextRequest) {
    try {
      const user = await requireAuth(request);
        console.log('user is ',user)
      const body = await request.json();
      const { name, description, status, priority, dueDate, assignedToId } = body;

      if (!name) {
        return NextResponse.json(
          { error: 'Project name is required' },
          { status: 400 }
        );
      }

       const finalAssignedToId = assignedToId && assignedToId.trim() !== '' 
      ? assignedToId 
      : null;

      const project = await prisma.project.create({
        data: {
          name,
          description,
          status,
          priority,
          dueDate: dueDate ? new Date(dueDate) : null,
          createdById: user.id,
          assignedToId:finalAssignedToId
        },
        include: {
          createdBy: {
            select: { name: true }
          }
        }
      });

      // Create activity log
      const activity = await prisma.activity.create({
        data: {
          action: 'CREATE',
          details: `Created project: ${name}`,
          userId: user.id,
          projectId: project.id
        }
      });

    await notifyProjectCreated(project, user);
    await notifyActivityCreated(activity, project, user);

    return NextResponse.json(project);

      // return NextResponse.json(project);
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      console.error('Error creating project:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

