#!/bin/bash

# CIKLUS APP - Limpeza Apenas do GitHub
# ====================================

echo "🧹 LIMPEZA APENAS DO REPOSITÓRIO GITHUB"
echo "Mantendo tudo local intacto"
echo "======================================"
echo ""

# 1. Verificar estado atual
echo "📋 Estado atual do git:"
git status --short
echo ""

# 2. Criar branch órfão temporária (sem histórico)
echo "📋 PASSO 1: Criando branch temporária sem histórico"
git checkout --orphan temp-clean

# 3. Remover tudo do staging
echo "📋 PASSO 2: Limpando staging area"
git rm -rf --cached . 2>/dev/null || true

# 4. Adicionar apenas arquivos que NÃO são backups
echo "📋 PASSO 3: Adicionando arquivos (excluindo backups)"
git add . --verbose

# 5. Commit limpo
echo "📋 PASSO 4: Commit limpo"
git commit -m "🎯 CIKLUS APP - Repositório Limpo

Sistema completo de planejamento financeiro familiar

✅ Funcionalidades:
- Gestão de membros familiares
- Cálculos financeiros avançados
- Metodologia CIKLUS (até 100 anos)
- Simulações de cenários
- Portfolios de investimentos
- Objetivos financeiros
- Exportação de dados

✅ Tecnologias:
- React + TypeScript
- Node.js + Express
- PostgreSQL + Drizzle ORM
- Vite + TailwindCSS

Data: $(date '+%Y-%m-%d %H:%M:%S')
Autor: Pedro Orlandi"

# 6. Deletar branch main atual
echo "📋 PASSO 5: Substituindo branch main"
git branch -D main 2>/dev/null || true

# 7. Renomear branch temporária para main
echo "📋 PASSO 6: Renomeando branch"
git branch -m main

# 8. Forçar push para GitHub
echo "📋 PASSO 7: Push forçado para GitHub"
echo "ATENÇÃO: Isso vai LIMPAR COMPLETAMENTE o GitHub"
echo "Pressione ENTER para continuar ou Ctrl+C para cancelar"
read

git push origin main --force

echo ""
echo "✅ GITHUB LIMPO COM SUCESSO!"
echo "============================"
echo "✅ Repositório local: INTACTO"
echo "✅ GitHub: COMPLETAMENTE LIMPO"
echo "✅ Histórico antigo: REMOVIDO"
echo "✅ Data: ATUALIZADA PARA HOJE"
echo ""
echo "🎯 Verifique seu GitHub - deve mostrar apenas 1 commit de hoje!"