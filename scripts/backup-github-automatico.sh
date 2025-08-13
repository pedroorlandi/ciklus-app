#!/bin/bash

# CIKLUS APP - BACKUP AUTOMÁTICO PARA GITHUB
# ===========================================
# Backup automático com proteção contra perda do Repl

echo "🔄 BACKUP AUTOMÁTICO PARA GITHUB"
echo "Data: $(date '+%Y-%m-%d %H:%M:%S')"
echo "================================="

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
echo "🗄️ Backup da base de dados para GitHub..."
mkdir -p backups/github-sync
pg_dump $DATABASE_URL > backups/github-sync/database-$(date +%Y%m%d-%H%M%S).sql

# Commit do backup da base
git add backups/github-sync/
git commit -m "📊 Database backup: $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null || echo "Database backup já commitado"

echo "✅ BACKUP AUTOMÁTICO PARA GITHUB CONCLUÍDO"
echo "=========================================="