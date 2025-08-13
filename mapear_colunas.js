// Mapear colunas compatíveis entre PostgreSQL local e Supabase
import { execSync } from 'child_process';

const SUPABASE_URL = 'https://xjaoydofavoyuxosqaua.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Campos que existem no Supabase (baseado no schema original)
const camposSupabase = [
  'planejamento_id', 'ano', 'mes', 'data',
  'despesas_basicas', 'despesas_dependentes', 'despesas_estilo', 
  'despesas_viagens', 'despesas_patrimoniais',
  'receita_ativa', 'receita_passiva', 'receita_patrimonio',
  'portfolio_inicial', 'portfolio_final', 'saving'
];

// Mapear dados compatíveis
function mapearDados(dadosOriginais) {
  return dadosOriginais.map(row => {
    const dadosMapeados = {};
    
    // Mapear campos compatíveis
    dadosMapeados.planejamento_id = 2;
    dadosMapeados.ano = parseInt(row.ano) || 2025;
    dadosMapeados.mes = parseInt(row.mes) || 1;
    dadosMapeados.data = `${row.ano}-${String(row.mes).padStart(2, '0')}-01`;
    
    // Despesas
    dadosMapeados.despesas_basicas = parseFloat(row.despesas_basicas) || 0;
    dadosMapeados.despesas_dependentes = parseFloat(row.despesas_dependentes) || 0;
    dadosMapeados.despesas_estilo = parseFloat(row.despesas_estilo) || 0;
    dadosMapeados.despesas_viagens = parseFloat(row.despesas_viagens) || 0;
    dadosMapeados.despesas_patrimoniais = parseFloat(row.despesas_patrimoniais) || 0;
    
    // Receitas
    dadosMapeados.receita_ativa = parseFloat(row.receita_ativa) || 0;
    dadosMapeados.receita_passiva = parseFloat(row.receita_passiva) || 0;
    dadosMapeados.receita_patrimonio = parseFloat(row.receita_patrimonio) || 0;
    
    // Portfolio
    dadosMapeados.portfolio_inicial = parseFloat(row.portfolio_inicial) || 0;
    dadosMapeados.portfolio_final = parseFloat(row.portfolio_final) || 0;
    dadosMapeados.saving = parseFloat(row.saving) || 0;
    
    return dadosMapeados;
  });
}

// Buscar dados locais
function fetchLocalData() {
  try {
    const result = execSync(`psql $DATABASE_URL -c "SELECT * FROM dados_mensais WHERE planejamento_id = 2 ORDER BY ano, mes" --csv`, { 
      encoding: 'utf-8'
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
        row[header] = value;
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
      console.error(`Erro (${response.status}):`, errorText.substring(0, 200));
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
  console.log('🔄 MAPEAMENTO E TRANSFERÊNCIA - Campos compatíveis');
  
  const dadosOriginais = fetchLocalData();
  if (dadosOriginais.length === 0) {
    console.error('❌ Nenhum dado encontrado');
    return;
  }
  
  console.log(`📊 ${dadosOriginais.length} registros originais encontrados`);
  
  const dadosMapeados = mapearDados(dadosOriginais);
  console.log(`🔀 ${dadosMapeados.length} registros mapeados para Supabase`);
  
  // Exemplo dos primeiros dados mapeados
  console.log('\n📋 Exemplo de mapeamento:');
  console.log(JSON.stringify(dadosMapeados[0], null, 2));
  
  // Transferir em lotes
  const batchSize = 50;
  let transferidos = 0;
  
  for (let i = 0; i < dadosMapeados.length; i += batchSize) {
    const batch = dadosMapeados.slice(i, i + batchSize);
    const loteNum = Math.floor(i / batchSize) + 1;
    
    console.log(`\n📦 Lote ${loteNum} (${batch.length} registros)...`);
    
    const success = await insertBatch(batch);
    if (success) {
      transferidos += batch.length;
      console.log(`✅ Lote ${loteNum} transferido`);
    } else {
      console.log(`❌ Falha no lote ${loteNum}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log(`\n🎉 CONCLUÍDO!`);
  console.log(`📈 ${transferidos}/${dadosMapeados.length} registros no Supabase`);
}

main();