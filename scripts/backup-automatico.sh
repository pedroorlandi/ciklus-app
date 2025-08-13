#!/bin/bash

# CIKLUS APP - Backup Automático Diário
# ====================================

echo "🔒 INICIANDO BACKUP AUTOMÁTICO DIÁRIO"
echo "Data: $(date '+%Y-%m-%d %H:%M:%S')"
echo "======================================"

# Criar diretório de backup
BACKUP_DIR="backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# 1. BACKUP DO CÓDIGO FONTE
echo "📦 Criando backup do código fonte..."
tar -czf $BACKUP_DIR/ciklus-codigo-$(date +%Y%m%d-%H%M%S).tar.gz \
  --exclude='node_modules' \
  --exclude='*.log' \
  --exclude='backups' \
  --exclude='attached_assets' \
  --exclude='.git' \
  server/ client/ shared/ public/ \
  *.json *.js *.ts *.md *.sql

# 2. BACKUP DA BASE DE DADOS (PostgreSQL)
echo "🗄️ Criando backup da base de dados..."
pg_dump $DATABASE_URL > $BACKUP_DIR/database-backup-$(date +%Y%m%d-%H%M%S).sql

# 3. BACKUP DAS CONFIGURAÇÕES
echo "⚙️ Backup das configurações..."
cp package.json package-lock.json tsconfig.json drizzle.config.ts $BACKUP_DIR/

# 4. RELATÓRIO DE STATUS
echo "📊 Gerando relatório de status..."
cat > $BACKUP_DIR/status-report.txt << EOF
CIKLUS APP - Relatório de Backup
================================
Data: $(date '+%Y-%m-%d %H:%M:%S')
Ambiente: ${NODE_ENV:-development}

ESTATÍSTICAS DA BASE DE DADOS:
$(psql $DATABASE_URL -c "SELECT 
  'Planejamentos: ' || COUNT(*) FROM planejamentos UNION ALL
  SELECT 'Membros: ' || COUNT(*) FROM membros_family UNION ALL  
  SELECT 'Dados Mensais: ' || COUNT(*) FROM dados_mensais;" -t)

TAMANHO DOS ARQUIVOS BACKUP:
$(ls -lh $BACKUP_DIR)

ÚLTIMO COMMIT GIT:
$(git log -1 --oneline 2>/dev/null || echo "Git não disponível")
EOF

echo "✅ BACKUP CONCLUÍDO COM SUCESSO!"
echo "Localização: $BACKUP_DIR"
echo "Arquivos criados:"
ls -la $BACKUP_DIR

# 5. LIMPEZA DE BACKUPS ANTIGOS (manter últimos 7 dias)
echo "🧹 Limpando backups antigos..."
find backups/ -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true

echo "🎯 Backup diário finalizado: $(date '+%Y-%m-%d %H:%M:%S')"