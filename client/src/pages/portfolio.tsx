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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPortfolioInvestimentoSchema } from "@shared/schema";
import { CATEGORIAS_INVESTIMENTO, CATEGORIAS_INVESTIMENTO_VALUES, MOEDAS, getCategoriaColor } from "@shared/constants";
import { Plus, Briefcase, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { EditableDataTableGeneric } from "@/components/ui/editable-data-table-generic";
import { z } from "zod";

const formSchema = insertPortfolioInvestimentoSchema.extend({
  quantidade: z.string(),
  precoMedio: z.string(),
  valorAtual: z.string(),
});

export default function Portfolio() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvestimento, setEditingInvestimento] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const { selectedPlanejamento } = usePlanejamentoContext();

  // Configurações das colunas para tabela editável
  const portfolioColumnConfig = [
    { key: "ativo", header: "Ativo", type: "text" as const },
    { key: "categoria", header: "Categoria", type: "select" as const, options: CATEGORIAS_INVESTIMENTO_VALUES },
    { key: "quantidade", header: "Quantidade", type: "number" as const },
    { key: "precoMedio", header: "Preço Médio", type: "currency" as const },
    { key: "valorAtual", header: "Valor Atual", type: "currency" as const },
    { key: "moeda", header: "Moeda", type: "select" as const, options: MOEDAS.map(m => m.value) },
  ];

  // Função para salvamento em massa
  const handleBulkSave = async (updatedData: any[]) => {
    const updates = updatedData.map(item => 
      updateMutation.mutateAsync({
        id: item.id,
        data: {
          ...item,
          quantidade: String(item.quantidade || "0"),
          precoMedio: String(item.precoMedio || "0"),
          valorAtual: String(item.valorAtual || "0"),
          planejamentoId: selectedPlanejamento
        }
      })
    );
    
    try {
      await Promise.all(updates);
      toast({
        title: "Sucesso",
        description: "Investimentos atualizados com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar os investimentos.",
        variant: "destructive",
      });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoria: "acoes",
      ativo: "",
      quantidade: "",
      precoMedio: "",
      valorAtual: "",
      moeda: "BRL",
    },
  });

  const { data: planejamentos = [] } = useQuery({
    queryKey: ["/api/planejamentos"],
  });

  const { data: investimentos = [], isLoading } = useQuery({
    queryKey: ["/api/planejamentos", selectedPlanejamento, "portfolio"],
    enabled: !!selectedPlanejamento,
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (!selectedPlanejamento) throw new Error("Selecione um planejamento");
      const payload = {
        ...data,
        planejamentoId: selectedPlanejamento,
        quantidade: parseFloat(data.quantidade),
        precoMedio: parseFloat(data.precoMedio),
        valorAtual: parseFloat(data.valorAtual),
      };
      await apiRequest(`/api/planejamentos/${selectedPlanejamento}/portfolio`, {
        method: "POST",
        body: payload
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", selectedPlanejamento, "portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Investimento adicionado com sucesso!",
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
        description: "Erro ao adicionar investimento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof formSchema> }) => {
      const payload = {
        ...data,
        quantidade: parseFloat(data.quantidade),
        precoMedio: parseFloat(data.precoMedio),
        valorAtual: parseFloat(data.valorAtual),
      };
      await apiRequest(`/api/portfolio/${id}`, {
        method: "PUT",
        body: payload
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", selectedPlanejamento, "portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setIsDialogOpen(false);
      setEditingInvestimento(null);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Investimento atualizado com sucesso!",
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
        description: "Erro ao atualizar investimento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/portfolio/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", selectedPlanejamento, "portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Sucesso",
        description: "Investimento excluído com sucesso!",
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
        description: "Erro ao excluir investimento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const processedData = {
      ...data,
      quantidade: String(data.quantidade),
      precoMedio: String(data.precoMedio),
      valorAtual: String(data.valorAtual)
    };
    
    if (editingInvestimento) {
      updateMutation.mutate({ id: editingInvestimento.id, data: processedData });
    } else {
      createMutation.mutate(processedData);
    }
  };

  const handleEdit = (investimento: any) => {
    setEditingInvestimento(investimento);
    form.reset({
      categoria: investimento.categoria,
      ativo: investimento.ativo,
      quantidade: investimento.quantidade?.toString() || "",
      precoMedio: investimento.precoMedio?.toString() || "",
      valorAtual: investimento.valorAtual?.toString() || "",
      moeda: investimento.moeda,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este investimento?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatCurrency = (value: number, moeda: string = "BRL") => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: moeda
    }).format(value);
  };

  const getCategoriaColor = (categoria: string) => {
    const colors: { [key: string]: string } = {
      'renda_fixa': 'bg-blue-100 text-blue-800',
      'acoes': 'bg-green-100 text-green-800',
      'fundos_imobiliarios': 'bg-yellow-100 text-yellow-800',
      'criptomoedas': 'bg-purple-100 text-purple-800',
      'reserva_emergencia': 'bg-gray-100 text-gray-800',
    };
    return colors[categoria] || 'bg-gray-100 text-gray-800';
  };

  const getCategoriaText = (categoria: string) => {
    const names: { [key: string]: string } = {
      'renda_fixa': 'Renda Fixa',
      'acoes': 'Ações',
      'fundos_imobiliarios': 'Fundos Imobiliários',
      'criptomoedas': 'Criptomoedas',
      'reserva_emergencia': 'Reserva de Emergência',
    };
    return names[categoria] || categoria;
  };

  const calculatePerformance = (valorAtual: number, precoMedio: number, quantidade: number) => {
    const valorInvestido = precoMedio * quantidade;
    const performance = ((valorAtual - valorInvestido) / valorInvestido) * 100;
    return performance;
  };

  const totalPortfolio = investimentos.reduce((total, inv) => total + parseFloat(inv.valorAtual), 0);

  return (
    <MainLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-600 mt-2">Gerencie seus investimentos e acompanhe a performance</p>
        </div>

        {selectedPlanejamento && (
            <>
              {/* Portfolio Summary */}
              {totalPortfolio > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Total do Portfolio</h3>
                      <p className="text-3xl font-bold text-primary mt-1">
                        {formatCurrency(totalPortfolio)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{investimentos.length} investimento(s)</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Investimentos ({investimentos.length})
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
                    setEditingInvestimento(null);
                    form.reset();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Investimento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingInvestimento ? "Editar Investimento" : "Novo Investimento"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingInvestimento 
                          ? "Atualize as informações do investimento."
                          : "Adicione um novo investimento ao portfolio."
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="categoria"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Categoria</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione a categoria..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="renda_fixa">Renda Fixa</SelectItem>
                                  <SelectItem value="acoes">Ações</SelectItem>
                                  <SelectItem value="fundos_imobiliarios">Fundos Imobiliários</SelectItem>
                                  <SelectItem value="criptomoedas">Criptomoedas</SelectItem>
                                  <SelectItem value="reserva_emergencia">Reserva de Emergência</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ativo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do Ativo</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: ITUB4, Tesouro IPCA+, BTC" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="quantidade"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantidade</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.00000001"
                                    placeholder="100"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="precoMedio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preço Médio</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.00000001"
                                    placeholder="25.50"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="valorAtual"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor Atual Total</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    placeholder="2550.00"
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
                                    <SelectItem value="BRL">BRL - Real Brasileiro</SelectItem>
                                    <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <DialogFooter>
                          <Button 
                            type="button"
                            className="bg-primary hover:bg-primary-600"
                            onClick={(e) => {
                              e.preventDefault();
                              const formData = form.getValues();
                              console.log("=== MANUALLY CALLING ONSUBMIT ===");
                              console.log("Raw form data:", formData);
                              
                              const processedData = {
                                ...formData,
                                quantidade: String(formData.quantidade),
                                precoMedio: String(formData.precoMedio),
                                valorAtual: String(formData.valorAtual),
                                planejamentoId: selectedPlanejamento
                              };
                              console.log("Processed data:", processedData);
                              onSubmit(processedData);
                            }}
                          >
                            {editingInvestimento ? "Atualizar" : "Adicionar Investimento"}
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
                  data={investimentos}
                  columns={portfolioColumnConfig}
                  onSave={handleBulkSave}
                  searchKey="ativo"
                  searchPlaceholder="Buscar investimentos..."
                  initialEditMode={false}
                />
              ) : isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : investimentos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum investimento encontrado
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Adicione investimentos ao portfolio deste planejamento.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {investimentos.map((investimento: any) => {
                    const performance = calculatePerformance(
                      parseFloat(investimento.valorAtual),
                      parseFloat(investimento.precoMedio),
                      parseFloat(investimento.quantidade)
                    );
                    const isPositive = performance >= 0;

                    return (
                      <Card key={investimento.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg flex items-center">
                                <Briefcase className="h-5 w-5 mr-2" />
                                {investimento.ativo}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {formatCurrency(parseFloat(investimento.valorAtual), investimento.moeda)}
                              </CardDescription>
                            </div>
                            <Badge className={getCategoriaColor(investimento.categoria)}>
                              {getCategoriaText(investimento.categoria)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Quantidade:</span>
                                <div className="text-gray-600">{parseFloat(investimento.quantidade).toLocaleString('pt-BR')}</div>
                              </div>
                              <div>
                                <span className="font-medium">Preço Médio:</span>
                                <div className="text-gray-600">
                                  {formatCurrency(parseFloat(investimento.precoMedio), investimento.moeda)}
                                </div>
                              </div>
                            </div>

                            <div className="pt-3 border-t">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Performance:</span>
                                <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                  {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                                  {isPositive ? '+' : ''}{performance.toFixed(2)}%
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEdit(investimento)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDelete(investimento.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}

        {!selectedPlanejamento && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Selecione um Planejamento
            </h3>
            <p className="text-gray-500 mb-6">
              Escolha um planejamento acima para visualizar e gerenciar o portfolio de investimentos.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
