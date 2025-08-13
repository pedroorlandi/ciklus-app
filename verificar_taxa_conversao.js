// Verificar conversão de taxa anual para mensal

console.log('🧮 VERIFICAÇÃO CONVERSÃO DE TAXA ANUAL → MENSAL\n');

// Taxas dos imóveis
const taxasAnuais = [3, 5]; // Studio 3%, Orlando 5%

taxasAnuais.forEach(taxaAnual => {
  const taxaDecimal = taxaAnual / 100;
  const taxaMensal = Math.pow(1 + taxaDecimal, 1/12) - 1;
  
  console.log(`📊 TAXA ${taxaAnual}% A.A.:`);
  console.log(`   Taxa anual: ${taxaAnual}%`);
  console.log(`   Taxa mensal equivalente: ${(taxaMensal * 100).toFixed(6)}%`);
  
  // Teste para 11 anos (Studio) e 10 anos (Orlando)
  const periodos = taxaAnual === 3 ? 132 : 120; // 11 anos = 132 meses, 10 anos = 120 meses
  const anos = periodos / 12;
  
  // Valor inicial R$ 350.000 (Studio) ou $250.000 (Orlando)
  const valorInicial = taxaAnual === 3 ? 350000 : 250000;
  
  // Cálculo com taxa anual
  const valorFinalAnual = valorInicial * Math.pow(1 + taxaDecimal, anos);
  
  // Cálculo com taxa mensal
  const valorFinalMensal = valorInicial * Math.pow(1 + taxaMensal, periodos);
  
  console.log(`\n   🔍 COMPARAÇÃO APÓS ${anos} ANOS (${periodos} meses):`);
  console.log(`     Valor inicial: ${taxaAnual === 3 ? 'R$' : '$'} ${valorInicial.toLocaleString('pt-BR')}`);
  console.log(`     Com taxa anual: ${taxaAnual === 3 ? 'R$' : '$'} ${valorFinalAnual.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
  console.log(`     Com taxa mensal: ${taxaAnual === 3 ? 'R$' : '$'} ${valorFinalMensal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
  console.log(`     Diferença: ${taxaAnual === 3 ? 'R$' : '$'} ${(valorFinalMensal - valorFinalAnual).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
  console.log(`     Variação: ${(((valorFinalMensal - valorFinalAnual) / valorFinalAnual) * 100).toFixed(4)}%`);
  console.log('');
});

// Teste matemático fundamental
console.log('🎯 TESTE MATEMÁTICO FUNDAMENTAL:');
const taxa4 = 0.04;
const taxaMensal4 = Math.pow(1 + taxa4, 1/12) - 1;

console.log(`Taxa 4% a.a. = ${(taxaMensal4 * 100).toFixed(6)}% a.m.`);

// Verificar se (1+tm)^12 = (1+ta)
const verificacao = Math.pow(1 + taxaMensal4, 12);
console.log(`Verificação: (1 + ${(taxaMensal4 * 100).toFixed(6)}%)^12 = ${verificacao.toFixed(6)}`);
console.log(`Deveria ser: 1.04000000 = ${(1 + taxa4).toFixed(6)}`);
console.log(`Diferença: ${Math.abs(verificacao - (1 + taxa4)).toFixed(10)}`);
