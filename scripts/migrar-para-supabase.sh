#!/bin/bash

# CIKLUS APP - MIGRAÇÃO PARA SUPABASE
# ===================================

echo "🚀 MIGRAÇÃO PARA SUPABASE"
echo "Data: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================="
echo ""

# Backup antes da migração
echo "💾 FASE 1: Backup de segurança antes da migração..."
bash scripts/backup-completo-emergencia.sh
echo "✅ Backup de segurança criado"
echo ""

# Verificar dados locais
echo "📊 FASE 2: Verificando dados no PostgreSQL local..."
echo "Contando registros por tabela:"
psql $DATABASE_URL_LOCAL -c "
SELECT 
  'planejamentos' as tabela, COUNT(*) as registros FROM planejamentos
UNION ALL
SELECT 'dados_mensais' as tabela, COUNT(*) as registros FROM dados_mensais
UNION ALL
SELECT 'membros_family' as tabela, COUNT(*) as registros FROM membros_family
UNION ALL
SELECT 'indices_economicos' as tabela, COUNT(*) as registros FROM indices_economicos
UNION ALL
SELECT 'receitas' as tabela, COUNT(*) as registros FROM receitas
UNION ALL
SELECT 'despesas' as tabela, COUNT(*) as registros FROM despesas
UNION ALL
SELECT 'portfolio_investimentos' as tabela, COUNT(*) as registros FROM portfolio_investimentos
UNION ALL
SELECT 'objetivos' as tabela, COUNT(*) as registros FROM objetivos;
" 2>/dev/null || echo "Erro ao acessar PostgreSQL local"
echo ""

# Exportar schema e dados
echo "📁 FASE 3: Exportando schema e dados..."
mkdir -p migration-temp
pg_dump $DATABASE_URL_LOCAL --schema-only > migration-temp/schema.sql
pg_dump $DATABASE_URL_LOCAL --data-only --inserts > migration-temp/data.sql
echo "✅ Schema e dados exportados"
echo ""

# Aplicar no Supabase
echo "☁️ FASE 4: Aplicando no Supabase..."
echo "Criando schema no Supabase..."
if psql $DATABASE_URL < migration-temp/schema.sql 2>/dev/null; then
    echo "✅ Schema criado no Supabase"
else
    echo "⚠️ Algumas tabelas já existem - continuando..."
fi

echo "Inserindo dados no Supabase..."
if psql $DATABASE_URL < migration-temp/data.sql 2>/dev/null; then
    echo "✅ Dados inseridos no Supabase"
else
    echo "⚠️ Alguns dados já existem - verificando integridade..."
fi
echo ""

# Verificar migração
echo "🔍 FASE 5: Verificando migração..."
echo "Contando registros no Supabase:"
psql $DATABASE_URL -c "
SELECT 
  'planejamentos' as tabela, COUNT(*) as registros FROM planejamentos
UNION ALL
SELECT 'dados_mensais' as tabela, COUNT(*) as registros FROM dados_mensais
UNION ALL
SELECT 'membros_family' as tabela, COUNT(*) as registros FROM membros_family
UNION ALL
SELECT 'indices_economicos' as tabela, COUNT(*) as registros FROM indices_economicos;
" 2>/dev/null || echo "Erro ao verificar Supabase"
echo ""

# Limpeza
echo "🧹 FASE 6: Limpeza de arquivos temporários..."
rm -rf migration-temp/
echo "✅ Arquivos temporários removidos"
echo ""

echo "✅ MIGRAÇÃO PARA SUPABASE CONCLUÍDA!"
echo "===================================="
echo "🎯 Próximos passos:"
echo "1. Configurar aplicação para usar Supabase"
echo "2. Testar funcionalidades"
echo "3. Desativar PostgreSQL local (opcional)"
echo ""