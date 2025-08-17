import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

interface FamilyMembersProps {
  planejamentoId?: number;
}

export default function FamilyMembers({ planejamentoId }: FamilyMembersProps) {
  const { data: membros = [], isLoading } = useQuery({
    queryKey: ["/api/planejamentos", planejamentoId, "membros"],
    enabled: !!planejamentoId,
  });

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Membros da Família</h3>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Membros da Família</h3>
        <Button className="bg-primary hover:bg-primary-600">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Membro
        </Button>
      </div>
      
      {!planejamentoId ? (
        <div className="text-center py-8 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4" />
          <p>Selecione um planejamento</p>
          <p className="text-sm">para ver os membros da família</p>
        </div>
      ) : (!membros || !Array.isArray(membros) || membros.length === 0) ? (
        <div className="text-center py-8 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4" />
          <p>Nenhum membro cadastrado</p>
          <p className="text-sm">Adicione membros da família ao planejamento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.isArray(membros) && membros.map((membro: any) => (
            <div key={membro.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{membro.nome}</p>
                  <p className="text-xs text-gray-500 capitalize">{membro.parentesco}</p>
                </div>
              </div>
              <div className="mt-3 flex justify-between text-xs">
                <span className="text-gray-600">Idade: {membro.idade}</span>
                <span className="text-gray-600">
                  {membro.dependente ? "Dependente" : "Independente"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
