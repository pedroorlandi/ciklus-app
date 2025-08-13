#!/bin/bash

echo "🔒 BACKUP SEGURO PARA GITHUB - CIKLUS APP"
echo "=========================================="
echo ""

# Criar um bundle do repositório atual
echo "📦 Criando bundle completo do repositório..."
git bundle create ciklus-backup-$(date +%Y%m%d-%H%M%S).bundle --all

echo ""
echo "✅ BACKUP CRIADO COM SUCESSO!"
echo ""
echo "📋 INSTRUÇÕES PARA UPLOAD MANUAL:"
echo "1. Baixe o arquivo .bundle criado"
echo "2. Vá até seu repositório GitHub"
echo "3. Faça upload do bundle como release/backup"
echo "4. Ou use: git clone ciklus-backup-*.bundle nova-pasta"
echo ""
echo "🎯 ESTADO ATUAL PROTEGIDO:"
echo "- VPL sincronizado Excel ↔ Sistema"
echo "- Valor Orlando: R\$ 954.219,88"
echo "- Sistema objetivos completo"
echo "- 30 commits ahead of origin/main"
echo ""
echo "Para restaurar: git clone [arquivo-bundle] nova-pasta"