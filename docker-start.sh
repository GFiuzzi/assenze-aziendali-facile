
#!/bin/bash

echo "🐳 Avvio applicazione Gestione Assenze con Docker..."

# Controlla se Docker è installato
if ! command -v docker &> /dev/null; then
    echo "❌ Docker non è installato. Installalo prima di continuare."
    exit 1
fi

# Controlla se Docker Compose è installato
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose non è installato. Installalo prima di continuare."
    exit 1
fi

# Crea il file .env se non esiste
if [ ! -f .env ]; then
    echo "📝 Creazione file .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Modifica il file .env con le tue configurazioni prima di andare in produzione!"
fi

# Crea le directory necessarie
echo "📁 Creazione directory..."
mkdir -p volumes/db/init
mkdir -p volumes/api
mkdir -p volumes/storage

# Avvia i servizi
echo "🚀 Avvio servizi Docker..."
docker-compose up -d

# Attendi che i servizi siano pronti
echo "⏳ Attendo che i servizi siano pronti..."
sleep 30

# Controlla lo stato dei servizi
echo "🔍 Controllo stato servizi..."
docker-compose ps

echo ""
echo "✅ Applicazione avviata con successo!"
echo ""
echo "🌐 Accesso ai servizi:"
echo "   - Frontend React: http://localhost:3000"
echo "   - API Supabase: http://localhost:8000"
echo "   - Database PostgreSQL: localhost:5432"
echo ""
echo "📚 Comandi utili:"
echo "   - Fermare: docker-compose down"
echo "   - Logs: docker-compose logs -f"
echo "   - Riavviare: docker-compose restart"
echo ""
