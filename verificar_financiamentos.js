// Script para verificar cálculos de financiamento

// Dados dos imóveis
const imoveis = {
  studio: {
    nome: "Studio",
    valorAquisicao: 600000,
    entrada: 200000,
    valorFinanciado: 400000,
    taxaJuros: 12, // anual
    prazoAnos: 15,
    sistema: "PRICE",
    dataInicio: "2024-01-01"
  },
  moradia: {
    nome: "Moradia", 
    valorAquisicao: 2000000,
    entrada: 600000,
    valorFinanciado: 1400000,
    taxaJuros: 10, // anual
    prazoAnos: 15,
    sistema: "SAC",
    dataInicio: "2025-01-01"
  },
  orlando: {
    nome: "Orlando",
    valorAquisicao: 250000,
    entrada: 50000,
    valorFinanciado: 200000,
    taxaJuros: 6, // anual
    prazoAnos: 15,
    sistema: "PRICE",
    dataInicio: "2026-01-01"
  }
};

function calcularPRICE(valorFinanciado, taxaJurosAnual, prazoMeses) {
  const taxaJurosMensal = taxaJurosAnual / 100 / 12;
  
  // Cálculo da parcela fixa (PMT)
  const parcelaFixa = valorFinanciado * 
    (taxaJurosMensal * Math.pow(1 + taxaJurosMensal, prazoMeses)) /
    (Math.pow(1 + taxaJurosMensal, prazoMeses) - 1);
  
  return parcelaFixa;
}

function calcularSAC(valorFinanciado, taxaJurosAnual, prazoMeses, numeroParcela) {
  const taxaJurosMensal = taxaJurosAnual / 100 / 12;
  const amortizacaoConstante = valorFinanciado / prazoMeses;
  const saldoDevedor = valorFinanciado - ((numeroParcela - 1) * amortizacaoConstante);
  const juros = saldoDevedor * taxaJurosMensal;
  const valorParcela = amortizacaoConstante + juros;
  
  return { valorParcela, amortizacao: amortizacaoConstante, juros, saldoDevedor };
}

console.log("=== VERIFICAÇÃO DE FINANCIAMENTOS ===\n");

// Studio (PRICE) - Primeira e segunda parcela
console.log("1. STUDIO (2024) - PRICE 12% a.a.");
console.log(`   Valor financiado: R$ ${imoveis.studio.valorFinanciado.toLocaleString()}`);
const parcelaStudio = calcularPRICE(imoveis.studio.valorFinanciado, imoveis.studio.taxaJuros, 180);
console.log(`   Parcela fixa: R$ ${parcelaStudio.toFixed(2)}`);
console.log(`   → financiamento1 (coluna Studio)\n`);

// Moradia (SAC) - Primeira e segunda parcela  
console.log("2. MORADIA (2025) - SAC 10% a.a.");
console.log(`   Valor financiado: R$ ${imoveis.moradia.valorFinanciado.toLocaleString()}`);
const moradia1 = calcularSAC(imoveis.moradia.valorFinanciado, imoveis.moradia.taxaJuros, 180, 1);
const moradia2 = calcularSAC(imoveis.moradia.valorFinanciado, imoveis.moradia.taxaJuros, 180, 2);
console.log(`   1ª parcela: R$ ${moradia1.valorParcela.toFixed(2)} (amort: R$ ${moradia1.amortizacao.toFixed(2)} + juros: R$ ${moradia1.juros.toFixed(2)})`);
console.log(`   2ª parcela: R$ ${moradia2.valorParcela.toFixed(2)} (amort: R$ ${moradia2.amortizacao.toFixed(2)} + juros: R$ ${moradia2.juros.toFixed(2)})`);
console.log(`   → financiamento2 (coluna Moradia)\n`);

// Orlando (PRICE) - Primeira e segunda parcela
console.log("3. ORLANDO (2026) - PRICE 6% a.a.");
console.log(`   Valor financiado: USD$ ${imoveis.orlando.valorFinanciado.toLocaleString()}`);
const parcelaOrlando = calcularPRICE(imoveis.orlando.valorFinanciado, imoveis.orlando.taxaJuros, 180);
console.log(`   Parcela fixa: USD$ ${parcelaOrlando.toFixed(2)}`);
console.log(`   → financiamento3 (coluna Orlando)\n`);

console.log("=== CORRESPONDÊNCIA ESPERADA (APÓS CORREÇÃO) ===");
console.log("financiamento1 = Studio (R$ 4.800,67) - 2024 em diante");
console.log("financiamento2 = Moradia (1ª: R$ 19.444,44, 2ª: R$ 19.379,63) - 2025 em diante");  
console.log("financiamento3 = Orlando (USD$ 1.687,71 → R$ 9.187,62) - 2026 em diante");

console.log("\n=== DETALHES DOS CÁLCULOS ===");
console.log("STUDIO (PRICE):");
console.log("- Valor Aquisição: R$ 600.000");
console.log("- Entrada: R$ 200.000");
console.log("- Valor Financiado: R$ 400.000");
console.log("- Taxa: 12% a.a. = 1% a.m.");
console.log("- Prazo: 180 meses");
console.log("- Parcela fixa PRICE: R$ 4.800,67");

console.log("\nMORADIA (SAC):");
console.log("- Valor Aquisição: R$ 2.000.000");
console.log("- Entrada: R$ 600.000");
console.log("- Valor Financiado: R$ 1.400.000");
console.log("- Taxa: 10% a.a. = 0,833% a.m.");
console.log("- Prazo: 180 meses");
console.log("- Amortização constante: R$ 7.777,78");
console.log("- 1ª parcela = R$ 7.777,78 + R$ 11.666,67 = R$ 19.444,44");
console.log("- 2ª parcela = R$ 7.777,78 + R$ 11.601,85 = R$ 19.379,63");

console.log("\nORLANDO (PRICE):");
console.log("- Valor Aquisição: USD$ 250.000");
console.log("- Entrada: USD$ 50.000");
console.log("- Valor Financiado: USD$ 200.000");
console.log("- Taxa: 6% a.a. = 0,5% a.m.");
console.log("- Prazo: 180 meses");
console.log("- Parcela fixa PRICE: USD$ 1.687,71");
console.log("- Convertido para BRL (USD 5,45): R$ 9.187,62");