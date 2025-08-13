// Script para analisar o CSV gerado dos dados mensais
const fs = require('fs');

console.log('🔍 Analisando CSV dos dados mensais - Cenário Base');
console.log('');

try {
    // Ler o arquivo CSV
    const nomeArquivo = 'dados_mensais_ciklus_cenario_base_2025-07-29.csv';
    const csvContent = fs.readFileSync(nomeArquivo, 'utf8');
    const linhas = csvContent.split('\n').filter(linha => linha.trim());
    
    // Parse das linhas (ignorar header)
    const dados = [];
    for (let i = 1; i < linhas.length; i++) {
        const campos = linhas[i].split(',');
        if (campos.length >= 18) {
            dados.push({
                periodo: campos[0],
                ano: parseInt(campos[1]),
                mes: parseInt(campos[2]),
                receitasAtivas: parseFloat(campos[3]),
                receitasPassivas: parseFloat(campos[4]),
                totalReceitas: parseFloat(campos[5]),
                despesasOperacionais: parseFloat(campos[6]),
                despesasPatrimoniais: parseFloat(campos[7]),
                totalDespesas: parseFloat(campos[8]),
                financiamento1: parseFloat(campos[9]),
                financiamento2: parseFloat(campos[10]),
                financiamento3: parseFloat(campos[11]),
                vendaAtivos: parseFloat(campos[12]),
                desembolsoObjetivos: parseFloat(campos[13]),
                portfolioInicial: parseFloat(campos[14]),
                rendimentoPortfolio: parseFloat(campos[15]),
                saving: parseFloat(campos[16]),
                portfolioFinal: parseFloat(campos[17])
            });
        }
    }
    
    console.log(`📊 Arquivo: ${nomeArquivo}`);
    console.log(`📈 Total de registros: ${dados.length} meses`);
    console.log(`📅 Período: ${dados[0].periodo} até ${dados[dados.length-1].periodo}`);
    console.log('');
    
    // Calcular estatísticas por coluna
    const estatisticas = {};
    const colunas = [
        'receitasAtivas', 'receitasPassivas', 'totalReceitas',
        'despesasOperacionais', 'despesasPatrimoniais', 'totalDespesas', 
        'financiamento1', 'financiamento2', 'financiamento3',
        'vendaAtivos', 'desembolsoObjetivos', 'saving',
        'portfolioInicial', 'portfolioFinal'
    ];
    
    colunas.forEach(coluna => {
        const valores = dados.map(d => d[coluna]).filter(v => !isNaN(v) && v !== 0);
        if (valores.length > 0) {
            const soma = valores.reduce((a, b) => a + b, 0);
            const media = soma / valores.length;
            const min = Math.min(...valores);
            const max = Math.max(...valores);
            
            estatisticas[coluna] = {
                soma: soma,
                media: media,
                min: min,
                max: max,
                count: valores.length
            };
        }
    });
    
    // Exibir estatísticas principais
    console.log('💰 ESTATÍSTICAS FINANCEIRAS:');
    console.log('');
    
    console.log('📈 RECEITAS:');
    if (estatisticas.receitasAtivas) {
        console.log(`   Ativas - Total: R$ ${estatisticas.receitasAtivas.soma.toLocaleString('pt-BR', {minimumFractionDigits: 2})} | Média: R$ ${estatisticas.receitasAtivas.media.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    }
    if (estatisticas.receitasPassivas) {
        console.log(`   Passivas - Total: R$ ${estatisticas.receitasPassivas.soma.toLocaleString('pt-BR', {minimumFractionDigits: 2})} | Média: R$ ${estatisticas.receitasPassivas.media.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    }
    if (estatisticas.totalReceitas) {
        console.log(`   TOTAL - Soma: R$ ${estatisticas.totalReceitas.soma.toLocaleString('pt-BR', {minimumFractionDigits: 2})} | Média: R$ ${estatisticas.totalReceitas.media.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    }
    console.log('');
    
    console.log('📉 DESPESAS:');
    if (estatisticas.despesasOperacionais) {
        console.log(`   Operacionais - Total: R$ ${estatisticas.despesasOperacionais.soma.toLocaleString('pt-BR', {minimumFractionDigits: 2})} | Média: R$ ${estatisticas.despesasOperacionais.media.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    }
    if (estatisticas.despesasPatrimoniais) {
        console.log(`   Patrimoniais - Total: R$ ${estatisticas.despesasPatrimoniais.soma.toLocaleString('pt-BR', {minimumFractionDigits: 2})} | Média: R$ ${estatisticas.despesasPatrimoniais.media.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    }
    if (estatisticas.totalDespesas) {
        console.log(`   TOTAL - Soma: R$ ${estatisticas.totalDespesas.soma.toLocaleString('pt-BR', {minimumFractionDigits: 2})} | Média: R$ ${estatisticas.totalDespesas.media.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    }
    console.log('');
    
    console.log('🏠 FINANCIAMENTOS:');
    if (estatisticas.financiamento1) {
        console.log(`   Studio - Total: R$ ${estatisticas.financiamento1.soma.toLocaleString('pt-BR', {minimumFractionDigits: 2})} | ${estatisticas.financiamento1.count} meses`);
    }
    if (estatisticas.financiamento2) {
        console.log(`   Moradia - Total: R$ ${estatisticas.financiamento2.soma.toLocaleString('pt-BR', {minimumFractionDigits: 2})} | ${estatisticas.financiamento2.count} meses`);
    }
    if (estatisticas.financiamento3) {
        console.log(`   Orlando - Total: R$ ${estatisticas.financiamento3.soma.toLocaleString('pt-BR', {minimumFractionDigits: 2})} | ${estatisticas.financiamento3.count} meses`);
    }
    console.log('');
    
    console.log('💼 PORTFOLIO:');
    if (estatisticas.portfolioInicial && estatisticas.portfolioFinal) {
        console.log(`   Inicial - Mín: R$ ${estatisticas.portfolioInicial.min.toLocaleString('pt-BR', {minimumFractionDigits: 2})} | Máx: R$ ${estatisticas.portfolioInicial.max.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
        console.log(`   Final - Mín: R$ ${estatisticas.portfolioFinal.min.toLocaleString('pt-BR', {minimumFractionDigits: 2})} | Máx: R$ ${estatisticas.portfolioFinal.max.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    }
    console.log('');
    
    console.log('💰 SAVING (FLUXO LÍQUIDO):');
    if (estatisticas.saving) {
        console.log(`   Total Acumulado: R$ ${estatisticas.saving.soma.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
        console.log(`   Média Mensal: R$ ${estatisticas.saving.media.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
        console.log(`   Menor Valor: R$ ${estatisticas.saving.min.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
        console.log(`   Maior Valor: R$ ${estatisticas.saving.max.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    }
    
    // Identificar principais eventos
    console.log('');
    console.log('🎯 EVENTOS ESPECIAIS:');
    
    const vendasAtivos = dados.filter(d => d.vendaAtivos > 0);
    if (vendasAtivos.length > 0) {
        console.log(`   🏠 Vendas de Ativos: ${vendasAtivos.length} eventos`);
        vendasAtivos.forEach(v => {
            console.log(`      ${v.periodo}: R$ ${v.vendaAtivos.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
        });
    }
    
    const desembolsos = dados.filter(d => d.desembolsoObjetivos > 0);
    if (desembolsos.length > 0) {
        console.log(`   🎯 Desembolsos de Objetivos: ${desembolsos.length} eventos`);
        desembolsos.forEach(d => {
            console.log(`      ${d.periodo}: R$ ${d.desembolsoObjetivos.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
        });
    }

} catch (error) {
    console.error('❌ Erro ao analisar CSV:', error.message);
}