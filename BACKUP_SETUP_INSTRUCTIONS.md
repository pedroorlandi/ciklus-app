# CIKLUS APP - Instruções de Configuração de Backup

## 🎯 Sistema Criado e Testado

✅ **Scripts de backup funcionais**:
- `scripts/backup-automatico.sh` - Backup diário completo
- `scripts/backup-github-sync.sh` - Sincronização com GitHub

✅ **Teste realizado com sucesso**:
- Backup código: 1.2MB (sem node_modules)
- Backup database: 428KB (PostgreSQL dump)
- Configurações: package.json, tsconfig.json, etc.
- Relatório status: estatísticas automáticas

## 🚀 Para Ativar Backup Automático

### No Replit Deployments:

1. **Acesse Deployments** na barra lateral
2. **Create new deployment** → **Scheduled**
3. **Configure**:
   ```
   Nome: CIKLUS Daily Backup
   Comando: bash scripts/backup-automatico.sh
   Schedule: 0 2 * * * (diariamente às 02:00)
   Timezone: America/Sao_Paulo
   ```
4. **Deploy** e ativar

### Opcional - GitHub Sync:

1. **Configure GitHub remote** (se necessário):
   ```bash
   git remote add origin https://github.com/seu-usuario/ciklus-app.git
   ```

2. **Create second scheduled deployment**:
   ```
   Nome: CIKLUS GitHub Sync
   Comando: bash scripts/backup-github-sync.sh  
   Schedule: 0 3 * * 0 (domingos às 03:00)
   ```

## 📋 Comandos Disponíveis

### Backup Manual Imediato
```bash
bash scripts/backup-automatico.sh
```

### Sincronizar GitHub Agora
```bash
bash scripts/backup-github-sync.sh
```

### Verificar Backups
```bash
# Listar backups recentes
ls -la backups/

# Ver relatório do último backup
cat backups/*/status-report.txt | tail -20
```

## 🔍 Estrutura dos Backups

```
backups/
├── 20250813/
│   ├── ciklus-codigo-20250813-165032.tar.gz (1.2MB)
│   ├── database-backup-20250813-165032.sql (428KB)
│   ├── status-report.txt
│   └── [arquivos de configuração]
├── 20250814/
│   └── [backups do dia seguinte]
└── ...
```

## 🛡️ Níveis de Proteção Implementados

1. **Checkpoints Replit** (automático)
2. **Backup diário local** (automático com scheduled deployment)
3. **Sync GitHub** (automático semanal ou manual)
4. **Bundle emergência** (manual quando necessário)

## ⚡ Funcionalidades

✅ **Compressão inteligente** - exclui node_modules, logs  
✅ **Dump PostgreSQL completo** - todos os dados  
✅ **Relatórios automáticos** - estatísticas do sistema  
✅ **Limpeza automática** - remove backups +7 dias  
✅ **Fallback robusto** - bundles se GitHub falhar  
✅ **Zero manutenção** - funciona sozinho  

## 🎯 Status Final

- **Sistema**: ✅ Criado e testado
- **Scripts**: ✅ Funcionais e executáveis  
- **Documentação**: ✅ Completa
- **Pronto para**: Configurar Scheduled Deployment

**Próximo passo**: Configurar o Scheduled Deployment no painel do Replit para ativar o backup automático diário.