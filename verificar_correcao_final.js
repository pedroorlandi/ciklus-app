// Investigação detalhada da diferença de R$ 10,32 no cálculo do Orlando

console.log('🔍 INVESTIGAÇÃO DETALHADA - ORLANDO\n');

// Dados exatos do sistema
const valorInicial = 250000; // USD
const taxaValorizacao = 0.01; // 1% (cadastrado como "1" no banco)
const entrada = 50000; // USD
const valorFinanciado = valorInicial - entrada; // 200000 USD
const taxaJuros = 0.06; // 6% a.a.
const prazoAnos = 15;
const taxaDolar = 5.5426; // R$/USD (taxa atual do sistema)

// Datas
const dataInicio = new Date('2026-01-01');
const dataVenda = new Date('2035-01-01');

// Período exato
const diffTime = dataVenda.getTime() - dataInicio.getTime();
const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Aprox 108 meses
const diffYears = (dataVenda.getFullYear() - dataInicio.getFullYear());

console.log('📊 DADOS DE ENTRADA:');
console.log(`   Valor inicial: $${valorInicial}`);
console.log(`   Taxa valorização: ${taxaValorizacao} (${taxaValorizacao * 100}%)`);
console.log(`   Entrada: $${entrada}`);
console.log(`   Financiado: $${valorFinanciado}`);
console.log(`   Taxa juros: ${taxaJuros * 100}% a.a.`);
console.log(`   Prazo: ${prazoAnos} anos`);
console.log(`   Período valorização: ${diffYears} anos (${diffMonths} meses)`);
console.log(`   Taxa dólar: R$ ${taxaDolar}`);

// Método 1: Cálculo anual (antigo)
const valorPatrimonialAnual = valorInicial * Math.pow(1 + taxaValorizacao, diffYears);

// Método 2: Cálculo mensal (atual)
const taxaMensalValorizacao = Math.pow(1 + taxaValorizacao, 1/12) - 1;
const mesesExatos = diffYears * 12; // 9 * 12 = 108 meses
const valorPatrimonialMensal = valorInicial * Math.pow(1 + taxaMensalValorizacao, mesesExatos);

console.log('\n💰 VALORIZAÇÃO PATRIMONIAL:');
console.log(`   Método anual (antigo): $${valorPatrimonialAnual.toFixed(4)}`);
console.log(`   Método mensal (atual): $${valorPatrimonialMensal.toFixed(4)}`);
console.log(`   Diferença: $${(valorPatrimonialMensal - valorPatrimonialAnual).toFixed(4)}`);

// Cálculo do financiamento com precisão total
const taxaMensalJuros = Math.pow(1 + taxaJuros, 1/12) - 1;
const totalPagamentos = prazoAnos * 12; // 180 meses
const pagamentosRealizados = mesesExatos; // 108 meses

// Prestação PRICE com precisão máxima
const prestacao = valorFinanciado * (taxaMensalJuros * Math.pow(1 + taxaMensalJuros, totalPagamentos)) / 
                 (Math.pow(1 + taxaMensalJuros, totalPagamentos) - 1);

// Saldo devedor com precisão máxima
const saldoDevedor = valorFinanciado * Math.pow(1 + taxaMensalJuros, pagamentosRealizados) - 
                    prestacao * ((Math.pow(1 + taxaMensalJuros, pagamentosRealizados) - 1) / taxaMensalJuros);

console.log('\n🏦 FINANCIAMENTO PRICE:');
console.log(`   Taxa mensal: ${(taxaMensalJuros * 100).toFixed(8)}%`);
console.log(`   Prestação: $${prestacao.toFixed(4)}`);
console.log(`   Saldo devedor: $${saldoDevedor.toFixed(4)}`);

// Valor líquido com diferentes métodos
const valorLiquidoAnual = valorPatrimonialAnual - saldoDevedor;
const valorLiquidoMensal = valorPatrimonialMensal - saldoDevedor;

console.log('\n💵 VALOR LÍQUIDO DA VENDA:');
console.log(`   Método anual: $${valorLiquidoAnual.toFixed(4)} = R$ ${(valorLiquidoAnual * taxaDolar).toFixed(4)}`);
console.log(`   Método mensal: $${valorLiquidoMensal.toFixed(4)} = R$ ${(valorLiquidoMensal * taxaDolar).toFixed(4)}`);

// Comparação com sistema
const sistemaValor = 954209.56;
console.log('\n🎯 COMPARAÇÃO COM SISTEMA:');
console.log(`   Sistema CIKLUS: R$ ${sistemaValor.toFixed(2)}`);
console.log(`   Cálculo anual: R$ ${(valorLiquidoAnual * taxaDolar).toFixed(2)}`);
console.log(`   Cálculo mensal: R$ ${(valorLiquidoMensal * taxaDolar).toFixed(2)}`);
console.log(`   Diferença anual: R$ ${(sistemaValor - (valorLiquidoAnual * taxaDolar)).toFixed(2)}`);
console.log(`   Diferença mensal: R$ ${(sistemaValor - (valorLiquidoMensal * taxaDolar)).toFixed(2)}`);

// Teste com diferentes precisões de arredondamento
console.log('\n🔬 TESTE DE PRECISÃO:');

// Simular arredondamentos intermediários
const valorPat2Casas = Math.round(valorPatrimonialMensal * 100) / 100;
const saldoDev2Casas = Math.round(saldoDevedor * 100) / 100;
const valorLiq2Casas = valorPat2Casas - saldoDev2Casas;

const valorPat4Casas = Math.round(valorPatrimonialMensal * 10000) / 10000;
const saldoDev4Casas = Math.round(saldoDevedor * 10000) / 10000;
const valorLiq4Casas = valorPat4Casas - saldoDev4Casas;

console.log(`   Com 2 casas USD: $${valorLiq2Casas.toFixed(2)} = R$ ${(valorLiq2Casas * taxaDolar).toFixed(2)}`);
console.log(`   Com 4 casas USD: $${valorLiq4Casas.toFixed(4)} = R$ ${(valorLiq4Casas * taxaDolar).toFixed(2)}`);

// Verificar se o sistema usa taxa de câmbio arredondada
const taxaDolarArredondada = 5.54; // Possível arredondamento
console.log(`   Com taxa R$ 5,54: R$ ${(valorLiquidoMensal * taxaDolarArredondada).toFixed(2)}`);
