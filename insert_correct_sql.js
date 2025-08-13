// Script para inserir dados com estrutura correta da tabela dados_mensais
// Usando dados históricos do CSV e estrutura real do banco

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Função para executar SQL diretamente
function executeSql(sql) {
  try {
    const result = execSync(`psql $DATABASE_URL -c "${sql}" -t -A`, { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return result.trim();
  } catch (error) {
    console.error('Erro SQL:', error.message.split('\n')[0]);
    return null;
  }
}

// Função para processar CSV
function processCSVData(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(';');
  
  console.log('📊 Headers encontrados:', headers.slice(0, 8).join(', '), '...');
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(';');
    if (values.length >= headers.length - 5) {
      const row = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim() || '0.00';
      });
      data.push(row);
    }
  }
  
  console.log(`📈 ${data.length} linhas processadas`);
  return data;
}

// Função para converter mês para número
function mesParaNumero(mes) {
  const meses = {
    'janeiro': 1, 'fevereiro': 2, 'março': 3, 'abril': 4,
    'maio': 5, 'junho': 6, 'julho': 7, 'agosto': 8, 
    'setembro': 9, 'outubro': 10, 'novembro': 11, 'dezembro': 12
  };
  return meses[mes?.toLowerCase()] || 1;
}

// Função para converter data
function convertDateFormat(mes, ano) {
  const mesNum = mesParaNumero(mes);
  return `${ano}-${String(mesNum).padStart(2, '0')}-01`;
}

