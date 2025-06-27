
#!/bin/bash

echo "🐳 Avvio Gestione Assenze - Versione Semplificata"
echo "=================================================="

# Verifica Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker non installato!"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose non installato!"
    exit 1
fi

# Pulizia completa
echo "🧹 Pulizia configurazione precedente..."
docker-compose down -v --remove-orphans
docker system prune -f

# Rimozione volumi specifici
echo "🗑️ Rimozione volumi database..."
docker volume rm $(docker volume ls -q | grep -E "assenze|db_data") 2>/dev/null || true

# Build e avvio
echo "🔨 Build e avvio servizi..."
docker-compose up --build -d

# Attesa servizi
echo "⏳ Attesa avvio servizi..."
sleep 15

# Verifica stato
echo "🔍 Controllo stato servizi:"
docker-compose ps

# Test connettività
echo ""
echo "🧪 Test connettività API..."
if curl -s http://localhost:8080/health > /dev/null; then
    echo "✅ API Backend raggiungibile"
else
    echo "❌ API Backend non raggiungibile"
fi

echo ""
echo "🎉 APPLICAZIONE PRONTA!"
echo "======================="
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 API Backend: http://localhost:8080"
echo "🗄️ Database: localhost:5432"
echo ""
echo "📊 Dati di test già inseriti:"
echo "   - 6 dipendenti di esempio"
echo "   - 3 assenze di esempio"
echo ""
echo "🛠️ Comandi utili:"
echo "   docker-compose logs -f        # Visualizza logs"
echo "   docker-compose restart        # Riavvia servizi"
echo "   docker-compose down           # Ferma tutto"
echo ""
