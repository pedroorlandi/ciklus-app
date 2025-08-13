// Migração usando o servidor local para transferir dados para Supabase
// Bypass das limitações de rede usando o próprio Express server

import fs from 'fs';
import { execSync } from 'child_process';

// Função para executar SQL local
function executeSqlLocal(sql) {
  try {
    const result = execSync(`psql $DATABASE_URL -c "${sql}" -t -A`, { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return result.trim();
  } catch (error) {
    console.error('Erro SQL Local:', error.message.split('\n')[0]);
    return null;
  }
}

// Função para inserir via API local do servidor Express
async function insertViaLocalAPI(endpoint, data) {
  try {
    const response = await fetch(`http://localhost:5000${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Migration-Script/1.0'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro API (${response.status}):`, errorText.substring(0, 200));
      return false;
    }
    return true;
  } catch (error) {
    console.error('Erro na requisição:', error.message);
    return false;
  }
}

// Migrar dados mensais via API local
async function migrateDadosMensais() {
  console.log('\n📦 Migrando dados mensais via servidor local...');
  
  // Buscar todos os dados mensais
  const dados = [];
  try {
    const result = execSync(`psql $DATABASE_URL -c "SELECT * FROM dados_mensais WHERE planejamento_id = 2 ORDER BY ano, mes" --csv`, { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    const lines = result.trim().split('\n');
    if (lines.length <= 1) {
      console.log('  ⚠️ Nenhum dado encontrado');
      return 0;
    }
    
    const headers = lines[0].split(',');
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
      dados.push(row);
    }
    
    console.log(`  📊 ${dados.length} registros encontrados`);
    
    // Salvar dados em arquivo JSON para transfer via API
    fs.writeFileSync('dados_migracao.json', JSON.stringify(dados, null, 2));
    console.log('  💾 Dados exportados para dados_migracao.json');
    
    return dados.length;
  } catch (error) {
    console.error('Erro ao buscar dados mensais:', error.message);
    return 0;
  }
}

// Função principal
async function main() {
  try {
    console.log('🚀 MIGRAÇÃO VIA SERVIDOR LOCAL');
    console.log('📍 Preparando dados para Supabase via API Express');
    
    // Testar servidor local
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (!response.ok) {
        throw new Error('Servidor não responde');
      }
      console.log('✅ Servidor Express local conectado');
    } catch (error) {
      console.error('❌ Servidor Express não está rodando na porta 5000');
      process.exit(1);
    }
    
    // Testar PostgreSQL local
    const testLocal = executeSqlLocal("SELECT COUNT(*) FROM dados_mensais WHERE planejamento_id = 2");
    if (!testLocal) {
      console.error('❌ PostgreSQL local falhou');
      process.exit(1);
    }
    console.log(`✅ PostgreSQL local: ${testLocal} registros encontrados`);
    
    // Migrar dados mensais
    const dadosMigrados = await migrateDadosMensais();
    
    console.log('\n🎉 PREPARAÇÃO COMPLETA!');
    console.log(`📊 ${dadosMigrados} registros preparados para migração`);
    console.log('📂 Arquivo dados_migracao.json criado');
    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('1. Execute a migração SQL no Supabase (SUPABASE_MIGRATION.sql)');
    console.log('2. Configure o sistema para usar Supabase como primário');
    console.log('3. Importe os dados via interface Supabase ou API REST');
    
  } catch (error) {
    console.error('❌ Erro durante preparação:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}