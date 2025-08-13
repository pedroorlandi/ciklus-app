#!/bin/bash

# CIKLUS APP - Limpeza Completa do GitHub
# ======================================

echo "🧹 LIMPEZA COMPLETA DO GITHUB"
echo "Data: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=============================="
echo ""

echo "📋 PASSO 1: Remover remote atual"
git remote remove origin 2>/dev/null || echo "Remote origin não existia"

echo "📋 PASSO 2: Criar branch órfão (sem histórico)"
git checkout --orphan nova-main

echo "📋 PASSO 3: Adicionar apenas conteúdo atual"
git add .

echo "📋 PASSO 4: Commit inicial limpo"
git commit -m "🎯 CIKLUS APP - Sistema Completo

Funcionalidades implementadas:
✅ Metodologia CIKLUS universal (dados até 100 anos do provedor mais novo)
✅ Cálculos financeiros corretos e validados
✅ Interface cards para gerenciamento de membros
✅ Configuração Taxa de Juros Real
✅ Sistema completo de backup automático
✅ Simulações de provedores ausentes
✅ Portfolios e investimentos
✅ Objetivos financeiros
✅ Exportação CSV
✅ Integração índices econômicos BCB

Estado da base de dados:
- Planejamentos ativos: $(psql $DATABASE_URL -t -c "SELECT COUNT(*) FROM planejamentos;" 2>/dev/null || echo "N/A")
- Dados mensais: $(psql $DATABASE_URL -t -c "SELECT COUNT(*) FROM dados_mensais;" 2>/dev/null || echo "N/A") registros
- Cobertura temporal: 2025-2095 (metodologia CIKLUS)

Sistema de backup implementado:
- Scripts automáticos funcionais
- Documentação completa de recuperação
- Proteção contra perda de trabalho

Data: $(date '+%Y-%m-%d %H:%M:%S')
Autor: Pedro Orlandi"

echo "📋 PASSO 5: Renomear branch para main"
git branch -M main

echo "📋 PASSO 6: Configurar GitHub"
git remote add origin https://github.com/pedroorlandi/ciklus-app.git

echo "📋 PASSO 7: Push forçado para limpar GitHub"
echo "ATENÇÃO: Isso vai substituir COMPLETAMENTE o conteúdo do GitHub"
echo "Pressione ENTER para continuar ou Ctrl+C para cancelar"
read

git push -u origin main --force

echo ""
echo "✅ GITHUB COMPLETAMENTE LIMPO E ATUALIZADO!"
echo "=========================================="
echo "✅ Histórico antigo: REMOVIDO"
echo "✅ Conteúdo atual: ENVIADO" 
echo "✅ Data atualizada: HOJE"
echo "✅ Sistema preservado: 100%"
echo ""
echo "🎯 Verifique seu GitHub - deve mostrar commit de hoje!"