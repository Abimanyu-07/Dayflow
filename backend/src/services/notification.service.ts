import { AppNotification, CreateNotificationDTO } from '../types/notification.types';
import { NotificationType } from '../config/constants';
import { EmailService } from '../utils/email';

// In-memory notification store (ready for Prisma swap)
let notificationsStore: AppNotification[] = [];

export class NotificationService {
  static async createNotification(dto: CreateNotificationDTO): Promise<AppNotification> {
    const notification: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: dto.userId,
      type: dto.type,
      title: dto.title,
      message: dto.message,
      isRead: false,
      metadata: dto.metadata,
      createdAt: new Date().toISOString(),
    };

    notificationsStore.unshift(notification);
    return notification;
  }

  static async getUserNotifications(userId: string): Promise<AppNotification[]> {
    return notificationsStore.filter((n) => n.userId === userId);
  }

  static async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    const notif = notificationsStore.find((n) => n.id === notificationId && n.userId === userId);
    if (notif) {
      notif.isRead = true;
      return true;
    }
    return false;
  }

  static async markAllAsRead(userId: string): Promise<number> {
    let count = 0;
    notificationsStore.forEach((n) => {
      if (n.userId === userId && !n.isRead) {
        n.isRead = true;
        count++;
      }
    });
    return count;
  }

  static async notifyLeaveStatusChange(userEmail: string, userId: string, status: string, remarks?: string) {
    await this.createNotification({
      userId,
      type: status === 'APPROVED' ? NotificationType.LEAVE_APPROVED : NotificationType.LEAVE_REJECTED,
      title: `Leave Request ${status}`,
      message: `Your leave application has been ${status.toLowerCase()}.${remarks ? ` Note: ${remarks}` : ''}`,
    });

    await EmailService.sendLeaveStatusEmail(userEmail, status, remarks);
  }
}
