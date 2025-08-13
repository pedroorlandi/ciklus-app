# CIKLUS APP - Checklist de Recuperação Total

## 🚨 EM CASO DE PROBLEMA NO REPL

### ✅ ANTES DO PROBLEMA (Preparação)

**1. Configurar GitHub Remote com Token**
```bash
# Criar Personal Access Token no GitHub
# Adicionar secret GITHUB_TOKEN no Replit
git remote add origin https://github.com/seu-usuario/ciklus-app.git
```

**2. Ativar Backups Automáticos**
- Scheduled Deployment: `CIKLUS Emergency Backup`
- Comando: `bash scripts/backup-completo-emergencia.sh`
- Schedule: `0 2 * * *` (diário às 02:00)

**3. Download Manual de Segurança**
```bash
# Fazer backup completo agora
bash scripts/backup-completo-emergencia.sh
# Download: emergency-backup-YYYYMMDD-HHMMSS.tar.gz (88MB)
```

### ⚡ DURANTE O PROBLEMA (Recuperação)

**TEMPO TOTAL: 15-30 minutos**

#### Opção A: GitHub (5-15 min) ⭐ RECOMENDADA
```bash
# 1. Criar novo Repl Node.js com PostgreSQL (2 min)
# 2. Clonar repositório (3 min)
git clone https://github.com/seu-usuario/ciklus-app.git
cd ciklus-app

# 3. Restaurar base de dados (5 min)
psql $DATABASE_URL < backups/github-sync/database-latest.sql

# 4. Configurar e rodar (2 min)
npm run dev

# ✅ Sistema funcionando 100%
```

#### Opção B: Backup Completo (10-20 min)
```bash
# 1. Criar novo Repl Node.js com PostgreSQL (2 min)
# 2. Upload emergency-backup-*.tar.gz (3 min)
# 3. Extrair backup completo (5 min)
tar -xzf emergency-backup-*.tar.gz
mv emergency-backup-*/ciklus-completo-*.tar.gz .
tar -xzf ciklus-completo-*.tar.gz

# 4. Restaurar base (5 min)
psql $DATABASE_URL < emergency-backup-*/database-completo-*.sql

# 5. Sistema funcionando (2 min)
npm run dev

# ✅ Sistema funcionando 100%
```

### 🔍 VERIFICAÇÃO PÓS-RECUPERAÇÃO

**Testar Funcionalidades Críticas:**
```bash
# 1. Verificar base de dados
psql $DATABASE_URL -c "SELECT COUNT(*) FROM dados_mensais;"
# Esperado: 852 registros (2025-2095)

# 2. Verificar planejamentos
curl http://localhost:5000/api/planejamentos
# Esperado: Eduardo e Mônica + outros

# 3. Testar interface
# Abrir: http://localhost:5000
# Verificar: Cards de membros, gráficos, dados até 2095
```

**Funcionalidades que DEVEM estar funcionando:**
- ✅ Metodologia CIKLUS (dados até 100 anos do provedor mais novo)
- ✅ Cálculos de rendimento corretos (R$ 81,84 no exemplo)
- ✅ Interface cards para membros
- ✅ Configuração Taxa de Juros Real
- ✅ Simulações de provedores ausentes
- ✅ Portfolios e investimentos
- ✅ Objetivos financeiros
- ✅ Exportação CSV
- ✅ Integração índices econômicos

### 🛡️ DEPOIS DA RECUPERAÇÃO

**1. Reativar Backups**
```bash
# Configurar novamente scheduled deployments
# CIKLUS Emergency Backup: diário 02:00
# CIKLUS GitHub Sync: 2x por dia
```

**2. Verificar GitHub**
```bash
# Configurar remote novamente se necessário
git remote add origin https://github.com/seu-usuario/ciklus-app.git
git push origin main
```

**3. Teste Completo**
- Navegar por todas as páginas
- Testar cálculos financeiros
- Verificar gráficos até 2095
- Confirmar exportação CSV

### 📊 MONITORAMENTO CONTÍNUO

**Verificações Semanais:**
```bash
# 1. Backup funcionando?
ls -la emergency-backup-*/

# 2. GitHub atualizado?
git log --oneline -5

# 3. Base íntegra?
psql $DATABASE_URL -c "SELECT MAX(ano) FROM dados_mensais;"
# Esperado: 2095
```

### 🎯 GARANTIAS

✅ **Recuperação Completa**: 15-30 minutos máximo  
✅ **Zero Retrabalho**: Todas as funcionalidades preservadas  
✅ **Múltiplas Opções**: GitHub + Backup completo  
✅ **Verificação**: Checklists de integridade  
✅ **Automação**: Backups funcionam sozinhos  

---
**IMPORTANTE**: Com este sistema, problemas no Repl se tornam apenas pequenos inconvenientes de 15-30 minutos, não perdas de trabalho.