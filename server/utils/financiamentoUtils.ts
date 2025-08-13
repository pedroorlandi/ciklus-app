/**
 * Utilitários para cálculos de financiamento imobiliário
 * Suporta sistemas SAC e PRICE
 */

export interface CalculoFinanciamento {
  numero: number;
  valorParcela: number;
  amortizacao: number;
  juros: number;
  saldoDevedor: number;
  anoMes: string; // formato "AAAA-MM"
}

/**
 * Calcula parcelas do sistema SAC (Sistema de Amortização Constante)
 */
export function calcularSAC(
  valorFinanciado: number,
  taxaJurosAnual: number,
  prazoMeses: number,
  dataInicio: string // formato "AAAA-MM-DD"
): CalculoFinanciamento[] {
  const parcelas: CalculoFinanciamento[] = [];
  // Conversão correta de taxa anual para mensal (taxa efetiva)
  const taxaJurosMensal = Math.pow(1 + taxaJurosAnual / 100, 1/12) - 1;
  const amortizacaoConstante = valorFinanciado / prazoMeses;
  let saldoDevedor = valorFinanciado;
  
  const [ano, mes] = dataInicio.split('-');
  let anoAtual = parseInt(ano);
  let mesAtual = parseInt(mes);

  for (let i = 1; i <= prazoMeses; i++) {
    const juros = saldoDevedor * taxaJurosMensal;
    const valorParcela = amortizacaoConstante + juros;
    
    saldoDevedor -= amortizacaoConstante;
    
    parcelas.push({
      numero: i,
      valorParcela,
      amortizacao: amortizacaoConstante,
      juros,
      saldoDevedor: Math.max(0, saldoDevedor),
      anoMes: `${anoAtual}-${mesAtual.toString().padStart(2, '0')}`
    });
    
    // Avançar para próximo mês
    mesAtual++;
    if (mesAtual > 12) {
      mesAtual = 1;
      anoAtual++;
    }
  }

  return parcelas;
}

/**
 * Calcula parcelas do sistema PRICE (Tabela Price)
 */
export function calcularPRICE(
  valorFinanciado: number,
  taxaJurosAnual: number,
  prazoMeses: number,
  dataInicio: string // formato "AAAA-MM-DD"
): CalculoFinanciamento[] {
  const parcelas: CalculoFinanciamento[] = [];
  // Conversão correta de taxa anual para mensal (taxa efetiva)
  const taxaJurosMensal = Math.pow(1 + taxaJurosAnual / 100, 1/12) - 1;
  
  // Cálculo da parcela fixa (PMT)
  const parcelaFixa = valorFinanciado * 
    (taxaJurosMensal * Math.pow(1 + taxaJurosMensal, prazoMeses)) /
    (Math.pow(1 + taxaJurosMensal, prazoMeses) - 1);
  
  let saldoDevedor = valorFinanciado;
  
  const [ano, mes] = dataInicio.split('-');
  let anoAtual = parseInt(ano);
  let mesAtual = parseInt(mes);

  for (let i = 1; i <= prazoMeses; i++) {
    const juros = saldoDevedor * taxaJurosMensal;
    const amortizacao = parcelaFixa - juros;
    
    saldoDevedor -= amortizacao;
    
    parcelas.push({
      numero: i,
      valorParcela: parcelaFixa,
      amortizacao,
      juros,
      saldoDevedor: Math.max(0, saldoDevedor),
      anoMes: `${anoAtual}-${mesAtual.toString().padStart(2, '0')}`
    });
    
    // Avançar para próximo mês
    mesAtual++;
    if (mesAtual > 12) {
      mesAtual = 1;
      anoAtual++;
    }
  }

  return parcelas;
}

/**
 * Calcula parcelas de financiamento com base no sistema escolhido
 */
export function calcularFinanciamento(
  valorAquisicao: number,
  entrada: number,
  taxaJurosAnual: number,
  prazoAnos: number,
  dataInicio: string,
  sistema: 'SAC' | 'PRICE',
  dataVenda?: string
): CalculoFinanciamento[] {
  const valorFinanciado = valorAquisicao - entrada;
  const prazoMeses = prazoAnos * 12;
  
  console.log(`[FINANCIAMENTO] Calculando ${sistema}:`);
  console.log(`  Valor Aquisição: ${valorAquisicao}`);
  console.log(`  Entrada: ${entrada}`);
  console.log(`  Valor Financiado: ${valorFinanciado}`);
  console.log(`  Taxa Juros: ${taxaJurosAnual}% ao ano`);
  console.log(`  Prazo: ${prazoAnos} anos (${prazoMeses} meses)`);
  console.log(`  Data Início: ${dataInicio}`);
  console.log(`  Data Venda: ${dataVenda || 'N/A'}`);
  
  if (valorFinanciado <= 0) {
    console.log(`[FINANCIAMENTO] Valor financiado é ${valorFinanciado}, retornando array vazio`);
    return [];
  }
  
  let parcelas: CalculoFinanciamento[];
  
  if (sistema === 'SAC') {
    parcelas = calcularSAC(valorFinanciado, taxaJurosAnual, prazoMeses, dataInicio);
  } else {
    parcelas = calcularPRICE(valorFinanciado, taxaJurosAnual, prazoMeses, dataInicio);
  }
  
  // Se houver data de venda, filtrar parcelas até essa data
  if (dataVenda) {
    const [anoVenda, mesVenda] = dataVenda.split('-');
    const anoMesVenda = `${anoVenda}-${mesVenda}`;
    
    parcelas = parcelas.filter(parcela => parcela.anoMes <= anoMesVenda);
    console.log(`[FINANCIAMENTO] Filtrado até ${anoMesVenda}: ${parcelas.length} parcelas`);
  }
  
  console.log(`[FINANCIAMENTO] Total de parcelas calculadas: ${parcelas.length}`);
  
  return parcelas;
}

/**
 * Converte data do formato DD/MM/AAAA ou MM/AAAA para AAAA-MM-DD
 */
export function converterDataParaISOInicio(data: string): string {
  if (data.includes('/')) {
    const partes = data.split('/');
    if (partes.length === 2) {
      // MM/AAAA -> AAAA-MM-01
      return `${partes[1]}-${partes[0].padStart(2, '0')}-01`;
    } else if (partes.length === 3) {
      // DD/MM/AAAA -> AAAA-MM-DD
      return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
    }
  }
  
  // Se já estiver no formato AAAA-MM-DD, retorna como está
  if (data.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return data;
  }
  
  // Fallback: data atual
  return new Date().toISOString().split('T')[0];
}