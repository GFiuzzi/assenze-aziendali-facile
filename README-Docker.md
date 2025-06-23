
# Gestione Assenze - Deployment Docker

Questa guida ti aiuta a deployare l'intera applicazione usando Docker e Docker Compose.

## 📋 Prerequisiti

- Docker >= 20.10
- Docker Compose >= 2.0
- Server Ubuntu 20.04+ (consigliato)

## 🚀 Installazione Rapida

### 1. Installa Docker su Ubuntu

```bash
# Aggiorna il sistema
sudo apt update

# Installa Docker
sudo apt install docker.io docker-compose -y

# Avvia Docker
sudo systemctl start docker
sudo systemctl enable docker

# Aggiungi utente al gruppo docker
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Deploy dell'applicazione

```bash
# Clona il repository (o copia i file)
git clone YOUR_REPO
cd assenze-app

# Rendi eseguibili gli script
chmod +x docker-start.sh docker-stop.sh

# Avvia l'applicazione
./docker-start.sh
```

## 🏗️ Architettura

L'applicazione è composta da:

- **Frontend React** (porta 3000) - Interfaccia utente
- **Kong API Gateway** (porta 8000) - Proxy per le API
- **GoTrue Auth** - Sistema di autenticazione
- **PostgREST** - API REST automatica
- **PostgreSQL** (porta 5432) - Database
- **Storage API** - Gestione file (se necessario)

## 🔧 Configurazione

### File .env

Modifica il file `.env` con le tue configurazioni:

```bash
# Database
POSTGRES_PASSWORD=your_secure_password

# SMTP per email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@company.com
SMTP_PASS=your-app-password
SMTP_ADMIN_EMAIL=admin@company.com

# URL personalizzati (per produzione)
API_EXTERNAL_URL=http://your-server-ip:8000
SITE_URL=http://your-server-ip:3000
```

## 📱 Accesso all'applicazione

Dopo l'avvio:

- **App principale**: http://localhost:3000
- **API Supabase**: http://localhost:8000
- **Database**: localhost:5432

## 🛠️ Comandi utili

```bash
# Avvia l'applicazione
./docker-start.sh

# Ferma l'applicazione
./docker-stop.sh

# Visualizza logs
docker-compose logs -f

# Visualizza logs di un servizio specifico
docker-compose logs -f frontend

# Riavvia un servizio
docker-compose restart frontend

# Accedi al database
docker-compose exec db psql -U postgres -d postgres

# Backup del database
docker-compose exec db pg_dump -U postgres postgres > backup.sql
```

## 🔒 Sicurezza per Produzione

### 1. Cambia le password di default

```bash
# Nel file .env
POSTGRES_PASSWORD=your_very_secure_password
JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
```

### 2. Configura HTTPS

Aggiungi un reverse proxy Nginx con SSL:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Configura il firewall

```bash
# Apri solo le porte necessarie
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

## 📊 Monitoraggio

### Visualizza stato servizi

```bash
docker-compose ps
```

### Monitora risorse

```bash
docker stats
```

### Backup automatico

Crea uno script per backup giornaliero:

```bash
#!/bin/bash
# backup-daily.sh
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T db pg_dump -U postgres postgres > "backup_$DATE.sql"
```

## 🔧 Troubleshooting

### Problema: Servizi non si avviano

```bash
# Controlla i logs
docker-compose logs

# Riavvia tutto
docker-compose down
docker-compose up -d
```

### Problema: Database non accessibile

```bash
# Verifica che il container sia running
docker-compose ps

# Controlla i logs del database
docker-compose logs db
```

### Problema: Frontend non carica

```bash
# Rebuilda l'immagine frontend
docker-compose build frontend
docker-compose up -d frontend
```

## 📈 Scaling

Per gestire più traffico:

```bash
# Aumenta le repliche del frontend
docker-compose up -d --scale frontend=3
```

## 🔄 Aggiornamenti

```bash
# Ferma l'applicazione
./docker-stop.sh

# Aggiorna il codice
git pull

# Rebuilda e riavvia
docker-compose build
./docker-start.sh
```
