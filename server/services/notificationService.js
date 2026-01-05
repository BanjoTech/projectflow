// server/services/notificationService.js

const Notification = require('../models/Notification');

async function createNotification(
  io,
  { userId, type, message, projectId, fromUserId, data }
) {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      message,
      project: projectId,
      fromUser: fromUserId,
      data,
    });

    await notification.populate('fromUser', 'name');
    await notification.populate('project', 'name');

    // Emit to user's socket room
    io.to(`user:${userId}`).emit('notification', notification);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

async function notifyProjectMembers(
  io,
  { project, excludeUserId, type, message, data }
) {
  try {
    // Get all members (owner + collaborators)
    const memberIds = [
      project.user.toString(),
      ...(project.collaborators?.map((c) => c.user.toString()) || []),
    ].filter((id) => id !== excludeUserId);

    // Create notification for each member
    for (const memberId of memberIds) {
      await createNotification(io, {
        userId: memberId,
        type,
        message,
        projectId: project._id,
        fromUserId: excludeUserId,
        data,
      });
    }
  } catch (error) {
    console.error('Error notifying project members:', error);
  }
}

module.exports = {
  createNotification,
  notifyProjectMembers,
};
