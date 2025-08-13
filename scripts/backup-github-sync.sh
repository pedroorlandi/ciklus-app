#!/bin/bash

# CIKLUS APP - Sincronização com GitHub
# =====================================

echo "🔄 SINCRONIZAÇÃO AUTOMÁTICA COM GITHUB"
echo "Data: $(date '+%Y-%m-%d %H:%M:%S')"
echo "======================================="

# Verificar se há mudanças
if git diff --quiet && git diff --staged --quiet; then
    echo "ℹ️ Nenhuma mudança detectada - backup dispensado"
    exit 0
fi

# Commit automático das mudanças
echo "📝 Commitando mudanças automaticamente..."
git add .
git commit -m "🤖 Backup automático: $(date '+%Y-%m-%d %H:%M:%S')

- Dados atualizados automaticamente
- Sistema funcionando normalmente
- Metodologia CIKLUS ativa
- Backup diário executado"

# Push para GitHub (se configurado)
if git remote | grep -q origin; then
    echo "🚀 Enviando para GitHub..."
    git push origin main 2>/dev/null || {
        echo "⚠️ Falha no push - criando bundle local..."
        git bundle create "backups/emergency-backup-$(date +%Y%m%d-%H%M%S).bundle" --all
        echo "✅ Bundle criado como backup de emergência"
    }
else
    echo "⚠️ Remote GitHub não configurado - criando bundle..."
    git bundle create "backups/emergency-backup-$(date +%Y%m%d-%H%M%S).bundle" --all
    echo "✅ Bundle criado para upload manual"
fi

echo "✅ SINCRONIZAÇÃO CONCLUÍDA: $(date '+%Y-%m-%d %H:%M:%S')"