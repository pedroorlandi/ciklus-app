import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
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

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMembroFamilySchema } from "@shared/schema";
import { Plus, Users, Edit, Trash2 } from "lucide-react";
import { z } from "zod";

const formSchema = insertMembroFamilySchema.extend({
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
}).omit({ idade: true, planejamentoId: true }).partial({ parentesco: true });

export default function Membros() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMembro, setEditingMembro] = useState<any>(null);

  const { selectedPlanejamento } = usePlanejamentoContext();

  // Função para calcular idade a partir da data de nascimento
  const calculateAge = (dataNascimento: string): number => {
    if (!dataNascimento) return 0;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      parentesco: "membro", // Valor padrão genérico
      dataNascimento: "",
      dependente: false, // Padrão: não é provedor
    },
  });

  const { data: planejamentos = [] } = useQuery({
    queryKey: ["/api/planejamentos"],
  });

  const { data: membros = [], isLoading } = useQuery({
    queryKey: ["/api/planejamentos", selectedPlanejamento, "membros"],
    enabled: !!selectedPlanejamento,
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (!selectedPlanejamento) throw new Error("Selecione um planejamento");
      const payload = {
        ...data,
        planejamentoId: selectedPlanejamento,
      };
      console.log("=== CREATE MUTATION API CALL ===");
      console.log("Payload:", payload);
      const response = await apiRequest(`/api/planejamentos/${selectedPlanejamento}/membros`, {
        method: "POST",
        body: payload
      });
      console.log("API Response:", response);
      return response;
    },
    onSuccess: (data) => {
      console.log("=== CREATE MUTATION SUCCESS ===");
      console.log("Success data:", data);
      // Force a complete refresh of the query cache
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", selectedPlanejamento, "membros"] });
      queryClient.refetchQueries({ queryKey: ["/api/planejamentos", selectedPlanejamento, "membros"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Membro da família adicionado com sucesso!",
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
        description: "Erro ao adicionar membro. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof formSchema> }) => {
      console.log("=== UPDATE MUTATION START ===");
      console.log("Updating member ID:", id);
      console.log("Update data:", data);
      
      const payload = {
        ...data,
      };
      
      console.log("Payload being sent:", payload);
      
      try {
        const response = await apiRequest(`/api/membros/${id}`, {
          method: "PUT",
          body: payload
        });
        console.log("Update API response:", response);
        return response;
      } catch (error) {
        console.error("=== UPDATE MUTATION ERROR ===");
        console.error("Error details:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("=== UPDATE MUTATION SUCCESS ===");
      console.log("Success data:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", selectedPlanejamento, "membros"] });
      queryClient.refetchQueries({ queryKey: ["/api/planejamentos", selectedPlanejamento, "membros"] });
      setIsDialogOpen(false);
      setEditingMembro(null);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Membro atualizado com sucesso!",
      });
    },
    onError: (error: Error) => {
      console.error("=== UPDATE MUTATION ERROR HANDLER ===");
      console.error("Error:", error);
      console.error("Error message:", error.message);
      
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
        description: `Erro ao atualizar membro: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/membros/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", selectedPlanejamento, "membros"] });
      toast({
        title: "Sucesso",
        description: "Membro excluído com sucesso!",
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
        description: "Erro ao excluir membro. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("=== MEMBROS FORM SUBMIT START ===");
    console.log("Form submitted with data:", data);
    console.log("Editing membro:", editingMembro);
    console.log("Form errors:", form.formState.errors);
    console.log("Form valid:", form.formState.isValid);
    
    // Verificar se há erros no formulário
    const errors = form.formState.errors;
    if (Object.keys(errors).length > 0) {
      console.log("Form has validation errors, aborting submit");
      console.log("Validation errors:", errors);
      // Mostrar erro ao usuário
      Object.entries(errors).forEach(([field, error]: [string, any]) => {
        toast({
          title: "Erro de validação",
          description: `${field}: ${error.message}`,
          variant: "destructive",
        });
      });
      return;
    }
    
    const processedData = {
      ...data,
      parentesco: data.parentesco || "membro", // Garantir que sempre tenha um valor
      dependente: data.dependente, // Manter lógica correta - true = dependente, false = provedor  
      idade: calculateAge(data.dataNascimento), // Calcular idade automaticamente
      dataNascimento: data.dataNascimento + 'T00:00:00', // Adicionar timezone para consistência
    };
    
    console.log("Processed data:", processedData);
    
    if (editingMembro) {
      console.log("=== EDIT MODE - Calling updateMutation ===");
      console.log("Update mutation pending:", updateMutation.isPending);
      updateMutation.mutate({ id: editingMembro.id, data: processedData });
    } else {
      console.log("=== CREATE MODE - Calling createMutation ===");
      console.log("Create mutation pending:", createMutation.isPending);
      createMutation.mutate(processedData);
    }
  };

  const handleEdit = (membro: any) => {
    setEditingMembro(membro);
    // Formatar data corretamente para o input
    const formattedDate = membro.dataNascimento ? membro.dataNascimento.split('T')[0] : "";
    form.reset({
      nome: membro.nome,
      parentesco: membro.parentesco || "membro",
      dataNascimento: formattedDate,
      dependente: membro.dependente, // Manter valor original
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este membro?")) {
      deleteMutation.mutate(id);
    }
  };



  return (
    <MainLayout>
        <div className="p-8">
          {selectedPlanejamento && (
            <div className="mb-6">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Trabalhando em:</span> {(planejamentos as any[]).find((p: any) => p.id === selectedPlanejamento)?.nome}
              </div>
            </div>
          )}

          {selectedPlanejamento && (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Membros ({(membros as any[]).length})
                  </h2>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    setEditingMembro(null);
                    form.reset();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Membro
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingMembro ? "Editar Membro" : "Novo Membro da Família"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingMembro 
                          ? "Atualize as informações do membro da família."
                          : "Adicione um novo membro da família ao planejamento."
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={(e) => {
                        console.log("=== FORM SUBMIT EVENT ===");
                        console.log("Form submit event triggered");
                        e.preventDefault();
                        const formData = form.getValues();
                        console.log("Current form values:", formData);
                        console.log("Form errors:", form.formState.errors);
                        console.log("Is form valid?", form.formState.isValid);
                        form.handleSubmit(onSubmit)(e);
                      }} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="nome"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Maria Silva" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="dataNascimento"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data de Nascimento</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="dependente"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Provedor
                                </FormLabel>
                                <div className="text-[0.8rem] text-muted-foreground">
                                  Esta pessoa é um provedor financeiro da família?
                                </div>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={!field.value}
                                  onCheckedChange={(checked) => field.onChange(!checked)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button 
                            type="submit"
                            className="bg-primary hover:bg-primary-600"
                            disabled={updateMutation.isPending || createMutation.isPending}
                          >
                            {updateMutation.isPending || createMutation.isPending 
                              ? "Salvando..." 
                              : editingMembro ? "Atualizar" : "Adicionar Membro"
                            }
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : (membros as any[]).length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum membro encontrado
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Adicione membros da família a este planejamento.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(membros as any[]).map((membro: any) => (
                    <Card key={membro.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{membro.nome}</CardTitle>
                            <CardDescription className="mt-1 space-y-1">
                              <div>{membro.idade} anos</div>
                              <div className="text-sm text-gray-500">
                                {membro.dataNascimento ? new Date(membro.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR') : 'Data não informada'}
                              </div>
                            </CardDescription>
                          </div>
                          <Badge variant={membro.dependente ? "secondary" : "default"}>
                            {membro.dependente ? "Dependente" : "Provedor"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between pt-4 border-t">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(membro)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(membro.id)}
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
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecione um Planejamento
              </h3>
              <p className="text-gray-500 mb-6">
                Escolha um planejamento acima para visualizar e gerenciar os membros da família.
              </p>
            </div>
          )}
        </div>
    </MainLayout>
  );
}
