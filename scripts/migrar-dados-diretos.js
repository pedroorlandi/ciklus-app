#!/usr/bin/env node

// CIKLUS APP - MIGRAÇÃO DIRETA DE DADOS PARA SUPABASE
// ===================================================

import { Pool } from 'pg';

console.log('🚀 MIGRAÇÃO DIRETA PARA SUPABASE');
console.log('Data:', new Date().toLocaleString('pt-BR'));
console.log('=================================');
console.log('');

// Configurações de conexão
const LOCAL_DB = process.env.DATABASE_URL_LOCAL || 'postgresql://neondb_owner:bAQ8kFIRRJlq@ep-super-darkness-a5fw6yw7-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require';
const SUPABASE_DB = process.env.DATABASE_URL;

if (!SUPABASE_DB) {
  console.error('❌ DATABASE_URL (Supabase) não configurada');
  process.exit(1);
}

// Conexões
const localPool = new Pool({ 
  connectionString: LOCAL_DB,
  ssl: { rejectUnauthorized: false }
});

const supabasePool = new Pool({
  connectionString: SUPABASE_DB,
  ssl: { rejectUnauthorized: false }
});

async function migrarTabela(nomeTabela, colunas) {
  try {
    console.log(`📋 Migrando tabela: ${nomeTabela}`);
    
    // Contar registros locais
    const resultLocal = await localPool.query(`SELECT COUNT(*) as count FROM ${nomeTabela}`);
    const countLocal = parseInt(resultLocal.rows[0].count);
    console.log(`   Local: ${countLocal} registros`);
    
    if (countLocal === 0) {
      console.log(`   ✅ ${nomeTabela}: Nenhum registro para migrar`);
      return;
    }
    
    // Exportar dados
    const dadosLocais = await localPool.query(`SELECT * FROM ${nomeTabela} ORDER BY id`);
    
    // Verificar se tabela existe no Supabase
    try {
      await supabasePool.query(`SELECT 1 FROM ${nomeTabela} LIMIT 1`);
      console.log(`   ✅ Tabela ${nomeTabela} existe no Supabase`);
    } catch (err) {
      console.log(`   ⚠️ Tabela ${nomeTabela} não existe no Supabase - será criada via schema`);
      return;
    }
    
    // Limpar tabela no Supabase (se houver dados)
    const resultSupabase = await supabasePool.query(`SELECT COUNT(*) as count FROM ${nomeTabela}`);
    const countSupabase = parseInt(resultSupabase.rows[0].count);
    
    if (countSupabase > 0) {
      console.log(`   🔄 Supabase tem ${countSupabase} registros - limpando para nova migração...`);
      await supabasePool.query(`DELETE FROM ${nomeTabela}`);
    }
    
    // Migrar dados
    let migrados = 0;
    for (const registro of dadosLocais.rows) {
      try {
        const campos = Object.keys(registro).join(', ');
        const valores = Object.keys(registro).map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO ${nomeTabela} (${campos}) VALUES (${valores})`;
        
        await supabasePool.query(query, Object.values(registro));
        migrados++;
        
        if (migrados % 100 === 0) {
          console.log(`   📊 Migrados: ${migrados}/${countLocal}`);
        }
      } catch (err) {
        console.log(`   ⚠️ Erro ao migrar registro ${registro.id}: ${err.message}`);
      }
    }
    
    console.log(`   ✅ ${nomeTabela}: ${migrados} registros migrados`);
    
  } catch (err) {
    console.error(`   ❌ Erro na migração de ${nomeTabela}:`, err.message);
  }
}

async function executarMigracao() {
  try {
    // Testar conexões
    console.log('🔗 Testando conexões...');
    await localPool.query('SELECT 1');
    console.log('   ✅ PostgreSQL local conectado');
    
    await supabasePool.query('SELECT 1');
    console.log('   ✅ Supabase conectado');
    console.log('');
    
    // Migrar tabelas principais (ordem importante para FKs)
    const tabelas = [
      'users',
      'planejamentos',
      'membros_family',
      'indices_economicos',
      'dados_mensais',
      'receitas',
      'despesas',
      'portfolio_investimentos',
      'objetivos',
      'imoveis',
      'inss',
      'seguros',
      'mood_insights',
      'simulacao_provedores'
    ];
    
    for (const tabela of tabelas) {
      await migrarTabela(tabela);
      console.log('');
    }
    
    // Verificação final
    console.log('🔍 VERIFICAÇÃO FINAL');
    console.log('===================');
    
    const tabelasImportantes = ['planejamentos', 'dados_mensais', 'membros_family'];
    
    for (const tabela of tabelasImportantes) {
      const resultLocal = await localPool.query(`SELECT COUNT(*) as count FROM ${tabela}`);
      const resultSupabase = await supabasePool.query(`SELECT COUNT(*) as count FROM ${tabela}`);
      
      const countLocal = parseInt(resultLocal.rows[0].count);
      const countSupabase = parseInt(resultSupabase.rows[0].count);
      
      console.log(`${tabela}:`);
      console.log(`   Local: ${countLocal} | Supabase: ${countSupabase} ${countLocal === countSupabase ? '✅' : '❌'}`);
    }
    
    console.log('');
    console.log('✅ MIGRAÇÃO CONCLUÍDA!');
    console.log('=====================');
    console.log('🎯 Próximo passo: Reiniciar servidor para usar Supabase');
    
  } catch (err) {
    console.error('❌ Erro na migração:', err.message);
    process.exit(1);
  } finally {
    await localPool.end();
    await supabasePool.end();
  }
}

// Executar migração
executarMigracao();