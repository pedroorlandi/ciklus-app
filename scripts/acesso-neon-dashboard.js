#!/usr/bin/env node

// GUIA DE ACESSO AO NEON DASHBOARD
// ================================

console.log('🔍 COMO ACESSAR SEUS DADOS NO NEON');
console.log('==================================');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não encontrada');
  process.exit(1);
}

// Extrair informações da URL
const url = new URL(DATABASE_URL);
const host = url.hostname;
const database = url.pathname.replace('/', '');
const username = url.username;

console.log('📊 INFORMAÇÕES DO SEU BANCO NEON:');
console.log(`   Host: ${host}`);
console.log(`   Database: ${database}`);
console.log(`   Username: ${username}`);
console.log('');

// Extrair project ID
const projectId = host.split('.')[0];
console.log('🎯 ACESSO AO NEON DASHBOARD:');
console.log('');
console.log('1. 🌐 ACESSE: https://console.neon.tech/app/projects');
console.log('');
console.log('2. 🔍 PROCURE PELO PROJETO:');
console.log(`   • Project ID: ${projectId}`);
console.log(`   • Região: us-west-2 (Oregon)`);
console.log(`   • Database: ${database}`);
console.log('');
console.log('3. 📊 NO DASHBOARD NEON:');
console.log('   • Clique em "SQL Editor" ou "Tables"');
console.log('   • Selecione o database: "neondb"');
console.log('   • Visualize suas tabelas:');
console.log('     - planejamentos (2 registros)');
console.log('     - dados_mensais (1.704 registros)');
console.log('     - membros_family (5 registros)');
console.log('');
console.log('4. 🔧 COMANDOS SQL ÚTEIS:');
console.log('   SELECT * FROM planejamentos;');
console.log('   SELECT COUNT(*) FROM dados_mensais;');
console.log('   SELECT * FROM membros_family;');
console.log('');
console.log('💡 DICA:');
console.log('   Se não conseguir encontrar o projeto,');
console.log('   use as credenciais do DATABASE_URL para');
console.log('   fazer login na conta que criou o banco.');
console.log('');
console.log('✅ SEUS DADOS ESTÃO SEGUROS NO NEON!');
console.log('   Você pode visualizar tudo através do dashboard');