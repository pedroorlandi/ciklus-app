// Utility functions for date calculations on the client side
export function calcularDataFim(dataInicio: string, prazoAnos: number): string {
  if (!dataInicio || !prazoAnos) return '';
  
  const [mes, ano] = dataInicio.split('/').map(Number);
  
  if (!mes || !ano || mes < 1 || mes > 12) {
    return '';
  }
  
  // Janeiro é tratado como caso especial: 01/2025 + 30 anos = 12/2054
  if (mes === 1) {
    const anoFinal = ano + prazoAnos - 1;
    return `12/${anoFinal}`;
  }
  
  // Para outros meses: mantém o mês original
  // 06/2025 + 2 anos = 06/2027
  const anoFinal = ano + prazoAnos;
  return `${String(mes).padStart(2, '0')}/${anoFinal}`;
}