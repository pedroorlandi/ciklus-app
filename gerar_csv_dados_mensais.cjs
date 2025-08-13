// Script para gerar CSV dos dados mensais - Cenário Base
const fs = require('fs');
const { execSync } = require('child_process');

console.log('📊 Gerando CSV dos dados mensais - Cenário Base');
console.log('');

try {
    // Buscar dados mensais via API
    const result = execSync('curl -s "http://localhost:5000/api/dados/2"', { encoding: 'utf8' });
    const dados = JSON.parse(result);
    
    console.log(`📈 Total de registros: ${dados.length} meses`);
    console.log(`📅 Período: ${dados[0].ano}/${String(dados[0].mes).padStart(2, '0')} até ${dados[dados.length-1].ano}/${String(dados[dados.length-1].mes).padStart(2, '0')}`);
    console.log('');

    // Criar cabeçalho CSV
    const headers = [
        'Periodo',
        'Ano',
        'Mes',
        'Receitas_Ativas',
        'Receitas_Passivas', 
        'Total_Receitas',
        'Despesas_Operacionais',
        'Despesas_Patrimoniais',
        'Total_Despesas',
        'Financiamento1_Studio',
        'Financiamento2_Moradia', 
        'Financiamento3_Orlando',
        'Venda_Ativos',
        'Desembolso_Objetivos',
        'Portfolio_Inicial',
        'Rendimento_Portfolio',
        'Saving',
        'Portfolio_Final'
    ];

    // Criar conteúdo CSV
    let csvContent = headers.join(',') + '\n';
    
    dados.forEach(dado => {
        const periodo = `${dado.ano}/${String(dado.mes).padStart(2, '0')}`;
        
        const row = [
            periodo,
            dado.ano,
            dado.mes,
            parseFloat(dado.receitasAtivas || 0).toFixed(2),
            parseFloat(dado.receitasPassivas || 0).toFixed(2),
            parseFloat(dado.totalReceitas || 0).toFixed(2),
            parseFloat(dado.despesasOperacionais || 0).toFixed(2),
            parseFloat(dado.despesasPatrimoniais || 0).toFixed(2),
            parseFloat(dado.totalDespesas || 0).toFixed(2),
            parseFloat(dado.financiamento1 || 0).toFixed(2),
            parseFloat(dado.financiamento2 || 0).toFixed(2),
            parseFloat(dado.financiamento3 || 0).toFixed(2),
            parseFloat(dado.vendaAtivos || 0).toFixed(2),
            parseFloat(dado.desembolsoObjetivos || 0).toFixed(2),
            parseFloat(dado.portfolioInicial || 0).toFixed(2),
            parseFloat(dado.rendimentoPortfolio || 0).toFixed(2),
            parseFloat(dado.saving || 0).toFixed(2),
            parseFloat(dado.portfolioFinal || 0).toFixed(2)
        ];
        
        csvContent += row.join(',') + '\n';
    });

    // Salvar arquivo CSV
    const nomeArquivo = `dados_mensais_ciklus_cenario_base_${new Date().toISOString().split('T')[0]}.csv`;
    fs.writeFileSync(nomeArquivo, csvContent, 'utf8');
    
    console.log(`✅ CSV gerado com sucesso: ${nomeArquivo}`);
    console.log(`📁 Localização: ${process.cwd()}/${nomeArquivo}`);
    console.log(`📊 ${dados.length} linhas de dados + 1 linha de cabeçalho`);
    console.log('');
    
    // Mostrar estatísticas do arquivo
    const stats = fs.statSync(nomeArquivo);
    console.log(`📏 Tamanho do arquivo: ${(stats.size / 1024).toFixed(2)} KB`);
    
    // Mostrar amostra das primeiras 5 linhas
    console.log('');
    console.log('📋 Amostra das primeiras 5 linhas:');
    const linhas = csvContent.split('\n');
    for (let i = 0; i < Math.min(6, linhas.length); i++) {
        if (linhas[i].trim()) {
            console.log(`   ${i === 0 ? 'HEADER' : 'Linha ' + i}: ${linhas[i].substring(0, 100)}${linhas[i].length > 100 ? '...' : ''}`);
        }
    }

} catch (error) {
    console.error('❌ Erro ao gerar CSV:', error.message);
}