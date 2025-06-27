
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 8080;

// Configurazione database
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'assenze_db',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
});

// Middleware
app.use(cors());
app.use(express.json());

// Test connessione database
pool.connect((err, client, release) => {
  if (err) {
    console.error('Errore connessione database:', err);
  } else {
    console.log('✅ Database connesso con successo');
    release();
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes

// GET /api/employees - Lista dipendenti
app.get('/api/employees', async (req, res) => {
  try {
    console.log('📋 Richiesta lista dipendenti');
    const result = await pool.query('SELECT * FROM employees ORDER BY name');
    console.log(`✅ Trovati ${result.rows.length} dipendenti`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Errore GET employees:', error);
    res.status(500).json({ error: 'Errore nel recupero dipendenti', details: error.message });
  }
});

// POST /api/employees - Aggiungi dipendente
app.post('/api/employees', async (req, res) => {
  try {
    const { name, email, department } = req.body;
    console.log('👤 Aggiunta nuovo dipendente:', { name, email, department });
    
    const result = await pool.query(
      'INSERT INTO employees (name, email, department) VALUES ($1, $2, $3) RETURNING *',
      [name, email, department]
    );
    
    console.log('✅ Dipendente aggiunto con ID:', result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Errore POST employees:', error);
    res.status(500).json({ error: 'Errore nell\'aggiunta dipendente', details: error.message });
  }
});

// GET /api/absences - Lista assenze
app.get('/api/absences', async (req, res) => {
  try {
    console.log('📅 Richiesta lista assenze');
    const result = await pool.query('SELECT * FROM absences ORDER BY start_date DESC');
    console.log(`✅ Trovate ${result.rows.length} assenze`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Errore GET absences:', error);
    res.status(500).json({ error: 'Errore nel recupero assenze', details: error.message });
  }
});

// POST /api/absences - Aggiungi assenza
app.post('/api/absences', async (req, res) => {
  try {
    const { employee_id, employee_name, start_date, end_date, type, reason } = req.body;
    console.log('📝 Aggiunta nuova assenza:', { employee_id, employee_name, start_date, end_date, type });
    
    const result = await pool.query(
      'INSERT INTO absences (employee_id, employee_name, start_date, end_date, type, reason) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [employee_id, employee_name, start_date, end_date, type, reason]
    );
    
    console.log('✅ Assenza aggiunta con ID:', result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Errore POST absences:', error);
    res.status(500).json({ error: 'Errore nell\'aggiunta assenza', details: error.message });
  }
});

// DELETE /api/absences/:id - Elimina assenza
app.delete('/api/absences/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Eliminazione assenza ID:', id);
    
    const result = await pool.query('DELETE FROM absences WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assenza non trovata' });
    }
    
    console.log('✅ Assenza eliminata');
    res.json({ success: true, deleted: result.rows[0] });
  } catch (error) {
    console.error('❌ Errore DELETE absences:', error);
    res.status(500).json({ error: 'Errore nell\'eliminazione assenza', details: error.message });
  }
});

// Avvio server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server API avviato su porta ${port}`);
  console.log(`📍 Health check: http://localhost:${port}/health`);
  console.log(`📋 API Employees: http://localhost:${port}/api/employees`);
  console.log(`📅 API Absences: http://localhost:${port}/api/absences`);
});

// Gestione chiusura graceful
process.on('SIGINT', async () => {
  console.log('🛑 Chiusura server...');
  await pool.end();
  process.exit(0);
});
