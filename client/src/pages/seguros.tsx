import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit3, Save, X, Shield, Users } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
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
  observacoes: z.string().optional(),
});

const inssSchema = z.object({
  membroId: z.number().min(1, "Membro é obrigatório"),
  idadeConcessao: z.number().min(50, "Idade mínima é 50 anos").max(80, "Idade máxima é 80 anos"),
  beneficio: z.string().min(1, "Valor do benefício é obrigatório"),
  moeda: z.string().default("BRL"),
});

type SeguroForm = z.infer<typeof seguroSchema>;
type InssForm = z.infer<typeof inssSchema>;

interface InssEditFormProps {
  beneficio: Inss;
  membros: MembroFamily[];
  onSave: (beneficio: Inss, data: Partial<InssForm>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function InssEditForm({ beneficio, membros, onSave, onCancel, isLoading }: InssEditFormProps) {
  const [formData, setFormData] = useState({
    membroId: beneficio.membroId || undefined,
    idadeConcessao: beneficio.idadeConcessao,
    beneficio: beneficio.beneficio.toString(),
    moeda: beneficio.moeda,
  });

  const handleSave = () => {
    onSave(beneficio, {
      membroId: formData.membroId,
      idadeConcessao: formData.idadeConcessao,
      beneficio: formData.beneficio,
      moeda: formData.moeda,
    });
  };

  return (
    <div className="mt-2 space-y-3 bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Membro da Família</label>
          <Select 
            value={formData.membroId ? formData.membroId.toString() : ""} 
            onValueChange={(value) => setFormData({...formData, membroId: parseInt(value)})}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {membros.map(membro => (
                <SelectItem key={membro.id} value={membro.id.toString()}>
                  {membro.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Idade de Concessão</label>
          <Input
            type="number"
            value={formData.idadeConcessao}
            onChange={(e) => setFormData({...formData, idadeConcessao: parseInt(e.target.value)})}
            className="h-8"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Valor do Benefício</label>
          <Input
            value={formData.beneficio}
            onChange={(e) => setFormData({...formData, beneficio: e.target.value})}
            className="h-8"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Moeda</label>
          <Select 
            value={formData.moeda} 
            onValueChange={(value) => setFormData({...formData, moeda: value})}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BRL">BRL</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-1" />
          Cancelar
        </Button>
        <Button size="sm" onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-1" />
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
}

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
      moeda: "BRL",
      frequencia: "mensal",
    },
  });

  const inssForm = useForm<InssForm>({
    resolver: zodResolver(inssSchema),
    defaultValues: {
      moeda: "BRL",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: SeguroForm) => {
      return apiRequest(`/api/planejamentos/${planejamentoId}/seguros`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seguros", planejamentoId] });
      setIsModalOpen(false);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Seguro criado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar seguro",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<SeguroForm> }) => {
      return apiRequest(`/api/seguros/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seguros", planejamentoId] });
      setEditingId(null);
      toast({
        title: "Sucesso",
        description: "Seguro atualizado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar seguro",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/seguros/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seguros", planejamentoId] });
      toast({
        title: "Sucesso",
        description: "Seguro excluído com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao excluir seguro",
        variant: "destructive",
      });
    },
  });

  const createInssMutation = useMutation({
    mutationFn: async (data: InssForm) => {
      return apiRequest(`/api/planejamentos/${planejamentoId}/inss`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", planejamentoId, "inss"] });
      setIsInssModalOpen(false);
      inssForm.reset();
      toast({
        title: "Sucesso",
        description: "Benefício INSS criado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar benefício INSS",
        variant: "destructive",
      });
    },
  });

  const updateInssMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InssForm> }) => {
      return apiRequest(`/api/inss/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", planejamentoId, "inss"] });
      setEditingInssId(null);
      toast({
        title: "Sucesso",
        description: "Benefício INSS atualizado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar benefício INSS",
        variant: "destructive",
      });
    },
  });

  const deleteInssMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/inss/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", planejamentoId, "inss"] });
      toast({
        title: "Sucesso",
        description: "Benefício INSS excluído com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao excluir benefício INSS",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: SeguroForm) => {
    createMutation.mutate(data);
  };

  const handleCreateInss = (data: InssForm) => {
    createInssMutation.mutate(data);
  };

  const handleEdit = (seguro: Seguro) => {
    setEditingId(seguro.id);
  };

  const handleSave = (seguro: Seguro, updatedData: Partial<SeguroForm>) => {
    updateMutation.mutate({ id: seguro.id, data: updatedData });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este seguro?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditInss = (beneficio: Inss) => {
    setEditingInssId(beneficio.id);
  };

  const handleSaveInss = (beneficio: Inss, updatedData: Partial<InssForm>) => {
    updateInssMutation.mutate({ id: beneficio.id, data: updatedData });
  };

  const handleCancelEditInss = () => {
    setEditingInssId(null);
  };

  const handleDeleteInss = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este benefício INSS?")) {
      deleteInssMutation.mutate(id);
    }
  };

  const getMemberName = (membroId: number | null) => {
    if (!membroId) return "Não especificado";
    const membro = membros.find(m => m.id === membroId);
    return membro ? membro.nome : "Não encontrado";
  };

  const formatCurrency = (value: string | number, currency = "BRL") => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency,
    }).format(numValue);
  };

  const getCoberturaColor = (cobertura: string) => {
    switch (cobertura.toLowerCase()) {
      case "vida":
        return "bg-blue-100 text-blue-800";
      case "invalidez":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading || isLoadingInss) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold">Seguros e Previdência</h1>
          </div>
        </div>

        <Tabs defaultValue="seguros" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="seguros" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Seguros
            </TabsTrigger>
            <TabsTrigger value="inss" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              INSS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="seguros" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Seguros</h2>
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
                    <DialogDescription>
                      Adicione um novo seguro de mercado para um membro da família.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="membroId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Membro da Família</FormLabel>
                              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value ? field.value.toString() : ""}>
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
                                  <SelectItem value="vida">Vida</SelectItem>
                                  <SelectItem value="invalidez">Invalidez</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="seguradora"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seguradora *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome da seguradora" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="cs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Capital Segurado *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="0.00" />
                              </FormControl>
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
                                <Input {...field} placeholder="0.00" />
                              </FormControl>
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
                                  <SelectItem value="BRL">BRL</SelectItem>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="EUR">EUR</SelectItem>
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
                                <Input {...field} placeholder="0.00" />
                              </FormControl>
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
                                  <SelectItem value="semestral">Semestral</SelectItem>
                                  <SelectItem value="anual">Anual</SelectItem>
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
                            <FormLabel>Coberturas Adicionais</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Descreva coberturas adicionais do seguro" />
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
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(seguro.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
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
                          <span className="font-medium">Coberturas Adicionais:</span> {seguro.observacoes}
                        </div>
                      )}
                    </div>
                  </CardContent>
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
                    <DialogDescription>
                      Configure um benefício de previdência social para um membro da família.
                    </DialogDescription>
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
                              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value ? field.value.toString() : ""}>
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
                                  placeholder="65" 
                                />
                              </FormControl>
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
                                <Input {...field} placeholder="0.00" />
                              </FormControl>
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
                                  <SelectItem value="BRL">BRL</SelectItem>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

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
              {beneficios.map((beneficio) => (
                <Card key={beneficio.id} className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">Benefício INSS</CardTitle>

                        </div>
                        {editingInssId !== beneficio.id ? (
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>Membro: {getMemberName(beneficio.membroId)}</span>
                            <span>Idade de Concessão: {beneficio.idadeConcessao} anos</span>
                            <span>Benefício: {formatCurrency(beneficio.beneficio, beneficio.moeda)}</span>
                          </div>
                        ) : (
                          <InssEditForm 
                            beneficio={beneficio}
                            membros={membros}
                            onSave={handleSaveInss}
                            onCancel={handleCancelEditInss}
                            isLoading={updateInssMutation.isPending}
                          />
                        )}
                      </div>
                      {editingInssId !== beneficio.id && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditInss(beneficio)}
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
                      )}
                    </div>
                  </CardHeader>

                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}