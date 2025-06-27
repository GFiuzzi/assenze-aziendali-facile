
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

# Pulisci tutto e riavvia
echo "🧹 Pulizia configurazione precedente..."
docker-compose down -v
docker system prune -f

# Crea le directory necessarie
echo "📁 Creazione directory..."
mkdir -p backend

# Avvia i servizi
echo "🚀 Avvio servizi Docker..."
docker-compose up --build -d

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
echo "   - Frontend React: http://calendario.idrolab.local:3000"
echo "   - API Backend: http://calendario.idrolab.local:8080"
echo "   - Database PostgreSQL: localhost:5432"
echo ""
echo "📚 Comandi utili:"
echo "   - Fermare: docker-compose down"
echo "   - Logs: docker-compose logs -f"
echo "   - Riavviare: docker-compose restart"
echo ""
