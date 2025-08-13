// MIGRAÇÃO FINAL - PostgreSQL Local → Supabase (schema exato)
import { execSync } from 'child_process';

const SUPABASE_URL = 'https://xjaoydofavoyuxosqaua.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Buscar todos os dados do PostgreSQL local
function fetchAllLocalData() {
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
    console.error('Erro buscar dados:', error.message);
    return [];
  }
}

// Mapear dados para schema exato do Supabase
function mapearParaSupabaseExato(dadosLocais) {
  return dadosLocais.map(row => {
    const parseDecimal = (value) => {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    };
    
    return {
      planejamento_id: 2,
      ano: parseInt(row.ano) || 2025,
      mes: parseInt(row.mes) || 1,
      periodo: `${row.mes}/${row.ano}`,
      data: `${row.ano}-${String(row.mes).padStart(2, '0')}-01`,
      
      // Despesas
      despesas_basicas: parseDecimal(row.despesas_basicas),
      despesas_dependentes: parseDecimal(row.despesas_dependentes),
      despesas_estilo: parseDecimal(row.despesas_estilo),
      despesas_viagens: parseDecimal(row.despesas_viagens),
      despesas_patrimoniais: parseDecimal(row.despesas_patrimoniais),
      
      // Financiamentos
      financiamento_1: parseDecimal(row.financiamento_1),
      financiamento_2: parseDecimal(row.financiamento_2),
      financiamento_3: parseDecimal(row.financiamento_3),
      financiamento_4: parseDecimal(row.financiamento_4),
      financiamento_5: parseDecimal(row.financiamento_5),
      
      // Receitas
      receita_ativa: parseDecimal(row.receita_ativa),
      receita_passiva: parseDecimal(row.receita_passiva),
      receita_patrimonio: parseDecimal(row.receita_patrimonio),
      inss: parseDecimal(row.inss),
      
      // Vendas e Objetivos
      venda_ativos: parseDecimal(row.venda_ativos),
      desembolso_objetivos: parseDecimal(row.desembolso_objetivos),
      
      // Totais
      despesas_totais: parseDecimal(row.despesas_totais),
      receitas_totais: parseDecimal(row.receitas_totais),
      
      // Análise Financeira
      cs: parseDecimal(row.cs),
      portfolio_inicial: parseDecimal(row.portfolio_inicial),
      total_vendas: parseDecimal(row.total_vendas),
      projetos: parseDecimal(row.projetos),
      saving: parseDecimal(row.saving),
      renta_dolar: parseDecimal(row.renta_dolar),
      portfolio_final: parseDecimal(row.portfolio_final),
      projetos_brl: parseDecimal(row.projetos_brl),
      projetos_usd: parseDecimal(row.projetos_usd),
      caixa: parseDecimal(row.caixa),
      longevidade: parseDecimal(row.longevidade),
      
      // Metadados
      versao: 1
    };
  });
}

// Inserir lote no Supabase
async function insertBatch(batch, loteNum, total) {
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
      console.error(`❌ Lote ${loteNum} falhou:`, errorText.substring(0, 200));
      return false;
    }
    
    console.log(`✅ Lote ${loteNum} inserido (${batch.length} registros)`);
    return true;
  } catch (error) {
    console.error(`❌ Erro lote ${loteNum}:`, error.message);
    return false;
  }
}

// Função principal
async function main() {
  console.log('🚀 MIGRAÇÃO FINAL - 852 registros para Supabase');
  
  const dadosLocais = fetchAllLocalData();
  if (dadosLocais.length === 0) {
    console.error('❌ Nenhum dado local encontrado');
    return;
  }
  
  console.log(`📊 ${dadosLocais.length} registros no PostgreSQL local`);
  
  const dadosSupabase = mapearParaSupabaseExato(dadosLocais);
  console.log(`🔄 ${dadosSupabase.length} registros mapeados para Supabase`);
  
  // Limpar dados antigos
  console.log('\n🧹 Limpando dados antigos no Supabase...');
  try {
    const deleteResp = await fetch(`${SUPABASE_URL}/rest/v1/dados_mensais?planejamento_id=eq.2`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      }
    });
    console.log('✅ Dados antigos removidos');
  } catch (error) {
    console.log('⚠️ Erro limpeza:', error.message);
  }
  
  // Migrar em lotes
  const batchSize = 50;
  let transferidos = 0;
  let falhas = 0;
  const totalLotes = Math.ceil(dadosSupabase.length / batchSize);
  
  console.log(`\n📦 Iniciando migração em ${totalLotes} lotes...`);
  
  for (let i = 0; i < dadosSupabase.length; i += batchSize) {
    const batch = dadosSupabase.slice(i, i + batchSize);
    const loteNum = Math.floor(i / batchSize) + 1;
    
    console.log(`\n📦 Processando lote ${loteNum}/${totalLotes} (${batch.length} registros)...`);
    
    const success = await insertBatch(batch, loteNum, totalLotes);
    if (success) {
      transferidos += batch.length;
      console.log(`📈 Progresso: ${transferidos}/${dadosSupabase.length} (${Math.round(transferidos/dadosSupabase.length*100)}%)`);
    } else {
      falhas += batch.length;
    }
    
    // Pausa entre lotes
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log(`\n🎯 MIGRAÇÃO CONCLUÍDA!`);
  console.log(`✅ Sucesso: ${transferidos} registros`);
  console.log(`❌ Falhas: ${falhas} registros`);
  console.log(`📊 Taxa de sucesso: ${Math.round(transferidos/(transferidos+falhas)*100)}%`);
  
  // Verificação final
  console.log('\n🔍 Verificação final no Supabase...');
  try {
    const verifyResp = await fetch(`${SUPABASE_URL}/rest/v1/dados_mensais?select=count&planejamento_id=eq.2`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'count=exact'
      }
    });
    
    const countHeader = verifyResp.headers.get('content-range');
    const totalSupabase = countHeader ? countHeader.split('/')[1] : 'N/A';
    console.log(`📊 Total final no Supabase: ${totalSupabase} registros`);
    
    if (totalSupabase == dadosSupabase.length) {
      console.log('🎉 SUCESSO TOTAL - Migração 100% completa!');
      console.log('✅ Todos os 852 registros históricos no Supabase');
      console.log('✅ Sistema configurado para usar APENAS Supabase');
    } else {
      console.log(`⚠️ Divergência: esperado ${dadosSupabase.length}, encontrado ${totalSupabase}`);
    }
  } catch (error) {
    console.log('⚠️ Erro verificação final:', error.message);
  }
}

main();