# CONFIGURAÇÃO DOMÍNIO PERSONALIZADO - RESOLUÇÃO DE CONFLITOS

## ❌ PROBLEMA IDENTIFICADO:
Domínios personalizados já configurados em outro Replit/projeto.

## ✅ SOLUÇÃO:

### **PASSO 1: Remover Domínio do Projeto Anterior**
1. Acesse o projeto anterior onde `app.ciklus.com.br` está configurado
2. Vá para **Deployments** → **Settings** → **Custom Domains**
3. Clique em **"Remove domain"** ou **"Unlink"** para `app.ciklus.com.br`
4. Confirme a remoção
5. Aguarde alguns minutos para liberação

### **PASSO 2: Configurar no Projeto Atual**
Após remover do projeto anterior:

1. **No projeto atual**, clique em **Deploy**
2. Configure tipo **Autoscale**
3. Após deploy, vá para **Deployments** → **Settings**
4. Clique **"Link a domain"** → Digite: `app.ciklus.com.br`
5. Configure os registros DNS fornecidos

### **PASSO 3: Configuração DNS**
```
app.ciklus.com.br    A      [NOVO_IP_REPLIT]
app.ciklus.com.br    TXT    [NOVO_TOKEN_VERIFICACAO]
```

## 🔧 CONFIGURAÇÃO ATUAL RESOLVIDA:
- ✅ Conflito de porta 5000 resolvido
- ✅ Servidor reiniciado limpo
- ✅ Build de produção pronto (1.4MB)
- ✅ Separação automática de domínios configurada
- ✅ Database Neon conectado

## 📋 CHECKLIST:
- [ ] Remover domínio do projeto anterior
- [ ] Aguardar liberação (alguns minutos)
- [ ] Deploy neste projeto
- [ ] Configurar domínio personalizado
- [ ] Atualizar registros DNS
- [ ] Verificar funcionamento

**Status**: Pronto para configurar após remoção do projeto anterior.

## ⚠️ IMPORTANTE:
Só é possível ter um domínio personalizado ativo por vez no Replit. 
Remova primeiro do projeto anterior antes de configurar aqui.