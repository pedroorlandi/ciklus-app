# CIKLUS APP - Guia de Ativação dos Backups Automáticos

## 🎯 Status Atual
✅ **GitHub limpo e atualizado** (13/08/2025)  
✅ **Scripts de backup criados** e testados  
✅ **Sistema pronto** para ativação automática  

## 🚀 Próximo Passo: Ativar Scheduled Deployments

### **1. Backup Diário de Emergência**
1. **Acessar**: Replit → Deployments (barra lateral)
2. **Criar**: "Create new deployment" → "Scheduled"
3. **Configurar**:
   ```
   Nome: CIKLUS Emergency Backup
   Comando: bash scripts/backup-completo-emergencia.sh
   Schedule: 0 2 * * *
   Timezone: America/Sao_Paulo
   ```
4. **Deploy**: Ativar o deployment

### **2. Sync GitHub Automático**
1. **Criar segundo deployment**:
   ```
   Nome: CIKLUS GitHub Sync
   Comando: bash scripts/backup-github-automatico.sh
   Schedule: 0 1,13 * * *
   Timezone: America/Sao_Paulo
   ```
2. **Deploy**: Ativar o deployment

### **3. Configurar Token GitHub (Opcional)**
Para push automático sem pedir senha:
1. **GitHub**: Settings → Developer settings → Personal access tokens
2. **Gerar**: Token com scope "repo"
3. **Replit**: Secrets → Add new secret
   - Name: `GITHUB_TOKEN`
   - Value: seu_token_aqui

## 🛡️ Sistema de Proteção Completo

**Níveis de Backup Ativos:**
1. ✅ **Checkpoints Replit** (automático)
2. 🔄 **Backup diário local** (após ativar scheduled deployment)
3. 🔄 **GitHub sync automático** (após ativar scheduled deployment)
4. ✅ **Backup manual disponível** (`bash scripts/backup-completo-emergencia.sh`)

## 📊 Monitoramento

**Verificar backups funcionando:**
```bash
# Ver backups locais
ls -la emergency-backup-*/

# Ver status GitHub
git log --oneline -5

# Ver últimos deployments
# (painel Deployments no Replit)
```

## 🎯 Resultado Final

Com os scheduled deployments ativos:
- **02:00**: Backup completo diário (código + database)
- **01:00 e 13:00**: Sync automático para GitHub
- **Proteção total**: Recuperação garantida em 15-30 minutos
- **Zero manutenção**: Sistema funciona sozinho

---
**Status**: Sistema pronto para ativação
**Ação necessária**: Configurar Scheduled Deployments no painel Replit