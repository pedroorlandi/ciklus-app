# DEPLOY GUIDE - app.ciklus.com.br

## ✅ SISTEMA PRONTO PARA DEPLOY:

### **Configuração Atual:**
- **Servidor Express**: Detecta domínios automaticamente
- **Site Institucional**: `ciklus.com.br` → pasta `site-atual/`
- **App Financeiro**: `app.ciklus.com.br` → aplicação React completa
- **Database**: Neon PostgreSQL (user-controlled)
- **Build**: Production build gerado

### **Scripts de Deploy:**
```json
{
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "NODE_ENV=production node dist/index.js"
}
```

## 🚀 PROCESSO DE DEPLOY NO REPLIT:

### **1. Deploy da Aplicação:**
- Use o botão "Deploy" no Replit
- Tipo: Autoscale (recomendado para Node.js)
- Porta: 5000 (já configurada)

### **2. Configuração DNS:**
No seu provedor DNS (Registro.br, Cloudflare, etc.):
```
app.ciklus.com.br    A    [IP_FORNECIDO_PELO_REPLIT]
```

### **3. Custom Domain no Replit:**
1. Após deploy, vá para **Deployments** → **Settings**
2. Clique em **Link a domain**
3. Digite: `app.ciklus.com.br`
4. Configure os registros DNS fornecidos pelo Replit
5. Aguarde verificação (até 48h)

### **4. Variáveis de Ambiente:**
Certifique-se de que estão configuradas no deploy:
```
DATABASE_URL=[SUA_URL_NEON]
NODE_ENV=production
```

## 📋 CHECKLIST PRE-DEPLOY:

- [x] Build de produção funcional
- [x] Separação de domínios implementada
- [x] Database Neon configurado
- [x] Assets do site institucional incluídos
- [x] Scripts npm configurados
- [x] Porta 5000 configurada
- [ ] Deploy executado
- [ ] DNS configurado
- [ ] Custom domain verificado

## 🔧 PÓS-DEPLOY:

### **Teste da Aplicação:**
```bash
# Teste site institucional
curl -H "Host: ciklus.com.br" https://app.ciklus.com.br

# Teste app financeiro  
curl -H "Host: app.ciklus.com.br" https://app.ciklus.com.br/api/login
```

### **Monitoramento:**
- Logs do Replit Deploy
- Performance do banco Neon
- Certificados SSL automáticos