// Recálculo correto da parcela do Studio

const dados = {
  valorAquisicao: 600000,
  entrada: 200000,
  valorFinanciado: 400000, // 600k - 200k
  taxaJurosAnual: 11.39, // 11,39% a.a. (corrigida)
  prazoAnos: 15 // 180 meses
};

console.log("=== RECÁLCULO STUDIO ===");
console.log(`Valor de Aquisição: R$ ${dados.valorAquisicao.toLocaleString()}`);
console.log(`Entrada: R$ ${dados.entrada.toLocaleString()}`);
console.log(`Valor Financiado: R$ ${dados.valorFinanciado.toLocaleString()}`);
console.log(`Taxa de Juros: ${dados.taxaJurosAnual}% a.a.`);
console.log(`Prazo: ${dados.prazoAnos} anos (${dados.prazoAnos * 12} meses)`);

// Taxa mensal
const taxaMensal = dados.taxaJurosAnual / 100 / 12;
console.log(`Taxa Mensal: ${(taxaMensal * 100).toFixed(6)}%`);

// Fórmula PRICE: PMT = PV × [i × (1+i)^n] / [(1+i)^n - 1]
const n = dados.prazoAnos * 12; // 180 meses
const PV = dados.valorFinanciado; // 400.000
const i = taxaMensal; // 0.01

const fator1 = i * Math.pow(1 + i, n);
const fator2 = Math.pow(1 + i, n) - 1;
const PMT = PV * (fator1 / fator2);

console.log(`\nCálculo PRICE:`);
console.log(`n = ${n} meses`);
console.log(`i = ${i} (${(i*100).toFixed(6)}%)`);
console.log(`(1+i)^n = ${Math.pow(1 + i, n).toFixed(6)}`);
console.log(`Fator 1: ${fator1.toFixed(6)}`);
console.log(`Fator 2: ${fator2.toFixed(6)}`);
console.log(`PMT = ${PV} × ${(fator1/fator2).toFixed(8)}`);
console.log(`PMT = R$ ${PMT.toFixed(2)}`);

// Verificar se o valor esperado pelo usuário está correto
const valorEsperado = 4643.94;
console.log(`\nValor esperado pelo usuário: R$ ${valorEsperado}`);
console.log(`Diferença: R$ ${(PMT - valorEsperado).toFixed(2)}`);

// Tentar descobrir qual seria a taxa para obter R$ 4.643,94
function encontrarTaxa(pmt, pv, n) {
  // Aproximação iterativa
  let taxa = 0.005; // começar com 0.5% a.m.
  let incremento = 0.001;
  let tentativas = 0;
  
  while (tentativas < 1000) {
    const fator1 = taxa * Math.pow(1 + taxa, n);
    const fator2 = Math.pow(1 + taxa, n) - 1;
    const pmtCalculado = pv * (fator1 / fator2);
    
    if (Math.abs(pmtCalculado - pmt) < 0.01) {
      return taxa;
    }
    
    if (pmtCalculado > pmt) {
      taxa -= incremento;
      incremento /= 2;
    } else {
      taxa += incremento;
    }
    
    tentativas++;
  }
  
  return taxa;
}

const taxaCorreta = encontrarTaxa(valorEsperado, dados.valorFinanciado, n);
console.log(`\nPara obter R$ ${valorEsperado}:`);
console.log(`Taxa mensal necessária: ${(taxaCorreta * 100).toFixed(6)}%`);
console.log(`Taxa anual equivalente: ${(taxaCorreta * 12 * 100).toFixed(4)}%`);