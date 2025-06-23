
#!/bin/bash

echo "🛑 Arresto applicazione Gestione Assenze..."

# Ferma e rimuove i container
docker-compose down

echo "✅ Applicazione fermata con successo!"
echo ""
echo "💡 I dati del database sono conservati nel volume Docker 'db_data'"
echo "   Per rimuovere anche i dati: docker-compose down -v"
