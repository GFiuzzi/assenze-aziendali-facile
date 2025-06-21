
import { Employee, Absence } from "@/types/absence";

export const mockEmployees: Employee[] = [
  { id: "1", name: "Mario Rossi", email: "mario.rossi@azienda.it", department: "Vendite" },
  { id: "2", name: "Laura Bianchi", email: "laura.bianchi@azienda.it", department: "Marketing" },
  { id: "3", name: "Giuseppe Verdi", email: "giuseppe.verdi@azienda.it", department: "IT" },
  { id: "4", name: "Anna Neri", email: "anna.neri@azienda.it", department: "HR" },
  { id: "5", name: "Francesco Blu", email: "francesco.blu@azienda.it", department: "Amministrazione" },
  { id: "6", name: "Giulia Rosa", email: "giulia.rosa@azienda.it", department: "IT" },
];

export const mockAbsences: Absence[] = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "Mario Rossi",
    startDate: "2025-01-25",
    endDate: "2025-01-27",
    type: "ferie",
    reason: "Vacanza",
    createdAt: "2025-01-20T10:00:00Z"
  },
  {
    id: "2",
    employeeId: "2",
    employeeName: "Laura Bianchi",
    startDate: "2025-01-30",
    endDate: "2025-01-30",
    type: "permesso",
    reason: "Visita medica",
    createdAt: "2025-01-18T14:30:00Z"
  },
];
