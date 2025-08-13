// Cálculo detalhado do Orlando na venda (janeiro/2035)

console.log('🏠 CÁLCULO DETALHADO - ORLANDO (Janeiro/2035)\n');

// Dados do imóvel Orlando
const valorInicial = 250000; // USD
const taxaValorizacao = 0.01; // 1% a.a. (dados mostram 1, que seria 1%)
const dataInicio = new Date('2026-01-01');
const dataVenda = new Date('2035-01-01');
const valorFinanciado = 200000; // USD (250k - 50k entrada)
const taxaJuros = 0.06; // 6% a.a.
const prazoAnos = 15;
const taxaDolar = 5.5426; // R$/USD

// Calcular período de valorização
const anoInicio = dataInicio.getFullYear();
const anoVenda = dataVenda.getFullYear();
const anosValorizacao = anoVenda - anoInicio; // 2035 - 2026 = 9 anos
const mesesValorizacao = anosValorizacao * 12; // 108 meses

console.log('📊 DADOS BASE:');
console.log(`   Valor inicial: $${valorInicial.toLocaleString('pt-BR')}`);
console.log(`   Taxa valorização: ${taxaValorizacao * 100}% a.a.`);
console.log(`   Período: ${anosValorizacao} anos (${mesesValorizacao} meses)`);
console.log(`   Financiamento: $${valorFinanciado.toLocaleString('pt-BR')}`);
console.log(`   Taxa juros: ${taxaJuros * 100}% a.a.`);
console.log(`   Prazo: ${prazoAnos} anos`);

// 1. VALOR PATRIMONIAL NA VENDA
const taxaMensalValorizacao = Math.pow(1 + taxaValorizacao, 1/12) - 1;
const valorPatrimonialVenda = valorInicial * Math.pow(1 + taxaMensalValorizacao, mesesValorizacao);

console.log('\n💰 VALOR PATRIMONIAL NA VENDA:');
console.log(`   Taxa mensal equiv.: ${(taxaMensalValorizacao * 100).toFixed(6)}%`);
console.log(`   Valor após ${anosValorizacao} anos: $${valorPatrimonialVenda.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
console.log(`   Em reais: R$ ${(valorPatrimonialVenda * taxaDolar).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);

// 2. SALDO DEVEDOR DO FINANCIAMENTO
const taxaMensalJuros = Math.pow(1 + taxaJuros, 1/12) - 1;
const totalPagamentos = prazoAnos * 12; // 180 meses
const pagamentosMesesDecorridos = mesesValorizacao; // 108 meses até venda

// Prestação PRICE
const prestacao = valorFinanciado * (taxaMensalJuros * Math.pow(1 + taxaMensalJuros, totalPagamentos)) / 
                 (Math.pow(1 + taxaMensalJuros, totalPagamentos) - 1);

// Saldo devedor após pagamentos decorridos
const saldoDevedor = valorFinanciado * Math.pow(1 + taxaMensalJuros, pagamentosMesesDecorridos) - 
                    prestacao * ((Math.pow(1 + taxaMensalJuros, pagamentosMesesDecorridos) - 1) / taxaMensalJuros);

console.log('\n🏦 FINANCIAMENTO (PRICE):');
console.log(`   Taxa mensal equiv.: ${(taxaMensalJuros * 100).toFixed(6)}%`);
console.log(`   Prestação mensal: $${prestacao.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
console.log(`   Pagamentos feitos: ${pagamentosMesesDecorridos} de ${totalPagamentos} meses`);
console.log(`   Saldo devedor: $${saldoDevedor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
console.log(`   Em reais: R$ ${(saldoDevedor * taxaDolar).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);

// 3. VALOR LÍQUIDO DA VENDA
const valorLiquidoVenda = valorPatrimonialVenda - saldoDevedor;

console.log('\n💵 VALOR LÍQUIDO DA VENDA:');
console.log(`   Valor patrimonial: $${valorPatrimonialVenda.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
console.log(`   (-) Saldo devedor: $${saldoDevedor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
console.log(`   (=) Valor líquido: $${valorLiquidoVenda.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
console.log(`   Em reais: R$ ${(valorLiquidoVenda * taxaDolar).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);

// 4. COMPARAÇÃO COM SISTEMA
const vendaAtivosSistema = 954209.56;
console.log('\n🔍 COMPARAÇÃO COM SISTEMA:');
console.log(`   Sistema CIKLUS: R$ ${vendaAtivosSistema.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
console.log(`   Calculado agora: R$ ${(valorLiquidoVenda * taxaDolar).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
console.log(`   Diferença: R$ ${(vendaAtivosSistema - (valorLiquidoVenda * taxaDolar)).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
