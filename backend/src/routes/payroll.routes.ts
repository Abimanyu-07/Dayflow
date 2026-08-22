import { Router } from 'express';
import { PayrollController } from '../controllers/payroll.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdminOrHR } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  updateSalaryStructureSchema,
  generateSalarySlipSchema,
} from '../validators/payroll.validator';

const router = Router();

router.use(authenticate);

// Employee read-only view of their own salary and payslips
router.get('/me/salary-structure', PayrollController.getMySalaryStructure);
router.get('/me/slips', PayrollController.getMySalarySlips);

// Admin / HR management operations
router.get('/slips', requireAdminOrHR, PayrollController.getAllSalarySlips);
router.post('/generate-slip', requireAdminOrHR, validate(generateSalarySlipSchema), PayrollController.generateSalarySlip);
router.get('/employee/:id/salary-structure', requireAdminOrHR, PayrollController.getEmployeeSalaryStructure);
router.patch(
  '/employee/:id/salary-structure',
  requireAdminOrHR,
  validate(updateSalaryStructureSchema),
  PayrollController.updateSalaryStructure
);

export default router;
