import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdminOrHR } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  employeeSelfUpdateSchema,
  adminEmployeeUpdateSchema,
} from '../validators/employee.validator';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Protect all employee routes with JWT authentication
router.use(authenticate);

// Employee Self Operations
router.get('/me', EmployeeController.getMyProfile);
router.patch('/me', validate(employeeSelfUpdateSchema), EmployeeController.updateSelfProfile);
router.post(
  '/me/profile-picture',
  upload.single('profilePicture'),
  EmployeeController.uploadProfilePicture
);

// Admin / HR Operations
router.get('/', requireAdminOrHR, EmployeeController.getAllEmployees);
router.get('/:id', requireAdminOrHR, EmployeeController.getEmployeeById);
router.patch(
  '/:id',
  requireAdminOrHR,
  validate(adminEmployeeUpdateSchema),
  EmployeeController.updateEmployeeByAdmin
);
router.post(
  '/:id/documents',
  requireAdminOrHR,
  upload.single('document'),
  EmployeeController.uploadDocument
);

export default router;
