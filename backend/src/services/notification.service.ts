import { AppNotification, CreateNotificationDTO } from '../types/notification.types';
import { NotificationType } from '../config/constants';
import { EmailService } from '../utils/email';
import { prisma } from '../lib/prisma';

export class NotificationService {
  private static formatNotification(n: any): AppNotification {
    return {
      id: n.id,
      userId: n.user_id,
      type: (n.type as NotificationType) || NotificationType.SYSTEM,
      title: n.title,
      message: n.message,
      isRead: n.is_read || false,
      createdAt: n.created_at ? n.created_at.toISOString() : new Date().toISOString(),
    };
  }

  static async createNotification(dto: CreateNotificationDTO): Promise<AppNotification> {
    const notification = await prisma.notifications.create({
      data: {
        user_id: dto.userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        is_read: false,
      },
    });

    return this.formatNotification(notification);
  }

  static async getUserNotifications(userId: string): Promise<AppNotification[]> {
    const list = await prisma.notifications.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return list.map(this.formatNotification);
  }

  static async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      await prisma.notifications.updateMany({
        where: {
          id: notificationId,
          user_id: userId,
        },
        data: {
          is_read: true,
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  static async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notifications.updateMany({
      where: {
        user_id: userId,
        is_read: false,
      },
      data: {
        is_read: true,
      },
    });

    return result.count;
  }

  static async notifyLeaveStatusChange(userEmail: string, userId: string, status: string, remarks?: string) {
    await this.createNotification({
      userId,
      type: status === 'APPROVED' ? NotificationType.LEAVE_APPROVED : NotificationType.LEAVE_REJECTED,
      title: `Leave Request ${status}`,
      message: `Your leave application has been ${status.toLowerCase()}.${remarks ? ` Note: ${remarks}` : ''}`,
    });

    try {
      await EmailService.sendLeaveStatusEmail(userEmail, status, remarks);
    } catch (e) {
      console.warn('Failed to send status update email:', e);
    }
  }
}
