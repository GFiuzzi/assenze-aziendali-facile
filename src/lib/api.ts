
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://calendario.idrolab.local:8080';

console.log('🔧 API Base URL:', API_BASE_URL);

export const api = {
  async getEmployees() {
    console.log('📋 Richiesta lista dipendenti...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('✅ Dipendenti caricati:', data.length);
      return data;
    } catch (error) {
      console.error('❌ Errore caricamento dipendenti:', error);
      throw new Error('Impossibile caricare i dipendenti');
    }
  },

  async getAbsences() {
    console.log('📅 Richiesta lista assenze...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/absences`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('✅ Assenze caricate:', data.length);
      return data;
    } catch (error) {
      console.error('❌ Errore caricamento assenze:', error);
      throw new Error('Impossibile caricare le assenze');
    }
  },

  async addAbsence(absence: any) {
    console.log('📝 Aggiunta nuova assenza:', absence);
    try {
      const response = await fetch(`${API_BASE_URL}/api/absences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(absence),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Assenza aggiunta:', data.id);
      return data;
    } catch (error) {
      console.error('❌ Errore aggiunta assenza:', error);
      throw new Error('Impossibile aggiungere l\'assenza');
    }
  },

  async deleteAbsence(id: string) {
    console.log('🗑️ Eliminazione assenza ID:', id);
    try {
      const response = await fetch(`${API_BASE_URL}/api/absences/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Assenza eliminata');
      return data;
    } catch (error) {
      console.error('❌ Errore eliminazione assenza:', error);
      throw new Error('Impossibile eliminare l\'assenza');
    }
  },

  async addEmployee(employee: any) {
    console.log('👤 Aggiunta nuovo dipendente:', employee);
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Dipendente aggiunto:', data.id);
      return data;
    } catch (error) {
      console.error('❌ Errore aggiunta dipendente:', error);
      throw new Error('Impossibile aggiungere il dipendente');
    }
  },

  // Aggiungi queste funzioni all'oggetto api:

async updateEmployee(id: string, employee: any) {
  console.log('✏️ Modifica dipendente ID:', id, employee);
  try {
    const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employee),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Dipendente modificato:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Errore modifica dipendente:', error);
    throw new Error('Impossibile modificare il dipendente');
  }
},

async deleteEmployee(id: string) {
  console.log('🗑️ Eliminazione dipendente ID:', id);
  try {
    const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Dipendente eliminato');
    return data;
  } catch (error) {
    console.error('❌ Errore eliminazione dipendente:', error);
    throw new Error('Impossibile eliminare il dipendente');
  }
},



  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('❌ Health check fallito:', error);
      return false;
    }
  }
};