// Função para escapar strings SQL
function escapeSql(str) {
  return str?.replace(/'/g, "''") || '';
}

// Função para inserir dados na estrutura correta
async function insertDataToPostgres(csvData) {
  console.log('💾 Inserindo dados na tabela dados_mensais...');
  
  // Processar primeiros 24 registros (2 anos)
  const dataToProcess = csvData.slice(0, 24);
  console.log(`📊 Processando ${dataToProcess.length} registros`);
  
  let insertedCount = 0;
  
  for (const row of dataToProcess) {
    const ano = parseInt(row.Ano) || 2025;
    const mes = row.Mes || 'janeiro';
    const mesNum = mesParaNumero(mes);
    const data = convertDateFormat(mes, ano);
    const periodo = row.Periodo || '';
    
    // Valores com conversão de vírgula para ponto
    const despesasBasicas = parseFloat(row['Basicas']?.replace(',', '.')) || 0;
    const despesasDependentes = parseFloat(row['Dependentes']?.replace(',', '.')) || 0;
    const despesasEstilo = parseFloat(row['Estilo']?.replace(',', '.')) || 0;
    const despesasViagens = parseFloat(row['Viagens']?.replace(',', '.')) || 0;
    const despesasPatrimoniais = parseFloat(row['Patrimonial']?.replace(',', '.')) || 0;
    
    const financiamento1 = parseFloat(row['Financiamento 1']?.replace(',', '.')) || 0;
    const financiamento2 = parseFloat(row['Financiamento 2']?.replace(',', '.')) || 0;
    const financiamento3 = parseFloat(row['Financiamento 3']?.replace(',', '.')) || 0;
    const financiamento4 = parseFloat(row['Financiamento 4']?.replace(',', '.')) || 0;
    const financiamento5 = parseFloat(row['Financiamento 5']?.replace(',', '.')) || 0;
    
    const receitaFixa = parseFloat(row['Receita Fixa']?.replace(',', '.')) || 0;
    const receitaVariavel = parseFloat(row['Receita Variavel']?.replace(',', '.')) || 0;
    const receitaPatrimonio = parseFloat(row['Receita Patrimonio']?.replace(',', '.')) || 0;
    const inss = parseFloat(row['INSS']?.replace(',', '.')) || 0;
    
    const despesasTotais = parseFloat(row['Despesas Totais']?.replace(',', '.')) || 0;
    const receitasTotais = parseFloat(row['Receitas Totais']?.replace(',', '.')) || 0;
    const cs = parseFloat(row['CS']?.replace(',', '.')) || 0;
    
    const portfolioInicial = parseFloat(row['Portf Inicial']?.replace(',', '.')) || 0;
    const totalVendas = parseFloat(row['Total Vendas']?.replace(',', '.')) || 0;
    const projetos = parseFloat(row['Projetos']?.replace(',', '.')) || 0;
    const saving = parseFloat(row['Saving']?.replace(',', '.')) || 0;
    const rentaDolar = parseFloat(row['Renta $']?.replace(',', '.')) || 0;
    const portfolioFinal = parseFloat(row['Portf Final']?.replace(',', '.')) || 0;
    
    // SQL com estrutura correta da tabela
    const sql = `
      INSERT INTO dados_mensais (
        planejamento_id, ano, mes, periodo, data,
        despesas_basicas, despesas_dependentes, despesas_estilo, despesas_viagens, despesas_patrimoniais,
        financiamento_1, financiamento_2, financiamento_3, financiamento_4, financiamento_5,
        receita_ativa, receita_passiva, receita_patrimonio, inss,
        venda_ativos, desembolso_objetivos, despesas_totais, receitas_totais, cs,
        portfolio_inicial, total_vendas, projetos, saving, renta_dolar, portfolio_final,
        projetos_brl, projetos_usd, caixa, longevidade, gerado_em, versao
      ) VALUES (
        2, ${ano}, ${mesNum}, '${escapeSql(periodo)}', '${data}',
        ${despesasBasicas}, ${despesasDependentes}, ${despesasEstilo}, ${despesasViagens}, ${despesasPatrimoniais},
        ${financiamento1}, ${financiamento2}, ${financiamento3}, ${financiamento4}, ${financiamento5},
        ${receitaFixa}, ${receitaVariavel}, ${receitaPatrimonio}, ${inss},
        ${totalVendas}, 0, ${despesasTotais}, ${receitasTotais}, ${cs},
        ${portfolioInicial}, ${totalVendas}, ${projetos}, ${saving}, ${rentaDolar}, ${portfolioFinal},
        0, 0, 0, 0, NOW(), 1
      )
    `;
    
    const result = executeSql(sql);
    if (result !== null) {
      insertedCount++;
      console.log(`✅ ${mes}/${ano}: ${insertedCount}`);
    } else {
      console.log(`❌ Erro: ${mes}/${ano}`);
    }
  }
  
  console.log(`🎉 Total inserido: ${insertedCount} registros`);
  return insertedCount;
}

// Função principal
async function main() {
  try {
    console.log('🚀 Inserção de dados reais do CSV no PostgreSQL');
    console.log('📍 Arquivo: dados_mensais_ciklus.csv');
    
    // Testar conexão
    const testConnection = executeSql("SELECT NOW()");
    if (!testConnection) {
      console.error('❌ Falha na conexão PostgreSQL');
      process.exit(1);
    }
    console.log('✅ PostgreSQL conectado');
    
    // Verificar planejamento
    const planejamentoExists = executeSql("SELECT nome FROM planejamentos WHERE id = 2");
    if (!planejamentoExists) {
      console.error('❌ Planejamento ID 2 não encontrado');
      process.exit(1);
    }
    console.log(`✅ Planejamento: ${planejamentoExists}`);
    
    // Ler CSV
    const csvPath = path.join(process.cwd(), 'dados_mensais_ciklus.csv');
    if (!fs.existsSync(csvPath)) {
      console.error('❌ CSV não encontrado');
      process.exit(1);
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const csvData = processCSVData(csvContent);
    
    // Limpar dados existentes
    console.log('🧹 Limpando dados anteriores...');
    const deleted = executeSql("DELETE FROM dados_mensais WHERE planejamento_id = 2; SELECT ROW_COUNT()");
    console.log('✅ Dados limpos');
    
    // Inserir novos dados
    const insertedCount = await insertDataToPostgres(csvData);
    
    console.log('🎉 Migração concluída!');
    console.log(`📊 ${insertedCount} registros inseridos`);
    console.log('🔍 Dados disponíveis na interface Ciklus');
    
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}