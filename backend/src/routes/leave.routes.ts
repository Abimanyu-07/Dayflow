import { Router } from 'express';
import { LeaveController } from '../controllers/leave.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdminOrHR } from '../middleware/role.middleware';
import { validate, validateQuery } from '../middleware/validate.middleware';
import {
  createLeaveSchema,
  reviewLeaveSchema,
  leaveFilterSchema,
} from '../validators/leave.validator';

const router = Router();

router.use(authenticate);

// Employee operations
router.post('/', validate(createLeaveSchema), LeaveController.applyLeave);
router.get('/me', validateQuery(leaveFilterSchema), LeaveController.getMyLeaves);

// Admin / HR operations
router.get('/', requireAdminOrHR, validateQuery(leaveFilterSchema), LeaveController.getAllLeaves);
router.patch('/:id/approve', requireAdminOrHR, validate(reviewLeaveSchema), LeaveController.approveLeave);
router.patch('/:id/reject', requireAdminOrHR, validate(reviewLeaveSchema), LeaveController.rejectLeave);

export default router;
