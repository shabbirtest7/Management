// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { requireAuth, requireAdmin } from '@/lib/auth';
// import bcrypt from 'bcryptjs';


// import { 
//   notifyUserUpdated, 
//   notifyUserStatusChanged,
//   notifyUserDeleted 
// } from '@/lib/notifications';

// export async function GET(
//   request: NextRequest,
//   // { params }: { params: { id: string } }
//   { params }: { params: Promise<{ id: string }> }

// ) {
//   try {
//     const user = await requireAuth(request);
//  const { id } = await params;
//     // Users can view their own profile, admins can view any
//     if (user.id !== id && user.role !== 'ADMIN') {
//       return NextResponse.json(
//         { error: 'Forbidden' },
//         { status: 403 }
//       );
//     }

//     const targetUser = await prisma.user.findUnique({
//       where: { id: id },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         role: true,
//         isActive: true,
//         createdAt: true,
//         updatedAt: true,
//         _count: {
//           select: {
//             createdProjects: true,
//             assignedProjects: true,
//             activities: true
//           }
//         },
//         createdProjects: {
//           select: {
//             id: true,
//             name: true,
//             status: true,
//             priority: true,
//             createdAt: true
//           },
//           take: 5,
//           orderBy: { createdAt: 'desc' }
//         },
//         assignedProjects: {
//           select: {
//             id: true,
//             name: true,
//             status: true,
//             priority: true,
//             createdAt: true
//           },
//           take: 5,
//           orderBy: { createdAt: 'desc' }
//         }
//       }
//     });

//     if (!targetUser) {
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ user: targetUser });
//   } catch (error: any) {
//     if (error.message === 'Unauthorized') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
//     console.error('Error fetching user:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(
//   request: NextRequest,
//   // { params }: { params: { params: Promise<{ id: string }> } }
//   { params }: { params: Promise<{ id: string }> }

// ) {
//   try {
//     const currentUser = await requireAuth(request);

//      const { id: userId } = await params;

//     // Users can update their own profile, admins can update any
//     if (currentUser.id !==userId && currentUser.role !== 'ADMIN') {
//       return NextResponse.json(
//         { error: 'Forbidden' },
//         { status: 403 }
//       );
//     }

//     const body = await request.json();
//     const { name, email, role, isActive } = body;


//     console.log('User ID:', userId , name , role , isActive);

    
//     // Check if user exists
//     const existingUser = await prisma.user.findUnique({
//       where: { id: userId }
//     });

//     if (!existingUser) {
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // Only admins can change role and active status
//     const updateData: any = {};
    
//     if (name) updateData.name = name;
//     if (email) {
//       // Check if email is already taken by another user
//       if (email !== existingUser.email) {
//         const emailExists = await prisma.user.findUnique({
//           where: { email }
//         });
//         if (emailExists) {
//           return NextResponse.json(
//             { error: 'Email already in use' },
//             { status: 400 }
//           );
//         }
//       }
//       updateData.email = email;
//     }
    
//     if (currentUser.role === 'ADMIN') {
//       if (role) updateData.role = role;
//       if (isActive !== undefined) updateData.isActive = isActive;
//     }

//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: updateData,
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         role: true,
//         isActive: true,
//         createdAt: true
//       }
//     });

//     // Log activity

//     await prisma.activity.create({
//       data: {
//         action: 'UPDATE',
//         details: `Updated user: ${updatedUser.name}`,
//         userId: currentUser.id
//       }
//     });



//     if (currentUser.role === 'ADMIN') {
//   const changes: string[] = [];
  
//   if (name && name !== existingUser.name) changes.push(`name changed to "${name}"`);
//   if (email && email !== existingUser.email) changes.push(`email changed to "${email}"`);
//   if (role && role !== existingUser.role) changes.push(`role changed from ${existingUser.role} to ${role}`);
  
//   if (changes.length > 0) {
//     await notifyUserUpdated(updatedUser, currentUser, changes);
//   }
  
//   if (isActive !== undefined && isActive !== existingUser.isActive) {
//     await notifyUserStatusChanged(updatedUser, currentUser, isActive);
//   }
// }



//     return NextResponse.json({
//       message: 'User updated successfully',
//       user: updatedUser
//     });
//   } catch (error: any) {
//     if (error.message === 'Unauthorized') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
//     console.error('Error updating user:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   //  { params }: { params: { params: Promise<{ id: string }> } }
//     { params }: { params: Promise<{ id: string }> }

// ) {
//   try {
//     const admin = await requireAdmin(request);
//  const { id: userId } = await params;
//     // Prevent deleting yourself
//     if (admin.id === userId) {
//       return NextResponse.json(
//         { error: 'Cannot delete your own account' },
//         { status: 400 }
//       );
//     }

