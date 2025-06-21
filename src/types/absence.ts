
export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface Absence {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: 'ferie' | 'permesso' | 'malattia';
  reason: string;
  createdAt: string;
}

export type AbsenceType = 'ferie' | 'permesso' | 'malattia';
