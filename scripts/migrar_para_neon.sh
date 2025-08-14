#!/bin/bash

# Script para migrar dados para o Neon próprio

# URL do banco antigo (atual)
OLD_DB="$DATABASE_URL"

# URL do novo banco Neon
NEW_DB="postgresql://neondb_owner:npg_gwHF0Qa2DWcl@ep-lively-surf-ac3lxr0i-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

echo "🚀 Iniciando migração para Neon próprio..."

# 1. Criar schema no novo banco
echo "📋 Criando schema no novo banco..."
DATABASE_URL="$NEW_DB" npm run db:push

# 2. Exportar dados do banco antigo
echo "📤 Exportando dados do banco antigo..."
pg_dump "$OLD_DB" --data-only --inserts --no-owner --no-privileges > backup_para_neon.sql

# 3. Importar dados no novo banco
echo "📥 Importando dados no novo banco..."
psql "$NEW_DB" < backup_para_neon.sql

# 4. Verificar migração
echo "✅ Verificando migração..."
psql "$NEW_DB" -c "SELECT 'dados_mensais' as tabela, COUNT(*) as registros FROM dados_mensais UNION ALL SELECT 'planejamentos', COUNT(*) FROM planejamentos UNION ALL SELECT 'users', COUNT(*) FROM users;"

echo "🎉 Migração concluída! Use a nova DATABASE_URL:"
echo "$NEW_DB"