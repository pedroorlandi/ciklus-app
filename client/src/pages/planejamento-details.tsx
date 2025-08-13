import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, User, Home, TrendingUp, Target, DollarSign } from "lucide-react";
import FamilyMembers from "@/components/dashboard/family-members";

export default function PlanejamentoDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: planejamento, isLoading } = useQuery({
    queryKey: ["/api/planejamentos", id],
    enabled: !!id,
  });

  const { data: membros = [] } = useQuery({
    queryKey: ["/api/planejamentos", id, "membros"],
    enabled: !!id,
  });

  const { data: imoveis = [] } = useQuery({
    queryKey: ["/api/planejamentos", id, "imoveis"],
    enabled: !!id,
  });

  const { data: portfolio = [] } = useQuery({
    queryKey: ["/api/planejamentos", id, "portfolio"],
    enabled: !!id,
  });

  const { data: receitas = [] } = useQuery({
    queryKey: ["/api/planejamentos", id, "receitas"],
    enabled: !!id,
  });

  const { data: despesas = [] } = useQuery({
    queryKey: ["/api/planejamentos", id, "despesas"],
    enabled: !!id,
  });

  const { data: objetivos = [] } = useQuery({
    queryKey: ["/api/planejamentos", id, "objetivos"],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64">
          <Header title="Carregando..." subtitle="Buscando detalhes do planejamento" />
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!planejamento) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64">
          <Header title="Planejamento não encontrado" subtitle="O planejamento solicitado não foi encontrado" />
          <div className="p-8">
            <Button onClick={() => setLocation("/planejamentos")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Planejamentos
            </Button>
          </div>
        </main>
      </div>
    );
  }

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

  const totalReceitas = receitas.reduce((sum: number, receita: any) => sum + (receita.valor || 0), 0);
  const totalDespesas = despesas.reduce((sum: number, despesa: any) => sum + (despesa.valor || 0), 0);
  const totalPortfolio = portfolio.reduce((sum: number, item: any) => sum + (item.valorAtual || 0), 0);
  const totalImoveis = imoveis.reduce((sum: number, imovel: any) => sum + (imovel.valorAtual || 0), 0);

  return (
    <MainLayout>
        <Header 
          title={planejamento.nome} 
          subtitle={planejamento.descricao || "Detalhes do planejamento financeiro"} 
        />
        
        <div className="p-8">
          {/* Header com ações */}
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="outline" 
              onClick={() => setLocation("/planejamentos")}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Badge className={getStatusColor(planejamento.status)}>
              {planejamento.status.charAt(0).toUpperCase() + planejamento.status.slice(1)}
            </Badge>
          </div>

          {/* Informações básicas */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Informações do Planejamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Data de Início</p>
                  <p className="font-medium">{(() => {
                    const dateString = planejamento.dataInicio;
                    if (dateString?.includes('-') && dateString.length === 10) {
                      const [year, month, day] = dateString.split('-');
                      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                      return date.toLocaleDateString('pt-BR');
                    }
                    return new Date(dateString).toLocaleDateString('pt-BR');
                  })()}</p>
                </div>
                {planejamento.dataFim && (
                  <div>
                    <p className="text-sm text-gray-600">Data de Fim</p>
                    <p className="font-medium">{(() => {
                      const dateString = planejamento.dataFim;
                      if (dateString?.includes('-') && dateString.length === 10) {
                        const [year, month, day] = dateString.split('-');
                        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                        return date.toLocaleDateString('pt-BR');
                      }
                      return new Date(dateString).toLocaleDateString('pt-BR');
                    })()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium">{planejamento.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards de resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receitas Mensais</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">{receitas.length} fontes de receita</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Despesas Mensais</CardTitle>
                <DollarSign className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">{despesas.length} categorias de despesa</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  R$ {totalPortfolio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">{portfolio.length} investimentos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Imóveis</CardTitle>
                <Home className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  R$ {totalImoveis.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">{imoveis.length} propriedades</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs com detalhes */}
          <Tabs defaultValue="membros" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="membros">Membros</TabsTrigger>
              <TabsTrigger value="imoveis">Imóveis</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="receitas">Receitas</TabsTrigger>
              <TabsTrigger value="despesas">Despesas</TabsTrigger>
              <TabsTrigger value="objetivos">Objetivos</TabsTrigger>
            </TabsList>

            <TabsContent value="membros">
              <FamilyMembers planejamentoId={parseInt(id!)} />
            </TabsContent>

            <TabsContent value="imoveis">
              <Card>
                <CardHeader>
                  <CardTitle>Imóveis</CardTitle>
                  <CardDescription>Propriedades cadastradas neste planejamento</CardDescription>
                </CardHeader>
                <CardContent>
                  {imoveis.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhum imóvel cadastrado</p>
                  ) : (
                    <div className="space-y-4">
                      {imoveis.map((imovel: any) => (
                        <div key={imovel.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{imovel.tipo}</h4>
                              <p className="text-sm text-gray-600">{imovel.endereco}</p>
                              <p className="text-lg font-bold text-green-600 mt-2">
                                R$ {imovel.valorAtual?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                            {imovel.valorFinanciamento > 0 && (
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Financiamento</p>
                                <p className="font-medium">R$ {imovel.prestacao?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio de Investimentos</CardTitle>
                  <CardDescription>Investimentos cadastrados neste planejamento</CardDescription>
                </CardHeader>
                <CardContent>
                  {portfolio.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhum investimento cadastrado</p>
                  ) : (
                    <div className="space-y-4">
                      {portfolio.map((item: any) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{item.ativo}</h4>
                              <p className="text-sm text-gray-600">{item.categoria}</p>
                              <p className="text-xs text-gray-500">{item.quantidade} unidades × R$ {item.precoMedio}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-blue-600">
                                R$ {item.valorAtual?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                              <p className="text-sm text-gray-600">{item.moeda}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="receitas">
              <Card>
                <CardHeader>
                  <CardTitle>Receitas</CardTitle>
                  <CardDescription>Fontes de receita cadastradas neste planejamento</CardDescription>
                </CardHeader>
                <CardContent>
                  {receitas.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhuma receita cadastrada</p>
                  ) : (
                    <div className="space-y-4">
                      {receitas.map((receita: any) => (
                        <div key={receita.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{receita.descricao}</h4>
                              <p className="text-sm text-gray-600">{receita.categoria} - {receita.frequencia}</p>
                              {receita.membro && <p className="text-xs text-gray-500">Responsável: {receita.membro}</p>}
                              <p className="text-xs text-gray-500">
                                {new Date(receita.dataInicio).toLocaleDateString('pt-BR')}
                                {receita.dataFim && ` até ${new Date(receita.dataFim).toLocaleDateString('pt-BR')}`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">
                                R$ {receita.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                              <p className="text-sm text-gray-600">{receita.moeda}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="despesas">
              <Card>
                <CardHeader>
                  <CardTitle>Despesas</CardTitle>
                  <CardDescription>Despesas cadastradas neste planejamento</CardDescription>
                </CardHeader>
                <CardContent>
                  {despesas.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhuma despesa cadastrada</p>
                  ) : (
                    <div className="space-y-4">
                      {despesas.map((despesa: any) => (
                        <div key={despesa.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{despesa.descricao}</h4>
                              <p className="text-sm text-gray-600">{despesa.categoria} - {despesa.frequencia}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-red-600">
                                R$ {despesa.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                              <p className="text-sm text-gray-600">{despesa.moeda}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="objetivos">
              <Card>
                <CardHeader>
                  <CardTitle>Objetivos Financeiros</CardTitle>
                  <CardDescription>Metas e objetivos cadastrados neste planejamento</CardDescription>
                </CardHeader>
                <CardContent>
                  {objetivos.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhum objetivo cadastrado</p>
                  ) : (
                    <div className="space-y-4">
                      {objetivos.map((objetivo: any) => (
                        <div key={objetivo.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium">{objetivo.nome}</h4>
                              <p className="text-sm text-gray-600">{objetivo.descricao}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Meta: {new Date(objetivo.dataAlvo).toLocaleDateString('pt-BR')} - {objetivo.categoria}
                              </p>
                              <div className="mt-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progresso</span>
                                  <span>{((objetivo.valorAtual / objetivo.valorAlvo) * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${Math.min((objetivo.valorAtual / objetivo.valorAlvo) * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-lg font-bold text-blue-600">
                                R$ {objetivo.valorAlvo?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                              <p className="text-sm text-gray-600">
                                R$ {objetivo.valorAtual?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} atual
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
    </MainLayout>
  );
}