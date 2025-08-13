// Transferir dados com schema correto baseado no erro do Supabase
import { execSync } from 'child_process';

const SUPABASE_URL = 'https://xjaoydofavoyuxosqaua.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Buscar dados locais
function fetchLocalData() {
  try {
    const result = execSync(`psql $DATABASE_URL -c "SELECT * FROM dados_mensais WHERE planejamento_id = 2 ORDER BY ano, mes LIMIT 5" --csv`, { 
      encoding: 'utf-8'
    });
    
    const lines = result.trim().split('\n');
    if (lines.length <= 1) return [];
    
    const headers = lines[0].split(',');
    const data = [];
    
    console.log('📋 Colunas PostgreSQL local:', headers.join(', '));
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row = {};
      headers.forEach((header, index) => {
        let value = values[index] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        row[header] = value;
      });
      data.push(row);
    }
    
    return { dados: data, headers };
  } catch (error) {
    console.error('Erro buscar dados:', error.message);
    return { dados: [], headers: [] };
  }
}

// Criar dados compatíveis com Supabase baseado no erro
function criarDadosSupabase(dadosLocais) {
  return dadosLocais.map(row => {
    // Baseado no erro: necessita tipo, valor_brl, moeda_brl, valor_usd, moeda_usd
    return {
      planejamento_id: 2,
      ano: parseInt(row.ano) || 2025,
      mes: parseInt(row.mes) || 1,
      data: `${row.ano}-${String(row.mes).padStart(2, '0')}-01`,
      tipo: 'projecao', // Campo obrigatório
      descricao: `Dados ${row.ano}/${row.mes}`,
      categoria: 'mensal',
      valor_brl: parseFloat(row.saving) || 0.00,
      moeda_brl: 'BRL',
      valor_usd: 0.00,
      moeda_usd: 'BRL',
      observacoes: null
    };
  });
}

// Inserir no Supabase
async function insertSingle(registro) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/dados_mensais`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(registro)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro:`, errorText.substring(0, 200));
      return false;
    }
    return true;
  } catch (error) {
    console.error('❌ Erro inserção:', error.message);
    return false;
  }
}

// Função principal
async function main() {
  console.log('🔍 DIAGNÓSTICO - Schema PostgreSQL vs Supabase');
  
  const { dados, headers } = fetchLocalData();
  if (dados.length === 0) {
    console.error('❌ Nenhum dado encontrado');
    return;
  }
  
  console.log(`\n📊 ${dados.length} registros de exemplo obtidos`);
  console.log('📋 Exemplo dados locais (primeiro registro):');
  console.log(JSON.stringify(dados[0], null, 2));
  
  const dadosSupabase = criarDadosSupabase(dados);
  console.log('\n🔄 Dados mapeados para Supabase (primeiro registro):');
  console.log(JSON.stringify(dadosSupabase[0], null, 2));
  
  // Testar inserção com um único registro
  console.log('\n🧪 TESTE - Inserir primeiro registro...');
  const testeOk = await insertSingle(dadosSupabase[0]);
  
  if (testeOk) {
    console.log('✅ SUCESSO! Schema correto identificado');
    console.log('🎯 Pronto para transferir todos os 852 registros');
    
    // Contar registros atuais no Supabase
    try {
      const countResp = await fetch(`${SUPABASE_URL}/rest/v1/dados_mensais?select=count&planejamento_id=eq.2`, {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Prefer': 'count=exact'
        }
      });
      
      const totalSupabase = countResp.headers.get('content-range')?.split('/')[1] || '0';
      console.log(`📊 Total atual no Supabase: ${totalSupabase} registros`);
    } catch (error) {
      console.log('⚠️ Erro verificar contagem');
    }
    
  } else {
    console.log('❌ Ainda há incompatibilidade no schema');
    console.log('🔧 Revisar campos obrigatórios do Supabase');
  }
}

main();