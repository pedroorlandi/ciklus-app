# GUIA: IDENTIFICAR ARQUIVOS DO SITE INSTITUCIONAL

## 📁 ARQUIVOS QUE VOCÊ PRECISA COPIAR:

### **OBRIGATÓRIOS (Site Institucional):**
```
📁 public/ (ou dist/public/)
├── index.html (página principal)
├── 📁 assets/
│   ├── index-[HASH].js (JavaScript principal - maior arquivo)
│   ├── index-[HASH].css (CSS principal)
│   ├── 📁 imagens/
│   │   ├── logo-ciklus.png
│   │   ├── pedro-foto.jpg
│   │   ├── cfp-logo.png
│   │   ├── cvm-logo.png
│   │   └── outras-imagens-site.jpg
```

### **NÃO COPIAR (São do App Interno):**
```
❌ server/ (backend do app)
❌ client/src/pages/dashboard.tsx
❌ client/src/pages/receitas.tsx
❌ client/src/pages/despesas.tsx
❌ shared/schema.ts
❌ package.json (dependências do app)
❌ Arquivos de banco de dados
```

## 🔍 COMO IDENTIFICAR NO PROJETO "Site":

### **1. PROCURE POR:**
- Pasta `public/` ou `dist/public/`
- Arquivo `index.html` (deve ter title com "CIKLUS")
- Assets com hash no nome (ex: index-ABC123.js)

### **2. CONFIRME SE É SITE INSTITUCIONAL:**
- Abra `index.html` e veja se carrega o site institucional
- Tamanho do JS: geralmente entre 300KB-1.5MB
- CSS: geralmente entre 8KB-100KB

### **3. TESTE LOCALMENTE:**
```bash
# No projeto "Site", teste se é a versão correta:
python3 -m http.server 8080 --directory public
# Acesse localhost:8080 e veja se é igual ao www.ciklus.com.br
```

## 📋 CHECKLIST DE ARQUIVOS:

```
□ index.html (entrada principal)
□ assets/index-[hash].js (JavaScript)
□ assets/index-[hash].css (CSS)
□ assets/logo-ciklus (logo principal)
□ assets/pedro-foto (foto da equipe)
□ assets/cfp-logo (certificação)
□ assets/cvm-logo (certificação)
□ Outros assets de imagens do site
```

**Status:** Aguardando identificação dos arquivos corretos no projeto "Site"