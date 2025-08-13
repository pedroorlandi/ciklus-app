import fs from 'fs';

function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(';').map(h => h.trim().replace(/"/g, '').replace(/﻿/g, ''));
  
  return lines.slice(1).map(line => {
    const values = line.split(';').map(v => v.trim().replace(/"/g, ''));
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  });
}

function calcularVPL(fluxos, taxaAnual) {
  const taxaMensal = Math.pow(1 + taxaAnual, 1/12) - 1;
  
  return fluxos.reduce((vpl, fluxo, index) => {
    const periodo = index + 1;
    return vpl + (fluxo / Math.pow(1 + taxaMensal, periodo));
  }, 0);
}

// Comparar VPLs
console.log('🔍 COMPARANDO VPLs DOS DADOS CIKLUS\n');

try {
  // Dados originais (Excel)
  const csvOriginal = fs.readFileSync('attached_assets/Dados_para_VPL_1753644768052.csv', 'utf8');
  const dadosOriginais = parseCSV(csvOriginal);
  const savingsOriginais = dadosOriginais.map(row => {
    const value = row['Saving'];
    if (!value) return 0;
    let cleanValue = value.toString().replace(/[R$\s]/g, '');
    if (cleanValue.includes(',')) {
      cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
    }
    return parseFloat(cleanValue) || 0;
  });

  // Dados CIKLUS atualizados
  const csvCiklus = fs.readFileSync('dados_mensais_ciklus.csv', 'utf8');
  const dadosCiklus = parseCSV(csvCiklus);
  const savingsCiklus = dadosCiklus.map(row => {
    return parseFloat(row['Saving'] || 0);
  });

  // Calcular VPLs
  const taxaAnual = 0.04;
  const vplOriginal = calcularVPL(savingsOriginais, taxaAnual);
  const vplCiklus = calcularVPL(savingsCiklus, taxaAnual);

  console.log('📊 RESULTADOS VPL:');
  console.log(`   Excel Original: R$ ${vplOriginal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
  console.log(`   Sistema CIKLUS: R$ ${vplCiklus.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
  console.log(`   Diferença: R$ ${(vplCiklus - vplOriginal).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
  console.log(`   Variação: ${(((vplCiklus - vplOriginal) / vplOriginal) * 100).toFixed(4)}%`);

  // Comparar vendas específicas
  console.log('\n🏠 VENDAS DE IMÓVEIS:');
  
  // Orlando jan/2035
  const orlandoOriginal = dadosOriginais.find(d => d.Periodo && d.Ano === '2035' && d.Mes === 'janeiro');
  const orlandoCiklus = dadosCiklus.find(d => d.Ano === '2035' && d.Mes === 'janeiro');
  
  if (orlandoOriginal && orlandoCiklus) {
    const vendaOriginal = parseFloat(orlandoOriginal['Total Vendas'].replace(/[R$\s\.]/g, '').replace(',', '.') || 0);
    const vendaCiklus = parseFloat(orlandoCiklus['Total Vendas'] || 0);
    
    console.log(`   Orlando (jan/2035):`);
    console.log(`     Excel: R$ ${vendaOriginal.toLocaleString('pt-BR')}`);
    console.log(`     CIKLUS: R$ ${vendaCiklus.toLocaleString('pt-BR')}`);
    console.log(`     Diferença: R$ ${(vendaCiklus - vendaOriginal).toLocaleString('pt-BR')}`);
  }
  
  // Studio jan/2036
  const studioOriginal = dadosOriginais.find(d => d.Periodo && d.Ano === '2036' && d.Mes === 'janeiro');
  const studioCiklus = dadosCiklus.find(d => d.Ano === '2036' && d.Mes === 'janeiro');
  
  if (studioOriginal && studioCiklus) {
    const vendaOriginal = parseFloat(studioOriginal['Total Vendas'].replace(/[R$\s\.]/g, '').replace(',', '.') || 0);
    const vendaCiklus = parseFloat(studioCiklus['Total Vendas'] || 0);
    
    console.log(`   Studio (jan/2036):`);
    console.log(`     Excel: R$ ${vendaOriginal.toLocaleString('pt-BR')}`);
    console.log(`     CIKLUS: R$ ${vendaCiklus.toLocaleString('pt-BR')}`);
    console.log(`     Diferença: R$ ${(vendaCiklus - vendaOriginal).toLocaleString('pt-BR')}`);
  }

} catch (error) {
  console.error('❌ Erro:', error.message);
}
