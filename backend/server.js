
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 8080;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/absences', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM absences ORDER BY start_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/absences', async (req, res) => {
  try {
    const { employee_id, employee_name, start_date, end_date, type, reason } = req.body;
    const result = await pool.query(
      'INSERT INTO absences (employee_id, employee_name, start_date, end_date, type, reason) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [employee_id, employee_name, start_date, end_date, type, reason]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/absences/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM absences WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const { name, email, department } = req.body;
    const result = await pool.query(
      'INSERT INTO employees (name, email, department) VALUES ($1, $2, $3) RETURNING *',
      [name, email, department]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
