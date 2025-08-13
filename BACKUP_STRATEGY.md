# CIKLUS APP - Estratégia de Backup Periódico

## 🎯 Estratégia em 3 Camadas

### 1. **Checkpoints Automáticos (Replit)**
- ✅ **Ativo**: Criados automaticamente durante desenvolvimento
- ✅ **Cobertura**: Código + Conversa AI + Base de dados
- ✅ **Recuperação**: Rollback com um clique
- ✅ **Frequência**: Automática a cada marco de desenvolvimento

### 2. **Backup Diário Automatizado**
- 📍 **Script**: `scripts/backup-automatico.sh`
- 🕒 **Frequência**: Diariamente às 02:00 (horário do servidor)
- 📦 **Conteúdo**:
  - Código fonte compactado (sem node_modules)
  - Dump completo da base de dados PostgreSQL
  - Configurações do projeto
  - Relatório de status automatizado
- 🗂️ **Armazenamento**: Pasta `backups/YYYYMMDD/`
- 🧹 **Limpeza**: Remove backups com mais de 7 dias

### 3. **Sincronização GitHub**
- 📍 **Script**: `scripts/backup-github-sync.sh`  
- 🕒 **Frequência**: Semanalmente ou após mudanças críticas
- 📦 **Conteúdo**:
  - Commit automático com timestamp
  - Push para repositório remoto
  - Bundle de emergência se falhar
- 🔄 **Fallback**: Cria bundle local se GitHub indisponível

## 🚀 Configuração do Scheduled Deployment

### Passo 1: Configurar Backup Diário
1. Acesse **Deployments** no Replit
2. Crie **Scheduled Deployment**:
   - **Nome**: `CIKLUS Daily Backup`
   - **Comando**: `./scripts/backup-automatico.sh`
   - **Schedule**: `0 2 * * *` (02:00 diariamente)
   - **Timezone**: America/Sao_Paulo

### Passo 2: Configurar Sync GitHub (Opcional)
1. Crie segundo **Scheduled Deployment**:
   - **Nome**: `CIKLUS GitHub Sync`  
   - **Comando**: `./scripts/backup-github-sync.sh`
   - **Schedule**: `0 3 * * 0` (03:00 aos domingos)
   - **Timezone**: America/Sao_Paulo

## 📋 Comandos Manuais

### Backup Imediato
```bash
# Backup completo agora
./scripts/backup-automatico.sh

# Sincronizar com GitHub agora  
./scripts/backup-github-sync.sh
```

### Restauração
```bash
# Listar backups disponíveis
ls -la backups/

# Restaurar código fonte
tar -xzf backups/20250813/ciklus-codigo-20250813-*.tar.gz

# Restaurar base de dados
psql $DATABASE_URL < backups/20250813/database-backup-20250813-*.sql
```

## 🔍 Monitoramento

### Verificar Status
```bash
# Últimos backups criados
find backups/ -name "*.tar.gz" -mtime -7 | sort

# Tamanho total dos backups
du -sh backups/

# Status da base de dados
psql $DATABASE_URL -c "SELECT COUNT(*) FROM dados_mensais;"
```

### Logs de Backup
- Logs aparecem no console do Scheduled Deployment
- Relatórios salvos em `backups/YYYYMMDD/status-report.txt`

## 🛡️ Segurança e Redundância

### Níveis de Proteção:
1. **Nível 1**: Checkpoints Replit (imediato)
2. **Nível 2**: Backups locais diários (7 dias)  
3. **Nível 3**: GitHub remoto (permanente)
4. **Nível 4**: Bundles de emergência (manual)

### Cenários de Recuperação:
- **Erro desenvolvimento**: Rollback via Checkpoint
- **Corrupção dados**: Restaurar backup diário
- **Perda total Replit**: Clonar do GitHub
- **Emergência**: Usar bundle local

## ⚡ Vantagens desta Estratégia

✅ **Automática**: Zero intervenção manual diária  
✅ **Redundante**: Múltiplas camadas de proteção  
✅ **Incremental**: Preserva histórico de mudanças  
✅ **Rápida**: Rollback em minutos  
✅ **Robusta**: Funciona mesmo sem GitHub  
✅ **Monitorada**: Relatórios automatizados

## 🔧 Próximos Passos

1. **Testar backup manual**: `./scripts/backup-automatico.sh`
2. **Configurar Scheduled Deployment** no Replit
3. **Verificar primeira execução** automática
4. **Configurar GitHub remote** (opcional)
5. **Documentar processo** para equipe

---
**Última atualização**: 13 de agosto de 2025  
**Status**: Pronto para implementação