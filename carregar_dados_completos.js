// Script para carregar TODOS os dados históricos (852 registros)
// Dados reais do CSV para o sistema Ciklus

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Função para executar SQL
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

// Processar CSV
function processCSVData(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(';');
  
  console.log(`📊 Processando CSV com ${lines.length - 1} linhas de dados`);
  
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
  
  return data;
}

// Converter mês para número
function mesParaNumero(mes) {
  const meses = {
    'janeiro': 1, 'fevereiro': 2, 'março': 3, 'abril': 4,
    'maio': 5, 'junho': 6, 'julho': 7, 'agosto': 8, 
    'setembro': 9, 'outubro': 10, 'novembro': 11, 'dezembro': 12
  };
  return meses[mes?.toLowerCase()] || 1;
}

// Converter data
function convertDateFormat(mes, ano) {
  const mesNum = mesParaNumero(mes);
  return `${ano}-${String(mesNum).padStart(2, '0')}-01`;
}

// Escapar strings SQL
function escapeSql(str) {
  return str?.replace(/'/g, "''") || '';
}

// Processar em lotes para melhor performance
async function insertBatch(batch, batchNumber) {
  console.log(`📦 Processando lote ${batchNumber} (${batch.length} registros)...`);
  
  let insertedCount = 0;
  for (const row of batch) {
    const ano = parseInt(row.Ano) || 2025;
    const mes = row.Mes || 'janeiro';
    const mesNum = mesParaNumero(mes);
    const data = convertDateFormat(mes, ano);
    const periodo = row.Periodo || '';
    
    // Valores financeiros com conversão
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
    
    const projetosBrl = parseFloat(row['Projetos BRL']?.replace(',', '.')) || 0;
    const projetosUsd = parseFloat(row['Projetos USD']?.replace(',', '.')) || 0;
    const caixa = parseFloat(row['Caixa']?.replace(',', '.')) || 0;
    const longevidade = parseFloat(row['Longevidade']?.replace(',', '.')) || 0;
    
    // SQL de inserção
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
        ${projetosBrl}, ${projetosUsd}, ${caixa}, ${longevidade}, NOW(), 1
      )
    `;
    
    const result = executeSql(sql);
    if (result !== null) {
      insertedCount++;
      if (insertedCount % 50 === 0) {
        console.log(`  ✅ ${insertedCount} registros inseridos...`);
      }
    }
  }
  
  console.log(`✅ Lote ${batchNumber} concluído: ${insertedCount} registros`);
  return insertedCount;
}

// Função principal
async function main() {
  try {
    console.log('🚀 CARREGAMENTO COMPLETO - Todos os dados históricos');
    console.log('📍 Fonte: dados_mensais_ciklus.csv (852 registros)');
    
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
    
    // Ler CSV completo
    const csvPath = path.join(process.cwd(), 'dados_mensais_ciklus.csv');
    if (!fs.existsSync(csvPath)) {
      console.error('❌ CSV não encontrado');
      process.exit(1);
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const csvData = processCSVData(csvContent);
    
    console.log(`📊 Total de registros a processar: ${csvData.length}`);
    
    // Limpar dados existentes
    console.log('🧹 Limpando dados anteriores...');
    executeSql("DELETE FROM dados_mensais WHERE planejamento_id = 2");
    console.log('✅ Dados limpos');
    
    // Processar em lotes de 100 registros
    const batchSize = 100;
    let totalInserted = 0;
    
    for (let i = 0; i < csvData.length; i += batchSize) {
      const batch = csvData.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const inserted = await insertBatch(batch, batchNumber);
      totalInserted += inserted;
    }
    
    console.log('🎉 MIGRAÇÃO COMPLETA FINALIZADA!');
    console.log(`📊 Total inserido: ${totalInserted} registros`);
    console.log(`📈 Dados históricos completos disponíveis no sistema`);
    console.log(`🔍 Verifique na interface Ciklus`);
    
    // Verificar resultado final
    const finalCount = executeSql("SELECT COUNT(*) FROM dados_mensais WHERE planejamento_id = 2");
    console.log(`✅ Confirmação: ${finalCount} registros no banco de dados`);
    
  } catch (error) {
    console.error('❌ Erro durante migração completa:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}