
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create absences table
CREATE TABLE IF NOT EXISTS absences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    employee_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type VARCHAR(50) CHECK (type IN ('ferie', 'permesso', 'malattia')) NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
INSERT INTO absences (employee_id, employee_name, start_date, end_date, type, reason) 
SELECT 
    e.id,
    e.name,
    '2025-01-25'::date,
    '2025-01-27'::date,
    'ferie',
    'Vacanza'
FROM employees e WHERE e.name = 'Mario Rossi';

INSERT INTO absences (employee_id, employee_name, start_date, end_date, type, reason) 
SELECT 
    e.id,
    e.name,
    '2025-01-30'::date,
    '2025-01-30'::date,
    'permesso',
    'Visita medica'
FROM employees e WHERE e.name = 'Laura Bianchi';

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE absences ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust in production)
CREATE POLICY "Enable read access for all users" ON employees
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON employees
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON employees
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON employees
    FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON absences
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON absences
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON absences
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON absences
    FOR DELETE USING (true);
