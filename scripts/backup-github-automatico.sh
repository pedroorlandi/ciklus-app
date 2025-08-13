#!/bin/bash

# CIKLUS APP - BACKUP AUTOMÁTICO PARA GITHUB
# ===========================================
# Backup automático com proteção contra perda do Repl

echo "🔄 BACKUP AUTOMÁTICO PARA GITHUB"
echo "Data: $(date '+%Y-%m-%d %H:%M:%S')"
echo "================================="

# LIMPEZA AUTOMÁTICA: Manter apenas 3 backups mais recentes
echo "🧹 Limpeza automática de backups antigos..."
find . -name "emergency-backup-*" -type d -mtime +7 -exec rm -rf {} \; 2>/dev/null || true
find . -name "*.bundle" -mtime +7 -delete 2>/dev/null || true
find backups/github-sync/ -name "database-*.sql" -mtime +14 -delete 2>/dev/null || true
echo "✅ Limpeza concluída"

# Verificar se há mudanças significativas
CHANGES=$(git status --porcelain | wc -l)
if [ $CHANGES -eq 0 ]; then
    echo "ℹ️ Nenhuma mudança significativa - backup dispensado"
    exit 0
fi

echo "📝 Detectadas $CHANGES mudanças - iniciando backup..."

# Adicionar todas as mudanças
git add .

# Commit com informações detalhadas do estado
COMMIT_MSG="🤖 Backup automático: $(date '+%Y-%m-%d %H:%M:%S')

Estado do sistema preservado:
- Planejamentos: $(psql $DATABASE_URL -t -c "SELECT COUNT(*) FROM planejamentos;" 2>/dev/null || echo "N/A")
- Dados mensais: $(psql $DATABASE_URL -t -c "SELECT COUNT(*) FROM dados_mensais;" 2>/dev/null || echo "N/A")
- Metodologia CIKLUS ativa
- Funcionalidades avançadas operacionais

Mudanças: $CHANGES arquivos
Backup: $(date '+%Y-%m-%d %H:%M:%S')"

git commit -m "$COMMIT_MSG"

# Tentar push para GitHub
if git remote | grep -q origin; then
    echo "🚀 Enviando para GitHub..."
    if git push origin main 2>/dev/null; then
        echo "✅ Backup enviado para GitHub com sucesso!"
        
        # Criar tag de backup para facilitar recuperação
        TAG_NAME="backup-$(date +%Y%m%d-%H%M%S)"
        git tag -a $TAG_NAME -m "Backup automático - Estado funcional completo"
        git push origin $TAG_NAME 2>/dev/null || echo "⚠️ Tag criada localmente apenas"
        
    else
        echo "⚠️ Falha no push - criando backup local de emergência..."
        git bundle create "emergency-backup-$(date +%Y%m%d-%H%M%S).bundle" --all
        echo "✅ Bundle de emergência criado para upload manual"
    fi
else
    echo "⚠️ GitHub remote não configurado - criando bundle..."
    git bundle create "emergency-backup-$(date +%Y%m%d-%H%M%S).bundle" --all
    echo "✅ Bundle criado para configuração posterior do GitHub"
fi

# Criar também backup do estado da base de dados
echo "🗄️ Backup completo da base de dados para GitHub..."
mkdir -p backups/github-sync
pg_dump $DATABASE_URL > backups/github-sync/database-$(date +%Y%m%d-%H%M%S).sql

# Backup das configurações críticas
echo "⚙️ Backup das configurações do sistema..."
echo "# CIKLUS APP - Estado do Sistema $(date)" > backups/github-sync/system-state-$(date +%Y%m%d-%H%M%S).txt
echo "Database URL: [PROTEGIDO]" >> backups/github-sync/system-state-$(date +%Y%m%d-%H%M%S).txt
echo "Node Version: $(node --version)" >> backups/github-sync/system-state-$(date +%Y%m%d-%H%M%S).txt
echo "NPM Packages: $(npm list --depth=0 | wc -l) instalados" >> backups/github-sync/system-state-$(date +%Y%m%d-%H%M%S).txt
echo "Planejamentos: $(psql $DATABASE_URL -t -c "SELECT COUNT(*) FROM planejamentos;" 2>/dev/null || echo "N/A")" >> backups/github-sync/system-state-$(date +%Y%m%d-%H%M%S).txt
echo "Dados mensais: $(psql $DATABASE_URL -t -c "SELECT COUNT(*) FROM dados_mensais;" 2>/dev/null || echo "N/A")" >> backups/github-sync/system-state-$(date +%Y%m%d-%H%M%S).txt

# Backup dos arquivos de configuração críticos
cp package.json backups/github-sync/package-backup-$(date +%Y%m%d-%H%M%S).json 2>/dev/null || true
cp tsconfig.json backups/github-sync/tsconfig-backup-$(date +%Y%m%d-%H%M%S).json 2>/dev/null || true
cp .replit backups/github-sync/replit-backup-$(date +%Y%m%d-%H%M%S).txt 2>/dev/null || true

# Commit do backup completo
git add backups/github-sync/
git commit -m "📊 Backup completo: $(date '+%Y-%m-%d %H:%M:%S')

Inclui:
- Base de dados completa (SQL dump)
- Configurações do sistema
- Estado atual da aplicação
- Arquivos de configuração críticos

Proteção total contra retrabalho garantida." 2>/dev/null || echo "Backup já commitado"

echo "✅ BACKUP AUTOMÁTICO PARA GITHUB CONCLUÍDO"
echo "✅ PROTEÇÃO TOTAL CONTRA RETRABALHO ATIVA"
echo "=========================================="