// Converter dados_migracao.json para CSV para importação no Supabase
import fs from 'fs';

function main() {
  console.log('🔄 Convertendo JSON para CSV...');
  
  // Ler arquivo JSON
  const dadosJson = JSON.parse(fs.readFileSync('dados_migracao.json', 'utf-8'));
  
  if (!dadosJson || dadosJson.length === 0) {
    console.error('❌ Nenhum dado encontrado no arquivo JSON');
    return;
  }
  
  console.log(`📊 ${dadosJson.length} registros encontrados`);
  
  // Obter headers das colunas
  const headers = Object.keys(dadosJson[0]);
  
  // Gerar CSV
  let csv = headers.join(',') + '\n';
  
  dadosJson.forEach(row => {
    const values = headers.map(header => {
      let value = row[header];
      
      // Tratar valores null/undefined
      if (value === null || value === undefined) {
        return '';
      }
      
      // Escapar aspas e vírgulas
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        value = '"' + value.replace(/"/g, '""') + '"';
      }
      
      return value;
    });
    
    csv += values.join(',') + '\n';
  });
  
  // Salvar arquivo CSV
  fs.writeFileSync('dados_mensais_para_supabase.csv', csv);
  
  console.log('✅ Arquivo CSV criado: dados_mensais_para_supabase.csv');
  console.log(`📈 ${dadosJson.length} registros prontos para importação no Supabase`);
  console.log('📋 Use este arquivo na interface "Import CSV" do Supabase');
}

main();