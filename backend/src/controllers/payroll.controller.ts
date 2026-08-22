import { Request, Response, NextFunction } from 'express';
import { PayrollService } from '../services/payroll.service';
import { ApiResponse } from '../utils/apiResponse';

export class PayrollController {
  static async getMySalaryStructure(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = req.user!.employeeId!;
      const salary = await PayrollService.getEmployeeSalaryStructure(employeeId);
      ApiResponse.success(res, 'Salary structure retrieved', salary);
    } catch (error: any) {
      ApiResponse.notFound(res, error.message);
    }
  }

  static async getEmployeeSalaryStructure(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const salary = await PayrollService.getEmployeeSalaryStructure(id);
      ApiResponse.success(res, 'Employee salary structure retrieved', salary);
    } catch (error: any) {
      ApiResponse.notFound(res, error.message);
    }
  }

  static async updateSalaryStructure(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const updated = await PayrollService.updateSalaryStructure(id, req.body);
      ApiResponse.success(res, 'Salary structure updated successfully', updated);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async getMySalarySlips(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = req.user!.employeeId!;
      const slips = await PayrollService.getSalarySlips(employeeId);
      ApiResponse.success(res, 'Salary slips retrieved', slips);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async getAllSalarySlips(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { employeeId } = req.query;
      const slips = await PayrollService.getSalarySlips(employeeId as string);
      ApiResponse.success(res, 'All salary slips retrieved', slips);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async generateSalarySlip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slip = await PayrollService.generateSalarySlip(req.body);
      ApiResponse.created(res, 'Salary slip generated successfully', slip);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }
}