//     // Check if user exists
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       include: {
//         _count: {
//           select: {
//             createdProjects: true,
//             assignedProjects: true
//           }
//         }
//       }
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // Check if user has associated projects
//     if (user._count.createdProjects > 0 || user._count.assignedProjects > 0) {
//       return NextResponse.json(
//         { error: 'Cannot delete user with associated projects' },
//         { status: 400 }
//       );
//     }

//     // Delete user and related activities
//     await prisma.$transaction([
//       prisma.activity.deleteMany({
//         where: { userId: userId }
//       }),
//       prisma.user.delete({
//         where: { id: userId}
//       })
//     ]);

//     // Log activity
//     await prisma.activity.create({
//       data: {
//         action: 'DELETE',
//         details: `Deleted user: ${user.name} (${user.email})`,
//         userId: admin.id
//       }
//     });


//      await prisma.$transaction([
//       prisma.activity.deleteMany({ where: { userId: userId } }),
//       prisma.notification.deleteMany({ where: { userId: userId } }),
//       prisma.user.delete({ where: { id: userId } })
//     ]);

//     // 🚀 Notify about deletion
//     await notifyUserDeleted(user, admin);

//     return NextResponse.json({ message: 'User deleted successfully' });

//     // return NextResponse.json({
//     //   message: 'User deleted successfully'
//     // });
//   } catch (error: any) {
//     if (error.message === 'Unauthorized' || error.message === 'Forbidden: Admin access required') {
//       return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
//     }
//     console.error('Error deleting user:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }





// updated code 

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireAdmin } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { 
  notifyUserUpdated, 
  notifyUserStatusChanged,
  notifyUserDeleted 
} from '@/lib/notifications';

// ==================== GET - Fetch Single User ====================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    const { id: userId } = await params;

    // Users can view their own profile, admins can view any
    if (user.id !== userId && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            createdProjects: true,
            assignedProjects: true,
            activities: true
          }
        },
        createdProjects: {
          select: {
            id: true,
            name: true,
            status: true,
            priority: true,
            createdAt: true
          },
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        assignedProjects: {
          select: {
            id: true,
            name: true,
            status: true,
            priority: true,
            createdAt: true
          },
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: targetUser });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ==================== PUT - Update User ====================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireAuth(request);
    const { id: userId } = await params;
    const body = await request.json();
    const { name, email, role, isActive } = body;

    console.log('User ID:', userId, 'Name:', name, 'Role:', role, 'isActive:', isActive);

    // Users can update their own profile, admins can update any
    if (currentUser.id !== userId && currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};
    const changes: string[] = [];
    
    if (name && name !== existingUser.name) {
      updateData.name = name;
      changes.push(`name changed from "${existingUser.name}" to "${name}"`);
    }
    
    if (email && email !== existingUser.email) {
      // Check if email is already taken by another user
      if (email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email }
        });
        if (emailExists) {
          return NextResponse.json(
            { error: 'Email already in use' },
            { status: 400 }
          );
        }
      }
      updateData.email = email;
      changes.push(`email changed from "${existingUser.email}" to "${email}"`);
    }
    
    // Only admins can change role and active status
    if (currentUser.role === 'ADMIN') {
      if (role && role !== existingUser.role) {
        updateData.role = role;
        changes.push(`role changed from ${existingUser.role} to ${role}`);
      }
      if (isActive !== undefined && isActive !== existingUser.isActive) {
        updateData.isActive = isActive;
        changes.push(`status changed to ${isActive ? 'active' : 'inactive'}`);
      }
    }

    // If no changes, return early
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        message: 'No changes detected',
        user: existingUser
      });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: 'UPDATE',
        details: `Updated user: ${updatedUser.name} - ${changes.join(', ')}`,
        userId: currentUser.id
      }
    });

    // 🚀 Send notifications
    if (changes.length > 0) {
      await notifyUserUpdated(updatedUser, currentUser, changes);
    }
    
    if (isActive !== undefined && isActive !== existingUser.isActive) {
      await notifyUserStatusChanged(updatedUser, currentUser, isActive);
    }

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser,
      changes
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ==================== DELETE - Delete User ====================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id: userId } = await params;

    // Prevent deleting yourself
    if (admin.id === userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            createdProjects: true,
            assignedProjects: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has associated projects
    if (user._count.createdProjects > 0 || user._count.assignedProjects > 0) {
      return NextResponse.json(
        { error: 'Cannot delete user with associated projects. Please reassign or delete projects first.' },
        { status: 400 }
      );
    }

    // Delete user and related records in a transaction
    await prisma.$transaction([
      prisma.activity.deleteMany({ where: { userId: userId } }),
      prisma.notification.deleteMany({ where: { userId: userId } }),
      prisma.user.delete({ where: { id: userId } })
    ]);

    // Log activity
    await prisma.activity.create({
      data: {
        action: 'DELETE',
        details: `Deleted user: ${user.name} (${user.email})`,
        userId: admin.id
      }
    });

    // 🚀 Notify about deletion
    await notifyUserDeleted(user, admin);

    return NextResponse.json({ 
      message: 'User deleted successfully' 
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden: Admin access required') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}