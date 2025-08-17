# SETUP DE DEPLOY - SEPARAÇÃO DE DOMÍNIOS

## ✅ IMPLEMENTADO:

### **1. Servidor Express Modificado:**
- Detecta domínio `ciklus.com.br` e `www.ciklus.com.br`
- Serve arquivos estáticos do site institucional automaticamente
- Mantém fluxo normal do app para `app.ciklus.com.br`

### **2. Roteamento React Ajustado:**
- Página inicial (`/`) agora requer autenticação
- Site institucional acessível via `/institucional` (para desenvolvimento)

## 🚀 PRÓXIMOS PASSOS:

### **3. Configuração DNS:**
```
ciklus.com.br        → A Record → [IP_SERVIDOR]
www.ciklus.com.br    → CNAME   → ciklus.com.br
app.ciklus.com.br    → CNAME   → ciklus.com.br
```

### **4. Deploy Production:**

**Opção A: Single Server (Atual)**
- Um servidor Express na porta 5000
- Detecta domínio e serve conteúdo apropriado

**Opção B: Nginx + Node.js**
- Nginx serve `ciklus.com.br` estático
- Nginx faz proxy para `app.ciklus.com.br` → Node.js

### **5. Testes Locais:**
```bash
# Adicionar ao /etc/hosts para testar:
127.0.0.1 ciklus.com.br
127.0.0.1 www.ciklus.com.br  
127.0.0.1 app.ciklus.com.br

# Testar:
curl -H "Host: ciklus.com.br" http://localhost:5000
curl -H "Host: app.ciklus.com.br" http://localhost:5000/api/login
```

## 📋 ESTRUTURA FINAL:

```
ciklus.com.br/       → Site institucional (estático)
├── index.html
├── assets/
└── imagens/

app.ciklus.com.br/   → Aplicativo financeiro (React SPA)
├── /dashboard       → Dashboard principal
├── /planejamentos   → Gestão de planejamentos
├── /receitas        → CRUD receitas
└── /api/*           → API backend
```

**Status**: ✅ Pronto para deploy com separação de domínios