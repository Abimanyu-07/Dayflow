import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../services/employee.service';
import { ApiResponse } from '../utils/apiResponse';

export class EmployeeController {
  static async getAllEmployees(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { department, search } = req.query;
      const employees = await EmployeeService.getAllEmployees({
        department: department as string,
        search: search as string,
      });
      ApiResponse.success(res, 'Employees retrieved successfully', employees);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const profile = await EmployeeService.getMyProfile(userId);
      ApiResponse.success(res, 'Employee profile retrieved', profile);
    } catch (error: any) {
      ApiResponse.notFound(res, error.message);
    }
  }

  static async getEmployeeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const profile = await EmployeeService.getEmployeeById(id);
      ApiResponse.success(res, 'Employee profile retrieved', profile);
    } catch (error: any) {
      ApiResponse.notFound(res, error.message);
    }
  }

  static async updateSelfProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const updated = await EmployeeService.updateSelfProfile(userId, req.body);
      ApiResponse.success(res, 'Profile updated successfully', updated);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async updateEmployeeByAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const updated = await EmployeeService.updateEmployeeByAdmin(id, req.body);
      ApiResponse.success(res, 'Employee updated successfully by Admin', updated);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async uploadProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        ApiResponse.badRequest(res, 'No profile image file uploaded');
        return;
      }
      const fileUrl = `/uploads/profiles/${req.file.filename}`;
      const userId = req.user!.userId;
      const updated = await EmployeeService.updateSelfProfile(userId, { profilePicture: fileUrl });
      ApiResponse.success(res, 'Profile picture uploaded successfully', {
        profilePicture: fileUrl,
        employee: updated,
      });
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async uploadDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      if (!req.file) {
        ApiResponse.badRequest(res, 'No document file uploaded');
        return;
      }
      const fileUrl = `/uploads/documents/${req.file.filename}`;
      const doc = await EmployeeService.addDocument(id, {
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileUrl,
      });
      ApiResponse.created(res, 'Document uploaded successfully', doc);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }
}
