import { prisma } from '@/lib/prisma';

interface NotificationData {
  [key: string]: any;
}

interface CreateNotificationParams {
  userId: string;
  type: any;
  title: string;
  message: string;
  data?: NotificationData;
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  data = {}
}: CreateNotificationParams) {
  try {
    console.log(`📝 Creating notification for user ${userId}:`, { type, title });
    
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data,
        isRead: false
      }
    });

    console.log(`✅ Notification created: ${notification.id}`);
    return notification;
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    return null;
  }
}

// Helper to notify multiple users
export async function notifyUsers(
  userIds: string[],
  type: string,
  title: string,
  message: string,
  data: NotificationData = {}
) {
  const results = await Promise.allSettled(
    userIds.map(userId => 
      createNotification({ userId, type, title, message, data })
    )
  );
  
  const successCount = results.filter(r => r.status === 'fulfilled').length;
  console.log(`📊 Notified ${successCount}/${userIds.length} users`);
  
  return results;
}

// Get all admin users
export async function getAllAdmins() {
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN', isActive: true },
    select: { id: true, name: true, email: true }
  });
  return admins;
}

// Get project stakeholders (creator, assignee, and admins)
export async function getProjectStakeholders(projectId: string, excludeUserId?: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      createdBy: { select: { id: true } },
      assignedTo: { select: { id: true } }
    }
  });

  if (!project) return [];

  const stakeholderIds = new Set<string>();
  
  // Add creator
  if (project.createdBy?.id) {
    stakeholderIds.add(project.createdBy.id);
  }
  
  // Add assignee if exists
  if (project.assignedTo?.id) {
    stakeholderIds.add(project.assignedTo.id);
  }
  
  // Add all admins
  const admins = await getAllAdmins();
  admins.forEach(admin => stakeholderIds.add(admin.id));
  
  // Remove excluded user if specified
  if (excludeUserId) {
    stakeholderIds.delete(excludeUserId);
  }
  
  return Array.from(stakeholderIds);
}

// ==================== USER MANAGEMENT NOTIFICATIONS ====================

export async function notifyUserCreated(newUser: any, createdBy: any) {
  const admins = await getAllAdmins();
  const adminIds = admins.map(a => a.id);
  
  // 1. Notify the new user
  await createNotification({
    userId: newUser.id,
    type: 'USER_CREATED',
    title: '🎉 Welcome to OpsPortal!',
    message: `Your account has been created by ${createdBy.name}. You can now log in with your credentials.`,
    data: {
      createdBy: createdBy.id,
      createdByName: createdBy.name,
      userEmail: newUser.email,
      userRole: newUser.role
    }
  });

  // 2. Notify the creator (admin)
  await createNotification({
    userId: createdBy.id,
    type: 'USER_CREATED',
    title: '✅ User Created Successfully',
    message: `You have created a new user: ${newUser.name} (${newUser.email}) with role: ${newUser.role}`,
    data: {
      userId: newUser.id,
      userEmail: newUser.email,
      userName: newUser.name,
      userRole: newUser.role
    }
  });

  // 3. Notify all other admins
  const otherAdminIds = adminIds.filter(id => id !== createdBy.id);
  if (otherAdminIds.length > 0) {
    await notifyUsers(
      otherAdminIds,
      'USER_CREATED',
      '👥 New User Registered',
      `A new user ${newUser.name} (${newUser.email}) has been created by ${createdBy.name}`,
      {
        userId: newUser.id,
        userEmail: newUser.email,
        userName: newUser.name,
        userRole: newUser.role,
        createdBy: createdBy.id,
        createdByName: createdBy.name
      }
    );
  }
}

