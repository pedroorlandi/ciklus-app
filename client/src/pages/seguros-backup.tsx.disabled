import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit3, Save, X, Shield, Users } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePlanejamentoContext } from "@/hooks/usePlanejamentoContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Seguro, Inss, MembroFamily } from "@shared/schema";

const seguroSchema = z.object({
  membroId: z.number().optional(),
  cobertura: z.string().min(1, "Cobertura é obrigatória"),
  seguradora: z.string().min(1, "Seguradora é obrigatória"),
  cs: z.string().min(1, "Capital Segurado é obrigatório"),
  custo: z.string().min(1, "Custo é obrigatório"),
  moeda: z.string().default("BRL"),
  frequencia: z.string().default("mensal"),
  csSugerido: z.string().min(1, "CS Sugerido é obrigatório"),
  status: z.string().default("ativo"),
  observacoes: z.string().optional(),
});

const inssSchema = z.object({
  membroId: z.number().min(1, "Membro é obrigatório"),
  idadeConcessao: z.number().min(50, "Idade mínima é 50 anos").max(80, "Idade máxima é 80 anos"),
  beneficio: z.string().min(1, "Valor do benefício é obrigatório"),
  moeda: z.string().default("BRL"),
  observacoes: z.string().optional(),
});

type SeguroForm = z.infer<typeof seguroSchema>;
type InssForm = z.infer<typeof inssSchema>;

