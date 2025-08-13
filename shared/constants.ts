// Constantes compartilhadas entre frontend e backend
// Mantém consistência nas opções de dropdowns e validações

export const CATEGORIAS_DESPESA = [
  { value: "basicas", label: "Básicas" },
  { value: "dependentes", label: "Dependentes" },
  { value: "estilo", label: "Estilo" },
  { value: "viagens", label: "Viagens" },
  { value: "patrimoniais", label: "Patrimoniais" },
] as const;

export const CATEGORIAS_RECEITA = [
  { value: "laborais", label: "Laborais" },
  { value: "passivas", label: "Passivas" },
  { value: "patrimoniais", label: "Patrimoniais" },
] as const;

export const MOEDAS = [
  { value: "BRL", label: "BRL - Real" },
  { value: "USD", label: "USD - Dólar" },
  { value: "EUR", label: "EUR - Euro" },
] as const;

export const FREQUENCIAS = [
  { value: "mensal", label: "Mensal" },
  { value: "personalizada", label: "Personalizada" },
] as const;

export const TIPOS_IMOVEL = [
  { value: "residencial", label: "Residencial" },
  { value: "comercial", label: "Comercial" },
  { value: "terreno", label: "Terreno" },
  { value: "investimento", label: "Investimento" },
] as const;

export const OPCOES_FINANCIAMENTO = [
  { value: "NAO", label: "Não" },
  { value: "SIM", label: "Sim" },
] as const;

export const TIPOS_AMORTIZACAO = [
  { value: "SAC", label: "SAC" },
  { value: "PRICE", label: "PRICE" },
] as const;

export const STATUS_IMOVEL = [
  { value: "ativo", label: "Ativo" },
  { value: "vendido", label: "Vendido" },
  { value: "alugado", label: "Alugado" },
] as const;

export const CATEGORIAS_INVESTIMENTO = [
  { value: "renda_fixa", label: "Renda Fixa" },
  { value: "acoes", label: "Ações" },
  { value: "fundos_imobiliarios", label: "Fundos Imobiliários" },
  { value: "criptomoedas", label: "Criptomoedas" },
  { value: "reserva_emergencia", label: "Reserva de Emergência" },
] as const;

export const STATUS_PLANEJAMENTO = [
  { value: "ativo", label: "Ativo" },
  { value: "pausado", label: "Pausado" },
  { value: "concluido", label: "Concluído" },
] as const;

export const TIPOS_INDICE = [
  { value: "taxa", label: "Taxa" },
  { value: "cambio", label: "Câmbio" },
  { value: "inflacao", label: "Inflação" },
] as const;

export const UNIDADES_INDICE = [
  { value: "%", label: "%" },
  { value: "R$", label: "R$" },
] as const;

export const MESES_ANO = [
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
] as const;

// Funções utilitárias para cores e ícones
export const getCategoriaColor = (categoria: string, tipo: 'despesa' | 'receita' | 'investimento' | 'imovel' | 'indice') => {
  const colorMaps = {
    despesa: {
      'basicas': 'bg-blue-100 text-blue-800',
      'dependentes': 'bg-green-100 text-green-800',
      'estilo': 'bg-purple-100 text-purple-800',
      'viagens': 'bg-yellow-100 text-yellow-800',
      'patrimoniais': 'bg-orange-100 text-orange-800',
    },
    receita: {
      'salario': 'bg-green-100 text-green-800',
      'investimentos': 'bg-blue-100 text-blue-800',
      'outros': 'bg-gray-100 text-gray-800',
    },
    investimento: {
      'renda_fixa': 'bg-blue-100 text-blue-800',
      'acoes': 'bg-green-100 text-green-800',
      'fundos_imobiliarios': 'bg-yellow-100 text-yellow-800',
      'criptomoedas': 'bg-purple-100 text-purple-800',
      'reserva_emergencia': 'bg-gray-100 text-gray-800',
    },
    imovel: {
      'residencial': 'bg-green-100 text-green-800',
      'comercial': 'bg-blue-100 text-blue-800',
      'terreno': 'bg-yellow-100 text-yellow-800',
    },
    indice: {
      'taxa': 'bg-blue-100 text-blue-800',
      'cambio': 'bg-green-100 text-green-800',
      'inflacao': 'bg-orange-100 text-orange-800',
    }
  };
  
  return colorMaps[tipo]?.[categoria as keyof typeof colorMaps[typeof tipo]] || 'bg-gray-100 text-gray-800';
};

// Extrai apenas os valores para uso em validação e arrays simples
export const CATEGORIAS_DESPESA_VALUES = CATEGORIAS_DESPESA.map(c => c.value);
export const CATEGORIAS_RECEITA_VALUES = CATEGORIAS_RECEITA.map(c => c.value);
export const MOEDAS_VALUES = MOEDAS.map(m => m.value);
export const FREQUENCIAS_VALUES = FREQUENCIAS.map(f => f.value);
export const TIPOS_IMOVEL_VALUES = TIPOS_IMOVEL.map(t => t.value);
export const STATUS_IMOVEL_VALUES = STATUS_IMOVEL.map(s => s.value);
export const TIPOS_AMORTIZACAO_VALUES = TIPOS_AMORTIZACAO.map(t => t.value);
export const CATEGORIAS_INVESTIMENTO_VALUES = CATEGORIAS_INVESTIMENTO.map(c => c.value);
export const MESES_ANO_VALUES = MESES_ANO.map(m => m.value);