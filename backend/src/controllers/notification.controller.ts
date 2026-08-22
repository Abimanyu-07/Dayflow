import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { ApiResponse } from '../utils/apiResponse';

export class NotificationController {
  static async getMyNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const notifications = await NotificationService.getUserNotifications(userId);
      ApiResponse.success(res, 'Notifications retrieved', notifications);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const userId = req.user!.userId;
      const updated = await NotificationService.markAsRead(id, userId);
      if (!updated) {
        ApiResponse.notFound(res, 'Notification not found');
        return;
      }
      ApiResponse.success(res, 'Notification marked as read');
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const count = await NotificationService.markAllAsRead(userId);
      ApiResponse.success(res, `${count} notifications marked as read`);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }
}