export default function Seguros() {
  const { selectedPlanejamento } = usePlanejamentoContext();
  const planejamentoId = selectedPlanejamento;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingInssId, setEditingInssId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInssModalOpen, setIsInssModalOpen] = useState(false);

  if (!planejamentoId) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Selecione um planejamento primeiro</p>
        </div>
      </MainLayout>
    );
  }

  const { data: seguros = [], isLoading } = useQuery<Seguro[]>({
    queryKey: ["/api/seguros", planejamentoId],
    enabled: !!planejamentoId,
  });

  const { data: beneficios = [], isLoading: isLoadingInss } = useQuery<Inss[]>({
    queryKey: ["/api/planejamentos", planejamentoId, "inss"],
    enabled: !!planejamentoId,
  });

  const { data: membros = [] } = useQuery<MembroFamily[]>({
    queryKey: ["/api/planejamentos", planejamentoId, "membros"],
    enabled: !!planejamentoId,
  });

  const form = useForm<SeguroForm>({
    resolver: zodResolver(seguroSchema),
    defaultValues: {
      cobertura: "",
      seguradora: "",
      cs: "",
      custo: "",
      moeda: "BRL",
      frequencia: "mensal",
      csSugerido: "",
      status: "ativo",
      observacoes: "",
    },
  });

  const editForm = useForm<SeguroForm>({
    resolver: zodResolver(seguroSchema),
  });

  const inssForm = useForm<InssForm>({
    resolver: zodResolver(inssSchema),
    defaultValues: {
      idadeConcessao: 65,
      beneficio: "",
      moeda: "BRL",
      observacoes: "",
    },
  });

  const editInssForm = useForm<InssForm>({
    resolver: zodResolver(inssSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: SeguroForm) =>
      apiRequest("/api/seguros", {
        method: "POST",
        body: { ...data, planejamentoId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seguros"] });
      form.reset();
      setIsModalOpen(false);
      toast({ title: "Seguro criado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao criar seguro", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SeguroForm }) =>
      apiRequest(`/api/seguros/${id}`, {
        method: "PUT",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seguros"] });
      setEditingId(null);
      toast({ title: "Seguro atualizado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar seguro", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/seguros/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seguros"] });
      toast({ title: "Seguro excluído com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir seguro", variant: "destructive" });
    },
  });

  // INSS Mutations
  const createInssMutation = useMutation({
    mutationFn: (data: InssForm) =>
      apiRequest(`/api/planejamentos/${planejamentoId}/inss`, {
        method: "POST",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", planejamentoId, "inss"] });
      inssForm.reset();
      setIsInssModalOpen(false);
      toast({ title: "Benefício INSS criado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao criar benefício INSS", variant: "destructive" });
    },
  });

  const updateInssMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: InssForm }) =>
      apiRequest(`/api/inss/${id}`, {
        method: "PUT",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", planejamentoId, "inss"] });
      setEditingInssId(null);
      toast({ title: "Benefício INSS atualizado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar benefício INSS", variant: "destructive" });
    },
  });

  const deleteInssMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/inss/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", planejamentoId, "inss"] });
      toast({ title: "Benefício INSS excluído com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir benefício INSS", variant: "destructive" });
    },
  });

  const handleCreate = (data: SeguroForm) => {
    createMutation.mutate(data);
  };

  const handleEdit = (seguro: Seguro) => {
    setEditingId(seguro.id);
    editForm.reset({
      membroId: seguro.membroId || undefined,
      cobertura: seguro.cobertura,
      seguradora: seguro.seguradora,
      cs: seguro.cs,
      custo: seguro.custo,
      moeda: seguro.moeda,
      frequencia: seguro.frequencia,
      csSugerido: seguro.csSugerido,
      status: seguro.status,
      observacoes: seguro.observacoes || "",
    });
  };

  const handleUpdate = (data: SeguroForm) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Excluir este seguro permanentemente?")) {
      deleteMutation.mutate(id);
    }
  };

  // INSS Handler Functions
  const handleCreateInss = (data: InssForm) => {
    createInssMutation.mutate(data);
  };

  const handleEditInss = (beneficio: Inss) => {
    setEditingInssId(beneficio.id);
    editInssForm.reset({
      membroId: beneficio.membroId,
      idadeConcessao: beneficio.idadeConcessao,
      beneficio: beneficio.beneficio,
      moeda: beneficio.moeda,
      observacoes: beneficio.observacoes || "",
    });
  };

  const handleUpdateInss = (data: InssForm) => {
    if (editingInssId) {
      updateInssMutation.mutate({ id: editingInssId, data });
    }
  };

  const handleDeleteInss = (id: number) => {
    if (confirm("Excluir este benefício INSS permanentemente?")) {
      deleteInssMutation.mutate(id);
    }
  };

  const getMemberBirthYear = (membroId: number) => {
    const membro = membros.find(m => m.id === membroId);
    if (!membro?.dataNascimento) return null;
    return new Date(membro.dataNascimento).getFullYear();
  };

  const calculateRetirementYear = (membroId: number, idadeConcessao: number) => {
    const birthYear = getMemberBirthYear(membroId);
    return birthYear ? birthYear + idadeConcessao : undefined;
  };

  const formatCurrency = (value: string, moeda: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    const prefix = moeda === "USD" ? "$" : "R$";
    return `${prefix} ${num.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  };

  const getMemberName = (membroId?: number) => {
    if (!membroId) return "Família";
    const membro = membros.find(m => m.id === membroId);
    return membro?.nome || "Membro não encontrado";
  };

  const getCoberturaColor = (cobertura: string) => {
    switch (cobertura.toLowerCase()) {
      case "vida": return "bg-blue-100 text-blue-800";
      case "invalidez": return "bg-purple-100 text-purple-800";
      case "acidentes": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo": return "bg-green-100 text-green-800";
      case "suspenso": return "bg-yellow-100 text-yellow-800";
      case "cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seguros & Previdência</h1>
            <p className="text-gray-600">Gestão de seguros de vida, invalidez e benefícios INSS</p>
          </div>
        </div>

        <Tabs defaultValue="seguros" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="seguros" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Seguros de Mercado
            </TabsTrigger>
            <TabsTrigger value="inss" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              INSS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="seguros" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Seguros de Mercado</h2>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Seguro
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Seguro</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="membroId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Membro</FormLabel>
                              <Select onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} value={field.value?.toString() || ""}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o membro" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {membros.map(membro => (
                                    <SelectItem key={membro.id} value={membro.id.toString()}>
                                      {membro.nome}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cobertura"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cobertura *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione a cobertura" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="vida">Seguro de Vida</SelectItem>
                                  <SelectItem value="invalidez">Invalidez</SelectItem>
                                  <SelectItem value="acidentes">Acidentes</SelectItem>
                                  <SelectItem value="funeral">Funeral</SelectItem>
                                  <SelectItem value="outros">Outros</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="seguradora"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Seguradora *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Nome da seguradora" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <FormField
                          control={form.control}
                          name="cs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Capital Segurado *</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} placeholder="Ex: 500000" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="custo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custo *</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} placeholder="Ex: 150" />
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
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="BRL">Real (BRL)</SelectItem>
                                  <SelectItem value="USD">Dólar (USD)</SelectItem>
                                </SelectContent>
                              </Select>
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
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="mensal">Mensal</SelectItem>
                                  <SelectItem value="anual">Anual</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="csSugerido"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CS Sugerido *</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} placeholder="Capital segurado sugerido" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="observacoes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Observações sobre o seguro" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending}>
                          {createMutation.isPending ? "Salvando..." : "Salvar"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {seguros.map((seguro) => (
                <Card key={seguro.id} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{getMemberName(seguro.membroId)}</CardTitle>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCoberturaColor(seguro.cobertura)}`}>
                              {seguro.cobertura}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>Seguradora: {seguro.seguradora}</span>
                            <span>CS: {formatCurrency(seguro.cs, seguro.moeda)}</span>
                            <span>Custo: {formatCurrency(seguro.custo, seguro.moeda)}/{seguro.frequencia}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(seguro)}
                          disabled={editingId === seguro.id}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(seguro.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {seguro.observacoes && (
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600">{seguro.observacoes}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inss" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">INSS - Previdência Social</h2>
              <Dialog open={isInssModalOpen} onOpenChange={setIsInssModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Benefício INSS
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Benefício INSS</DialogTitle>
                  </DialogHeader>
                  <Form {...inssForm}>
                    <form onSubmit={inssForm.handleSubmit(handleCreateInss)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={inssForm.control}
                          name="membroId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Membro da Família *</FormLabel>
                              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o membro" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {membros.map(membro => (
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
                          control={inssForm.control}
                          name="idadeConcessao"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Idade de Concessão *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  placeholder="Ex: 65"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={inssForm.control}
                          name="beneficio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor do Benefício *</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} placeholder="Ex: 5000" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={inssForm.control}
                          name="moeda"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Moeda</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="BRL">Real (BRL)</SelectItem>
                                  <SelectItem value="USD">Dólar (USD)</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={inssForm.control}
                        name="observacoes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Observações sobre o benefício previdenciário" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsInssModalOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={createInssMutation.isPending}>
                          {createInssMutation.isPending ? "Salvando..." : "Salvar"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {beneficios.map((beneficio) => {
                const retirementYear = calculateRetirementYear(beneficio.membroId, beneficio.idadeConcessao);
                
                return (
                  <Card key={beneficio.id} className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{getMemberName(beneficio.membroId)}</CardTitle>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span>Idade: {beneficio.idadeConcessao} anos</span>
                              <span>Benefício: {formatCurrency(beneficio.beneficio, beneficio.moeda)}/mês</span>
                              {retirementYear && <span className="font-medium text-purple-600">Início: {retirementYear}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditInss(beneficio)}
                            disabled={editingInssId === beneficio.id}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteInss(beneficio.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {beneficio.observacoes && (
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600">{beneficio.observacoes}</p>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Seguro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Seguro</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="membroId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Membro</FormLabel>
                          <Select onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} value={field.value?.toString() || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o membro" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {membros.map(membro => (
                                <SelectItem key={membro.id} value={membro.id.toString()}>
                                  {membro.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cobertura"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cobertura *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a cobertura" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="vida">Seguro de Vida</SelectItem>
                              <SelectItem value="invalidez">Invalidez</SelectItem>
                              <SelectItem value="acidentes">Acidentes</SelectItem>
                              <SelectItem value="funeral">Funeral</SelectItem>
                              <SelectItem value="outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seguradora"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seguradora *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nome da seguradora" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="cs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CS Atual *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} placeholder="Capital segurado" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="custo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custo *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} placeholder="Valor do prêmio" />
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
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BRL">Real (BRL)</SelectItem>
                              <SelectItem value="USD">Dólar (USD)</SelectItem>
                            </SelectContent>
                          </Select>
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
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="mensal">Mensal</SelectItem>
                              <SelectItem value="trimestral">Trimestral</SelectItem>
                              <SelectItem value="semestral">Semestral</SelectItem>
                              <SelectItem value="anual">Anual</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="csSugerido"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CS Sugerido *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} placeholder="Capital sugerido" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ativo">Ativo</SelectItem>
                              <SelectItem value="suspenso">Suspenso</SelectItem>
                              <SelectItem value="cancelado">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Observações adicionais sobre o seguro" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      {createMutation.isPending ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {seguros.map((seguro) => (
            <Card key={seguro.id} className="border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{seguro.seguradora}</CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCoberturaColor(seguro.cobertura)}`}>
                          {seguro.cobertura}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(seguro.status)}`}>
                          {seguro.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>Membro: {getMemberName(seguro.membroId)}</span>
                        <span>CS Atual: {formatCurrency(seguro.cs, seguro.moeda)}</span>
                        <span>Custo: {formatCurrency(seguro.custo, seguro.moeda)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(seguro)}
                      disabled={editingId === seguro.id}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(seguro.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {editingId === seguro.id && (
                <CardContent>
                  <Form {...editForm}>
                    <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={editForm.control}
                          name="membroId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Membro</FormLabel>
                              <Select onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} value={field.value?.toString() || ""}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {membros.map(membro => (
                                    <SelectItem key={membro.id} value={membro.id.toString()}>
                                      {membro.nome}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={editForm.control}
                          name="cobertura"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cobertura</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="vida">Seguro de Vida</SelectItem>
                                  <SelectItem value="invalidez">Invalidez</SelectItem>
                                  <SelectItem value="acidentes">Acidentes</SelectItem>
                                  <SelectItem value="funeral">Funeral</SelectItem>
                                  <SelectItem value="outros">Outros</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={editForm.control}
                          name="seguradora"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Seguradora</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <FormField
                          control={editForm.control}
                          name="cs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CS Atual</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={editForm.control}
                          name="custo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custo</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={editForm.control}
                          name="moeda"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Moeda</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="BRL">Real (BRL)</SelectItem>
                                  <SelectItem value="USD">Dólar (USD)</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={editForm.control}
                          name="frequencia"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frequência</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="mensal">Mensal</SelectItem>
                                  <SelectItem value="trimestral">Trimestral</SelectItem>
                                  <SelectItem value="semestral">Semestral</SelectItem>
                                  <SelectItem value="anual">Anual</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={editForm.control}
                          name="csSugerido"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CS Sugerido</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={editForm.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="ativo">Ativo</SelectItem>
                                  <SelectItem value="suspenso">Suspenso</SelectItem>
                                  <SelectItem value="cancelado">Cancelado</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={editForm.control}
                        name="observacoes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={updateMutation.isPending}>
                          <Save className="h-4 w-4 mr-2" />
                          {updateMutation.isPending ? "Salvando..." : "Salvar"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              )}
              
              {editingId !== seguro.id && (
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">CS Sugerido:</span> {formatCurrency(seguro.csSugerido, seguro.moeda)}
                      </div>
                      <div>
                        <span className="font-medium">Frequência:</span> {seguro.frequencia}
                      </div>
                    </div>
                    {seguro.observacoes && (
                      <div className="text-sm">
                        <span className="font-medium">Observações:</span> {seguro.observacoes}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}