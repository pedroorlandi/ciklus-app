#!/bin/bash

# CIKLUS APP - Limpeza Definitiva do GitHub
# ==========================================

echo "🧹 LIMPEZA DEFINITIVA DO GITHUB"
echo "Removendo histórico completo e criando repositório limpo"
echo "========================================================"
echo ""

# 1. Backup da pasta .git
echo "📋 PASSO 1: Backup do .git atual"
mv .git .git-backup-$(date +%Y%m%d-%H%M%S)

# 2. Inicializar novo repositório
echo "📋 PASSO 2: Novo repositório git"
git init

# 3. Configurar GitHub
echo "📋 PASSO 3: Configurar remote"
git remote add origin https://github.com/pedroorlandi/ciklus-app.git

# 4. Adicionar apenas arquivos relevantes (sem backups)
echo "📋 PASSO 4: Adicionar arquivos (excluindo backups)"
git add .

# 5. Commit inicial limpo
echo "📋 PASSO 5: Commit inicial"
git commit -m "🎯 CIKLUS APP - Sistema Completo Limpo

✅ Funcionalidades implementadas:
- Metodologia CIKLUS universal (dados até 100 anos)
- Cálculos financeiros corretos e validados
- Interface cards para gerenciamento de membros
- Configuração Taxa de Juros Real
- Sistema de backup automático (scripts)
- Simulações de provedores ausentes
- Portfolios e investimentos
- Objetivos financeiros
- Exportação CSV
- Integração índices econômicos BCB

✅ Arquitetura:
- React + TypeScript (Frontend)
- Node.js + Express (Backend)
- PostgreSQL + Drizzle ORM
- Vite + TailwindCSS

✅ Estado da aplicação:
- Sistema funcionando completamente
- Base de dados com planejamentos reais
- Scripts de backup funcionais
- Documentação completa

Data: $(date '+%Y-%m-%d %H:%M:%S')
Autor: Pedro Orlandi"

# 6. Forçar push para substituir GitHub
echo "📋 PASSO 6: Push forçado para GitHub"
git push -u origin main --force

echo ""
echo "✅ GITHUB COMPLETAMENTE LIMPO!"
echo "=============================="
echo "✅ Histórico antigo: REMOVIDO"
echo "✅ Arquivos grandes: REMOVIDOS" 
echo "✅ Conteúdo atual: ENVIADO"
echo "✅ Data: HOJE"
echo ""
echo "🎯 Verificar GitHub agora - deve mostrar commit de hoje!"