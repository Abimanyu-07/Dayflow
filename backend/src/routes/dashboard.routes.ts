import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdminOrHR } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);

router.get('/employee', DashboardController.getEmployeeDashboard);
router.get('/admin', requireAdminOrHR, DashboardController.getAdminDashboard);

export default router;
