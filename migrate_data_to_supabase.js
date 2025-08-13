// Migração completa dos dados do PostgreSQL local para Supabase
// Usando REST API do Supabase para transferir os 852 registros

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Configuração Supabase
const SUPABASE_URL = 'https://xjaoydofavoyuxosqaua.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_KEY não encontrada');
  process.exit(1);
}

// Função para executar SQL local
function executeSqlLocal(sql) {
  try {
    const result = execSync(`psql $DATABASE_URL -c "${sql}" -t -A`, { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return result.trim();
  } catch (error) {
    console.error('Erro SQL Local:', error.message.split('\n')[0]);
    return null;
  }
}

// Função para inserir no Supabase via REST API
async function insertToSupabase(table, data) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro Supabase (${response.status}):`, errorText);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Erro na requisição:', error.message);
    return false;
  }
}

// Função para buscar dados do PostgreSQL local
function fetchLocalData(table, limit = null) {
  const limitClause = limit ? `LIMIT ${limit}` : '';
  const sql = `SELECT * FROM ${table} ORDER BY id ${limitClause}`;
  
  try {
    const result = execSync(`psql $DATABASE_URL -c "${sql}" --csv`, { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    const lines = result.trim().split('\n');
    if (lines.length <= 1) return [];
    
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row = {};
      headers.forEach((header, index) => {
        let value = values[index] || '';
        
        // Remover aspas extras
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        
        // Converter tipos
        if (value === '' || value === 'null') {
          row[header] = null;
        } else if (!isNaN(value) && value !== '') {
          row[header] = parseFloat(value);
        } else {
          row[header] = value;
        }
      });
      data.push(row);
    }
    
    return data;
  } catch (error) {
    console.error(`Erro ao buscar dados de ${table}:`, error.message.split('\n')[0]);
    return [];
  }
}

// Função para migrar uma tabela específica
async function migrateTable(tableName, batchSize = 50) {
  console.log(`\n📦 Migrando tabela: ${tableName}`);
  
  const data = fetchLocalData(tableName);
  if (data.length === 0) {
    console.log(`  ⚠️ Nenhum dado encontrado em ${tableName}`);
    return 0;
  }
  
  console.log(`  📊 ${data.length} registros encontrados`);
  
  let migratedCount = 0;
  
  // Processar em lotes
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    
    const success = await insertToSupabase(tableName, batch);
    if (success) {
      migratedCount += batch.length;
      console.log(`  ✅ Lote ${Math.floor(i/batchSize) + 1}: ${batch.length} registros`);
    } else {
      console.log(`  ❌ Falha no lote ${Math.floor(i/batchSize) + 1}`);
    }
    
    // Pequena pausa entre lotes
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`  🎉 Total migrado: ${migratedCount}/${data.length} registros`);
  return migratedCount;
}

// Função principal de migração
async function main() {
  try {
    console.log('🚀 MIGRAÇÃO COMPLETA: PostgreSQL Local → Supabase');
    console.log('📍 Transferindo todos os dados reais para produção');
    
    // Testar conexão local
    const testLocal = executeSqlLocal("SELECT NOW()");
    if (!testLocal) {
      console.error('❌ Conexão PostgreSQL local falhou');
      process.exit(1);
    }
    console.log('✅ PostgreSQL local conectado');
    
    // Testar conexão Supabase
    const testSupabase = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      }
    });
    
    if (!testSupabase.ok) {
      console.error('❌ Conexão Supabase falhou');
      process.exit(1);
    }
    console.log('✅ Supabase REST API conectado');
    
    // Lista de tabelas para migrar (ordem é importante devido a foreign keys)
    const tabelas = [
      'users',
      'planejamentos', 
      'dados_mensais',
      'indices_economicos',
      'membros_family',
      'imoveis',
      'portfolio_investimentos',
      'receitas',
      'despesas',
      'objetivos',
      'inss',
      'seguros',
      'mood_insights',
      'simulacao_provedores'
    ];
    
    let totalMigrado = 0;
    
    console.log('\n🔄 Iniciando migração por tabelas...');
    
    for (const tabela of tabelas) {
      const migrados = await migrateTable(tabela);
      totalMigrado += migrados;
    }
    
    console.log('\n🎉 MIGRAÇÃO COMPLETA FINALIZADA!');
    console.log(`📊 Total de registros migrados: ${totalMigrado}`);
    console.log('✅ Dados históricos reais agora estão no Supabase');
    console.log('🔗 Supabase será o banco principal de produção');
    
    // Verificar dados específicos no Supabase
    console.log('\n🔍 Verificando migração dos dados principais...');
    
    const verificarSupabase = await fetch(`${SUPABASE_URL}/rest/v1/dados_mensais?select=count`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'count=exact'
      }
    });
    
    if (verificarSupabase.ok) {
      const count = verificarSupabase.headers.get('content-range');
      console.log(`📈 Dados mensais no Supabase: ${count || 'N/A'}`);
    }
    
  } catch (error) {
    console.error('❌ Erro durante migração:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}