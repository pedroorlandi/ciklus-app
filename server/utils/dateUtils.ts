// Utilitários para trabalhar com datas MM/AAAA

export function calcularDataFim(dataInicio: string, prazoAnos: number): string {
  // CORREÇÃO NOVA: manter o mês original + prazo em anos
  // Exemplo: 06/2025 + 2 anos = 06/2027 (não 12/2026)
  // Especial: 01/2025 + 30 anos = 12/2054 (caso especial para Janeiro)
  const [mes, ano] = dataInicio.split('/').map(Number);
  
  if (mes === 1) {
    // Caso especial: Janeiro sempre termina em dezembro do ano (inicial + prazo - 1)
    const anoFim = ano + prazoAnos - 1;
    return `12/${anoFim}`;
  } else {
    // Caso geral: manter o mês original, adicionar anos ao ano
    const anoFim = ano + prazoAnos;
    return `${mes.toString().padStart(2, '0')}/${anoFim}`;
  }
}

export function validarFormatoData(data: string): boolean {
  // Valida formato MM/AAAA
  const regex = /^(0[1-9]|1[0-2])\/\d{4}$/;
  return regex.test(data);
}

export function parseDataMesAno(data: string): { mes: number; ano: number } {
  const [mes, ano] = data.split('/').map(Number);
  return { mes, ano };
}

export function formatarDataMesAno(mes: number, ano: number): string {
  return `${mes.toString().padStart(2, '0')}/${ano}`;
}

// Converte data padrão YYYY-MM-DD para MM/AAAA
export function converterParaMesAno(data: string): string {
  const date = new Date(data);
  const mes = date.getMonth() + 1; // getMonth() retorna 0-11
  const ano = date.getFullYear();
  return formatarDataMesAno(mes, ano);
}

// Obter mês/ano atual no formato MM/AAAA
export function obterMesAnoAtual(): string {
  const hoje = new Date();
  const mes = hoje.getMonth() + 1;
  const ano = hoje.getFullYear();
  return formatarDataMesAno(mes, ano);
}