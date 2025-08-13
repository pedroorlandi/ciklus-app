import fs from 'fs';
import { execSync } from 'child_process';

// Parse CSV com formatação brasileira
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

// VPL Excel-compatible: primeira parcela em t=1, não t=0
function vplExcel(cashFlows, rate) {
  return cashFlows.reduce((vpl, cashFlow, index) => {
    // Excel: primeiro fluxo em período 1, não 0
    const period = index + 1;
    return vpl + (cashFlow / Math.pow(1 + rate, period));
  }, 0);
}

// Nossa implementação atual
function vplNosso(cashFlows, annualRate) {
  const monthlyRate = Math.pow(1 + annualRate, 1/12) - 1;
  return cashFlows.reduce((vpl, cashFlow, index) => {
    const discountFactor = Math.pow(1 + monthlyRate, index + 1);
    return vpl + (cashFlow / discountFactor);
  }, 0);
}

// Análise comparativa
async function analisarVPL() {
  try {
    console.log('🔍 ANÁLISE COMPARATIVA VPL - EXCEL vs SISTEMA\n');
    
    // Carregar dados
    const csvContent = fs.readFileSync('attached_assets/Dados_para_VPL_1753644768052.csv', 'utf8');
    const excelData = parseCSV(csvContent);
    
    const excelSavings = excelData.map(row => {
      const value = row['Saving'];
      if (!value) return 0;
      let cleanValue = value.toString().replace(/[R$\s]/g, '');
      if (cleanValue.includes(',')) {
        cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
      }
      return parseFloat(cleanValue) || 0;
    });
    
    const taxaAnual = 0.04;
    const taxaMensal = Math.pow(1 + taxaAnual, 1/12) - 1;
    
    console.log(`Taxa anual: ${(taxaAnual * 100).toFixed(4)}%`);
    console.log(`Taxa mensal equivalente: ${(taxaMensal * 100).toFixed(6)}%`);
    console.log(`Períodos: ${excelSavings.length}\n`);
    
    // Comparar diferentes implementações VPL
    console.log('💹 COMPARAÇÃO DE IMPLEMENTAÇÕES VPL:');
    
    // 1. VPL Excel com taxa mensal
    const vplExcelMensal = vplExcel(excelSavings, taxaMensal);
    console.log(`VPL Excel (taxa mensal): R$ ${vplExcelMensal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    
    // 2. Nossa implementação atual
    const vplNossoAtual = vplNosso(excelSavings, taxaAnual);
    console.log(`VPL Nossa implementação: R$ ${vplNossoAtual.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    
    // 3. VPL com taxa anual dividida por 12 (erro comum)
    const taxaSimples = taxaAnual / 12;
    const vplSimples = vplExcel(excelSavings, taxaSimples);
    console.log(`VPL Taxa simples (4%/12): R$ ${vplSimples.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    
    // 4. Diferenças
    console.log('\n🔍 DIFERENÇAS:');
    console.log(`Excel vs Nossa: R$ ${(vplExcelMensal - vplNossoAtual).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log(`Excel vs Simples: R$ ${(vplExcelMensal - vplSimples).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    
    // 5. Teste com VPL Excel exato (sem conversão mensal)
    console.log('\n🎯 TESTE VPL EXCEL DIRETO:');
    
    // Simulação: se Excel usa taxa anual diretamente em base mensal
    const vplExcelDireto = excelSavings.reduce((vpl, cashFlow, index) => {
      // Período em anos (mês/12)
      const periodoAnos = (index + 1) / 12;
      return vpl + (cashFlow / Math.pow(1 + taxaAnual, periodoAnos));
    }, 0);
    
    console.log(`VPL Excel direto (períodos em anos): R$ ${vplExcelDireto.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log(`Diferença com Excel: R$ ${(385220.95 - vplExcelDireto).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

analisarVPL();
