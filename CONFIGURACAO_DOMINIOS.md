# CONFIGURAÇÃO DE DOMÍNIOS - CIKLUS

## 🎯 OBJETIVO:
- **ciklus.com.br** → Site institucional estático
- **app.ciklus.com.br** → Aplicativo financeiro (React + Express)

## 📋 ESTRATÉGIAS DISPONÍVEIS:

### **OPÇÃO 1: SERVIDOR EXPRESS COM ROTEAMENTO**
```typescript
// server/index.ts
app.use((req, res, next) => {
  const host = req.get('host');
  
  if (host === 'ciklus.com.br' || host === 'www.ciklus.com.br') {
    // Servir site institucional estático
    express.static('./site-atual')
  } else if (host === 'app.ciklus.com.br') {
    // Servir aplicativo React
    next();
  }
});
```

### **OPÇÃO 2: DOIS SERVIDORES SEPARADOS**
- **ciklus.com.br**: Servidor estático simples (nginx/apache)
- **app.ciklus.com.br**: Servidor Express atual

### **OPÇÃO 3: REVERSE PROXY**
- Proxy principal redireciona baseado no domínio
- Mantém arquitetura atual

## 📁 ARQUIVOS NECESSÁRIOS:

### **Site Institucional (ciklus.com.br):**
```
site-atual/
├── index.html
├── assets/
│   ├── index-DzLvYZF-.js
│   ├── index-D99CTFWF.css
│   └── imagens/
```

### **Aplicativo (app.ciklus.com.br):**
```
Arquitetura atual:
- client/ (React)
- server/ (Express)
- shared/ (schemas)
```

## 🚀 IMPLEMENTAÇÃO RECOMENDADA:
**OPÇÃO 1** - Mais simples e mantém arquitetura unificada.