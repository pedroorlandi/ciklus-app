interface PortfolioOverviewProps {
  allocation: Array<{
    categoria: string;
    valor: number;
  }>;
}

export default function PortfolioOverview({ allocation }: PortfolioOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCategoryColor = (categoria: string) => {
    const colors: { [key: string]: string } = {
      'renda_fixa': 'bg-blue-500',
      'acoes': 'bg-green-500',
      'fundos_imobiliarios': 'bg-yellow-500',
      'criptomoedas': 'bg-purple-500',
      'reserva_emergencia': 'bg-gray-500',
    };
    return colors[categoria] || 'bg-gray-500';
  };

  const getCategoryName = (categoria: string) => {
    const names: { [key: string]: string } = {
      'renda_fixa': 'Renda Fixa',
      'acoes': 'Ações',
      'fundos_imobiliarios': 'Fundos Imobiliários',
      'criptomoedas': 'Criptomoedas',
      'reserva_emergencia': 'Reserva de Emergência',
    };
    return names[categoria] || categoria;
  };

  const totalValue = allocation?.reduce((sum, item) => sum + item.valor, 0) || 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Distribuição do Portfolio</h3>
        <button className="text-sm text-primary hover:text-primary-700">Gerenciar</button>
      </div>
      <div className="space-y-4">
        {!allocation || allocation.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
            <p>Nenhum investimento encontrado</p>
            <p className="text-sm">Adicione investimentos ao seu portfolio</p>
          </div>
        ) : (
          allocation.map((item) => {
            const percentage = totalValue > 0 ? (item.valor / totalValue) * 100 : 0;
            return (
              <div key={item.categoria} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 ${getCategoryColor(item.categoria)} rounded-full`}></div>
                  <span className="text-sm font-medium text-gray-900">
                    {getCategoryName(item.categoria)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{formatCurrency(item.valor)}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(percentage)}%
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
