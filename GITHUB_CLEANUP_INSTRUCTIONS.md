# CIKLUS APP - Instruções para Limpeza do GitHub

## 🎯 Objetivo
Limpar o GitHub atual e criar primeiro backup limpo do sistema avançado

## 🧹 Como Executar a Limpeza

### Passo 1: Executar Script de Limpeza
```bash
bash scripts/limpar-github-preparar-backup.sh
```

**O script vai:**
1. ✅ Mostrar estado atual do Git
2. ✅ Criar backup antes da limpeza  
3. ✅ Remover .git atual (remove histórico anterior)
4. ✅ Criar novo repositório Git limpo
5. ✅ Fazer commit inicial com sistema completo
6. ✅ Configurar remote para seu GitHub
7. ✅ Fazer primeiro push limpo
8. ✅ Criar tag v1.0.0 para marco inicial

### Passo 2: Configurar Autenticação (se necessário)
Se der erro de autenticação:

**Opção A: Personal Access Token**
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic) com scope `repo`
3. Usar no lugar da senha quando pedir

**Opção B: Configurar Token nos Secrets**
1. Replit → Secrets (barra lateral)
2. Add new secret:
   - Name: `GITHUB_TOKEN`
   - Value: seu_personal_access_token

## 🔄 Após a Limpeza

### Configurar Backup Automático
Com GitHub limpo, ativar:

**1. Scheduled Deployment - Backup Diário**
- Nome: `CIKLUS Emergency Backup`
- Comando: `bash scripts/backup-completo-emergencia.sh`
- Schedule: `0 2 * * *` (02:00 diariamente)

**2. Scheduled Deployment - GitHub Sync**
- Nome: `CIKLUS GitHub Sync`  
- Comando: `bash scripts/backup-github-automatico.sh`
- Schedule: `0 1,13 * * *` (01:00 e 13:00 diariamente)

## ✅ Resultado Final

Após a limpeza você terá:
- 🧹 **GitHub limpo** com apenas a versão atual funcional
- 📦 **Primeiro commit** documenta estado completo do sistema
- 🏷️ **Tag v1.0.0** marca versão inicial funcional
- 🔄 **Backup automático** pronto para ativar
- 🛡️ **Proteção total** contra perda do trabalho

## 🎯 Sistema Preservado

O commit inicial vai documentar:
- ✅ Metodologia CIKLUS universal (dados até 100 anos)
- ✅ Cálculos financeiros corretos  
- ✅ Interface cards para membros
- ✅ Configuração Taxa de Juros Real
- ✅ Sistema completo de backup
- ✅ Base de dados com 852 registros (2025-2095)
- ✅ Todas as funcionalidades avançadas implementadas

---
**IMPORTANTE**: Esta limpeza preserva todo o trabalho avançado do sistema, apenas remove o histórico Git anterior para criar um backup limpo e organizado.