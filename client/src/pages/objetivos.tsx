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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertObjetivoSchema, type MembroFamily } from "@shared/schema";
import { Plus, Target, Edit, Trash2, Calendar, DollarSign, Home, GraduationCap, Plane, AlertTriangle, User, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditableDataTableGeneric } from "@/components/ui/editable-data-table-generic";
import { z } from "zod";

// Schema simplificado para formulário 
const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  categoria: z.string(),
  valorObjetivo: z.string(),
  valorAtual: z.string().optional(),
  moeda: z.string(),
  prioridade: z.number(),
  dataAlvo: z.string(),
  status: z.string(),
  membroId: z.number().optional(),
  planejamentoId: z.number().optional(),
});

// Componente SortableCard para drag-and-drop
function SortableCard({ objetivo, onEdit, onDelete, membros }: { objetivo: any, onEdit: (obj: any) => void, onDelete: (id: number) => void, membros: MembroFamily[] }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: objetivo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const CategoryIcon = getCategoriaIcon(objetivo.categoria);
  const progress = calculateProgress(parseFloat(objetivo.valorAtual), parseFloat(objetivo.valorObjetivo));
  const monthsRemaining = calculateMonthsRemaining(objetivo.dataAlvo);

  return (
    <Card ref={setNodeRef} style={style} className="hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-purple-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center flex-1">
            <div 
              className="cursor-grab active:cursor-grabbing p-1 mr-2 hover:bg-purple-50 rounded transition-colors"
              {...attributes}
              {...listeners}
              title="Arraste para reordenar prioridade"
            >
              <GripVertical className="h-4 w-4 text-purple-400 hover:text-purple-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center">
                <CategoryIcon className="h-5 w-5 mr-2 text-primary" />
                {objetivo.nome}
              </CardTitle>
              <CardDescription className="mt-1">
                {getCategoriaText(objetivo.categoria)}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge className={getStatusColor(objetivo.status)}>
              {getStatusText(objetivo.status)}
            </Badge>
            <Badge className={getPrioridadeColor(objetivo.prioridade)}>
              {getPrioridadeText(objetivo.prioridade)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progresso</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between items-center mt-2 text-sm">
              <span className="text-gray-600">
                {formatCurrency(parseFloat(objetivo.valorAtual), objetivo.moeda)}
              </span>
              <span className="font-medium">
                {formatCurrency(parseFloat(objetivo.valorObjetivo), objetivo.moeda)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(objetivo.dataAlvo).toLocaleDateString('pt-BR')}
            </div>
            <div className={`text-right ${monthsRemaining <= 6 ? 'text-red-600' : 'text-gray-600'}`}>
              {monthsRemaining > 0 ? `${monthsRemaining} meses` : 'Vencido'}
            </div>
          </div>

          {objetivo.descricao && (
            <p className="text-sm text-gray-600 line-clamp-2">{objetivo.descricao}</p>
          )}

          {/* Membro Responsável */}
          {objetivo.membroId && (
            <div className="flex items-center text-sm text-purple-600 bg-purple-50 px-2 py-1 rounded">
              <User className="h-3 w-3 mr-1" />
              <span className="text-xs">
                {membros.find(m => m.id === objetivo.membroId)?.nome || `Membro #${objetivo.membroId}`}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(objetivo)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(objetivo.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Funções utilitárias (movidas para cima para usar no SortableCard)
const formatCurrency = (value: number, moeda: string = "BRL") => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: moeda
  }).format(value);
};

const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    'ativo': 'bg-green-100 text-green-800',
    'pausado': 'bg-yellow-100 text-yellow-800',
    'concluido': 'bg-blue-100 text-blue-800',
    'cancelado': 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status: string) => {
  const names: { [key: string]: string } = {
    'ativo': 'Ativo',
    'pausado': 'Pausado',
    'concluido': 'Concluído',
    'cancelado': 'Cancelado',
  };
  return names[status] || status;
};

const getPrioridadeColor = (prioridade: number) => {
  if (prioridade <= 3) return 'bg-red-100 text-red-800';
  if (prioridade <= 6) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

const getPrioridadeText = (prioridade: number) => {
  return `#${prioridade}`;
};

const getCategoriaIcon = (categoria: string) => {
  const icons: { [key: string]: any } = {
    'aposentadoria': DollarSign,
    'educacao': GraduationCap,
    'casa': Home,
    'viagem': Plane,
    'emergencia': AlertTriangle,
    'investimento': Target,
    'outros': Target,
  };
  return icons[categoria] || Target;
};

const getCategoriaText = (categoria: string) => {
  const names: { [key: string]: string } = {
    'aposentadoria': 'Aposentadoria',
    'educacao': 'Educação',
    'casa': 'Casa',
    'viagem': 'Viagem',
    'emergencia': 'Emergência',
    'investimento': 'Investimento',
    'outros': 'Outros',
  };
  return names[categoria] || categoria;
};

const calculateProgress = (valorAtual: number, valorAlvo: number) => {
  if (valorAlvo === 0) return 0;
  return Math.min((valorAtual / valorAlvo) * 100, 100);
};

const calculateMonthsRemaining = (dataAlvo: string) => {
  const hoje = new Date();
  const alvo = new Date(dataAlvo);
  const diffTime = alvo.getTime() - hoje.getTime();
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  return diffMonths;
};

export default function Objetivos() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingObjetivo, setEditingObjetivo] = useState<any>(null);
  // Removido viewMode - apenas drag-and-drop agora
  const { selectedPlanejamento } = usePlanejamentoContext();

  // Sensores para drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Função para lidar com o final do drag
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = objetivos.findIndex((item: any) => item.id === active.id);
      const newIndex = objetivos.findIndex((item: any) => item.id === over.id);
      
      const newOrder = arrayMove(objetivos, oldIndex, newIndex);
      
      // Atualizar as prioridades baseadas na nova ordem
      const updatedObjetivos = newOrder.map((obj: any, index: number) => ({
        ...obj,
        prioridade: index + 1
      }));

      // Atualizar prioridades no backend
      try {
        for (const objetivo of updatedObjetivos) {
          await apiRequest(`/api/objetivos/${objetivo.id}`, {
            method: "PUT",
            body: {
              ...objetivo,
              valorObjetivo: parseFloat(objetivo.valorObjetivo || "0"),
              valorAtual: parseFloat(objetivo.valorAtual || "0"),
              planejamentoId: selectedPlanejamento || 0
            }
          });
        }
        
        // Invalidar cache para atualizar a UI
        queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", selectedPlanejamento, "objetivos"] });
        
        toast({
          title: "Sucesso",
          description: "Prioridades atualizadas com sucesso!",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao atualizar prioridades. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const { data: membros = [] } = useQuery<MembroFamily[]>({
    queryKey: ["/api/planejamentos", selectedPlanejamento, "membros"],
    enabled: !!selectedPlanejamento,
  });

  // Configurações das colunas para tabela editável
  const membrosOptions = membros?.map(m => ({ value: m.id.toString(), label: m.nome })) || [];
  
  const objetivosColumnConfig = [
    { key: "nome", header: "Nome", type: "text" as const },
    { key: "prioridade", header: "Prioridade", type: "number" as const },
    { key: "valorObjetivo", header: "Valor Alvo", type: "currency" as const },
    { key: "moeda", header: "Moeda", type: "select" as const, options: ["BRL", "USD"] },
    { key: "membroId", header: "Membro", type: "select" as const, options: membrosOptions.map(m => m.value) },
    { key: "dataAlvo", header: "Data Alvo", type: "date" as const },
    { key: "categoria", header: "Categoria", type: "select" as const, options: ["casa", "educacao", "viagem", "aposentadoria", "emergencia", "investimento", "outros"] },
    { key: "status", header: "Status", type: "select" as const, options: ["ativo", "pausado", "concluido", "cancelado"] },
  ];

  // Função para salvamento em massa
  const handleBulkSave = async (updatedData: any[]) => {
    const updates = updatedData.map(item => 
      updateMutation.mutateAsync({
        id: item.id,
        data: {
          ...item,
          valorAlvo: String(item.valorAlvo || "0"),
          valorAtual: String(item.valorAtual || "0"),
          planejamentoId: selectedPlanejamento
        }
      })
    );
    
    try {
      await Promise.all(updates);
      toast({
        title: "Sucesso",
        description: "Objetivos atualizados com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar os objetivos.",
        variant: "destructive",
      });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      categoria: "outros",
      valorObjetivo: "0",
      valorAtual: "0", 
      moeda: "BRL",
      prioridade: 1,
      dataAlvo: "",
      status: "ativo",
      planejamentoId: selectedPlanejamento!,
      membroId: undefined,
    },
  });

  const { data: planejamentos = [] } = useQuery({
    queryKey: ["/api/planejamentos"],
  });

  const { data: objetivos = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/planejamentos", selectedPlanejamento, "objetivos"],
    enabled: !!selectedPlanejamento,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!selectedPlanejamento) throw new Error("Selecione um planejamento");
      
      const payload = {
        ...data,
        membroId: data.membroId || null,
      };
      
      return await apiRequest(`/api/planejamentos/${selectedPlanejamento}/objetivos`, {
        method: "POST",
        body: payload
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", selectedPlanejamento, "objetivos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Objetivo adicionado com sucesso!",
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
        description: "Erro ao adicionar objetivo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const payload = {
        ...data,
        membroId: data.membroId || null,
      };
      
      return await apiRequest(`/api/objetivos/${id}`, {
        method: "PUT",
        body: payload
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", selectedPlanejamento, "objetivos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setIsDialogOpen(false);
      setEditingObjetivo(null);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Objetivo atualizado com sucesso!",
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
        description: "Erro ao atualizar objetivo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/objetivos/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planejamentos", selectedPlanejamento, "objetivos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Sucesso",
        description: "Objetivo excluído com sucesso!",
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
        description: "Erro ao excluir objetivo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: any) => {
    if (!selectedPlanejamento) {
      toast({
        title: "Erro",
        description: "Selecione um planejamento primeiro.",
        variant: "destructive",
      });
      return;
    }
    
    if (editingObjetivo) {
      updateMutation.mutate({ id: editingObjetivo.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (objetivo: any) => {
    setEditingObjetivo(objetivo);
    form.reset({
      nome: objetivo.nome,
      descricao: objetivo.descricao || "",
      valorObjetivo: objetivo.valorObjetivo?.toString() || "",
      valorAtual: objetivo.valorAtual?.toString() || "0",
      moeda: objetivo.moeda,
      dataAlvo: objetivo.dataAlvo,
      prioridade: objetivo.prioridade,
      status: objetivo.status,
      categoria: objetivo.categoria,
      membroId: objetivo.membroId || undefined,
      planejamentoId: selectedPlanejamento!,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este objetivo?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatCurrency = (value: number, moeda: string = "BRL") => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: moeda
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'em_andamento': 'bg-yellow-100 text-yellow-800',
      'concluido': 'bg-green-100 text-green-800',
      'pausado': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const names: { [key: string]: string } = {
      'em_andamento': 'Em Andamento',
      'concluido': 'Concluído',
      'pausado': 'Pausado',
    };
    return names[status] || status;
  };

  const getPrioridadeColor = (prioridade: number) => {
    if (prioridade <= 3) return 'bg-red-100 text-red-800';
    if (prioridade <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getPrioridadeText = (prioridade: number) => {
    return `#${prioridade}`;
  };

  const getCategoriaIcon = (categoria: string) => {
    const icons: { [key: string]: any } = {
      'aposentadoria': DollarSign,
      'educacao': GraduationCap,
      'casa': Home,
      'viagem': Plane,
      'emergencia': AlertTriangle,
    };
    return icons[categoria] || Target;
  };

  const getCategoriaText = (categoria: string) => {
    const names: { [key: string]: string } = {
      'aposentadoria': 'Aposentadoria',
      'educacao': 'Educação',
      'casa': 'Casa',
      'viagem': 'Viagem',
      'emergencia': 'Emergência',
    };
    return names[categoria] || categoria;
  };

  const calculateProgress = (valorAtual: number, valorAlvo: number) => {
    if (valorAlvo === 0) return 0;
    return Math.min((valorAtual / valorAlvo) * 100, 100);
  };

  const calculateMonthsRemaining = (dataAlvo: string) => {
    const hoje = new Date();
    const alvo = new Date(dataAlvo);
    const diffTime = alvo.getTime() - hoje.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  };

  const getNextAvailablePriority = () => {
    if (!Array.isArray(objetivos) || objetivos.length === 0) return 1;
    
    const usedPriorities = objetivos.map((obj: any) => obj.prioridade).sort((a: number, b: number) => a - b);
    
    // Encontrar o primeiro número disponível
    for (let i = 1; i <= usedPriorities.length + 1; i++) {
      if (!usedPriorities.includes(i)) {
        return i;
      }
    }
    
    return usedPriorities.length + 1;
  };

  const handleOpenDialog = () => {
    const nextPriority = getNextAvailablePriority();
    
    form.reset({
      nome: "",
      descricao: "",
      valorObjetivo: "",
      valorAtual: "0",
      moeda: "BRL",
      dataAlvo: "",
      prioridade: nextPriority,
      status: "ativo",
      categoria: "outros",
    });
    setEditingObjetivo(null);
    setIsDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Objetivos</h1>
          <p className="text-gray-600 mt-2">Defina e acompanhe seus objetivos financeiros</p>
        </div>

        {selectedPlanejamento && (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Objetivos ({objetivos.length})
                  </h2>
                  {objetivos.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Arraste os cards para reordenar as prioridades
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                      setEditingObjetivo(null);
                      form.reset();
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-primary hover:bg-primary-600"
                        onClick={handleOpenDialog}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Objetivo
                      </Button>
                    </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingObjetivo ? "Editar Objetivo" : "Novo Objetivo"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingObjetivo 
                          ? "Atualize as informações do objetivo financeiro."
                          : "Crie um novo objetivo financeiro para acompanhar."
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = form.getValues();
                        const finalData = {
                          ...formData,
                          planejamentoId: selectedPlanejamento!
                        };
                        onSubmit(finalData);
                      }} className="space-y-4">
                        <FormField
                          control={form.control as any}
                          name="nome"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do Objetivo</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Reserva de Emergência, Casa na Praia..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control as any}
                          name="descricao"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição (Opcional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Descreva mais detalhes sobre este objetivo..."
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control as any}
                            name="prioridade"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Prioridade (Ordem)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="1"
                                    placeholder="1"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormDescription className="text-xs text-gray-500">
                                  💡 Próxima disponível: #{getNextAvailablePriority()}. Arraste os objetivos para reordenar a prioridade.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control as any}
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
                                    <SelectItem value="casa">🏠 Casa</SelectItem>
                                    <SelectItem value="educacao">🎓 Educação</SelectItem>
                                    <SelectItem value="viagem">✈️ Viagem</SelectItem>
                                    <SelectItem value="aposentadoria">🏖️ Aposentadoria</SelectItem>
                                    <SelectItem value="emergencia">🚨 Emergência</SelectItem>
                                    <SelectItem value="investimento">📈 Investimento</SelectItem>
                                    <SelectItem value="outros">🎯 Outros</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control as any}
                            name="valorObjetivo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor Alvo</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    placeholder="100000.00"
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
                                    <SelectItem value="BRL">🇧🇷 Real (BRL)</SelectItem>
                                    <SelectItem value="USD">🇺🇸 Dólar (USD)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control as any}
                            name="membroId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Membro Responsável</FormLabel>
                                <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione o membro..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {membros.map((membro) => (
                                      <SelectItem key={membro.id} value={membro.id.toString()}>
                                        <div className="flex items-center gap-2">
                                          <User className="h-4 w-4" />
                                          {membro.nome}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control as any}
                            name="dataAlvo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Data Alvo</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="date"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control as any}
                          name="valorAtual"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor Atual (Opcional)</FormLabel>
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
                        <DialogFooter>
                          <Button 
                            type="submit" 
                            disabled={createMutation.isPending || updateMutation.isPending}
                            className="bg-primary hover:bg-primary-600"

                          >
                            {createMutation.isPending || updateMutation.isPending ? "Salvando..." :
                             editingObjetivo ? "Atualizar Objetivo" : "Criar Objetivo"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : objetivos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum objetivo encontrado
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Crie objetivos financeiros para acompanhar suas metas.
                  </p>
                </div>
              ) : (
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={objetivos?.map((obj: any) => obj.id) || []}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {objetivos
                        ?.sort((a: any, b: any) => a.prioridade - b.prioridade)
                        ?.map((objetivo: any) => (
                          <SortableCard
                            key={objetivo.id}
                            objetivo={objetivo}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            membros={membros}
                          />
                        ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </>
          )}

        {!selectedPlanejamento && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Selecione um Planejamento
            </h3>
            <p className="text-gray-500 mb-6">
              Escolha um planejamento acima para visualizar e gerenciar os objetivos financeiros.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
