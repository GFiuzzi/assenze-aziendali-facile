
-- Script di inizializzazione database
-- Questo script viene eseguito automaticamente al primo avvio del container PostgreSQL

\echo '🔧 Inizio inizializzazione database assenze...'

-- Creazione tabella dipendenti
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

\echo '✅ Tabella employees creata'

-- Creazione tabella assenze
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

\echo '✅ Tabella absences creata'

-- Inserimento dati di esempio
INSERT INTO employees (name, email, department) VALUES
('Mario Rossi', 'mario.rossi@azienda.it', 'Vendite'),
('Laura Bianchi', 'laura.bianchi@azienda.it', 'Marketing'),
('Giuseppe Verdi', 'giuseppe.verdi@azienda.it', 'IT'),
('Anna Neri', 'anna.neri@azienda.it', 'HR'),
('Francesco Blu', 'francesco.blu@azienda.it', 'Amministrazione'),
('Giulia Rosa', 'giulia.rosa@azienda.it', 'IT')
ON CONFLICT (email) DO NOTHING;

\echo '✅ Dipendenti di esempio inseriti'

-- Inserimento assenze di esempio
INSERT INTO absences (employee_id, employee_name, start_date, end_date, type, reason) VALUES
(1, 'Mario Rossi', '2025-01-25', '2025-01-27', 'ferie', 'Vacanza'),
(2, 'Laura Bianchi', '2025-01-30', '2025-01-30', 'permesso', 'Visita medica'),
(3, 'Giuseppe Verdi', '2025-02-01', '2025-02-03', 'malattia', 'Influenza')
ON CONFLICT DO NOTHING;

\echo '✅ Assenze di esempio inserite'

-- Verifica dati inseriti
\echo '📊 Verifica dati inseriti:'
SELECT 'Dipendenti totali:' as info, COUNT(*) as count FROM employees;
SELECT 'Assenze totali:' as info, COUNT(*) as count FROM absences;

\echo '🎉 Inizializzazione database completata con successo!'
