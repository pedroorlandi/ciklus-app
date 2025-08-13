import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { usePlanejamentoContext } from "@/hooks/usePlanejamentoContext";
import MainLayout from "@/components/layout/MainLayout";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDespesaSchema } from "@shared/schema";
import { CATEGORIAS_DESPESA, CATEGORIAS_DESPESA_VALUES, MOEDAS, FREQUENCIAS, MESES_ANO, getCategoriaColor } from "@shared/constants";
import { Plus, TrendingDown, Edit, Trash2, Calendar, User } from "lucide-react";
import { EditableDataTableGeneric } from "@/components/ui/editable-data-table-generic";
import { z } from "zod";

const formSchema = insertDespesaSchema.extend({
  valor: z.string().min(1, "Valor é obrigatório"),
  membro: z.string().optional(),
  imovel: z.string().optional(),
  dataInicio: z.string().min(1, "Data de início é obrigatória").regex(/^\d{2}\/\d{4}$/, "Formato deve ser MM/AAAA"),
  dataFim: z.string().optional(),
  prazoAnos: z.number().nullable().optional(),
  mesesRecorrencia: z.string().optional(),
});

export default function Despesas() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDespesa, setEditingDespesa] = useState<any>(null);
  const [viewMode] = useState<'table'>('table');
  const { selectedPlanejamento } = usePlanejamentoContext();

  const { data: planejamentos = [] } = useQuery({
    queryKey: ["/api/planejamentos"],
  });

  const { data: despesas = [], isLoading } = useQuery({
    queryKey: ["/api/planejamentos", selectedPlanejamento, "despesas"],
    enabled: !!selectedPlanejamento,
  });

  const { data: membros = [] } = useQuery({
    queryKey: ["/api/planejamentos", selectedPlanejamento, "membros"],
    enabled: !!selectedPlanejamento,
  });

  const { data: imoveis = [] } = useQuery({
    queryKey: ["/api/planejamentos", selectedPlanejamento, "imoveis"],
    enabled: !!selectedPlanejamento,
  });

  // Configurações das colunas para tabela editável
  const despesasColumnConfig = [
    { key: "descricao", header: "Descrição", type: "text" as const },
    { key: "categoria", header: "Categoria", type: "select" as const, options: CATEGORIAS_DESPESA_VALUES },
    { key: "valor", header: "Valor", type: "currency" as const },
    { key: "moeda", header: "Moeda", type: "select" as const, options: MOEDAS.map(m => m.value) },
    { 
      key: "membro", 
      header: "Membro", 
      type: "select" as const, 
      options: [
        { value: "none", label: "Nenhum específico" },
        ...(membros as any[]).map((membro: any) => ({ value: membro.id.toString(), label: membro.nome }))
      ],
      formatter: (value: any) => {
        if (!value || value === "none") return "Nenhum específico";
        const membro = (membros as any[]).find((m: any) => m.id.toString() === value.toString());
        return membro ? membro.nome : value;
      }
    },
    { 
      key: "imovel", 
      header: "Imóvel", 
      type: "select" as const, 
      options: [
        { value: "none", label: "Nenhum específico" },
        ...(imoveis as any[]).map((imovel: any) => ({ value: imovel.id.toString(), label: imovel.nome }))
      ],
      formatter: (value: any) => {
        if (!value || value === "none") return "Nenhum específico";
        const imovel = (imoveis as any[]).find((i: any) => i.id.toString() === value.toString());
        return imovel ? imovel.nome : value;
      }
    },
    { key: "dataInicio", header: "Data Início", type: "date" as const },
    { key: "prazoAnos", header: "Prazo (anos)", type: "number" as const },
    { key: "dataFim", header: "Data Fim", type: "date" as const },
    { key: "frequencia", header: "Frequência", type: "select" as const, options: FREQUENCIAS.map(f => f.value) },
    { key: "mesesRecorrencia", header: "Meses (Personalizada)", type: "month-selector" as const },

  ];

  // Função para salvamento em massa
  const handleBulkSave = async (updatedData: any[]) => {
    try {
      const updates = updatedData.map(async (item) => {
        // Calcular data fim automaticamente se prazo estiver definido
        let dataFimCalculada = item.dataFim;
        if (item.dataInicio && item.prazoAnos && item.prazoAnos > 0) {
          const [mes, ano] = item.dataInicio.split('/');
          if (mes && ano && parseInt(ano) > 2000) {
            // CORREÇÃO: movimento que inicia em jan/2025 e dura 30 anos termina em dez/2054
            const anoFim = parseInt(ano) + item.prazoAnos - 1;
            dataFimCalculada = `12/${anoFim}`; // Sempre termina em dezembro
          }
        }
        
        // Limpar meses se frequência não for personalizada
        let mesesRecorrencia = item.mesesRecorrencia;
        if (item.frequencia !== 'personalizada') {
          mesesRecorrencia = "";
        }
        
        // Fazer requisição PUT diretamente para cada item
        return await apiRequest(`/api/despesas/${item.id}`, {
          method: "PUT",
          body: {
            ...item,
            valor: parseFloat(item.valor || "0"),
            dataFim: dataFimCalculada,
            membro: item.membro === "none" ? null : item.membro,
            imovel: item.imovel === "none" ? null : item.imovel,
            mesesRecorrencia: mesesRecorrencia,
          }
        });
      });
      
      await Promise.all(updates);
      
      // Invalidar cache para recarregar dados de forma mais agressiva
      await queryClient.invalidateQueries({
        queryKey: ["/api/planejamentos", selectedPlanejamento, "despesas"],
      });
      await queryClient.refetchQueries({
        queryKey: ["/api/planejamentos", selectedPlanejamento, "despesas"],
      });
      
      toast({
        title: "Sucesso",
        description: "Despesas atualizadas com sucesso!",
      });
    } catch (error: any) {
      console.error("Erro ao atualizar despesas:", error);
      if (isUnauthorizedError(error)) {
        toast({
          title: "Não autorizado",
          description: "Você foi desconectado. Fazendo login novamente...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Erro ao atualizar as despesas.",
        variant: "destructive",
      });
    }
  };

  const handleCreateDespesa = async (newDespesas: any[]) => {
    try {
      const createPromises = newDespesas.map(async (despesa) => {
        // Calcular data fim automaticamente se prazo estiver definido
        let dataFimCalculada = despesa.dataFim;
        if (despesa.dataInicio && despesa.prazoAnos && despesa.prazoAnos > 0) {
          const [mes, ano] = despesa.dataInicio.split('/');
          if (mes && ano && parseInt(ano) > 2000) {
            const anoFim = parseInt(ano) + despesa.prazoAnos - 1;
            dataFimCalculada = `12/${anoFim}`;
          }
        }

        // Limpar meses se frequência não for personalizada
        let mesesRecorrencia = despesa.mesesRecorrencia;
        if (despesa.frequencia !== 'personalizada') {
          mesesRecorrencia = "";
        }

        return await apiRequest(`/api/planejamentos/${selectedPlanejamento}/despesas`, {
          method: "POST",
          body: {
            ...despesa,
            valor: parseFloat(despesa.valor) || 0,
            planejamentoId: selectedPlanejamento,
            dataFim: dataFimCalculada,
            mesesRecorrencia: mesesRecorrencia,
          },
        });
      });

      await Promise.all(createPromises);

      // Invalidar cache de forma mais agressiva para garantir atualização
      await queryClient.invalidateQueries({
        queryKey: ["/api/planejamentos", selectedPlanejamento, "despesas"],
      });
      await queryClient.refetchQueries({
        queryKey: ["/api/planejamentos", selectedPlanejamento, "despesas"],
      });

      toast({
        title: "Sucesso",
        description: `${newDespesas.length} despesa(s) criada(s) com sucesso!`,
      });
    } catch (error: any) {
      console.error("Erro ao criar despesas:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar as despesas.",
        variant: "destructive",
      });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descricao: "",
      valor: "",
      moeda: "BRL",
      frequencia: "mensal",
      dataInicio: `${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`,
      dataFim: "",
      categoria: "outros",
      membro: "none",
      imovel: "",
      prazoAnos: null,
      ativo: true,
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/despesas/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/planejamentos", selectedPlanejamento, "despesas"],
      });
      toast({
        title: "Sucesso",
        description: "Despesa excluída com sucesso!",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Não autorizado",
          description: "Você foi desconectado. Fazendo login novamente...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Erro ao excluir despesa. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Excluir despesa permanentemente?")) {
      deleteMutation.mutate(id);
    }
  };

  if (!selectedPlanejamento) {
    return (
      <MainLayout>
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Nenhum planejamento selecionado</h2>
              <p className="text-gray-600">Selecione um planejamento para visualizar as despesas.</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const planejamento = (planejamentos as any[]).find((p: any) => p.id === selectedPlanejamento);

  return (
    <MainLayout>
      <div className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Despesas</h1>
              <p className="text-gray-600">
                Gerencie as despesas do planejamento: {planejamento?.nome}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <div className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
          ) : (
            <EditableDataTableGeneric
              data={despesas as any[]}
              columns={despesasColumnConfig}
              onSave={handleBulkSave}
              onCreate={handleCreateDespesa}
              onDelete={handleDelete}
              searchKey="descricao"
              searchPlaceholder="Buscar despesas..."
              initialEditMode={(despesas as any[]).length === 0}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}