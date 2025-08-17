# DEPLOY COM DOMÍNIO PERSONALIZADO - app.ciklus.com.br

## 🎯 OBJETIVO:
Fazer deploy da aplicação CIKLUS no domínio `app.ciklus.com.br`

## ✅ PRÉ-REQUISITOS ATENDIDOS:
- Build de produção concluído (1.4MB bundle)
- Servidor configurado para separação de domínios
- Database Neon PostgreSQL conectado
- Porta 5000 configurada
- Assets do site institucional incluídos

## 🚀 PROCESSO DE DEPLOY:

### **PASSO 1: Deploy da Aplicação**
1. Clique no botão **"Deploy"** no Replit
2. Escolha **"Autoscale"** (melhor para Node.js)
3. Configure as variáveis de ambiente:
   ```
   DATABASE_URL=[sua_url_neon]
   NODE_ENV=production
   ```
4. Aguarde o deploy ser concluído

### **PASSO 2: Configurar Domínio Personalizado**
1. Após deploy, vá para **Deployments** → **Settings**
2. Clique em **"Link a domain"**
3. Digite: `app.ciklus.com.br`
4. O Replit fornecerá registros DNS para configurar

### **PASSO 3: Configuração DNS**
No seu provedor DNS (Registro.br, Cloudflare, etc.):

**Registros que o Replit fornecerá:**
```
app.ciklus.com.br    A      [IP_FORNECIDO]
app.ciklus.com.br    TXT    [VERIFICACAO]
```

**Para site institucional separado:**
```
ciklus.com.br        A      [MESMO_IP]
www.ciklus.com.br    CNAME  ciklus.com.br
```

### **PASSO 4: Verificação**
1. Aguarde propagação DNS (até 48h, geralmente minutos)
2. O Replit verificará automaticamente
3. Status mudará para "Verified"
4. SSL automático será configurado

## 📋 ARQUITETURA FINAL:

```
app.ciklus.com.br/
├── /                    → Dashboard (login required)
├── /dashboard           → Dashboard principal  
├── /planejamentos       → Gestão de planejamentos
├── /receitas           → CRUD receitas
├── /api/*              → API backend
└── [outras rotas]      → Aplicação React

Separação automática via Host header:
- Host: app.ciklus.com.br → Aplicação React
- Host: ciklus.com.br → Site institucional estático
```

## 🔧 MONITORAMENTO:
- Logs do deploy no painel Replit
- Performance do database Neon
- Certificados SSL automáticos
- Métricas de uso no Replit Console

## ⚠️ IMPORTANTE:
O servidor já detecta automaticamente o domínio e serve:
- `app.ciklus.com.br` → Aplicação financeira completa
- `ciklus.com.br` → Site institucional estático

**Status**: ✅ Pronto para deploy com domínio personalizado