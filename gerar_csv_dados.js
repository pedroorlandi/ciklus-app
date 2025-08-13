import fs from 'fs';
import { execSync } from 'child_process';

async function gerarCSVDados() {
  try {
    console.log('📊 GERANDO CSV DOS DADOS MENSAIS CIKLUS\n');
    
    // Buscar dados do sistema
    const dados = JSON.parse(execSync('curl -s "http://localhost:5000/api/dados/2"', {encoding: 'utf8'}));
    
    console.log(`Dados carregados: ${dados.length} registros`);
    
    // Cabeçalho do CSV (compatível com seu formato)
    const headers = [
      'Periodo',
      'Mes',
      'Ano', 
      'Basicas',
      'Dependentes',
      'Estilo',
      'Viagens',
      'Patrimonial',
      'Financiamento 1',
      'Financiamento 2', 
      'Financiamento 3',
      'Financiamento 4',
      'Financiamento 5',
      'Despesas Totais',
      'Receita Fixa',
      'Receita Variavel',
      'Receita Patrimonio',
      'INSS',
      'Receitas Totais',
      'CS',
      'Portf Inicial',
      'Total Vendas',
      'Projetos',
      'Saving',
      'Renta $',
      'Portf Final'
    ];
    
    // Converter dados para formato CSV
    const linhasCSV = dados.map(d => {
      // Mapear mês para nome
      const meses = ['janeiro','fevereiro','março','abril','maio','junho',
                     'julho','agosto','setembro','outubro','novembro','dezembro'];
      const nomeMes = meses[d.mes - 1];
      
      // Período no formato Excel (número de dias desde 1900)
      const dataBase = new Date(1900, 0, 1);
      const dataAtual = new Date(d.ano, d.mes - 1, 1);
      const diasDiferenca = Math.floor((dataAtual - dataBase) / (1000 * 60 * 60 * 24)) + 1;
      
      return [
        diasDiferenca, // Periodo como número
        nomeMes,
        d.ano,
        parseFloat(d.despesasBasicas || 0).toFixed(2),
        parseFloat(d.despesasDependentes || 0).toFixed(2), 
        parseFloat(d.despesasEstilo || 0).toFixed(2),
        parseFloat(d.despesasViagens || 0).toFixed(2),
        parseFloat(d.despesasPatrimoniais || 0).toFixed(2),
        parseFloat(d.financiamento1 || 0).toFixed(2),
        parseFloat(d.financiamento2 || 0).toFixed(2),
        parseFloat(d.financiamento3 || 0).toFixed(2),
        parseFloat(d.financiamento4 || 0).toFixed(2),
        parseFloat(d.financiamento5 || 0).toFixed(2),
        parseFloat(d.despesasTotais || 0).toFixed(2),
        parseFloat(d.receitaAtiva || 0).toFixed(2),
        parseFloat(d.receitaPassiva || 0).toFixed(2),
        parseFloat(d.receitaPatrimonio || 0).toFixed(2),
        parseFloat(d.inss || 0).toFixed(2),
        parseFloat(d.receitasTotais || 0).toFixed(2),
        '', // CS (coluna vazia no seu CSV)
        parseFloat(d.portfolioInicial || 0).toFixed(2),
        parseFloat(d.vendaAtivos || 0).toFixed(2),
        parseFloat(d.desembolsoObjetivos || 0).toFixed(2),
        parseFloat(d.saving || 0).toFixed(2),
        parseFloat(d.rendimento || 0).toFixed(2),
        parseFloat(d.portfolioFinal || 0).toFixed(2)
      ].join(';');
    });
    
    // Montar CSV completo
    const csvContent = [headers.join(';'), ...linhasCSV].join('\n');
    
    // Salvar arquivo
    fs.writeFileSync('dados_mensais_ciklus.csv', csvContent, 'utf8');
    
    console.log('✅ CSV gerado: dados_mensais_ciklus.csv');
    console.log(`📝 Linhas: ${linhasCSV.length + 1} (incluindo cabeçalho)`);
    console.log(`📋 Colunas: ${headers.length}`);
    
    // Mostrar primeiras linhas para verificação
    console.log('\n🔍 PRIMEIRAS 5 LINHAS:');
    const linhas = [headers.join(';'), ...linhasCSV.slice(0, 5)];
    linhas.forEach((linha, i) => {
      console.log(`${i === 0 ? 'Header' : i}: ${linha.substring(0, 100)}...`);
    });
    
    // Calcular VPL da coluna Saving
    const savings = dados.map(d => parseFloat(d.saving || 0));
    const taxaAnual = 0.04;
    const taxaMensal = Math.pow(1 + taxaAnual, 1/12) - 1;
    
    const vpl = savings.reduce((acc, saving, index) => {
      return acc + (saving / Math.pow(1 + taxaMensal, index + 1));
    }, 0);
    
    console.log('\n💹 VPL DOS DADOS CIKLUS:');
    console.log(`VPL (4% a.a.): R$ ${vpl.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

gerarCSVDados();
