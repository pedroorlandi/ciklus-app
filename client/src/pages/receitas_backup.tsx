import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { usePlanejamentoContext } from "@/hooks/usePlanejamentoContext";
import Sidebar from "@/components/layout/sidebar";

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
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
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
        ...membros.map((membro: any) => ({ value: membro.id.toString(), label: membro.nome }))
      ],
      formatter: (value: any) => {
        if (!value || value === "none") return "Nenhum específico";
        const membro = membros.find((m: any) => m.id.toString() === value.toString());
        return membro ? membro.nome : value;
      }
    },
    { 
      key: "imovel", 
      header: "Imóvel", 
      type: "select" as const, 
      options: [
        { value: "none", label: "Nenhum específico" },
        ...imoveis.map((imovel: any) => ({ value: imovel.id.toString(), label: imovel.nome }))
      ],
      formatter: (value: any) => {
        if (!value || value === "none") return "Nenhum específico";
        const imovel = imoveis.find((i: any) => i.id.toString() === value.toString());
        return imovel ? imovel.nome : value;
      }
    },
    { key: "dataInicio", header: "Data Início", type: "text" as const },
    { key: "prazoAnos", header: "Prazo (anos)", type: "number" as const },
    { key: "dataFim", header: "Data Fim", type: "text" as const },
    { key: "frequencia", header: "Frequência", type: "select" as const, options: FREQUENCIAS.map(f => f.value) },
    { 
      key: "ativo", 
      header: "Ativo", 
      type: "boolean" as const,
      formatter: (value: boolean) => value ? "Sim" : "Não"
    }
  ];

  // Função para salvamento em massa
  const handleBulkSave = async (updatedData: any[]) => {
    const updates = updatedData.map(item => 
      updateMutation.mutateAsync({
        id: item.id,
        data: {
          ...item,
          valor: String(item.valor || "0")
        }
      })
    );
    
    try {
      await Promise.all(updates);
      toast({
        title: "Sucesso",
        description: "Receitas atualizadas com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar as receitas.",
        variant: "destructive",
      });
    }
  ];

  // Função para salvamento em massa
  const handleBulkSave = async (updatedData: any[]) => {
    const updates = updatedData.map(item => 
      updateMutation.mutateAsync({
        id: item.id,
        data: {
          ...item,
          valor: String(item.valor || "0"),
          planejamentoId: selectedPlanejamento
        }
      })
    );
    
    try {
      await Promise.all(updates);
      toast({
        title: "Sucesso",
        description: "Receitas atualizadas com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar as receitas.",
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
      mesesRecorrencia: "",
      ativo: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      console.log("=== CREATE MUTATION START ===");
      console.log("Selected planejamento:", selectedPlanejamento);
      console.log("Form data received:", data);
      
      if (!selectedPlanejamento) throw new Error("Selecione um planejamento");
      
      const payload = {
        ...data,
        planejamentoId: selectedPlanejamento,
        valor: parseFloat(data.valor),
        dataFim: data.dataFim || null,
        membro: data.membro === "none" || !data.membro ? null : data.membro,
        imovel: data.imovel === "none" || !data.imovel ? null : data.imovel,
      };
      
      console.log("Transformed payload:", payload);
      console.log("Making API call to POST /api/planejamentos/" + selectedPlanejamento + "/receitas");
      
      try {
        const result = await apiRequest("POST", `/api/planejamentos/${selectedPlanejamento}/receitas`, payload);
        console.log("CREATE API SUCCESS response:", result);
        return result;
      } catch (error) {
        console.error("CREATE API ERROR:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("=== CREATE SUCCESS ===");
      console.log("Success data:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", selectedPlanejamento, "receitas"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Receita adicionada com sucesso!",
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
        description: "Erro ao adicionar receita. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof formSchema> }) => {
      console.log("=== UPDATE MUTATION START ===");
      console.log("Received ID:", id);
      console.log("Received data:", data);
      
      const payload = {
        ...data,
        valor: parseFloat(data.valor),
        dataFim: data.dataFim || null,
        membro: data.membro === "none" || !data.membro ? null : data.membro,
      };
      
      console.log("Transformed payload:", payload);
      console.log("Making API call to PUT /api/receitas/" + id);
      
      try {
        const result = await apiRequest("PUT", `/api/receitas/${id}`, payload);
        console.log("API SUCCESS response:", result);
        return result;
      } catch (error) {
        console.error("API ERROR:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("=== UPDATE SUCCESS ===");
      console.log("Success data:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", selectedPlanejamento, "receitas"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setIsDialogOpen(false);
      setEditingReceita(null);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Receita atualizada com sucesso!",
      });
    },
    onError: (error: Error) => {
      console.error("=== UPDATE ERROR ===");
      console.error("Error object:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
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
        description: `Erro ao atualizar receita: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/receitas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", selectedPlanejamento, "receitas"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
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
    console.log("=== FORM SUBMIT START ===");
    console.log("Form submitted with data:", data);
    console.log("Editing receita:", editingReceita);
    console.log("Form errors:", form.formState.errors);
    console.log("Form is valid:", form.formState.isValid);
    console.log("Form is submitting:", form.formState.isSubmitting);
    
    if (editingReceita) {
      console.log("=== EDIT MODE DETECTED ===");
      console.log("Calling updateMutation with ID:", editingReceita.id);
      console.log("Update mutation state:", {
        isPending: updateMutation.isPending,
        isError: updateMutation.isError,
        error: updateMutation.error
      });
      updateMutation.mutate({ id: editingReceita.id, data });
    } else {
      console.log("=== CREATE MODE DETECTED ===");
      console.log("Calling createMutation");
      createMutation.mutate(data);
    }
  };

  const handleEdit = (receita: any) => {
    console.log("handleEdit called with receita:", receita);
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
    console.log("Setting form data:", formData);
    form.reset(formData);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta receita?")) {
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
    const membro = membros.find((m: any) => m.id.toString() === membroId);
    return membro ? membro.nome : "Não especificado";
  };

  const totalReceitas = receitas.filter((r: any) => r.ativo).reduce((total, receita) => {
    if (receita.frequencia === 'mensal') {
      return total + parseFloat(receita.valor);
    }
    return total;
  }, 0);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-x-hidden">
        <div className="p-8">
          {selectedPlanejamento && (
            <div className="mb-6">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Trabalhando em:</span> {planejamentos.find((p: any) => p.id === selectedPlanejamento)?.nome}
              </div>
            </div>
          )}

          {selectedPlanejamento && (
            <>
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
                      <p className="text-sm text-gray-600">{receitas.length} receita(s)</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Receitas ({receitas.length})
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant={viewMode === 'cards' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('cards')}
                      className="rounded-r-none"
                    >
                      Cards
                    </Button>
                    <Button
                      variant={viewMode === 'table' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('table')}
                      className="rounded-l-none"
                    >
                      Tabela
                    </Button>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    setEditingReceita(null);
                    form.reset({
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
                    });
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Receita
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingReceita ? "Editar Receita" : "Nova Receita"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingReceita 
                          ? "Atualize as informações da receita."
                          : "Adicione uma nova fonte de receita."
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={(e) => {
                        console.log("=== FORM ONSUBMIT EVENT ===");
                        console.log("Event:", e);
                        e.preventDefault();
                        form.handleSubmit(onSubmit, (errors) => {
                          console.log("Form validation errors:", errors);
                        })(e);
                      }} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="descricao"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Salário, Dividendos, Freelance..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="valor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="moeda"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Moeda</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {MOEDAS.map((moeda) => (
                                      <SelectItem key={moeda.value} value={moeda.value}>
                                        {moeda.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="categoria"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Categoria</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {CATEGORIAS_RECEITA.map((categoria) => (
                                      <SelectItem key={categoria.value} value={categoria.value}>
                                        {categoria.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="frequencia"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Frequência</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {FREQUENCIAS.map((frequencia) => (
                                      <SelectItem key={frequencia.value} value={frequencia.value}>
                                        {frequencia.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        {/* Seletor de meses específicos - só aparece se frequencia for "personalizada" */}
                        {form.watch('frequencia') === 'personalizada' && (
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="mesesRecorrencia"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Meses de Ocorrência</FormLabel>
                                  <FormControl>
                                    <div className="grid grid-cols-3 gap-2">
                                      {MESES_ANO.map((mes) => (
                                        <div key={mes.value} className="flex items-center space-x-2">
                                          <input
                                            type="checkbox"
                                            id={`mes-receita-${mes.value}`}
                                            name={`mes-receita-${mes.value}`}
                                            autoComplete="off"
                                            checked={field.value?.split(',').includes(mes.value) || false}
                                            onChange={(e) => {
                                              const currentMeses = field.value?.split(',').filter(m => m) || [];
                                              if (e.target.checked) {
                                                const newMeses = [...currentMeses, mes.value].sort((a, b) => parseInt(a) - parseInt(b));
                                                field.onChange(newMeses.join(','));
                                              } else {
                                                const newMeses = currentMeses.filter(m => m !== mes.value);
                                                field.onChange(newMeses.join(','));
                                              }
                                            }}
                                            className="rounded border-gray-300 text-primary focus:ring-primary"
                                          />
                                          <label htmlFor={`mes-receita-${mes.value}`} className="text-sm font-medium">
                                            {mes.label}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </FormControl>
                                  <div className="text-xs text-gray-500">
                                    <strong>Exemplos:</strong><br/>
                                    • <strong>Anual:</strong> Selecione 1 mês (ex: Dezembro para 13º salário)<br/>
                                    • <strong>Semestral:</strong> Selecione 2 meses (ex: Janeiro e Julho)<br/>
                                    • <strong>Trimestral:</strong> Selecione 4 meses (ex: Jan, Abr, Jul, Out)<br/>
                                    • <strong>Única:</strong> Selecione apenas 1 mês + defina prazo de 1 ano
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                        
                        <div className="grid grid-cols-3 gap-4">
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="membro"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Membro da Família (Opcional)</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione um membro..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="none">Nenhum específico</SelectItem>
                                    {membros.map((membro: any) => (
                                      <SelectItem key={membro.id} value={membro.id.toString()}>
                                        {membro.nome}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="imovel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Imóvel (Opcional)</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione um imóvel..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="none">Nenhum específico</SelectItem>
                                    {imoveis.map((imovel: any) => (
                                      <SelectItem key={imovel.id} value={imovel.id.toString()}>
                                        {imovel.nome}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="dataInicio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Data de Início</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="MM/AAAA" 
                                    {...field}
                                    maxLength={7}
                                    onChange={(e) => {
                                      let value = e.target.value.replace(/\D/g, '');
                                      if (value.length >= 2) {
                                        value = value.slice(0, 2) + '/' + value.slice(2, 6);
                                      }
                                      field.onChange(value);
                                      
                                      // Calcular data fim automaticamente se prazo estiver preenchido
                                      const prazo = form.getValues('prazoAnos');
                                      if (value.length === 7 && prazo) {
                                        const [mes, ano] = value.split('/');
                                        if (mes && ano) {
                                          // CORREÇÃO: movimento que inicia em jan/2025 e dura 30 anos termina em dez/2054
                                          const anoFim = parseInt(ano) + prazo - 1;
                                          const dataFim = `12/${anoFim}`; // Sempre termina em dezembro
                                          form.setValue('dataFim', dataFim);
                                        }
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="prazoAnos"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Prazo (anos)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="Ex: 5"
                                    {...field}
                                    onChange={(e) => {
                                      const prazo = e.target.value ? parseInt(e.target.value) : null;
                                      field.onChange(prazo);
                                      
                                      // Calcular data fim automaticamente
                                      const dataInicio = form.getValues('dataInicio');
                                      console.log('EDIT MODE - Prazo alterado:', { dataInicio, prazo });
                                      
                                      if (dataInicio && dataInicio.length === 7 && prazo && prazo > 0) {
                                        const [mes, ano] = dataInicio.split('/');
                                        if (mes && ano && parseInt(ano) > 2000) {
                                          // CORREÇÃO: movimento que inicia em jan/2025 e dura 30 anos termina em dez/2054
                                          const anoFim = parseInt(ano) + prazo - 1;
                                          const dataFim = `12/${anoFim}`; // Sempre termina em dezembro
                                          console.log('EDIT MODE - Calculando nova data fim:', { dataInicio, prazo, dataFim });
                                          form.setValue('dataFim', dataFim);
                                        }
                                      } else if (!prazo || prazo === 0) {
                                        // Se remover o prazo, limpar a data fim
                                        form.setValue('dataFim', '');
                                      }
                                    }}
                                    value={field.value || ''}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dataFim"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Data Fim (Calculada)</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="MM/AAAA" 
                                    {...field}
                                    maxLength={7}
                                    onChange={(e) => {
                                      let value = e.target.value.replace(/\D/g, '');
                                      if (value.length >= 2) {
                                        value = value.slice(0, 2) + '/' + value.slice(2, 6);
                                      }
                                      field.onChange(value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
{/* Campo de meses específicos removido - substituído pelo seletor visual acima */}
                        <FormField
                          control={form.control}
                          name="ativo"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Receita Ativa
                                </FormLabel>
                                <div className="text-[0.8rem] text-muted-foreground">
                                  Esta receita está sendo considerada nos cálculos?
                                </div>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button 
                            type="button"
                            disabled={false}
                            className="bg-primary hover:bg-primary-600"
                            onClick={(e) => {
                              console.log("=== BUTTON CLICKED ===");
                              console.log("Button clicked, form state:", form.formState);
                              console.log("Form values:", form.getValues());
                              console.log("editingReceita:", editingReceita);
                              console.log("Update mutation pending:", updateMutation.isPending);
                              console.log("Create mutation pending:", createMutation.isPending);
                              console.log("Button disabled state was:", createMutation.isPending || updateMutation.isPending);
                              
                              e.preventDefault();
                              const formData = form.getValues();
                              console.log("=== MANUALLY CALLING ONSUBMIT ===");
                              console.log("Raw form data:", formData);
                              
                              // Ensure valor is string
                              const processedData = {
                                ...formData,
                                valor: String(formData.valor)
                              };
                              console.log("Processed data:", processedData);
                              onSubmit(processedData);
                            }}
                          >
                            {editingReceita ? "Atualizar" : "Adicionar Receita"}
                            {createMutation.isPending && " (Create Pending)"}
                            {updateMutation.isPending && " (Update Pending)"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                </div>
              </div>

              {viewMode === 'table' ? (
                <EditableDataTableGeneric
                  data={receitas}
                  columns={receitasColumnConfig}
                  onSave={handleBulkSave}
                  searchKey="descricao"
                  searchPlaceholder="Buscar receitas..."
                  initialEditMode={false}
                />
              ) : isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : receitas.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma receita encontrada
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Adicione receitas a este planejamento.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {receitas.map((receita: any) => (
                    <Card key={receita.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center">
                              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                              {receita.descricao}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {formatCurrency(parseFloat(receita.valor), receita.moeda)} • {getFrequenciaText(receita.frequencia)}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <Badge className={getCategoriaColorLocal(receita.categoria)}>
                              {getCategoriaText(receita.categoria)}
                            </Badge>
                            {!receita.ativo && (
                              <Badge variant="secondary">Inativa</Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              {new Date(receita.dataInicio).toLocaleDateString('pt-BR')}
                              {receita.dataFim && 
                                ` - ${new Date(receita.dataFim).toLocaleDateString('pt-BR')}`
                              }
                            </span>
                          </div>

                          {receita.membro && (
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="h-4 w-4 mr-2" />
                              <span>{getMemberName(receita.membro)}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between pt-4 border-t">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(receita)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(receita.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {!selectedPlanejamento && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecione um Planejamento
              </h3>
              <p className="text-gray-500 mb-6">
                Escolha um planejamento acima para visualizar e gerenciar as receitas.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
