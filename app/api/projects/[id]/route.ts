import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
   { params }: { params: { params: Promise<{ id: string }> } }
) {
  try {
    const user = await requireAuth(request);
    const { id: projectId }:any = await params;

    // Find the project
    const project = await prisma.project.findUnique({
      where: { id:projectId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        activities: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check authorization (admin can view any, users can only view their assigned/created)
    if (user.role !== 'ADMIN' && 
        project.createdById !== user.id && 
        project.assignedToId !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to view this project' },
        { status: 403 }
      );
    }

    return NextResponse.json({ project });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



// Update Method

export async function PUT(
  request: NextRequest,
   { params }: { params: { params: Promise<{ id: string }> } }
) {
  try {
    const user = await requireAuth(request);
     const { id: projectId }:any = await params;
 
    // Find the project
    const existingProject = await prisma.project.findUnique({
      where: { id:projectId },
      include: {
        createdBy: true,
        assignedTo: true
      }
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check authorization (admin can update any, users can only update their own)
    if (user.role !== 'ADMIN' && existingProject.createdById !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to update this project' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, status, priority, dueDate, assignedToId } = body;

    // Track changes for activity log
    const changes: string[] = [];

    if (name && name !== existingProject.name) {
      changes.push(`name changed from "${existingProject.name}" to "${name}"`);
    }
    if (status && status !== existingProject.status) {
      changes.push(`status changed from ${existingProject.status} to ${status}`);
    }
    if (priority && priority !== existingProject.priority) {
      changes.push(`priority changed from ${existingProject.priority} to ${priority}`);
    }
    if (assignedToId !== existingProject.assignedToId) {
      const oldAssignee = existingProject.assignedTo?.name || 'Unassigned';
      const newAssignee = assignedToId ? 'someone' : 'Unassigned';
      changes.push(`assignment changed from ${oldAssignee} to ${newAssignee}`);
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id:projectId },
      data: {
        name: name || existingProject.name,
        description: description !== undefined ? description : existingProject.description,
        status: status || existingProject.status,
        priority: priority || existingProject.priority,
        dueDate: dueDate ? new Date(dueDate) : existingProject.dueDate,
        assignedToId: assignedToId || null
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        },
        assignedTo: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // Log activity
    if (changes.length > 0) {
      await prisma.activity.create({
        data: {
          action: 'UPDATE',
          details: `Updated project: ${changes.join(', ')}`,
          userId: user.id,
          projectId: projectId
        }
      });
    }

    // Special log for completion
    if (status === 'COMPLETED' && existingProject.status !== 'COMPLETED') {
      await prisma.activity.create({
        data: {
          action: 'COMPLETE',
          details: `Completed project: ${updatedProject.name}`,
          userId: user.id,
          projectId: projectId,
        }
      });
    }

    return NextResponse.json({
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



/// Delete Method

export async function DELETE(
  request: NextRequest,
  { params }: { params: { params: Promise<{ id: string }> } }
) {
  try {
    const user = await requireAuth(request);
     const { id: projectId }:any = await params;
    // Find the project
    const project = await prisma.project.findUnique({
      where: { id:projectId },
      include: {
        _count: {
          select: {
            activities: true
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check authorization (admin can delete any, users can only delete their own)
    if (user.role !== 'ADMIN' && project.createdById !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this project' },
        { status: 403 }
      );
    }

    // Delete project and related activities in a transaction
    await prisma.$transaction([
      // Delete all activities related to this project
      prisma.activity.deleteMany({
        where: { projectId: projectId }
      }),
      // Delete the project
      prisma.project.delete({
        where: { id:projectId}
      })
    ]);

    // Log the deletion (after successful deletion)
    await prisma.activity.create({
      data: {
        action: 'DELETE',
        details: `Deleted project: ${project.name}`,
        userId: user.id
      }
    });

    return NextResponse.json({
      message: 'Project deleted successfully'
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}