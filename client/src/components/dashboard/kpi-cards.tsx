import { TrendingUp, TrendingDown, Target, ChartLine } from "lucide-react";

interface KPICardsProps {
  data: {
    totalAssets: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    goalsAchieved: number;
    totalGoals: number;
  };
}

export default function KPICards({ data }: KPICardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const kpis = [
    {
      title: "Patrimônio Total",
      value: formatCurrency(data.totalAssets),
      icon: ChartLine,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      change: "+12.5%",
      changeColor: "text-green-600",
    },
    {
      title: "Receitas Mensais",
      value: formatCurrency(data.monthlyIncome),
      icon: TrendingUp,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      change: "+8.2%",
      changeColor: "text-green-600",
    },
    {
      title: "Despesas Mensais",
      value: formatCurrency(data.monthlyExpenses),
      icon: TrendingDown,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      change: "+3.1%",
      changeColor: "text-red-600",
    },
    {
      title: "Objetivos Atingidos",
      value: `${data.goalsAchieved}/${data.totalGoals}`,
      icon: Target,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      change: data.totalGoals > 0 ? `${Math.round((data.goalsAchieved / data.totalGoals) * 100)}%` : "0%",
      changeColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              </div>
              <div className={`w-12 h-12 ${kpi.iconBg} rounded-lg flex items-center justify-center`}>
                <Icon className={`${kpi.iconColor} text-lg h-6 w-6`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${kpi.changeColor}`}>
                {kpi.change}
              </span>
              <span className="text-gray-500 text-sm ml-2">vs. mês anterior</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
