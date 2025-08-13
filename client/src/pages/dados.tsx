import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { usePlanejamentoContext } from "@/hooks/usePlanejamentoContext";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
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

  const { data: indices = [] } = useQuery<any[]>({
    queryKey: ["/api/indices"],
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
    mutationFn: (params?: { provedoresAusentes?: number[]; capitalSeguradoAdicional?: number }) => {
      return apiRequest(`/api/dados/${selectedPlanejamento}/regenerar`, {
        method: "POST",
        body: {
          provedoresAusentes: params?.provedoresAusentes,
          capitalSeguradoAdicional: params?.capitalSeguradoAdicional
        }
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
    
    if (moedaSelecionada === 'USD') {
      // Formato americano para USD: $1,000.00
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numero);
    } else {
      // Formato brasileiro para BRL: R$ 1.000,00
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numero);
    }
  };

  const gerarAnos = () => {
    const anoAtual = new Date().getFullYear();
    const anos = [];
    
    // Buscar o último ano dos dados mensais se disponível
    let anoFinal = anoAtual + 80; // fallback
    if (dadosMensais && dadosMensais.length > 0) {
      const ultimoAno = Math.max(...dadosMensais.map(d => d.ano));
      if (ultimoAno > anoAtual) {
        anoFinal = ultimoAno;
      }
    }
    
    for (let i = anoAtual; i <= anoFinal; i++) {
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
      <MainLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Nenhum planejamento selecionado</h2>
            <p className="text-muted-foreground">Selecione um planejamento para visualizar os dados mensais.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header ultra compacto */}
        <div className="px-2 py-0.5 border-b bg-white flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-sm font-bold">Dados Mensais</h1>
              <p className="text-xs text-muted-foreground">{planejamentoNome}</p>
            </div>
            <Button
              onClick={() => regenerarMutation.mutate({})}
              disabled={regenerarMutation.isPending}
              variant="outline"
              size="sm"
              className="h-7 text-xs"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${regenerarMutation.isPending ? 'animate-spin' : ''}`} />
              {regenerarMutation.isPending ? 'Regenerando...' : 'Regenerar'}
            </Button>
          </div>
        </div>

        {/* Indicador de Regeneração Centralizado */}
        {regenerarMutation.isPending && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 mx-4 max-w-md w-full">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    🔄 Dados em Regeneração
                  </h3>
                  <p className="text-sm text-gray-600">
                    Recalculando projeções financeiras...<br/>
                    Por favor, aguarde alguns instantes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Área principal sem padding */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="ciclo-vida" className="w-full h-full flex flex-col">
            <TabsList className="inline-flex h-6 items-center justify-center rounded-md bg-muted p-0.5 text-muted-foreground mx-1 mt-0.5 mb-0.5">
              <TabsTrigger value="ciclo-vida" className="px-1 py-0.5 text-xs">Ciclo de Vida</TabsTrigger>
              <TabsTrigger value="dados-mensais" className="px-1 py-0.5 text-xs">Dados Mensais</TabsTrigger>
              <TabsTrigger value="analise-avancada" className="px-1 py-0.5 text-xs">Análise Avançada</TabsTrigger>
            </TabsList>

            <TabsContent value="ciclo-vida" className="mt-4">
              <GraficoCicloVida 
                dados={dadosMensais} 
                isLoading={isLoading} 
                moeda={moedaSelecionada} 
                onMoedaChange={setMoedaSelecionada}
              />
            </TabsContent>

            <TabsContent value="dados-mensais" className="mt-4">
              {/* KPIs Compactos */}
              {!isLoading && dadosMensais.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white border rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="text-sm text-gray-500">Receitas {anoSelecionado}</div>
                        <div className="text-lg font-bold text-green-600">{formatarValor(totais.totalReceitas)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="text-sm text-gray-500">Despesas {anoSelecionado}</div>
                        <div className="text-lg font-bold text-red-600">{formatarValor(totais.totalDespesas)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="text-sm text-gray-500">Saving {anoSelecionado}</div>
                        <div className={`text-lg font-bold ${totais.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatarValor(totais.saldo)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Controles da Tabela */}
              <div className="bg-white border rounded-lg">
                <div className="p-3 border-b">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">
                      Dados Mensais Detalhados
                    </h3>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      {/* Seletor de Moeda */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Moeda:</span>
                        <Select value={moedaSelecionada} onValueChange={setMoedaSelecionada}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BRL">BRL</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Seletor de Ano */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Ano:</span>
                        <Select value={anoSelecionado.toString()} onValueChange={(value) => setAnoSelecionado(parseInt(value))}>
                          <SelectTrigger className="w-24">
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
                  </div>
                </div>

                {/* Área de Tabela */}
                <div className="p-4">
                  <div className="bg-white flex-1 flex flex-col min-h-0">
                
                {isLoading ? (
                  <div className="text-center py-4">Carregando dados...</div>
                ) : dadosMensais.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Nenhum dado encontrado para {anoSelecionado}
                    </p>
                    <Button 
                      onClick={() => regenerarMutation.mutate({})}
                      disabled={regenerarMutation.isPending}
                    >
                      {regenerarMutation.isPending ? "Gerando..." : "Gerar Dados Mensais"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1 min-h-0">
                    <div className="h-full overflow-auto">
                      <table className="text-sm" style={{minWidth: '1600px'}}>
                        <thead className="bg-gray-50">
                          <tr className="sticky top-0 z-10 bg-gray-50">
                            <th className="sticky left-0 bg-gray-50 text-left p-3 font-medium border-r-2 border-gray-200 z-10 w-24">Período</th>
                            <th className="text-right p-3 font-medium w-20 bg-gray-50">Laborais</th>
                            <th className="text-right p-3 font-medium w-20 bg-gray-50">Passivas</th>
                            <th className="text-right p-3 font-medium w-24 bg-gray-50">Patrimoniais</th>
                            <th className="text-right p-3 font-medium w-20 bg-gray-50">Básicas</th>
                            <th className="text-right p-3 font-medium w-24 bg-gray-50">Dependentes</th>
                            <th className="text-right p-3 font-medium w-20 bg-gray-50">Estilo</th>
                            <th className="text-right p-3 font-medium w-20 bg-gray-50">Viagens</th>
                            <th className="text-right p-3 font-medium w-24 bg-gray-50">Patrim. Desp.</th>
                            <th className="text-right p-3 font-medium w-20 bg-gray-50">{imoveisComFinanciamento[0]?.nome || 'Financ. 1'}</th>
                            <th className="text-right p-3 font-medium w-20 bg-gray-50">{imoveisComFinanciamento[1]?.nome || 'Financ. 2'}</th>
                            <th className="text-right p-3 font-medium w-20 bg-gray-50">{imoveisComFinanciamento[2]?.nome || 'Financ. 3'}</th>
                            <th className="text-right p-3 font-medium w-24 bg-gray-50">Venda de Ativos</th>
                            <th className="text-right p-3 font-medium w-24 bg-gray-50">Desembolso Objetivos</th>
                            <th className="text-right p-3 font-medium w-24 bg-gray-50">Total Receitas</th>
                            <th className="text-right p-3 font-medium w-24 bg-gray-50">Total Despesas</th>
                            <th className="text-right p-3 font-medium w-24 bg-gray-50">Portfolio Inicial</th>
                            <th className="text-right p-3 font-medium w-20 bg-gray-50">Saving</th>
                            <th className="text-right p-3 font-medium w-24 bg-gray-50">Rendimento</th>
                            <th className="text-right p-3 font-medium w-24 bg-gray-50">Portfolio Final</th>
                          </tr>
                        </thead>
                        <tbody>
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
                                  vendaAtivos: parseFloat(dado.vendaAtivos || "0"),
                                  desembolsoObjetivos: parseFloat(dado.desembolsoObjetivos || "0"),
                                  receitasTotais: parseFloat(dado.receitasTotais || "0"),
                                  despesasTotais: parseFloat(dado.despesasTotais || "0"),
                                  portfolioInicial: parseFloat(dado.portfolioInicial || "0"),
                                  portfolioFinal: parseFloat(dado.portfolioFinal || "0"),
                                  rentaDolar: parseFloat(dado.rentaDolar || "0"),
                                };
                              }
                              return acc;
                            }, {});

                          return Object.values(dadosConsolidados)
                            .sort((a: any, b: any) => a.mes - b.mes)
                            .map((dado: any) => {
                              // CORREÇÃO: Usar rentaDolar que já vem calculado corretamente do backend

                              return (
                              <tr key={`${dado.ano}-${dado.mes}`} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium sticky left-0 bg-white border-r-2 border-gray-200 z-10">
                                  {dado.periodo}
                                </td>
                                <td className="p-3 text-right text-green-600 font-medium">
                                  {formatarValor(dado.receitaAtiva)}
                                </td>
                                <td className="p-3 text-right text-green-600 font-medium">
                                  {formatarValor(dado.receitaPassiva)}
                                </td>
                                <td className="p-3 text-right text-green-600 font-medium">
                                  {formatarValor(dado.receitaPatrimonio)}
                                </td>
                                <td className="p-3 text-right text-red-600 font-medium">
                                  {formatarValor(dado.despesasBasicas)}
                                </td>
                                <td className="p-3 text-right text-red-600 font-medium">
                                  {formatarValor(dado.despesasDependentes)}
                                </td>
                                <td className="p-3 text-right text-red-600 font-medium">
                                  {formatarValor(dado.despesasEstilo)}
                                </td>
                                <td className="p-3 text-right text-red-600 font-medium">
                                  {formatarValor(dado.despesasViagens)}
                                </td>
                                <td className="p-3 text-right text-red-600 font-medium">
                                  {formatarValor(dado.despesasPatrimoniais)}
                                </td>
                                <td className="p-3 text-right text-orange-600 font-medium">
                                  {formatarValor(dado.financiamento1)}
                                </td>
                                <td className="p-3 text-right text-orange-600 font-medium">
                                  {formatarValor(dado.financiamento2)}
                                </td>
                                <td className="p-3 text-right text-orange-600 font-medium">
                                  {formatarValor(dado.financiamento3)}
                                </td>
                                <td className="p-3 text-right text-blue-600 font-bold">
                                  {formatarValor(dado.vendaAtivos)}
                                </td>
                                <td className="p-3 text-right text-purple-600 font-bold">
                                  {formatarValor(dado.desembolsoObjetivos)}
                                </td>
                                <td className="p-3 text-right text-green-600 font-bold">
                                  {formatarValor(dado.receitasTotais)}
                                </td>
                                <td className="p-3 text-right text-red-600 font-bold">
                                  {formatarValor(dado.despesasTotais)}
                                </td>
                                <td className="p-3 text-right text-blue-600 font-bold">
                                  {formatarValor(dado.portfolioInicial)}
                                </td>
                                <td className={`p-3 text-right font-bold ${
                                  (dado.receitasTotais - dado.despesasTotais) >= 0 
                                    ? 'text-green-600' 
                                    : 'text-red-600'
                                }`}>
                                  {formatarValor(dado.receitasTotais - dado.despesasTotais)}
                                </td>
                                <td className="p-3 text-right text-purple-600 font-bold">
                                  {formatarValor(dado.rentaDolar)}
                                </td>
                                <td className="p-3 text-right text-blue-600 font-bold">
                                  {formatarValor(dado.portfolioFinal)}
                                </td>
                              </tr>
                              );
                            });
                        })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analise-avancada" className="mt-6">
              <AnaliseAvancada dados={dadosMensais} anoSelecionado={anoSelecionado} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}