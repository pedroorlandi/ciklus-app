#!/usr/bin/env node

// EXTRAIR INFORMAÇÕES DO SUPABASE PARA DASHBOARD
// ===============================================

console.log('🔍 EXTRAINDO INFORMAÇÕES DO SUPABASE');
console.log('====================================');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não encontrada');
  process.exit(1);
}

console.log('📋 Analisando DATABASE_URL...');
console.log('');

// Parse da URL
try {
  const url = new URL(DATABASE_URL);
  
  // Extrair informações
  const host = url.hostname;
  const database = url.pathname.replace('/', '');
  const username = url.username;
  
  console.log('📊 INFORMAÇÕES DO BANCO:');
  console.log(`   Host: ${host}`);
  console.log(`   Database: ${database}`);
  console.log(`   Username: ${username}`);
  console.log('');
  
  // Identificar o projeto Supabase
  if (host.includes('neon.tech')) {
    console.log('🎯 TIPO: Neon (Backend do Supabase)');
    
    // Extrair project ID do host (parte antes do primeiro ponto)
    const projectId = host.split('.')[0].replace('ep-', '');
    
    console.log('🌐 INFORMAÇÕES PARA SUPABASE DASHBOARD:');
    console.log('');
    console.log('📍 ONDE ENCONTRAR SEU PROJETO:');
    console.log('   1. Acesse: https://supabase.com/dashboard/projects');
    console.log('   2. Procure por um projeto com nome similar a "ciklus-app"');
    console.log('   3. Ou procure por um projeto na região: us-west-2');
    console.log('');
    
    console.log('🔑 IDENTIFICADORES DO SEU PROJETO:');
    console.log(`   Project Reference: ${projectId}`);
    console.log(`   Região: us-west-2 (Oregon)`);
    console.log(`   Database Name: ${database}`);
    console.log(`   Host Completo: ${host}`);
    console.log('');
    
    console.log('🔍 COMO VERIFICAR SE É O PROJETO CORRETO:');
    console.log('   1. No projeto do Supabase Dashboard');
    console.log('   2. Vá em: Settings → Database');
    console.log('   3. Na seção "Connection parameters":');
    console.log(`      - Host deve ser: ${host}`);
    console.log(`      - Database deve ser: ${database}`);
    console.log(`      - User deve ser: ${username}`);
    console.log('');
    
    console.log('💡 DICA IMPORTANTE:');
    console.log('   Se o Supabase Dashboard mostra tabelas vazias,');
    console.log('   você pode estar visualizando um projeto diferente.');
    console.log('   Confirme se os dados de conexão coincidem!');
    
  } else if (host.includes('supabase.co')) {
    console.log('🎯 TIPO: Supabase Direto');
    
    const projectRef = host.split('.')[0];
    console.log(`   Project Reference: ${projectRef}`);
    console.log(`   URL do Dashboard: https://supabase.com/dashboard/project/${projectRef}`);
    
  } else {
    console.log('⚠️ TIPO: Outro PostgreSQL');
    console.log('   Este não parece ser um banco Supabase padrão');
  }
  
} catch (error) {
  console.error('❌ Erro ao analisar DATABASE_URL:', error.message);
}

console.log('');
console.log('✅ ANÁLISE CONCLUÍDA');
console.log('===================');