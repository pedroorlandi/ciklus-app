import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPlanejamentoSchema } from "@shared/schema";
import { Plus, Calendar, User, Eye, Edit, Trash2 } from "lucide-react";
import { z } from "zod";

interface Planejamento {
  id: number;
  nome: string;
  descricao?: string;
  status: string;
  dataInicio: string;
  dataFim?: string;
  userId: string;
  planejadorId?: string;
}

const formSchema = insertPlanejamentoSchema.extend({
  dataInicio: z.string(),
}).omit({ dataFim: true, planejadorId: true }).extend({
  planejadorId: z.string().optional().nullable(),
});

export default function Planejamentos() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlanejamento, setEditingPlanejamento] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      status: "ativo",
      dataInicio: new Date().toISOString().split('T')[0],
      planejadorId: "",
    },
  });

  const { data: planejamentos = [], isLoading, error } = useQuery<Planejamento[]>({
    queryKey: ["/api/planejamentos"],
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const payload = {
        ...data,
        planejadorId: data.planejadorId || null,
      };
      await apiRequest("/api/planejamentos", {
        method: "POST",
        body: payload
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Planejamento criado com sucesso!",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Erro ao criar planejamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof formSchema> }) => {
      console.log("=== UPDATE MUTATION START ===");
      console.log("ID:", id);
      console.log("Data received:", data);
      
      const payload = {
        ...data,
        planejadorId: data.planejadorId || null,
      };
      
      console.log("Payload being sent:", payload);
      console.log("URL:", `/api/planejamentos/${id}`);
      
      const result = await apiRequest(`/api/planejamentos/${id}`, {
        method: "PUT",
        body: payload
      });
      console.log("Update result:", result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos"] });
      setIsDialogOpen(false);
      setEditingPlanejamento(null);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Planejamento atualizado com sucesso!",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Erro ao atualizar planejamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/planejamentos/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos"] });
      toast({
        title: "Sucesso",
        description: "Planejamento excluído com sucesso!",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Erro ao excluir planejamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("=== PLANEJAMENTOS FORM SUBMIT START ===");
    console.log("Form submitted with data:", data);
    console.log("Editing planejamento:", editingPlanejamento);
    
    const processedData = {
      ...data,
      userId: user?.id || "",
    };
    
    console.log("Processed data:", processedData);
    
    if (editingPlanejamento) {
      console.log("=== EDIT MODE - Calling updateMutation ===");
      updateMutation.mutate({ id: editingPlanejamento.id, data: processedData });
    } else {
      console.log("=== CREATE MODE - Calling createMutation ===");
      createMutation.mutate(processedData);
    }
  };

  const handleEdit = (planejamento: any) => {
    console.log("=== HANDLE EDIT START ===");
    console.log("Original planejamento:", planejamento);
    
    setEditingPlanejamento(planejamento);
    
    // Converter data para formato YYYY-MM-DD se necessário
    let formattedDataInicio = planejamento.dataInicio;
    if (planejamento.dataInicio && !planejamento.dataInicio.includes('-')) {
      // Se está no formato DD/MM/YYYY, converter para YYYY-MM-DD
      const [day, month, year] = planejamento.dataInicio.split('/');
      formattedDataInicio = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (planejamento.dataInicio) {
      // Se é um objeto Date ou string ISO, converter para YYYY-MM-DD
      const date = new Date(planejamento.dataInicio);
      formattedDataInicio = date.toISOString().split('T')[0];
    }
    
    const formData = {
      nome: planejamento.nome,
      descricao: planejamento.descricao || "",
      status: planejamento.status,
      dataInicio: formattedDataInicio,
      advisorId: planejamento.advisorId || "",
    };
    
    console.log("Form data being set:", formData);
    form.reset(formData);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este planejamento?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800";
      case "concluido":
        return "bg-blue-100 text-blue-800";
      case "inativo":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ativo":
        return "Ativo";
      case "concluido":
        return "Concluído";
      case "inativo":
        return "Inativo";
      default:
        return status;
    }
  };

  const canEdit = (planejamento: any) => {
    if (user?.role === "administrador") return true;
    if (user?.role === "advisor" && planejamento.advisorId === user.id) return true;
    if (user?.role === "cliente" && planejamento.userId === user.id) return true;
    return false;
  };

  // Função helper para formatar datas evitando problemas de timezone
  const formatDateSafe = (dateString: string): string => {
    if (!dateString) return "";
    
    // Se a data vem no formato YYYY-MM-DD, criar Date com valores locais
    if (dateString.includes('-') && dateString.length === 10) {
      const [year, month, day] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('pt-BR');
    }
    
    // Caso contrário, usar conversão normal
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Planejamentos</h1>
          <p className="text-gray-600 mt-2">Gerencie seus planejamentos financeiros</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Planejamentos</h1>
        <p className="text-gray-600 mt-2">Gerencie seus planejamentos financeiros</p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Seus Planejamentos ({planejamentos.length})
        </h2>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingPlanejamento(null);
                form.reset();
              }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Planejamento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingPlanejamento ? "Editar Planejamento" : "Novo Planejamento"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPlanejamento 
                      ? "Atualize as informações do planejamento financeiro."
                      : "Crie um novo planejamento financeiro para sua família."
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
                          <FormLabel>Nome do Planejamento</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Planejamento Familiar 2024" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="descricao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva os objetivos e escopo deste planejamento..." 
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dataInicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Início</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ativo">Ativo</SelectItem>
                              <SelectItem value="inativo">Inativo</SelectItem>
                              <SelectItem value="concluido">Concluído</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button 
                        type="button"
                        className="bg-primary hover:bg-primary-600"
                        onClick={(e) => {
                          e.preventDefault();
                          const formData = form.getValues();
                          console.log("=== MANUALLY CALLING ONSUBMIT PLANEJAMENTOS ===");
                          console.log("Raw form data:", formData);
                          
                          const processedData = {
                            ...formData,
                            userId: user?.id,
                          };
                          console.log("Processed data:", processedData);
                          onSubmit(processedData as any);
                        }}
                      >
                        {editingPlanejamento ? "Atualizar" : "Criar Planejamento"}
                        {createMutation.isPending && " (Create Pending)"}
                        {updateMutation.isPending && " (Update Pending)"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {planejamentos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum planejamento encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                Crie seu primeiro planejamento financeiro para começar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {planejamentos.map((planejamento) => (
                <Card key={planejamento.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{planejamento.nome}</CardTitle>
                        <CardDescription className="mt-1">
                          {planejamento.descricao || "Sem descrição"}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(planejamento.status)}>
                        {getStatusText(planejamento.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {formatDateSafe(planejamento.dataInicio)}
                          {planejamento.dataFim && 
                            ` - ${formatDateSafe(planejamento.dataFim)}`
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLocation(`/planejamentos/${planejamento.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          {canEdit(planejamento) && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(planejamento)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          )}
                        </div>
                        {canEdit(planejamento) && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(planejamento.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
    </MainLayout>
  );
}
