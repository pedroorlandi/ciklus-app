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
import { insertReceitaSchema } from "@shared/schema";
import { CATEGORIAS_RECEITA, CATEGORIAS_RECEITA_VALUES, MOEDAS, FREQUENCIAS, MESES_ANO, getCategoriaColor } from "@shared/constants";
import { Plus, TrendingUp, Edit, Trash2, Calendar, User } from "lucide-react";
import { EditableDataTableGeneric } from "@/components/ui/editable-data-table-generic";
import { z } from "zod";

const formSchema = insertReceitaSchema.extend({
  valor: z.string().min(1, "Valor é obrigatório"),
  membro: z.string().optional(),
  imovel: z.string().optional(),
  dataInicio: z.string().min(1, "Data de início é obrigatória").regex(/^\d{2}\/\d{4}$/, "Formato deve ser MM/AAAA"),
  dataFim: z.string().optional(),
  prazoAnos: z.number().nullable().optional(),
  mesesRecorrencia: z.string().optional(),
});

export default function Receitas() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReceita, setEditingReceita] = useState<any>(null);
  const [viewMode] = useState<'table'>('table');
  const { selectedPlanejamento } = usePlanejamentoContext();

  const { data: planejamentos = [] } = useQuery({
    queryKey: ["/api/planejamentos"],
  });

  const { data: receitas = [], isLoading } = useQuery({
    queryKey: ["/api/planejamentos", selectedPlanejamento, "receitas"],
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
  const receitasColumnConfig = [
    { key: "descricao", header: "Descrição", type: "text" as const },
    { key: "categoria", header: "Categoria", type: "select" as const, options: CATEGORIAS_RECEITA_VALUES },
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
        return await apiRequest(`/api/receitas/${item.id}`, {
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
        queryKey: ["/api/planejamentos", selectedPlanejamento, "receitas"],
      });
      await queryClient.refetchQueries({
        queryKey: ["/api/planejamentos", selectedPlanejamento, "receitas"],
      });
      
      toast({
        title: "Sucesso",
        description: "Receitas atualizadas com sucesso!",
      });
    } catch (error: any) {
      console.error("Erro ao atualizar receitas:", error);
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
        description: "Erro ao atualizar as receitas.",
        variant: "destructive",
      });
    }
  };

  const handleCreateReceita = async (newReceitas: any[]) => {
    try {
      const createPromises = newReceitas.map(async (receita) => {
        // Calcular data fim automaticamente se prazo estiver definido
        let dataFimCalculada = receita.dataFim;
        if (receita.dataInicio && receita.prazoAnos && receita.prazoAnos > 0) {
          const [mes, ano] = receita.dataInicio.split('/');
          if (mes && ano && parseInt(ano) > 2000) {
            const anoFim = parseInt(ano) + receita.prazoAnos - 1;
            dataFimCalculada = `12/${anoFim}`;
          }
        }

        // Limpar meses se frequência não for personalizada
        let mesesRecorrencia = receita.mesesRecorrencia;
        if (receita.frequencia !== 'personalizada') {
          mesesRecorrencia = "";
        }

        return await apiRequest(`/api/planejamentos/${selectedPlanejamento}/receitas`, {
          method: "POST",
          body: {
            ...receita,
            valor: parseFloat(receita.valor) || 0,
            planejamentoId: selectedPlanejamento,
            dataFim: dataFimCalculada,
            mesesRecorrencia: mesesRecorrencia,
          },
        });
      });

      await Promise.all(createPromises);

      // Invalidar cache de forma mais agressiva para garantir atualização
      await queryClient.invalidateQueries({
        queryKey: ["/api/planejamentos", selectedPlanejamento, "receitas"],
      });
      await queryClient.refetchQueries({
        queryKey: ["/api/planejamentos", selectedPlanejamento, "receitas"],
      });

      toast({
        title: "Sucesso",
        description: `${newReceitas.length} receita(s) criada(s) com sucesso!`,
      });
    } catch (error: any) {
      console.error("Erro ao criar receitas:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar as receitas.",
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
      categoria: "salario",
      membro: "none",
      imovel: "",
      prazoAnos: null,
      ativo: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return await apiRequest(`/api/planejamentos/${selectedPlanejamento}/receitas`, {
        method: "POST",
        body: {
          ...data,
          valor: parseFloat(data.valor),
          planejamentoId: selectedPlanejamento,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/planejamentos", selectedPlanejamento, "receitas"],
      });
      setIsDialogOpen(false);
      setEditingReceita(null);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Receita criada com sucesso!",
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
        description: "Erro ao criar receita. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof formSchema> }) => {
      return await apiRequest(`/api/planejamentos/${selectedPlanejamento}/receitas/${id}`, {
        method: "PUT",
        body: {
          ...data,
          valor: parseFloat(data.valor),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/planejamentos", selectedPlanejamento, "receitas"],
      });
      setIsDialogOpen(false);
      setEditingReceita(null);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Receita atualizada com sucesso!",
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
        description: "Erro ao atualizar receita. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/receitas/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/planejamentos", selectedPlanejamento, "receitas"],
      });
      toast({
        title: "Sucesso",
        description: "Receita excluída com sucesso!",
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
        description: "Erro ao excluir receita. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (editingReceita) {
      updateMutation.mutate({ id: editingReceita.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (receita: any) => {
    setEditingReceita(receita);
    const formData = {
      descricao: receita.descricao || "",
      valor: receita.valor?.toString() || "",
      moeda: receita.moeda || "BRL",
      frequencia: receita.frequencia || "mensal",
      dataInicio: receita.dataInicio || "",
      dataFim: receita.dataFim || "",
      categoria: receita.categoria || "salario",
      membro: receita.membro ? receita.membro.toString() : "none",
      imovel: receita.imovel ? receita.imovel.toString() : "none",
      prazoAnos: receita.prazoAnos || null,
      ativo: receita.ativo !== undefined ? receita.ativo : true,
    };
    form.reset(formData);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Excluir receita permanentemente?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatCurrency = (value: number, moeda: string = "BRL") => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: moeda
    }).format(value);
  };

  const getCategoriaColorLocal = (categoria: string) => {
    return getCategoriaColor(categoria, 'receita');
  };

  const getCategoriaText = (categoria: string) => {
    const categoria_obj = CATEGORIAS_RECEITA.find(c => c.value === categoria);
    return categoria_obj ? categoria_obj.label : categoria;
  };

  const getFrequenciaText = (frequencia: string) => {
    const freq_obj = FREQUENCIAS.find(f => f.value === frequencia);
    return freq_obj ? freq_obj.label : frequencia;
  };

  const getMemberName = (membroId: string) => {
    const membro = (membros as any[]).find((m: any) => m.id.toString() === membroId);
    return membro ? membro.nome : "Não especificado";
  };

  const getImovelName = (imovelId: string) => {
    const imovel = (imoveis as any[]).find((i: any) => i.id.toString() === imovelId);
    return imovel ? imovel.nome : "Não especificado";
  };

  // Calcular total das receitas ativas
  const totalReceitas = (receitas as any[])
    .filter((receita: any) => receita.ativo)
    .reduce((total: number, receita: any) => total + (receita.valor || 0), 0);

  const planejamentoAtual = (planejamentos as any[]).find((p: any) => p.id.toString() === selectedPlanejamento);

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Receitas</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Gerencie as fontes de receita do planejamento financeiro
              </p>
            </div>

            {!selectedPlanejamento ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione um planejamento
                </h3>
                <p className="text-gray-500">
                  Escolha um planejamento para visualizar e gerenciar as receitas.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Receitas Summary */}
                {totalReceitas > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Total de Receitas Mensais</h3>
                        <p className="text-3xl font-bold text-green-600 mt-1">
                          {formatCurrency(totalReceitas)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{(receitas as any[]).length} receita(s)</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Receitas ({(receitas as any[]).length})
                  </h2>
                  <div className="flex items-center gap-4">
                  </div>
                </div>

                {isLoading ? (
                  <div className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
                ) : (
                  <EditableDataTableGeneric
                    data={receitas as any[]}
                    columns={receitasColumnConfig}
                    onSave={handleBulkSave}
                    onCreate={handleCreateReceita}
                    onDelete={(id: number) => deleteMutation.mutate(id)}
                    searchKey="descricao"
                    searchPlaceholder="Buscar receitas..."
                    initialEditMode={(receitas as any[]).length === 0}
                    newItemTemplate={{
                      descricao: "",
                      valor: 0,
                      moeda: "BRL",
                      frequencia: "mensal",
                      mesesRecorrencia: "",
                      dataInicio: `${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`,
                      categoria: "salario",
                      membro: "none",
                      imovel: "",
                      prazoAnos: null,
                      ativo: true,
                    }}
                  />
                )}
              </div>
            )}
      </div>
    </MainLayout>
  );
}