export async function notifyUserUpdated(updatedUser: any, updatedBy: any, changes: string[]) {
  const admins = await getAllAdmins();
  const adminIds = admins.map(a => a.id);

  // 1. Notify the updated user
  await createNotification({
    userId: updatedUser.id,
    type: 'USER_UPDATED',
    title: '📝 Your Account Was Updated',
    message: `Your account information has been updated by ${updatedBy.name}. Changes: ${changes.join(', ')}`,
    data: {
      updatedBy: updatedBy.id,
      updatedByName: updatedBy.name,
      changes
    }
  });

  // 2. Notify the updater (admin)
  if (updatedBy.id !== updatedUser.id) {
    await createNotification({
      userId: updatedBy.id,
      type: 'USER_UPDATED',
      title: '✅ User Updated Successfully',
      message: `You have updated user ${updatedUser.name}'s account. Changes: ${changes.join(', ')}`,
      data: {
        userId: updatedUser.id,
        userName: updatedUser.name,
        changes
      }
    });
  }

  // 3. Notify all other admins
  const otherAdminIds = adminIds.filter(id => id !== updatedBy.id && id !== updatedUser.id);
  if (otherAdminIds.length > 0) {
    await notifyUsers(
      otherAdminIds,
      'USER_UPDATED',
      '👥 User Account Updated',
      `${updatedBy.name} updated ${updatedUser.name}'s account. Changes: ${changes.join(', ')}`,
      {
        userId: updatedUser.id,
        userName: updatedUser.name,
        updatedBy: updatedBy.id,
        updatedByName: updatedBy.name,
        changes
      }
    );
  }
}

export async function notifyUserStatusChanged(user: any, changedBy: any, newStatus: boolean) {
  const status = newStatus ? 'activated' : 'deactivated';
  const admins = await getAllAdmins();
  const adminIds = admins.map(a => a.id);

  // 1. Notify the affected user
  await createNotification({
    userId: user.id,
    type: 'USER_STATUS_CHANGED',
    title: `🔔 Account ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    message: `Your account has been ${status} by ${changedBy.name}`,
    data: {
      changedBy: changedBy.id,
      changedByName: changedBy.name,
      newStatus,
      status
    }
  });

  // 2. Notify the changer
  if (changedBy.id !== user.id) {
    await createNotification({
      userId: changedBy.id,
      type: 'USER_STATUS_CHANGED',
      title: `✅ User ${status}`,
      message: `You have ${status} ${user.name}'s account`,
      data: {
        userId: user.id,
        userName: user.name,
        newStatus,
        status
      }
    });
  }

  // 3. Notify all other admins
  const otherAdminIds = adminIds.filter(id => id !== changedBy.id && id !== user.id);
  if (otherAdminIds.length > 0) {
    await notifyUsers(
      otherAdminIds,
      'USER_STATUS_CHANGED',
      '👥 User Status Changed',
      `${changedBy.name} ${status} ${user.name}'s account`,
      {
        userId: user.id,
        userName: user.name,
        changedBy: changedBy.id,
        changedByName: changedBy.name,
        newStatus,
        status
      }
    );
  }
}

export async function notifyUserDeleted(deletedUser: any, deletedBy: any) {
  const admins = await getAllAdmins();
  const adminIds = admins.map(a => a.id);

  // 1. Notify the deleter (admin)
  await createNotification({
    userId: deletedBy.id,
    type: 'USER_DELETED',
    title: '🗑️ User Deleted',
    message: `You have deleted user: ${deletedUser.name} (${deletedUser.email})`,
    data: {
      deletedUserId: deletedUser.id,
      deletedUserEmail: deletedUser.email,
      deletedUserName: deletedUser.name
    }
  });

  // 2. Notify all other admins
  const otherAdminIds = adminIds.filter(id => id !== deletedBy.id);
  if (otherAdminIds.length > 0) {
    await notifyUsers(
      otherAdminIds,
      'USER_DELETED',
      '👥 User Account Deleted',
      `${deletedBy.name} deleted user ${deletedUser.name} (${deletedUser.email})`,
      {
        deletedUserId: deletedUser.id,
        deletedUserEmail: deletedUser.email,
        deletedUserName: deletedUser.name,
        deletedBy: deletedBy.id,
        deletedByName: deletedBy.name
      }
    );
  }
}

