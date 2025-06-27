
# Gestione Assenze Aziendali

Sistema semplice e funzionante per la gestione delle assenze dei dipendenti.

## 🚀 Avvio Rapido

```bash
# Clona il repository
git clone <repo-url>
cd assenze-aziendali

# Avvia l'applicazione
chmod +x docker-start.sh
./docker-start.sh
```

## 🏗️ Architettura

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL 15
- **Container**: Docker Compose

## 📱 Accesso

- **Applicazione Web**: http://localhost:3000
- **API Backend**: http://localhost:8080
- **Database**: localhost:5432

## 🔧 Credenziali Database

- **Database**: assenze_db
- **Username**: admin
- **Password**: admin123

## 📊 Funzionalità

✅ Visualizzazione calendario assenze
✅ Tabella assenze con filtri
✅ Aggiunta nuove assenze
✅ Gestione dipendenti
✅ Dati di test precaricati

## 🛠️ Comandi Docker

```bash
# Avvia applicazione
./docker-start.sh

# Visualizza logs
docker-compose logs -f

# Riavvia servizi
docker-compose restart

# Ferma tutto
docker-compose down

# Reset completo
docker-compose down -v
```

## 🧪 Test

L'applicazione include:
- 6 dipendenti di esempio
- 3 assenze di esempio
- API health check
- Logs dettagliati
- Gestione errori completa

## 📝 Note Tecniche

- Database inizializzato automaticamente
- API RESTful complete
- Frontend responsive
- Gestione errori robusta
- Logs strutturati per debug
