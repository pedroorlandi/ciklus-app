import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Users, UserCheck, UserX, Shield, Edit } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import Header from "@/components/layout/header";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt: string;
}

interface Planejamento {
  id: number;
  nome: string;
  userId: string;
  planejadorId: string | null;
  status: string;
}

export default function AdminPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPlanejamento, setSelectedPlanejamento] = useState<number | null>(null);
  const [selectedPlanejador, setSelectedPlanejador] = useState<string>("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

  const { data: planejadores = [] } = useQuery<User[]>({
    queryKey: ['/api/admin/users/by-role/planejador'],
  });

  const { data: planejamentos = [] } = useQuery<Planejamento[]>({
    queryKey: ['/api/planejamentos'],
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await apiRequest(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: { role },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users/by-role/planejador'] });
      toast({
        title: "Sucesso",
        description: "Papel do usuário atualizado com sucesso",
      });
      setSelectedUserId("");
      setSelectedRole("");
    },
    onError: (error: any) => {
      console.error("Update role error:", error);
      toast({
        title: "Erro",
        description: error?.message || "Erro ao atualizar papel do usuário",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const response = await apiRequest(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: { status },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Sucesso", 
        description: "Status do usuário atualizado com sucesso",
      });
      setSelectedUserId("");
      setSelectedStatus("");
    },
    onError: (error: any) => {
      console.error("Update status error:", error);
      toast({
        title: "Erro",
        description: error?.message || "Erro ao atualizar status do usuário",
        variant: "destructive",
      });
    },
  });

  const assignPlanejadorMutation = useMutation({
    mutationFn: async ({ planejamentoId, planejadorId }: { planejamentoId: number; planejadorId: string }) => {
      const response = await apiRequest(`/api/admin/planejamentos/${planejamentoId}/planejador`, {
        method: 'PATCH',
        body: { planejadorId },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/planejamentos'] });
      toast({
        title: "Sucesso",
        description: "Planejador associado com sucesso",
      });
      setSelectedPlanejamento(null);
      setSelectedPlanejador("");
    },
    onError: (error: any) => {
      console.error("Assign planejador error:", error);
      toast({
        title: "Erro",
        description: error?.message || "Erro ao associar planejador",
        variant: "destructive",
      });
    },
  });

  const handleUpdateRole = () => {
    if (!selectedUserId || !selectedRole) {
      toast({
        title: "Erro",
        description: "Selecione um usuário e um papel",
        variant: "destructive",
      });
      return;
    }
    updateRoleMutation.mutate({ userId: selectedUserId, role: selectedRole });
  };

  const handleUpdateStatus = () => {
    if (!selectedUserId || !selectedStatus) {
      toast({
        title: "Erro",
        description: "Selecione um usuário e um status",
        variant: "destructive",
      });
      return;
    }
    updateStatusMutation.mutate({ userId: selectedUserId, status: selectedStatus });
  };

  const handleAssignPlanejador = () => {
    if (!selectedPlanejamento || !selectedPlanejador) {
      toast({
        title: "Erro",
        description: "Selecione um planejamento e um planejador",
        variant: "destructive",
      });
      return;
    }
    assignPlanejadorMutation.mutate({ planejamentoId: selectedPlanejamento, planejadorId: selectedPlanejador });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrador': return 'bg-red-100 text-red-800';
      case 'planejador': return 'bg-blue-100 text-blue-800';
      case 'cliente': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-gray-100 text-gray-800';
      case 'suspenso': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const adminCount = users.filter(u => u.role === 'administrador').length;
  const planejadorCount = users.filter(u => u.role === 'planejador').length;
  const clienteCount = users.filter(u => u.role === 'cliente').length;

  return (
    <MainLayout>
      <Header
        title="Administração do Sistema"
        subtitle="Gerenciamento de usuários e configurações do sistema"
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planejadores</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planejadorCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <UserX className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clienteCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Ações de Administração */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alterar Papel do Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="userSelect">Selecionar Usuário</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="roleSelect">Novo Papel</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administrador">Administrador</SelectItem>
                  <SelectItem value="planejador">Planejador</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdateRole} disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? "Atualizando..." : "Atualizar Papel"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alterar Status do Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="userStatusSelect">Selecionar Usuário</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="statusSelect">Novo Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="suspenso">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdateStatus} disabled={updateStatusMutation.isPending}>
              {updateStatusMutation.isPending ? "Atualizando..." : "Atualizar Status"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Associar Planejador */}
      <Card>
        <CardHeader>
          <CardTitle>Associar Planejador ao Planejamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="planejamentoSelect">Selecionar Planejamento</Label>
              <Select value={selectedPlanejamento?.toString() || ""} onValueChange={(value) => setSelectedPlanejamento(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um planejamento" />
                </SelectTrigger>
                <SelectContent>
                  {planejamentos.map((planejamento) => (
                    <SelectItem key={planejamento.id} value={planejamento.id.toString()}>
                      {planejamento.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="planejadorSelect">Selecionar Planejador</Label>
              <Select value={selectedPlanejador} onValueChange={setSelectedPlanejador}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um planejador" />
                </SelectTrigger>
                <SelectContent>
                  {planejadores.map((planejador) => (
                    <SelectItem key={planejador.id} value={planejador.id}>
                      {planejador.firstName} {planejador.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAssignPlanejador} disabled={assignPlanejadorMutation.isPending}>
            {assignPlanejadorMutation.isPending ? "Associando..." : "Associar Planejador"}
          </Button>
        </CardContent>
      </Card>

      {/* Tabela de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Criação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainLayout>
  );
}