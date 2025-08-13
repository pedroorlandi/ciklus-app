// Transferir dados diretamente para Supabase (tabelas já existem)
import { execSync } from 'child_process';

const SUPABASE_URL = 'https://xjaoydofavoyuxosqaua.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Buscar dados do PostgreSQL local
function fetchLocalData() {
  try {
    const result = execSync(`psql $DATABASE_URL -c "SELECT * FROM dados_mensais WHERE planejamento_id = 2 ORDER BY ano, mes" --csv`, { 
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
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
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
    console.error('Erro:', error.message);
    return [];
  }
}

// Inserir no Supabase
async function insertBatch(batch) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/dados_mensais`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(batch)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro Supabase (${response.status}):`, errorText);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Erro inserção:', error.message);
    return false;
  }
}

// Função principal
async function main() {
  console.log('🚀 TRANSFERÊNCIA DIRETA - PostgreSQL Local → Supabase');
  
  // Buscar dados locais
  const dados = fetchLocalData();
  if (dados.length === 0) {
    console.error('❌ Nenhum dado encontrado no PostgreSQL local');
    return;
  }
  
  console.log(`📊 ${dados.length} registros encontrados no PostgreSQL local`);
  
  // Primeiro, inserir o planejamento se não existir
  console.log('📋 Verificando planejamento...');
  const planejamentoData = [{
    id: 2,
    nome: "Eduardo e Mônica",
    descricao: "Planejamento financeiro familiar completo",
    user_id: "demo-user",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }];
  
  try {
    const planResp = await fetch(`${SUPABASE_URL}/rest/v1/planejamentos`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(planejamentoData)
    });
    
    if (planResp.ok) {
      console.log('✅ Planejamento criado no Supabase');
    } else {
      console.log('⚠️ Planejamento pode já existir');
    }
  } catch (error) {
    console.log('⚠️ Erro ao criar planejamento (pode já existir)');
  }
  
  // Transferir dados mensais em lotes
  const batchSize = 100;
  let transferidos = 0;
  
  for (let i = 0; i < dados.length; i += batchSize) {
    const batch = dados.slice(i, i + batchSize);
    const loteNum = Math.floor(i / batchSize) + 1;
    
    console.log(`📦 Transferindo lote ${loteNum} (${batch.length} registros)...`);
    
    const success = await insertBatch(batch);
    if (success) {
      transferidos += batch.length;
      console.log(`✅ Lote ${loteNum} transferido com sucesso`);
    } else {
      console.log(`❌ Falha no lote ${loteNum}`);
    }
    
    // Pausa entre lotes
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`\n🎉 TRANSFERÊNCIA COMPLETA!`);
  console.log(`📈 ${transferidos}/${dados.length} registros transferidos para Supabase`);
  
  // Verificar resultado
  try {
    const verifyResp = await fetch(`${SUPABASE_URL}/rest/v1/dados_mensais?select=count`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'count=exact'
      }
    });
    
    const countHeader = verifyResp.headers.get('content-range');
    console.log(`✅ Verificação: ${countHeader || 'N/A'} registros no Supabase`);
  } catch (error) {
    console.log('⚠️ Não foi possível verificar a contagem final');
  }
}

main();