import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdminOrHR } from '../middleware/role.middleware';
import { validate, validateQuery } from '../middleware/validate.middleware';
import {
  checkInSchema,
  checkOutSchema,
  attendanceFilterSchema,
} from '../validators/attendance.validator';

const router = Router();

router.use(authenticate);

// Employee operations (Scoped to self)
router.post('/check-in', validate(checkInSchema), AttendanceController.checkIn);
router.post('/check-out', validate(checkOutSchema), AttendanceController.checkOut);
router.get('/today', AttendanceController.getMyTodayAttendance);
router.get('/me', validateQuery(attendanceFilterSchema), AttendanceController.getMyAttendance);
router.get('/weekly', AttendanceController.getMyWeeklyAttendance);

// Admin / HR operations (Scoped to all)
router.get('/', requireAdminOrHR, validateQuery(attendanceFilterSchema), AttendanceController.getAllAttendance);

export default router;
