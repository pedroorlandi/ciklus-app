# EXPLICAÇÃO: Evolução do Portfólio

## Como o Portfólio é Calculado

Com base no código em `server/storage.ts`, o sistema calcula a evolução do portfólio da seguinte forma:

### 1. Valor Inicial
- **Portfolio Inicial**: R$ 0,00 (quando não há investimentos cadastrados) ou soma dos investimentos reais

### 2. Cálculo Mensal (para cada mês)
```
Portfolio Final = Portfolio Inicial + Rendimento Mensal + Saving (Saldo)

Onde:
- Portfolio Inicial = Portfolio Final do mês anterior
- Rendimento Mensal = Portfolio Inicial × 0.8% (taxa fixa de 0.8% ao mês)
- Saving = Total Receitas - Total Despesas (saldo mensal)
```

### 3. Metodologia Aplicada
1. **Janeiro/2025**: Inicia com R$ 0,00 (se vazio) ou valor real dos investimentos
2. **Rendimento**: Portfolio × Taxa Mensal (ex: 0 × 0.327% = R$ 0)
3. **Saldo**: Receitas - Despesas (ex: 25.000 - 0 = R$ 25.000)
4. **Portfolio Final**: 0 + 0 + 25.000 = R$ 25.000
5. **Fevereiro/2025**: Inicia com R$ 25.000 e repete o cálculo

### 4. Premissas do Sistema
- **Taxa de Retorno**: Agora usa a "Taxa de Juros Real" configurada nos Índices Econômicos (atualmente 4% ao ano)
- **Conversão**: Taxa mensal = (1 + taxa_anual)^(1/12) - 1 (4% anual = 0.327% mensal)
- **Reinvestimento**: Todo saldo mensal positivo é adicionado ao portfólio
- **Saque**: Saldo mensal negativo reduz o portfólio
- **Composição**: Juros compostos mês a mês

### 5. Onde Verificar
- **Gráfico**: Mostra a evolução anual consolidada
- **Tabela**: Nova coluna "Portfolio Final" mostra valor mês a mês
- **Fonte**: Mesmos dados, garantindo sincronização