// ==================== PROJECT MANAGEMENT NOTIFICATIONS ====================

export async function notifyProjectCreated(project: any, createdBy: any) {
  const stakeholders = await getProjectStakeholders(project.id, createdBy.id);
  
  // 1. Notify the creator
  await createNotification({
    userId: createdBy.id,
    type: 'PROJECT_CREATED',
    title: '✅ Project Created',
    message: `You successfully created project: ${project.name}`,
    data: { 
      projectId: project.id, 
      projectName: project.name,
      projectStatus: project.status,
      projectPriority: project.priority
    }
  });

  // 2. Notify assignee if exists and different from creator
  if (project.assignedToId && project.assignedToId !== createdBy.id) {
    await createNotification({
      userId: project.assignedToId,
      type: 'PROJECT_ASSIGNED',
      title: '📋 New Project Assigned',
      message: `You have been assigned to project: ${project.name} by ${createdBy.name}`,
      data: { 
        projectId: project.id, 
        projectName: project.name,
        assignedBy: createdBy.id,
        assignedByName: createdBy.name
      }
    });
  }

  // 3. Notify all other stakeholders (admins)
  const otherStakeholders = stakeholders.filter(id => id !== createdBy.id && id !== project.assignedToId);
  if (otherStakeholders.length > 0) {
    await notifyUsers(
      otherStakeholders,
      'PROJECT_CREATED',
      '📊 New Project Created',
      `${createdBy.name} created a new project: ${project.name}`,
      { 
        projectId: project.id, 
        projectName: project.name,
        createdBy: createdBy.id,
        createdByName: createdBy.name,
        assignedTo: project.assignedToId
      }
    );
  }
}

export async function notifyProjectUpdated(project: any, updatedBy: any, changes: string[]) {
  const stakeholders = await getProjectStakeholders(project.id, updatedBy.id);
  
  // 1. Notify the updater
  await createNotification({
    userId: updatedBy.id,
    type: 'PROJECT_UPDATED',
    title: '✅ Project Updated',
    message: `You updated project: ${project.name}. Changes: ${changes.join(', ')}`,
    data: { 
      projectId: project.id, 
      projectName: project.name,
      changes
    }
  });

  // 2. Notify assignee if exists and different from updater
  if (project.assignedToId && project.assignedToId !== updatedBy.id) {
    await createNotification({
      userId: project.assignedToId,
      type: 'PROJECT_UPDATED',
      title: '📋 Project Updated',
      message: `Project "${project.name}" was updated by ${updatedBy.name}. Changes: ${changes.join(', ')}`,
      data: { 
        projectId: project.id, 
        projectName: project.name,
        updatedBy: updatedBy.id,
        updatedByName: updatedBy.name,
        changes
      }
    });
  }

  // 3. Notify creator if different from updater and assignee
  if (project.createdById !== updatedBy.id && project.createdById !== project.assignedToId) {
    await createNotification({
      userId: project.createdById,
      type: 'PROJECT_UPDATED',
      title: '📊 Your Project Was Updated',
      message: `Your project "${project.name}" was updated by ${updatedBy.name}. Changes: ${changes.join(', ')}`,
      data: { 
        projectId: project.id, 
        projectName: project.name,
        updatedBy: updatedBy.id,
        updatedByName: updatedBy.name,
        changes
      }
    });
  }

  // 4. Notify all other stakeholders
  const otherStakeholders = stakeholders.filter(
    id => id !== updatedBy.id && id !== project.assignedToId && id !== project.createdById
  );
  
  if (otherStakeholders.length > 0) {
    await notifyUsers(
      otherStakeholders,
      'PROJECT_UPDATED',
      '📊 Project Updated',
      `${updatedBy.name} updated project "${project.name}". Changes: ${changes.join(', ')}`,
      { 
        projectId: project.id, 
        projectName: project.name,
        updatedBy: updatedBy.id,
        updatedByName: updatedBy.name,
        changes
      }
    );
  }
}

