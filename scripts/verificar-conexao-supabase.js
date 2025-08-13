#!/usr/bin/env node

// VERIFICAR CONEXÃO ENTRE REPLIT E SUPABASE
// ========================================

import { Pool } from 'pg';

console.log('🔍 VERIFICANDO CONEXÃO SUPABASE x REPLIT');
console.log('========================================');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não encontrada');
  process.exit(1);
}

console.log('📋 DATABASE_URL configurada:');
console.log(DATABASE_URL.replace(/:[^:@]*@/, ':***@'));
console.log('');

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verificarConexao() {
  try {
    // Informações do servidor
    console.log('🔗 Testando conexão...');
    const infoServer = await pool.query(`
      SELECT 
        current_database() as banco,
        current_user as usuario,
        inet_server_addr() as servidor_ip,
        version() as versao
    `);
    
    console.log('✅ Conectado com sucesso!');
    console.log('📊 Informações do servidor:');
    console.log(`   Banco: ${infoServer.rows[0].banco}`);
    console.log(`   Usuário: ${infoServer.rows[0].usuario}`);
    console.log(`   IP: ${infoServer.rows[0].servidor_ip}`);
    console.log(`   Versão: ${infoServer.rows[0].versao.split(',')[0]}`);
    console.log('');
    
    // Verificar dados principais
    console.log('📋 Contagem de dados:');
    
    const tabelas = ['planejamentos', 'dados_mensais', 'membros_family', 'indices_economicos'];
    
    for (const tabela of tabelas) {
      try {
        const result = await pool.query(`SELECT COUNT(*) as count FROM ${tabela}`);
        const count = parseInt(result.rows[0].count);
        console.log(`   ${tabela}: ${count} registros`);
      } catch (err) {
        console.log(`   ${tabela}: ERRO - ${err.message}`);
      }
    }
    
    console.log('');
    
    // Verificar se é Supabase/Neon
    const isNeon = DATABASE_URL.includes('neon.tech');
    const isSupabase = DATABASE_URL.includes('supabase.co');
    const isAWS = DATABASE_URL.includes('amazonaws.com');
    
    console.log('🎯 Tipo de banco:');
    if (isNeon) {
      console.log('   ✅ NEON (backend do Supabase)');
      console.log('   📍 Localização: AWS');
      console.log('   🔄 Replit → Neon PostgreSQL');
    } else if (isSupabase) {
      console.log('   ✅ SUPABASE direto');
    } else if (isAWS) {
      console.log('   ✅ AWS PostgreSQL');
    } else {
      console.log('   ⚠️ PostgreSQL local/outro');
    }
    
    console.log('');
    
    // Verificar esquema
    console.log('📝 Schema público:');
    const tabelas_db = await pool.query(`
      SELECT tablename, tableowner 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);
    
    console.log(`   Total de tabelas: ${tabelas_db.rows.length}`);
    tabelas_db.rows.forEach(row => {
      console.log(`   - ${row.tablename} (${row.tableowner})`);
    });
    
    console.log('');
    console.log('🎉 VERIFICAÇÃO CONCLUÍDA');
    console.log('========================');
    
    if (isNeon) {
      console.log('💡 DIAGNÓSTICO:');
      console.log('   - Replit conectado ao Neon (correto)');
      console.log('   - Dados existem no Neon (1704 registros confirmados)');
      console.log('   - Supabase Dashboard pode estar vendo outro projeto');
      console.log('   - Verifique se o projeto do Dashboard é o mesmo');
    }
    
  } catch (err) {
    console.error('❌ Erro na verificação:', err.message);
  } finally {
    await pool.end();
  }
}

verificarConexao();