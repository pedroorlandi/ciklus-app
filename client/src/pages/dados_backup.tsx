import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { usePlanejamentoContext } from "@/hooks/usePlanejamentoContext";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import type { DadoMensal } from "@shared/schema";
import AnaliseAvancada from "@/components/dados/analise-avancada";
import GraficoCicloVida from "@/components/dados/grafico-ciclo-vida";

export default function Dados() {
  const { selectedPlanejamento, planejamentoNome } = usePlanejamentoContext();
  const [anoSelecionado, setAnoSelecionado] = useState<number>(new Date().getFullYear());
  const [moedaSelecionada, setMoedaSelecionada] = useState<string>("BRL");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: dadosMensais = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/dados/${selectedPlanejamento}`, moedaSelecionada],
    queryFn: () => apiRequest(`/api/dados/${selectedPlanejamento}?moeda=${moedaSelecionada}`),
    enabled: !!selectedPlanejamento,
    retry: false,
  });

  const { data: imoveis = [] } = useQuery<any[]>({
    queryKey: [`/api/planejamentos/${selectedPlanejamento}/imoveis`],
    enabled: !!selectedPlanejamento,
    retry: false,
  });

  const imoveisComFinanciamento = imoveis
    .filter(i => i.financiamento === 'SIM')
    .sort((a, b) => {
      const dataA = new Date(a.dataInicio || '2030-01-01');
      const dataB = new Date(b.dataInicio || '2030-01-01');
      return dataA.getTime() - dataB.getTime();
    });

  const regenerarMutation = useMutation({
    mutationFn: () => {
      return apiRequest(`/api/dados/${selectedPlanejamento}/regenerar`, {
        method: "POST"
      });
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Dados mensais regenerados com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/dados/${selectedPlanejamento}`, moedaSelecionada] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Acesso Negado",
          description: "Você foi desconectado. Redirecionando...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Erro ao regenerar dados mensais. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const formatarValor = (valor: string | number) => {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
    const simbolo = moedaSelecionada === 'USD' ? '$' : 'R$';
    
    if (numero >= 1000000) {
      return `${simbolo} ${(numero / 1000000).toFixed(1)}M`;
    } else if (numero >= 1000) {
      return `${simbolo} ${(numero / 1000).toFixed(0)}k`;
    } else {
      return `${simbolo} ${numero.toFixed(0)}`;
    }
  };

  const gerarAnos = () => {
    const anoAtual = new Date().getFullYear();
    const anos = [];
    for (let i = anoAtual; i <= anoAtual + 80; i++) {
      anos.push(i);
    }
    return anos;
  };

  const calcularTotais = () => {
    const dadosAno = dadosMensais.filter(dado => dado.ano === anoSelecionado);
    
    return dadosAno.reduce((acc, dado) => {
      const receitas = parseFloat(dado.receitasTotais || "0");
      const despesas = parseFloat(dado.despesasTotais || "0");
      
      return {
        totalReceitas: acc.totalReceitas + receitas,
        totalDespesas: acc.totalDespesas + despesas,
        saldo: acc.saldo + (receitas - despesas),
      };
    }, { totalReceitas: 0, totalDespesas: 0, saldo: 0 });
  };

  const totais = calcularTotais();

  if (!selectedPlanejamento) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Nenhum planejamento selecionado</h2>
            <p className="text-muted-foreground">Selecione um planejamento para visualizar os dados mensais.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        {/* Header fixo */}
        <div className="p-6 pb-4 border-b bg-white flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Dados Mensais</h1>
              <p className="text-muted-foreground">
                Aba DADOS - {planejamentoNome} - Projeção Completa
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => regenerarMutation.mutate()}
                disabled={regenerarMutation.isPending}
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${regenerarMutation.isPending ? 'animate-spin' : ''}`} />
                Regenerar
              </Button>
            </div>
          </div>
        </div>

        {/* Área principal - usa o resto do espaço disponível */}
        <div className="flex-1 p-6 min-h-0">
          <Tabs defaultValue="ciclo-vida" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mb-4 flex-shrink-0">
              <TabsTrigger value="ciclo-vida">Ciclo de Vida</TabsTrigger>
              <TabsTrigger value="dados-mensais">Dados Mensais</TabsTrigger>
              <TabsTrigger value="analise-avancada">Análise Avançada</TabsTrigger>
            </TabsList>

            <TabsContent value="ciclo-vida" className="flex-1 flex flex-col">
              <div className="mb-4 flex justify-end">
                <Select value={moedaSelecionada} onValueChange={setMoedaSelecionada}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">BRL</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <GraficoCicloVida dados={dadosMensais} isLoading={isLoading} moeda={moedaSelecionada} />
            </TabsContent>

            <TabsContent value="dados-mensais" className="flex-1 flex flex-col">
              {/* Controles - Header */}
              <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 className="text-2xl font-bold">Dados Mensais - {anoSelecionado}</h2>
                <div className="flex gap-2">
                  <Select value={moedaSelecionada} onValueChange={setMoedaSelecionada}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">BRL</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={anoSelecionado.toString()} onValueChange={(value) => setAnoSelecionado(parseInt(value))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gerarAnos().map(ano => (
                        <SelectItem key={ano} value={ano.toString()}>
                          {ano}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Cards de Resumo */}
              <div className="grid grid-cols-3 gap-4 mb-4 flex-shrink-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatarValor(totais.totalReceitas.toString())}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {formatarValor(totais.totalDespesas.toString())}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Saving</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${totais.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatarValor(totais.saldo.toString())}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Área de Tabela - Pega o resto do espaço */}
              <div className="flex-1 border rounded-lg bg-white overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Dados Mensais Consolidados - {anoSelecionado}</h3>
                  <p className="text-sm text-muted-foreground">
                    Uma linha por período com receitas e despesas organizadas em colunas
                  </p>
                </div>
                <div className="h-full overflow-auto" style={{height: 'calc(100% - 100px)'}}>
                  {isLoading ? (
                    <div className="text-center py-4">Carregando dados...</div>
                  ) : dadosMensais.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Nenhum dado encontrado para {anoSelecionado}
                      </p>
                      <Button 
                        onClick={() => regenerarMutation.mutate()}
                        disabled={regenerarMutation.isPending}
                      >
                        {regenerarMutation.isPending ? "Gerando..." : "Gerar Dados Mensais"}
                      </Button>
                    </div>
                  ) : (
                    <Table style={{minWidth: '1400px'}}>
                      <TableHeader style={{position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 5}}>
                        <TableRow>
                          <TableHead style={{position: 'sticky', left: 0, backgroundColor: 'white', borderRight: '2px solid #e5e7eb', zIndex: 10, minWidth: '120px'}}>Período</TableHead>
                          <TableHead className="text-right" style={{minWidth: '100px'}}>Laborais</TableHead>
                          <TableHead className="text-right" style={{minWidth: '100px'}}>Passivas</TableHead>
                          <TableHead className="text-right" style={{minWidth: '120px'}}>Patrimoniais</TableHead>
                          <TableHead className="text-right" style={{minWidth: '100px'}}>Básicas</TableHead>
                          <TableHead className="text-right" style={{minWidth: '120px'}}>Dependentes</TableHead>
                          <TableHead className="text-right" style={{minWidth: '100px'}}>Estilo</TableHead>
                          <TableHead className="text-right" style={{minWidth: '100px'}}>Viagens</TableHead>
                          <TableHead className="text-right" style={{minWidth: '120px'}}>Patrim. Desp.</TableHead>
                          <TableHead className="text-right" style={{minWidth: '100px'}}>{imoveisComFinanciamento[0]?.nome || 'Financ. 1'}</TableHead>
                          <TableHead className="text-right" style={{minWidth: '100px'}}>{imoveisComFinanciamento[1]?.nome || 'Financ. 2'}</TableHead>
                          <TableHead className="text-right" style={{minWidth: '100px'}}>{imoveisComFinanciamento[2]?.nome || 'Financ. 3'}</TableHead>
                          <TableHead className="text-right" style={{minWidth: '120px'}}>Total Receitas</TableHead>
                          <TableHead className="text-right" style={{minWidth: '120px'}}>Total Despesas</TableHead>
                          <TableHead className="text-right" style={{minWidth: '100px'}}>Saving</TableHead>
                          <TableHead className="text-right" style={{minWidth: '120px'}}>Rentabilidade</TableHead>
                          <TableHead className="text-right" style={{minWidth: '120px'}}>Portfolio Final</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(() => {
                          const dadosConsolidados = dadosMensais
                            .filter(dado => dado.ano === anoSelecionado)
                            .reduce((acc: any, dado: any) => {
                              const key = `${dado.ano}-${dado.mes}`;
                              if (!acc[key]) {
                                acc[key] = {
                                  ano: dado.ano,
                                  mes: dado.mes,
                                  periodo: dado.periodo,
                                  receitaAtiva: parseFloat(dado.receitaAtiva || "0"),
                                  receitaPassiva: parseFloat(dado.receitaPassiva || "0"), 
                                  receitaPatrimonio: parseFloat(dado.receitaPatrimonio || "0"),
                                  despesasBasicas: parseFloat(dado.despesasBasicas || "0"),
                                  despesasDependentes: parseFloat(dado.despesasDependentes || "0"),
                                  despesasEstilo: parseFloat(dado.despesasEstilo || "0"),
                                  despesasViagens: parseFloat(dado.despesasViagens || "0"),
                                  despesasPatrimoniais: parseFloat(dado.despesasPatrimoniais || "0"),
                                  financiamento1: parseFloat(dado.financiamento1 || "0"),
                                  financiamento2: parseFloat(dado.financiamento2 || "0"),
                                  financiamento3: parseFloat(dado.financiamento3 || "0"),
                                  receitasTotais: parseFloat(dado.receitasTotais || "0"),
                                  despesasTotais: parseFloat(dado.despesasTotais || "0"),
                                  portfolioFinal: parseFloat(dado.portfolioFinal || "0"),
                                  rentabilidade: (() => {
                                    const receitas = parseFloat(dado.receitasTotais || "0");
                                    const despesas = parseFloat(dado.despesasTotais || "0");
                                    const saving = receitas - despesas;
                                    return receitas > 0 ? (saving / receitas) * 100 : 0;
                                  })(),
                                };
                              }
                              return acc;
                            }, {});

                          return Object.values(dadosConsolidados)
                            .sort((a: any, b: any) => a.mes - b.mes)
                            .map((dado: any) => (
                              <TableRow key={`${dado.ano}-${dado.mes}`}>
                                <TableCell style={{position: 'sticky', left: 0, backgroundColor: 'white', borderRight: '2px solid #e5e7eb', zIndex: 10}} className="font-medium">
                                  {dado.periodo}
                                </TableCell>
                                <TableCell className="text-right text-green-600 font-medium">
                                  {formatarValor(dado.receitaAtiva.toString())}
                                </TableCell>
                                <TableCell className="text-right text-green-600 font-medium">
                                  {formatarValor(dado.receitaPassiva.toString())}
                                </TableCell>
                                <TableCell className="text-right text-green-600 font-medium">
                                  {formatarValor(dado.receitaPatrimonio.toString())}
                                </TableCell>
                                <TableCell className="text-right text-red-600 font-medium">
                                  {formatarValor(dado.despesasBasicas.toString())}
                                </TableCell>
                                <TableCell className="text-right text-red-600 font-medium">
                                  {formatarValor(dado.despesasDependentes.toString())}
                                </TableCell>
                                <TableCell className="text-right text-red-600 font-medium">
                                  {formatarValor(dado.despesasEstilo.toString())}
                                </TableCell>
                                <TableCell className="text-right text-red-600 font-medium">
                                  {formatarValor(dado.despesasViagens.toString())}
                                </TableCell>
                                <TableCell className="text-right text-red-600 font-medium">
                                  {formatarValor(dado.despesasPatrimoniais.toString())}
                                </TableCell>
                                <TableCell className="text-right text-orange-600 font-medium">
                                  {formatarValor(dado.financiamento1.toString())}
                                </TableCell>
                                <TableCell className="text-right text-orange-600 font-medium">
                                  {formatarValor(dado.financiamento2.toString())}
                                </TableCell>
                                <TableCell className="text-right text-orange-600 font-medium">
                                  {formatarValor(dado.financiamento3.toString())}
                                </TableCell>
                                <TableCell className="text-right text-green-600 font-bold">
                                  {formatarValor(dado.receitasTotais.toString())}
                                </TableCell>
                                <TableCell className="text-right text-red-600 font-bold">
                                  {formatarValor(dado.despesasTotais.toString())}
                                </TableCell>
                                <TableCell className={`text-right font-bold ${
                                  (dado.receitasTotais - dado.despesasTotais) >= 0 
                                    ? 'text-green-600' 
                                    : 'text-red-600'
                                }`}>
                                  {formatarValor((dado.receitasTotais - dado.despesasTotais).toString())}
                                </TableCell>
                                <TableCell className={`text-right font-bold ${
                                  dado.rentabilidade >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {dado.rentabilidade.toFixed(1)}%
                                </TableCell>
                                <TableCell className="text-right text-blue-600 font-bold">
                                  {formatarValor((parseFloat(dado.portfolioFinal || "0")).toString())}
                                </TableCell>
                              </TableRow>
                            ));
                        })()}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analise-avancada" className="flex-1 overflow-hidden">
              <AnaliseAvancada dados={dadosMensais} anoSelecionado={anoSelecionado} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}