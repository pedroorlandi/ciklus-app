# 🔄 GUIA: Migração para Neon Próprio

## Status
- ✅ **Backup criado**: Dados seguros para migração
- ✅ **Conta Neon**: Usuario já possui conta
- 🔄 **Em andamento**: Configuração novo banco

## Próximos Passos

### 1. Criar Projeto no Neon
1. Acesse `console.neon.tech`
2. Clique em "Create Project"
3. Configure:
   - **Nome**: "CIKLUS-APP" ou similar
   - **Região**: Escolha mais próxima (us-east-1 recomendado)
   - **PostgreSQL Version**: 16 (mais recente)

### 2. Obter Connection String
Após criar o projeto:
1. Vá em "Connection Details"
2. Copie a **Connection String**
3. Formato: `postgresql://username:password@host/dbname?sslmode=require`

### 3. Configurar no Replit
1. Abrir "Secrets" no Replit
2. Editar `DATABASE_URL`
3. Colar nova connection string do Neon

### 4. Migrar Dados
Executar restore com backup criado:
```bash
psql "nova_database_url" < backup_migracao_neon_YYYYMMDD_HHMMSS.sql
```

### 5. Testar Sistema
- Verificar se aplicação conecta
- Validar dados carregados
- Testar funcionalidades principais

### 6. Finalizar
- Confirmar funcionamento
- Documentar nova configuração
- Solicitar remoção banco antigo (opcional)

## Backup Atual
- **Arquivo**: backup_migracao_neon_YYYYMMDD_HHMMSS.sql
- **Status**: Pronto para restore
- **Dados**: Todos os 1.704 registros incluídos