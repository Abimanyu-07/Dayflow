import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service';
import { ApiResponse } from '../utils/apiResponse';

export class ReportController {
  static async getAttendanceReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { date } = req.query;
      const report = await ReportService.getAttendanceReport(date as string);
      ApiResponse.success(res, 'Attendance report retrieved', report);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async getLeaveReport(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const report = await ReportService.getLeaveReport();
      ApiResponse.success(res, 'Leave statistics retrieved', report);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async getEmployeeReport(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const report = await ReportService.getEmployeeReport();
      ApiResponse.success(res, 'Employee statistics report retrieved', report);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async getPayrollReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { month, year } = req.query;
      const report = await ReportService.getPayrollReport(
        month ? parseInt(month as string, 10) : undefined,
        year ? parseInt(year as string, 10) : undefined
      );
      ApiResponse.success(res, 'Payroll report retrieved', report);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }
}
