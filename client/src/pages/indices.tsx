import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import MainLayout from "@/components/layout/MainLayout";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertIndiceEconomicoSchema } from "@shared/schema";
import { Plus, BarChart3, Edit, Trash2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { z } from "zod";

const formSchema = insertIndiceEconomicoSchema.extend({
  valor: z.string(),
  data: z.string(),
  manual: z.boolean().optional(),
  atualizacaoAutomatica: z.boolean().optional(),
});

export default function Indices() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndice, setEditingIndice] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      valor: "",
      data: new Date().toISOString().split('T')[0],
      tipo: "",
      unidade: "%",
      manual: false,
      atualizacaoAutomatica: true,
    },
  });

  const { data: indicesData = [], isLoading, error } = useQuery({
    queryKey: ["/api/indices"],
    queryFn: async () => {
      const response = await fetch("/api/indices", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
  });

  const indices = Array.isArray(indicesData) ? indicesData : [];

  const autoUpdateMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/indices/auto-update", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/indices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Sucesso",
        description: "Índices automáticos atualizados com dados do último dia útil!",
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
        description: "Erro ao atualizar índices automáticos. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return await apiRequest("POST", "/api/indices", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/indices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Índice econômico adicionado com sucesso!",
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
        description: "Erro ao adicionar índice. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof formSchema> }) => {
      console.log("[UPDATE] Enviando dados para atualização:", { id, data });
      const response = await fetch(`/api/indices/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("[UPDATE] Resultado da atualização:", result);
      return result;
    },
    onSuccess: async (result) => {
      console.log("[UPDATE] Sucesso na atualização, invalidando cache...");
      // Invalida e recarrega imediatamente
      await queryClient.invalidateQueries({ queryKey: ["/api/indices"] });
      await queryClient.refetchQueries({ queryKey: ["/api/indices"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setIsDialogOpen(false);
      setEditingIndice(null);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Índice econômico atualizado com sucesso!",
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
        description: "Erro ao atualizar índice. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    let processedData;
    
    // Configurações específicas para diferentes índices
    if (data.nome === "Idade Limite Dependentes") {
      processedData = {
        ...data,
        valor: String(data.valor),
        tipo: "parametro",
        unidade: "anos", 
        manual: true,
        atualizacaoAutomatica: false
      };
    } else if (data.nome === "Taxa de Juros Real") {
      processedData = {
        ...data,
        valor: String(data.valor),
        tipo: "manual",
        manual: true,
        atualizacaoAutomatica: false
      };
    } else {
      processedData = {
        ...data,
        valor: String(data.valor),
        manual: false,
        atualizacaoAutomatica: true
      };
    }
    
    if (editingIndice) {
      updateMutation.mutate({ id: editingIndice.id, data: processedData as any });
    } else {
      createMutation.mutate(processedData as any);
    }
  };

  const handleEdit = (indice: any) => {
    console.log("[EDIT] Editando índice:", indice);
    setEditingIndice(indice);
    const formData = {
      nome: indice.nome,
      valor: String(parseFloat(indice.valor) || 0), // Converte para string para compatibilidade
      data: indice.data,
      tipo: indice.tipo || "",
      unidade: indice.unidade || "",
    };
    console.log("[EDIT] Dados do form:", formData);
    form.reset(formData);
    setIsDialogOpen(true);
  };

  const canEditIndices = user?.role === "administrador" || user?.role === "advisor";

  const getTipoColor = (tipo: string) => {
    const colors: { [key: string]: string } = {
      'taxa': 'bg-blue-100 text-blue-800',
      'cambio': 'bg-green-100 text-green-800',
      'inflacao': 'bg-orange-100 text-orange-800',
      'manual': 'bg-purple-100 text-purple-800',
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const getTipoText = (tipo: string) => {
    const names: { [key: string]: string } = {
      'taxa': 'Taxa',
      'cambio': 'Câmbio',
      'inflacao': 'Inflação',
      'manual': 'Manual',
    };
    return names[tipo] || tipo;
  };

  const getChangeIcon = (nome: string, valor: number) => {
    // This would normally compare with previous value
    // For now, show neutral icon
    return Minus;
  };

  const formatValue = (valor: any, unidade: string, nome?: string) => {
    const numericValue = parseFloat(valor) || 0;
    if (unidade === "R$") {
      return `R$ ${numericValue.toFixed(2)}`;
    } else if (unidade === "%") {
      return `${numericValue.toFixed(2)}%`;
    } else if (unidade === "anos" && nome === "Idade Limite Dependentes") {
      return `${Math.round(numericValue)} ${unidade}`;
    }
    return `${numericValue.toFixed(4)}${unidade}`;
  };

  const getIndiceDescription = (nome: string) => {
    const descriptions: { [key: string]: string } = {
      'CDI': 'Certificado de Depósito Interbancário',
      'SELIC': 'Sistema Especial de Liquidação e Custódia',
      'IPCA': 'Índice Nacional de Preços ao Consumidor Amplo',
      'USD_BRL': 'Dólar Americano / Real Brasileiro',
      'EUR_BRL': 'Euro / Real Brasileiro',
      'Taxa de Juros Real': 'Taxa real descontada a inflação (definida pelo usuário)',
      'Idade Limite Dependentes': 'Idade limite para dependentes quando ambos provedores ausentes',
    };
    return descriptions[nome] || 'Parâmetro ou índice econômico';
  };

  return (
    <MainLayout>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Parâmetros e Índices Atuais ({(indices || []).length})
            </h2>
            {canEditIndices && (
              <div className="flex gap-3">
                <Button 
                  onClick={() => autoUpdateMutation.mutate()}
                  disabled={autoUpdateMutation.isPending}
                  variant="outline"
                  className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  {autoUpdateMutation.isPending ? "Atualizando..." : "Atualizar Automáticos"}
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    setEditingIndice(null);
                    form.reset();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Índice
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingIndice ? "Editar Índice" : "Novo Índice Econômico"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingIndice 
                        ? "Atualize as informações do índice econômico."
                        : "Adicione um novo índice econômico para acompanhamento."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome do Índice</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o índice..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="CDI">CDI (Automático)</SelectItem>
                                <SelectItem value="SELIC">SELIC (Automático)</SelectItem>
                                <SelectItem value="IPCA">IPCA (Automático)</SelectItem>
                                <SelectItem value="USD_BRL">USD/BRL (Automático)</SelectItem>
                                <SelectItem value="EUR_BRL">EUR/BRL (Automático)</SelectItem>
                                <SelectItem value="Taxa de Juros Real">Taxa de Juros Real (Manual)</SelectItem>
                                <SelectItem value="Idade Limite Dependentes">Idade Limite Dependentes (Manual)</SelectItem>
                              </SelectContent>
                            </Select>
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
                                  step="0.0001"
                                  placeholder="13.75"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="data"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {/* Campos Tipo e Unidade apenas para índices que não sejam "Idade Limite Dependentes" */}
                      {form.watch("nome") !== "Idade Limite Dependentes" && (
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="tipo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tipo</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="taxa">Taxa</SelectItem>
                                    <SelectItem value="cambio">Câmbio</SelectItem>
                                    <SelectItem value="inflacao">Inflação</SelectItem>
                                    <SelectItem value="manual">Manual</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="unidade"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Unidade</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="%">% (Percentual)</SelectItem>
                                    <SelectItem value="R$">R$ (Real)</SelectItem>
                                    <SelectItem value="pts">pts (Pontos)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      <DialogFooter>
                        <Button 
                          type="submit" 
                          disabled={createMutation.isPending || updateMutation.isPending}
                          className="bg-primary hover:bg-primary-600"
                        >
                          {createMutation.isPending || updateMutation.isPending 
                            ? "Salvando..." 
                            : editingIndice ? "Atualizar" : "Adicionar Índice"
                          }
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (indices || []).length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum índice encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                {canEditIndices 
                  ? "Adicione índices econômicos para acompanhamento." 
                  : "Aguarde a atualização dos índices econômicos."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(indices || []).slice(0, 3).map((indice: any) => {
                  const ChangeIcon = getChangeIcon(indice.nome, indice.valor);
                  return (
                    <Card key={indice.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {indice.nome === "USD_BRL" ? "USD/BRL" : indice.nome}
                          </CardTitle>
                          <Badge className={getTipoColor(indice.tipo)}>
                            {getTipoText(indice.tipo)}
                          </Badge>
                        </div>
                        <CardDescription>
                          {getIndiceDescription(indice.nome)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatValue(indice.valor, indice.unidade, indice.nome)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <ChangeIcon className="h-4 w-4 mr-1" />
                            {new Date(indice.data).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Full Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Histórico Completo</CardTitle>
                  <CardDescription>
                    Todos os índices econômicos registrados no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Índice</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Data</TableHead>
                        {canEditIndices && <TableHead>Ações</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(indices || []).map((indice: any) => (
                        <TableRow key={indice.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {indice.nome === "USD_BRL" ? "USD/BRL" : indice.nome}
                                {indice.manual && (
                                  <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-600">
                                    Manual
                                  </Badge>
                                )}
                                {indice.atualizacaoAutomatica && !indice.manual && (
                                  <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-600">
                                    Auto
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {getIndiceDescription(indice.nome)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTipoColor(indice.tipo)}>
                              {getTipoText(indice.tipo)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {formatValue(indice.valor, indice.unidade, indice.nome)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(indice.data).toLocaleDateString('pt-BR')}
                          </TableCell>
                          {canEditIndices && (
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEdit(indice)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
    </MainLayout>
  );
}