export async function notifyProjectDeleted(project: any, deletedBy: any) {
  const stakeholders = await getProjectStakeholders(project.id, deletedBy.id);
  
  // 1. Notify the deleter
  await createNotification({
    userId: deletedBy.id,
    type: 'PROJECT_DELETED',
    title: '🗑️ Project Deleted',
    message: `You deleted project: ${project.name}`,
    data: { 
      projectId: project.id, 
      projectName: project.name 
    }
  });

  // 2. Notify all other stakeholders
  if (stakeholders.length > 0) {
    await notifyUsers(
      stakeholders,
      'PROJECT_DELETED',
      '🗑️ Project Deleted',
      `${deletedBy.name} deleted project: ${project.name}`,
      { 
        projectId: project.id, 
        projectName: project.name,
        deletedBy: deletedBy.id,
        deletedByName: deletedBy.name
      }
    );
  }
}

export async function notifyStatusChanged(project: any, oldStatus: string, newStatus: string, changedBy: any) {
  const stakeholders = await getProjectStakeholders(project.id, changedBy.id);
  
  const message = `Project "${project.name}" status changed from ${oldStatus.replace('_', ' ')} to ${newStatus.replace('_', ' ')}`;
  
  // 1. Notify the changer
  await createNotification({
    userId: changedBy.id,
    type: 'STATUS_CHANGED',
    title: '🔄 Status Updated',
    message: `You changed status of "${project.name}" to ${newStatus.replace('_', ' ')}`,
    data: { 
      projectId: project.id, 
      projectName: project.name,
      oldStatus, 
      newStatus 
    }
  });

  // 2. Special notification for completion
  if (newStatus === 'COMPLETED') {
    // Notify creator
    if (project.createdById !== changedBy.id) {
      await createNotification({
        userId: project.createdById,
        type: 'PROJECT_COMPLETED',
        title: '🎉 Project Completed!',
        message: `Your project "${project.name}" has been completed by ${changedBy.name}`,
        data: { 
          projectId: project.id, 
          projectName: project.name,
          completedBy: changedBy.id,
          completedByName: changedBy.name
        }
      });
    }

    // Notify assignee
    if (project.assignedToId && project.assignedToId !== changedBy.id && project.assignedToId !== project.createdById) {
      await createNotification({
        userId: project.assignedToId,
        type: 'PROJECT_COMPLETED',
        title: '🎉 Project Completed!',
        message: `Project "${project.name}" has been completed by ${changedBy.name}`,
        data: { 
          projectId: project.id, 
          projectName: project.name,
          completedBy: changedBy.id,
          completedByName: changedBy.name
        }
      });
    }
  }

  // 3. Notify all other stakeholders
  const otherStakeholders = stakeholders.filter(
    id => id !== changedBy.id && id !== project.createdById && id !== project.assignedToId
  );
  
  if (otherStakeholders.length > 0) {
    await notifyUsers(
      otherStakeholders,
      'STATUS_CHANGED',
      '🔄 Project Status Changed',
      message,
      { 
        projectId: project.id, 
        projectName: project.name,
        oldStatus, 
        newStatus,
        changedBy: changedBy.id,
        changedByName: changedBy.name
      }
    );
  }
}

