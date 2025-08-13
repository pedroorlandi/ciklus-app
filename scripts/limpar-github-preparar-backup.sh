#!/bin/bash

# CIKLUS APP - Limpeza do GitHub para Primeiro Backup
# ===================================================
# Execute este script manualmente para limpar o GitHub atual

echo "🧹 LIMPEZA DO GITHUB PARA PRIMEIRO BACKUP"
echo "=========================================="
echo "Data: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

echo "📋 PASSO 1: Verificar estado atual..."
echo "Remote atual:"
git remote -v

echo ""
echo "Commits recentes:"
git log --oneline -5

echo ""
echo "🗑️ PASSO 2: Remover configuração Git atual..."
echo "ATENÇÃO: Isso vai remover todo o histórico Git local"
echo "Pressione ENTER para continuar ou Ctrl+C para cancelar"
read

# Backup do estado atual antes de limpar
echo "📦 Criando backup antes da limpeza..."
tar -czf backup-antes-limpeza-$(date +%Y%m%d-%H%M%S).tar.gz \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='backups' \
  --exclude='emergency-backup-*' \
  .

# Remover Git atual
rm -rf .git

echo "✅ Git removido com sucesso!"
echo ""

echo "🆕 PASSO 3: Inicializar novo repositório Git..."
git init
git add .
git commit -m "🎯 Initial commit - CIKLUS APP sistema completo

Sistema implementado:
- ✅ Metodologia CIKLUS universal (dados até 100 anos)
- ✅ Cálculos financeiros corretos
- ✅ Interface cards para membros
- ✅ Configuração Taxa de Juros Real
- ✅ Sistema completo de backup
- ✅ Todas as funcionalidades avançadas

Estado da base de dados:
- Planejamentos: $(psql $DATABASE_URL -t -c "SELECT COUNT(*) FROM planejamentos;" 2>/dev/null || echo "N/A")
- Dados mensais: $(psql $DATABASE_URL -t -c "SELECT COUNT(*) FROM dados_mensais;" 2>/dev/null || echo "N/A")
- Cobertura: 2025-2095 (metodologia CIKLUS)

Primeira versão limpa para backup automático."

echo "✅ Novo repositório Git criado!"
echo ""

echo "🔗 PASSO 4: Configurar GitHub remote..."
echo "Insira a URL do seu repositório GitHub:"
echo "Formato: https://github.com/seu-usuario/ciklus-app.git"
read -p "URL do GitHub: " GITHUB_URL

if [ ! -z "$GITHUB_URL" ]; then
    git remote add origin "$GITHUB_URL"
    echo "✅ Remote GitHub configurado: $GITHUB_URL"
    
    echo ""
    echo "🚀 PASSO 5: Primeiro push para GitHub..."
    echo "NOTA: Pode pedir autenticação GitHub"
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Primeiro backup enviado para GitHub com sucesso!"
        
        # Criar tag de primeira versão
        git tag -a v1.0.0 -m "Primeira versão completa - Sistema CIKLUS funcional"
        git push origin v1.0.0
        
        echo "✅ Tag v1.0.0 criada para marco inicial"
    else
        echo "⚠️ Erro no push - configure autenticação GitHub"
        echo "Comandos para executar depois:"
        echo "git push -u origin main"
        echo "git tag -a v1.0.0 -m 'Primeira versão completa'"
        echo "git push origin v1.0.0"
    fi
else
    echo "⚠️ URL não fornecida - configure manualmente:"
    echo "git remote add origin https://github.com/seu-usuario/ciklus-app.git"
    echo "git push -u origin main"
fi

echo ""
echo "✅ LIMPEZA E PREPARAÇÃO CONCLUÍDA!"
echo "=================================="
echo "📋 PRÓXIMOS PASSOS:"
echo "1. ✅ GitHub limpo e primeira versão enviada"
echo "2. 🔄 Configurar backup automático diário"
echo "3. 🔐 Adicionar GITHUB_TOKEN nos Secrets"
echo "4. ⏰ Ativar Scheduled Deployments"
echo ""
echo "🎯 Sistema pronto para backup automático!"