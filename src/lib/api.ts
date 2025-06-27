
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = {
  async getEmployees() {
    const response = await fetch(`${API_BASE_URL}/api/employees`);
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
  },

  async getAbsences() {
    const response = await fetch(`${API_BASE_URL}/api/absences`);
    if (!response.ok) throw new Error('Failed to fetch absences');
    return response.json();
  },

  async addAbsence(absence: any) {
    const response = await fetch(`${API_BASE_URL}/api/absences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(absence),
    });
    if (!response.ok) throw new Error('Failed to add absence');
    return response.json();
  },

  async deleteAbsence(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/absences/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete absence');
    return response.json();
  },

  async addEmployee(employee: any) {
    const response = await fetch(`${API_BASE_URL}/api/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employee),
    });
    if (!response.ok) throw new Error('Failed to add employee');
    return response.json();
  },
};