export async function notifyProjectAssigned(project: any, assignedTo: any, assignedBy: any) {
  const stakeholders = await getProjectStakeholders(project.id, assignedBy.id);
  
  // 1. Notify the assigned user
  await createNotification({
    userId: assignedTo.id,
    type: 'PROJECT_ASSIGNED',
    title: '📋 New Project Assignment',
    message: `You have been assigned to project: ${project.name} by ${assignedBy.name}`,
    data: { 
      projectId: project.id, 
      projectName: project.name,
      assignedBy: assignedBy.id,
      assignedByName: assignedBy.name
    }
  });

  // 2. Notify the assigner
  if (assignedBy.id !== assignedTo.id) {
    await createNotification({
      userId: assignedBy.id,
      type: 'PROJECT_ASSIGNED',
      title: '✅ Assignment Complete',
      message: `You have assigned project "${project.name}" to ${assignedTo.name}`,
      data: { 
        projectId: project.id, 
        projectName: project.name,
        assignedTo: assignedTo.id,
        assignedToName: assignedTo.name
      }
    });
  }

  // 3. Notify creator if different
  if (project.createdById !== assignedBy.id && project.createdById !== assignedTo.id) {
    await createNotification({
      userId: project.createdById,
      type: 'PROJECT_ASSIGNED',
      title: '📊 Project Assignment Update',
      message: `Your project "${project.name}" has been assigned to ${assignedTo.name} by ${assignedBy.name}`,
      data: { 
        projectId: project.id, 
        projectName: project.name,
        assignedTo: assignedTo.id,
        assignedToName: assignedTo.name,
        assignedBy: assignedBy.id,
        assignedByName: assignedBy.name
      }
    });
  }

  // 4. Notify all other stakeholders
  const otherStakeholders = stakeholders.filter(
    id => id !== assignedBy.id && id !== assignedTo.id && id !== project.createdById
  );
  
  if (otherStakeholders.length > 0) {
    await notifyUsers(
      otherStakeholders,
      'PROJECT_ASSIGNED',
      '📊 Project Assignment',
      `${assignedBy.name} assigned project "${project.name}" to ${assignedTo.name}`,
      { 
        projectId: project.id, 
        projectName: project.name,
        assignedTo: assignedTo.id,
        assignedToName: assignedTo.name,
        assignedBy: assignedBy.id,
        assignedByName: assignedBy.name
      }
    );
  }
}

export async function notifyDueDateApproaching(project: any, daysLeft: number) {
  const stakeholders = await getProjectStakeholders(project.id);
  const message = `⏰ Project "${project.name}" is due in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`;
  
  await notifyUsers(
    stakeholders,
    'DUE_DATE_APPROACHING',
    '⏰ Due Date Approaching',
    message,
    { 
      projectId: project.id, 
      projectName: project.name,
      daysLeft,
      dueDate: project.dueDate
    }
  );
}

export async function notifyDueDateOverdue(project: any) {
  const stakeholders = await getProjectStakeholders(project.id);
  const message = `⚠️ Project "${project.name}" is overdue!`;
  
  await notifyUsers(
    stakeholders,
    'DUE_DATE_OVERDUE',
    '⚠️ Project Overdue',
    message,
    { 
      projectId: project.id, 
      projectName: project.name,
      dueDate: project.dueDate
    }
  );
}

// ==================== ACTIVITY NOTIFICATIONS ====================

export async function notifyActivityCreated(activity: any, project: any, user: any) {
  const stakeholders = await getProjectStakeholders(project.id, user.id);
  
  const actionMessages: Record<string, string> = {
    CREATE: 'created',
    UPDATE: 'updated',
    DELETE: 'deleted',
    COMPLETE: 'completed',
    COMMENT: 'commented on'
  };

  const action = actionMessages[activity.action] || 'performed an action on';
  
  await notifyUsers(
    stakeholders,
    'ACTIVITY_CREATED',
    `📝 New Activity: ${activity.action}`,
    `${user.name} ${action} project "${project.name}": ${activity.details}`,
    {
      activityId: activity.id,
      projectId: project.id,
      projectName: project.name,
      userId: user.id,
      userName: user.name,
      action: activity.action,
      details: activity.details
    }
  );
}

// ==================== SYSTEM NOTIFICATIONS ====================

export async function notifySystemAlert(message: string, data: any = {}) {
  const admins = await getAllAdmins();
  
  await notifyUsers(
    admins.map(a => a.id),
    'SYSTEM_ALERT',
    '🔔 System Alert',
    message,
    data
  );
}