#!/usr/bin/env node

// MIGRAR DADOS PARA O PROJETO SUPABASE CORRETO
// ============================================

import { Pool } from 'pg';

console.log('🚀 MIGRAÇÃO PARA PROJETO SUPABASE CORRETO');
console.log('========================================');

// Conexão atual (onde estão os dados)
const ORIGEM_DB = process.env.DATABASE_URL;

// Projeto correto do Dashboard (vazio)
const DESTINO_DB = "postgresql://postgres:[YOUR-PASSWORD]@db.xjaoydofavoyuxosqaua.supabase.co:5432/postgres";

console.log('📊 SITUAÇÃO ATUAL:');
console.log('   ORIGEM (com dados): ep-sparkling-leaf-af0jhs8y (Neon)');
console.log('   DESTINO (vazio): xjaoydofavoyuxosqaua (Supabase Dashboard)');
console.log('');

if (!ORIGEM_DB) {
  console.error('❌ DATABASE_URL não encontrada');
  process.exit(1);
}

async function exportarDados() {
  try {
    console.log('📋 CONECTANDO NA ORIGEM...');
    const origemPool = new Pool({
      connectionString: ORIGEM_DB,
      ssl: { rejectUnauthorized: false }
    });

    // Testar conexão
    await origemPool.query('SELECT 1');
    console.log('✅ Conectado na origem (dados existem)');

    // Contar dados
    const tabelas = ['planejamentos', 'dados_mensais', 'membros_family'];
    
    console.log('📊 DADOS A MIGRAR:');
    for (const tabela of tabelas) {
      const result = await origemPool.query(`SELECT COUNT(*) as count FROM ${tabela}`);
      const count = parseInt(result.rows[0].count);
      console.log(`   ${tabela}: ${count} registros`);
    }

    console.log('');
    console.log('💡 PRÓXIMOS PASSOS:');
    console.log('1. Configure a senha do projeto correto no Supabase');
    console.log('2. Substitua [YOUR-PASSWORD] na connection string');
    console.log('3. Execute a migração para o projeto do Dashboard');
    console.log('');
    console.log('🎯 CONNECTION STRING DO PROJETO CORRETO:');
    console.log('postgresql://postgres:[SUA-SENHA]@db.xjaoydofavoyuxosqaua.supabase.co:5432/postgres');

    await origemPool.end();

  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
}

exportarDados();