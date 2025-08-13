// Transferir dados usando apenas campos básicos confirmados no Supabase
import { execSync } from 'child_process';

const SUPABASE_URL = 'https://xjaoydofavoyuxosqaua.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

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
    console.error('Erro buscar dados locais:', error.message);
    return [];
  }
}

// Mapear para campos básicos do Supabase
function mapearParaSupabase(dadosLocais) {
  return dadosLocais.map(row => {
    return {
      planejamento_id: 2,
      ano: parseInt(row.ano) || 2025,
      mes: parseInt(row.mes) || 1,
      data: `${row.ano}-${String(row.mes).padStart(2, '0')}-01`
    };
  });
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
      console.error(`Erro (${response.status}):`, errorText.substring(0, 300));
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
  console.log('🚀 TRANSFERÊNCIA BÁSICA - Campos Mínimos para Supabase');
  
  const dadosLocais = fetchLocalData();
  if (dadosLocais.length === 0) {
    console.error('❌ Nenhum dado local encontrado');
    return;
  }
  
  console.log(`📊 ${dadosLocais.length} registros locais encontrados`);
  
  const dadosBasicos = mapearParaSupabase(dadosLocais);
  console.log(`🔄 ${dadosBasicos.length} registros mapeados`);
  
  // Exemplo do mapeamento
  console.log('\n📋 Exemplo (primeiro registro):');
  console.log(JSON.stringify(dadosBasicos[0], null, 2));
  
  // Limpar tabela primeiro (se houver dados)
  console.log('\n🧹 Limpando dados antigos...');
  try {
    const deleteResp = await fetch(`${SUPABASE_URL}/rest/v1/dados_mensais?planejamento_id=eq.2`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      }
    });
    console.log('✅ Limpeza executada');
  } catch (error) {
    console.log('⚠️ Erro na limpeza:', error.message);
  }
  
  // Inserir em lotes pequenos
  const batchSize = 25; // Lotes menores para evitar timeouts
  let transferidos = 0;
  
  for (let i = 0; i < dadosBasicos.length; i += batchSize) {
    const batch = dadosBasicos.slice(i, i + batchSize);
    const loteNum = Math.floor(i / batchSize) + 1;
    const totalLotes = Math.ceil(dadosBasicos.length / batchSize);
    
    console.log(`\n📦 Lote ${loteNum}/${totalLotes} (${batch.length} registros)...`);
    
    const success = await insertBatch(batch);
    if (success) {
      transferidos += batch.length;
      console.log(`✅ ${transferidos}/${dadosBasicos.length} transferidos`);
    } else {
      console.log(`❌ Falha no lote ${loteNum}`);
      // Tentar inserir registro por registro do lote que falhou
      console.log('🔧 Tentando registro por registro...');
      for (const registro of batch) {
        const singleSuccess = await insertBatch([registro]);
        if (singleSuccess) {
          transferidos++;
          console.log(`✅ +1 (total: ${transferidos})`);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Pausa entre lotes
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n🎉 TRANSFERÊNCIA CONCLUÍDA!`);
  console.log(`📈 ${transferidos}/${dadosBasicos.length} registros transferidos`);
  
  // Verificação final
  console.log('\n🔍 Verificação final...');
  try {
    const verifyResp = await fetch(`${SUPABASE_URL}/rest/v1/dados_mensais?select=count&planejamento_id=eq.2`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'count=exact'
      }
    });
    
    const countData = await verifyResp.json();
    const totalSupabase = verifyResp.headers.get('content-range')?.split('/')[1] || 'N/A';
    console.log(`📊 Total no Supabase: ${totalSupabase} registros`);
    
    if (totalSupabase == dadosBasicos.length) {
      console.log('🎯 SUCESSO TOTAL - Todos os dados transferidos!');
    } else {
      console.log(`⚠️ Divergência: esperado ${dadosBasicos.length}, encontrado ${totalSupabase}`);
    }
  } catch (error) {
    console.log('⚠️ Erro na verificação:', error.message);
  }
}

main();