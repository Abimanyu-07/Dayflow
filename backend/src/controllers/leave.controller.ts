import { Request, Response, NextFunction } from 'express';
import { LeaveService } from '../services/leave.service';
import { ApiResponse } from '../utils/apiResponse';
import { LeaveStatus } from '../config/constants';

export class LeaveController {
  static async applyLeave(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = req.user!.employeeId!;
      const leave = await LeaveService.applyLeave(employeeId, req.body);
      ApiResponse.created(res, 'Leave application submitted successfully', leave);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async getMyLeaves(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = req.user!.employeeId!;
      const { status, leaveType, startDate, endDate } = req.query;
      const leaves = await LeaveService.getLeaves({
        employeeId,
        status: status as any,
        leaveType: leaveType as any,
        startDate: startDate as string,
        endDate: endDate as string,
      });
      ApiResponse.success(res, 'My leaves retrieved', leaves);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async getAllLeaves(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { employeeId, status, leaveType, startDate, endDate } = req.query;
      const leaves = await LeaveService.getLeaves({
        employeeId: employeeId as string,
        status: status as any,
        leaveType: leaveType as any,
        startDate: startDate as string,
        endDate: endDate as string,
      });
      ApiResponse.success(res, 'All leave applications retrieved', leaves);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async approveLeave(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const reviewerId = req.user!.userId;
      const leave = await LeaveService.reviewLeave(
        id,
        LeaveStatus.APPROVED,
        reviewerId,
        req.body
      );
      ApiResponse.success(res, 'Leave request approved successfully', leave);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async rejectLeave(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const reviewerId = req.user!.userId;
      const leave = await LeaveService.reviewLeave(
        id,
        LeaveStatus.REJECTED,
        reviewerId,
        req.body
      );
      ApiResponse.success(res, 'Leave request rejected', leave);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }
}
