import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdminOrHR } from '../middleware/role.middleware';

const router = Router();

// Only Admin / HR can view aggregate reports & analytics
router.use(authenticate, requireAdminOrHR);

router.get('/attendance', ReportController.getAttendanceReport);
router.get('/leaves', ReportController.getLeaveReport);
router.get('/employees', ReportController.getEmployeeReport);
router.get('/payroll', ReportController.getPayrollReport);

export default router;
