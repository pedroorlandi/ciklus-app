import { TrendingUp, TrendingDown, ShoppingCart, Home } from "lucide-react";

export default function RecentTransactions() {
  // TODO: This will be replaced with real transaction data
  const transactions = [
    {
      id: 1,
      type: "receita",
      description: "Salário",
      amount: 15000,
      date: "15/02/2024",
      icon: TrendingUp,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      id: 2,
      type: "despesa",
      description: "Financiamento Casa",
      amount: -3450,
      date: "12/02/2024",
      icon: Home,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
    },
    {
      id: 3,
      type: "receita",
      description: "Dividendos ITUB4",
      amount: 487,
      date: "10/02/2024",
      icon: TrendingUp,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      id: 4,
      type: "despesa",
      description: "Compras do Mês",
      amount: -2180,
      date: "08/02/2024",
      icon: ShoppingCart,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Transações Recentes</h3>
        <button className="text-sm text-primary hover:text-primary-700">Ver todas</button>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => {
          const Icon = transaction.icon;
          return (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${transaction.iconBg} rounded-full flex items-center justify-center`}>
                  <Icon className={`${transaction.iconColor} h-5 w-5`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <p className={`text-sm font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.amount > 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
