import { Check, Clock, GraduationCap } from "lucide-react";

interface RecentGoalsProps {
  goals: Array<{
    id: number;
    nome: string;
    status: string;
    progress?: number;
    categoria: string;
  }>;
}

export default function RecentGoals({ goals }: RecentGoalsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "concluido":
        return Check;
      case "em_andamento":
        return Clock;
      default:
        return GraduationCap;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluido":
        return "bg-green-100 text-green-600";
      case "em_andamento":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  const getStatusText = (status: string, progress?: number) => {
    switch (status) {
      case "concluido":
        return "Concluído";
      case "em_andamento":
        return `${Math.round(progress || 0)}% concluído`;
      default:
        return "Planejando";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetivos Recentes</h3>
      <div className="space-y-4">
        {!goals || goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <GraduationCap className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhum objetivo encontrado</p>
            <p className="text-sm">Crie seus primeiros objetivos financeiros</p>
          </div>
        ) : (
          goals.map((goal) => {
            const StatusIcon = getStatusIcon(goal.status);
            return (
              <div key={goal.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(goal.status)}`}>
                  <StatusIcon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{goal.nome}</p>
                  <p className="text-xs text-gray-500">
                    {getStatusText(goal.status, goal.progress)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
