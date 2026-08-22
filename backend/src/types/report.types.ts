export interface AttendanceReportDTO {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
  halfDayToday: number;
  attendanceRatePercentage: number;
  date: string;
}

export interface LeaveReportDTO {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  leavesByType: {
    paid: number;
    sick: number;
    unpaid: number;
  };
}

export interface EmployeeReportDTO {
  totalEmployees: number;
  activeEmployees: number;
  departmentDistribution: Record<string, number>;
  roleDistribution: Record<string, number>;
}

export interface PayrollReportDTO {
  totalMonthlyPayout: number;
  averageSalary: number;
  totalSalariesProcessed: number;
  month: number;
  year: number;
}
