
-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create absences table
CREATE TABLE IF NOT EXISTS absences (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    employee_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type VARCHAR(50) CHECK (type IN ('ferie', 'permesso', 'malattia')) NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample employees
INSERT INTO employees (name, email, department) VALUES
('Mario Rossi', 'mario.rossi@azienda.it', 'Vendite'),
('Laura Bianchi', 'laura.bianchi@azienda.it', 'Marketing'),
('Giuseppe Verdi', 'giuseppe.verdi@azienda.it', 'IT'),
('Anna Neri', 'anna.neri@azienda.it', 'HR'),
('Francesco Blu', 'francesco.blu@azienda.it', 'Amministrazione'),
('Giulia Rosa', 'giulia.rosa@azienda.it', 'IT');

-- Insert sample absences
INSERT INTO absences (employee_id, employee_name, start_date, end_date, type, reason) VALUES
(1, 'Mario Rossi', '2025-01-25', '2025-01-27', 'ferie', 'Vacanza'),
(2, 'Laura Bianchi', '2025-01-30', '2025-01-30', 'permesso', 'Visita medica');
