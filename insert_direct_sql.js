// Script para inserir dados diretamente no banco PostgreSQL
// Usando dados históricos do CSV e inserção SQL direta

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
    console.error('Erro SQL:', error.message);
    return null;
  }
}

// Função para processar CSV e converter para dados estruturados
function processCSVData(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(';');
  
  console.log('📊 Headers encontrados:', headers.slice(0, 10).join(', '), '...');
  
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
  
  console.log(`📈 ${data.length} linhas de dados processadas`);
  return data;
}

// Função para converter data de mês/ano para formato SQL
function convertDateFormat(mes, ano) {
  const meses = {
    'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
    'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08', 
    'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
  };
  
  const mesNum = meses[mes?.toLowerCase()] || '01';
  return `${ano}-${mesNum}-01`;
}

// Função para escapar strings SQL
function escapeSql(str) {
  return str?.replace(/'/g, "''") || '';
}

// Função para inserir dados usando a tabela dados_mensais
async function insertDataToPostgres(csvData) {
  console.log('💾 Inserindo dados diretamente no PostgreSQL...');
  
  // Selecionar apenas os primeiros 24 registros (2 anos) para teste
  const dataToProcess = csvData.slice(0, 24);
  console.log(`📊 Processando ${dataToProcess.length} registros (2 anos de dados)`);
  
  let insertedCount = 0;
  
  for (const row of dataToProcess) {
    const periodo = parseInt(row.Periodo) || 45657;
    const mes = row.Mes || 'janeiro';
    const ano = parseInt(row.Ano) || 2025;
    const dataInicio = convertDateFormat(mes, ano);
    
    // Valores numéricos com tratamento de vírgulas
    const basicas = parseFloat(row['Basicas']?.replace(',', '.')) || 0;
    const dependentes = parseFloat(row['Dependentes']?.replace(',', '.')) || 0;
    const estilo = parseFloat(row['Estilo']?.replace(',', '.')) || 0;
    const viagens = parseFloat(row['Viagens']?.replace(',', '.')) || 0;
    const patrimonial = parseFloat(row['Patrimonial']?.replace(',', '.')) || 0;
    const receitaFixa = parseFloat(row['Receita Fixa']?.replace(',', '.')) || 0;
    const receitaVariavel = parseFloat(row['Receita Variavel']?.replace(',', '.')) || 0;
    const receitaPatrimonio = parseFloat(row['Receita Patrimonio']?.replace(',', '.')) || 0;
    const receitasTotais = parseFloat(row['Receitas Totais']?.replace(',', '.')) || 0;
    const despesasTotais = parseFloat(row['Despesas Totais']?.replace(',', '.')) || 0;
    const portfInicial = parseFloat(row['Portf Inicial']?.replace(',', '.')) || 0;
    const portfFinal = parseFloat(row['Portf Final']?.replace(',', '.')) || 0;
    const saving = parseFloat(row['Saving']?.replace(',', '.')) || 0;
    
    // Inserir na tabela dados_mensais
    const sql = `
      INSERT INTO dados_mensais (
        planejamento_id, periodo, mes, ano, data_referencia,
        despesas_basicas, despesas_dependentes, despesas_estilo, despesas_viagens, despesas_patrimonial,
        receita_fixa, receita_variavel, receita_patrimonio, receitas_totais, despesas_totais,
        patrimonio_inicial, patrimonio_final, poupanca_mensal, observacoes,
        created_at, updated_at
      ) VALUES (
        2, ${periodo}, '${escapeSql(mes)}', ${ano}, '${dataInicio}',
        ${basicas}, ${dependentes}, ${estilo}, ${viagens}, ${patrimonial},
        ${receitaFixa}, ${receitaVariavel}, ${receitaPatrimonio}, ${receitasTotais}, ${despesasTotais},
        ${portfInicial}, ${portfFinal}, ${saving}, 'Dados migrados do CSV - ${escapeSql(mes)}/${ano}',
        NOW(), NOW()
      )
    `;
    
    const result = executeSql(sql);
    if (result !== null) {
      insertedCount++;
      console.log(`✅ Inserido: ${mes}/${ano}`);
    } else {
      console.log(`❌ Erro ao inserir: ${mes}/${ano}`);
    }
  }
  
  console.log(`🎉 Inserção concluída: ${insertedCount} registros inseridos`);
  return insertedCount;
}

// Função principal
async function main() {
  try {
    console.log('🚀 Iniciando inserção direta de dados no PostgreSQL...');
    console.log('📍 Usando dados reais do arquivo: dados_mensais_ciklus.csv');
    
    // Verificar conexão com banco
    const testConnection = executeSql("SELECT NOW()");
    if (!testConnection) {
      console.error('❌ Não foi possível conectar ao banco PostgreSQL');
      process.exit(1);
    }
    console.log('✅ Conexão com PostgreSQL estabelecida');
    
    // Verificar se a tabela dados_mensais existe
    const tableExists = executeSql("SELECT to_regclass('public.dados_mensais')");
    if (!tableExists || tableExists === '') {
      console.error('❌ Tabela dados_mensais não existe');
      process.exit(1);
    }
    console.log('✅ Tabela dados_mensais encontrada');
    
    // Verificar se planejamento ID 2 existe
    const planejamentoExists = executeSql("SELECT id FROM planejamentos WHERE id = 2");
    if (!planejamentoExists) {
      console.error('❌ Planejamento ID 2 não encontrado');
      process.exit(1);
    }
    console.log('✅ Planejamento ID 2 encontrado');
    
    // Ler arquivo CSV
    const csvPath = path.join(process.cwd(), 'dados_mensais_ciklus.csv');
    if (!fs.existsSync(csvPath)) {
      console.error('❌ Arquivo dados_mensais_ciklus.csv não encontrado');
      process.exit(1);
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const csvData = processCSVData(csvContent);
    
    // Limpar dados existentes do planejamento 2 na tabela dados_mensais
    console.log('🧹 Limpando dados existentes...');
    executeSql("DELETE FROM dados_mensais WHERE planejamento_id = 2");
    
    // Inserir novos dados
    const insertedCount = await insertDataToPostgres(csvData);
    
    console.log('🎉 Migração concluída com sucesso!');
    console.log(`📊 ${insertedCount} registros inseridos na tabela dados_mensais`);
    console.log('🔍 Verifique os dados na interface do Ciklus');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as insertDirectSql };