import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from '../services/attendance.service';
import { ApiResponse } from '../utils/apiResponse';

export class AttendanceController {
  static async checkIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = req.user!.employeeId!;
      const result = await AttendanceService.checkIn(employeeId, req.body);
      ApiResponse.created(res, 'Checked in successfully', result);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async checkOut(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = req.user!.employeeId!;
      const result = await AttendanceService.checkOut(employeeId, req.body);
      ApiResponse.success(res, 'Checked out successfully', result);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async getMyAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = req.user!.employeeId!;
      const { startDate, endDate, status } = req.query;
      const records = await AttendanceService.getAttendanceList({
        employeeId,
        startDate: startDate as string,
        endDate: endDate as string,
        status: status as any,
      });
      ApiResponse.success(res, 'Attendance records retrieved', records);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async getMyTodayAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = req.user!.employeeId!;
      const record = await AttendanceService.getMyTodayAttendance(employeeId);
      ApiResponse.success(res, 'Today attendance status retrieved', record);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async getMyWeeklyAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = req.user!.employeeId!;
      const { weekStartDate } = req.query;
      const summary = await AttendanceService.getWeeklySummary(employeeId, weekStartDate as string);
      ApiResponse.success(res, 'Weekly attendance summary retrieved', summary);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async getAllAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { employeeId, startDate, endDate, status } = req.query;
      const records = await AttendanceService.getAttendanceList({
        employeeId: employeeId as string,
        startDate: startDate as string,
        endDate: endDate as string,
        status: status as any,
      });
      ApiResponse.success(res, 'All attendance records retrieved', records);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }
}
