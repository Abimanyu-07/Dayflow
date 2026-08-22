import 'dotenv/config';
import { AttendanceService } from './services/attendance.service';

async function testCheckIn() {
  try {
    console.log('Attempting to check in EMP126...');
    const result = await AttendanceService.checkIn('EMP126', { notes: 'Testing checkin' });
    console.log('✅ Check-in succeeded:', result);
  } catch (err: any) {
    console.error('❌ Check-in failed!');
    console.error(err.message || err);
    console.error(err.stack);
  }
}

testCheckIn();
