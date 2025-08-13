import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, BarChart3, LineChart as LineChartIcon, User, AlertTriangle, X, Shield, Calculator, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { usePlanejamentoContext } from "@/hooks/usePlanejamentoContext";
import { useToast } from "@/hooks/use-toast";
import type { DadoMensal, MembroFamily, SimulacaoProvedor, Seguro } from "@shared/schema";

interface GraficoCicloVidaProps {
  dados: DadoMensal[];
  isLoading: boolean;
  moeda?: string;
  onMoedaChange?: (moeda: string) => void;
}

type ViewMode = "consolidado" | "detalhado";
type ChartType = "line" | "bar";

export default function GraficoCicloVida({ dados, isLoading, moeda = "BRL", onMoedaChange }: GraficoCicloVidaProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("consolidado");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "receitasTotais", 
    "despesasTotais", 
    "portfolioFinal", 
    "saving"
  ]);
  const [hoveredData, setHoveredData] = useState<any>(null);
  const [regeneracaoRealizada, setRegeneracaoRealizada] = useState(false);
  
  const { selectedPlanejamento } = usePlanejamentoContext();
  const queryClient = useQueryClient();

  // Buscar membros da família para identificar provedores
  const { data: membros = [] } = useQuery<MembroFamily[]>({
    queryKey: [`/api/planejamentos/${selectedPlanejamento}/membros`],
    enabled: !!selectedPlanejamento,
    retry: false,
  });

  // Buscar simulações de provedores
  const { data: simulacoes = [] } = useQuery<SimulacaoProvedor[]>({
    queryKey: [`/api/simulacao-provedores/${selectedPlanejamento}`],
    enabled: !!selectedPlanejamento,
    retry: false,
  });

  // Buscar seguros existentes para cálculo de capital segurado
  const { data: seguros = [] } = useQuery<Seguro[]>({
    queryKey: [`/api/seguros/${selectedPlanejamento}`],
    enabled: !!selectedPlanejamento,
    retry: false,
  });

  const { toast } = useToast();

  // Mutation para regenerar dados com simulação automática
  const regenerarMutation = useMutation({
    mutationFn: async (params?: { provedoresAusentes?: number[]; capitalSeguradoAdicional?: number }) => {
      return await apiRequest(`/api/dados/${selectedPlanejamento}/regenerar`, {
        method: 'POST',
        body: { 
          provedoresAusentes: params?.provedoresAusentes,
          capitalSeguradoAdicional: params?.capitalSeguradoAdicional 
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/dados/${selectedPlanejamento}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/simulacao-provedores/${selectedPlanejamento}`] });
      setRegeneracaoRealizada(true); // Marca que uma regeneração foi realizada
    },
  });

  // Mutation para atualizar simulação de provedor
  const updateSimulacaoMutation = useMutation({
    mutationFn: async (simulacao: { planejamentoId: number; membroId: number; status: string; dataSimulacao?: string }) => {
      return await apiRequest('/api/simulacao-provedores', {
        method: 'POST',
        body: simulacao
      });
    },
    onSuccess: () => {
      // Apenas invalidar queries de simulação - regeneração será manual
      queryClient.invalidateQueries({ queryKey: [`/api/simulacao-provedores/${selectedPlanejamento}`] });
      setRegeneracaoRealizada(false); // Reset o flag pois mudou o status do provedor
      
      // Toast simples de confirmação
      toast({
        title: "✅ Simulação Atualizada",
        description: "Status do provedor alterado. Use o botão 'Regenerar' para recalcular os dados.",
      });
    },
  });

  // Filtrar apenas provedores (dependente = false)
  const provedores = membros.filter(membro => !membro.dependente);

  // Função para calcular VPL do SAVING com taxa de 4% anual
  const calcularVPLSaving = useMemo(() => {
    if (!dados || dados.length === 0) return 0;
    
    const taxaAnual = 0.04; // 4% anual
    const taxaMensal = Math.pow(1 + taxaAnual, 1/12) - 1; // Taxa mensal equivalente
    
    let vpl = 0;
    dados.forEach((dado, index) => {
      const saving = typeof dado.saving === 'string' ? parseFloat(dado.saving) : (dado.saving || 0);
      if (!isNaN(saving) && saving !== null) {
        vpl += saving / Math.pow(1 + taxaMensal, index + 1); // CORRIGIDO: usando index + 1
      }
    });
    
    return vpl;
  }, [dados]);

  // Função para calcular capital segurado já existente por membro
  const calcularCapitalSeguradoExistente = useMemo(() => {
    const capitalPorMembro: { [membroId: number]: number } = {};
    
    seguros.forEach(seguro => {
      if (seguro.membroId) {
        const capital = typeof seguro.cs === 'string' ? parseFloat(seguro.cs) : seguro.cs;
        if (!isNaN(capital)) {
          capitalPorMembro[seguro.membroId] = (capitalPorMembro[seguro.membroId] || 0) + capital;
        }
      }
    });
    
    return capitalPorMembro;
  }, [seguros]);

  // Função para calcular sugestão de capital segurado
  const calcularSugestaoCapitalSegurado = useMemo(() => {
    const provedoresAusentes = simulacoes
      .filter(s => s.status === 'ausente')
      .map(s => s.membroId);
    
    // Só calcular se há provedores ausentes E uma regeneração foi realizada E dados existem
    if (provedoresAusentes.length === 0 || !regeneracaoRealizada || !dados || dados.length === 0) return null;
    
    const vplAbsoluto = Math.abs(calcularVPLSaving);
    
    // Obter valor do portfólio inicial (primeiro registro da projeção)
    const portfolioInicial = parseFloat(dados[0].portfolioInicial || "0");
    
    // Descontar portfolio inicial apenas uma vez (não por membro)
    const vplComDescontoPortfolio = Math.max(0, vplAbsoluto - portfolioInicial);
    
    // Calcular capital existente total de todos os provedores ausentes
    const capitalExistenteTotalAusentes = provedoresAusentes.reduce((total, membroId) => {
      return total + (calcularCapitalSeguradoExistente[membroId] || 0);
    }, 0);
    
    // Capital segurado necessário total (descontando o que já existe)
    const capitalNecessarioTotal = Math.max(0, vplComDescontoPortfolio - capitalExistenteTotalAusentes);
    
    // Dividir o capital necessário igualmente entre os provedores ausentes
    const capitalPorProvedor = provedoresAusentes.length > 0 ? capitalNecessarioTotal / provedoresAusentes.length : 0;
    
    const sugestoesPorMembro: { [membroId: number]: { vpl: number; portfolioDescontado: number; capitalExistente: number; sugestao: number; totalProvedores: number } } = {};
    
    provedoresAusentes.forEach(membroId => {
      const capitalExistente = calcularCapitalSeguradoExistente[membroId] || 0;
      
      sugestoesPorMembro[membroId] = {
        vpl: vplAbsoluto,
        portfolioDescontado: portfolioInicial,
        capitalExistente,
        sugestao: capitalPorProvedor,
        totalProvedores: provedoresAusentes.length
      };
    });
    
    return sugestoesPorMembro;
  }, [calcularVPLSaving, calcularCapitalSeguradoExistente, simulacoes, dados, regeneracaoRealizada]);

  // Função para alternar status do provedor
  const toggleProvedorStatus = async (provedor: MembroFamily) => {
    const simulacaoExistente = simulacoes.find(s => s.membroId === provedor.id);
    const statusAtual = simulacaoExistente?.status || 'ativo';
    
    let novoStatus = 'ativo';
    if (statusAtual === 'ativo') {
      novoStatus = 'ausente';
    } else {
      novoStatus = 'ativo';
    }

    await updateSimulacaoMutation.mutateAsync({
      planejamentoId: selectedPlanejamento!,
      membroId: provedor.id!,
      status: novoStatus,
      dataSimulacao: novoStatus !== 'ativo' ? new Date().toISOString().split('T')[0] : undefined
    });
  };

  // Função para obter status do provedor
  const getProvedorStatus = (provedor: MembroFamily) => {
    const simulacao = simulacoes.find(s => s.membroId === provedor.id);
    return simulacao?.status || 'ativo';
  };

  // Função para verificar se houve regeneração após a última mudança de simulação
  const temRegeneracaoRecente = useMemo(() => {
    if (!dados || dados.length === 0 || !simulacoes || simulacoes.length === 0) return false;
    
    // Pegar a data de atualização mais recente das simulações (com verificação de null)
    const datasAtualizacao = simulacoes
      .map(s => s.updatedAt ? new Date(s.updatedAt).getTime() : 0)
      .filter(time => time > 0);
    
    if (datasAtualizacao.length === 0) return false;
    
    // Assumindo que os dados foram regenerados se existem dados (simplificação)
    // Em uma implementação mais robusta, poderia ter um timestamp nos dados mensais
    return dados.length > 0;
  }, [dados, simulacoes]);

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  // Processar dados para visualização consolidada por ano
  const dadosConsolidados = useMemo(() => {
    if (!dados || dados.length === 0) return [];

    const dadosPorAno = dados.reduce((acc, item) => {
      if (!acc[item.ano]) {
        acc[item.ano] = {
          ano: item.ano,
          receitasTotais: 0,
          despesasTotais: 0,
          despesasBasicas: 0,
          despesasDependentes: 0,
          despesasEstilo: 0,
          despesasViagens: 0,
          despesasPatrimoniais: 0,
          receitaAtiva: 0,
          receitaPassiva: 0,
          receitaPatrimonio: 0,
          portfolioFinal: 0,
          saving: 0,
          longevidade: 0,
          caixa: 0,
          meses: 0
        };
      }

      // Somar valores mensais
      acc[item.ano].receitasTotais += parseFloat(item.receitasTotais || "0");
      acc[item.ano].despesasTotais += parseFloat(item.despesasTotais || "0");
      acc[item.ano].despesasBasicas += parseFloat(item.despesasBasicas || "0");
      acc[item.ano].despesasDependentes += parseFloat(item.despesasDependentes || "0");
      acc[item.ano].despesasEstilo += parseFloat(item.despesasEstilo || "0");
      acc[item.ano].despesasViagens += parseFloat(item.despesasViagens || "0");
      acc[item.ano].despesasPatrimoniais += parseFloat(item.despesasPatrimoniais || "0");
      acc[item.ano].receitaAtiva += parseFloat(item.receitaAtiva || "0");
      acc[item.ano].receitaPassiva += parseFloat(item.receitaPassiva || "0");
      acc[item.ano].receitaPatrimonio += parseFloat(item.receitaPatrimonio || "0");
      acc[item.ano].saving += parseFloat(item.saving || "0");
      acc[item.ano].caixa = parseFloat(item.caixa || "0"); // Último valor do ano
      
      // Portfolio e longevidade - usar último valor do ano
      acc[item.ano].portfolioFinal = parseFloat(item.portfolioFinal || "0");
      acc[item.ano].longevidade = parseFloat(item.longevidade || "0");
      acc[item.ano].meses++;

      return acc;
    }, {} as Record<number, any>);

    return Object.values(dadosPorAno).sort((a, b) => a.ano - b.ano);
  }, [dados]);

  // Dados detalhados para um ano específico
  const dadosDetalhados = useMemo(() => {
    if (!selectedYear || !dados) return [];
    
    return dados
      .filter(item => item.ano === selectedYear)
      .map(item => ({
        mes: item.mes,
        periodo: item.periodo,
        receitasTotais: parseFloat(item.receitasTotais || "0"),
        despesasTotais: parseFloat(item.despesasTotais || "0"),
        despesasBasicas: parseFloat(item.despesasBasicas || "0"),
        despesasDependentes: parseFloat(item.despesasDependentes || "0"),
        despesasEstilo: parseFloat(item.despesasEstilo || "0"),
        despesasViagens: parseFloat(item.despesasViagens || "0"),
        despesasPatrimoniais: parseFloat(item.despesasPatrimoniais || "0"),
        receitaAtiva: parseFloat(item.receitaAtiva || "0"),
        receitaPassiva: parseFloat(item.receitaPassiva || "0"),
        receitaPatrimonio: parseFloat(item.receitaPatrimonio || "0"),
        portfolioFinal: parseFloat(item.portfolioFinal || "0"),
        saving: parseFloat(item.saving || "0"),
        saldoMensal: parseFloat(item.receitasTotais || "0") - parseFloat(item.despesasTotais || "0"),
      }))
      .sort((a, b) => a.mes - b.mes);
  }, [selectedYear, dados]);

  const formatCurrency = (value: number) => {
    const currency = moeda === "USD" ? "USD" : "BRL";
    const locale = moeda === "USD" ? "en-US" : "pt-BR";
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Função específica para exibição no gráfico - sem casas decimais
  const formatCurrencyDisplay = (value: number) => {
    const currency = moeda === "USD" ? "USD" : "BRL";
    const locale = moeda === "USD" ? "en-US" : "pt-BR";
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip que captura os dados
  const CustomTooltip = ({ active, payload, label }: any) => {
    useEffect(() => {
      if (active && payload && payload.length) {
        const data = {
          label: viewMode === "consolidado" ? `Ano ${label}` : label,
          payload: payload
        };
        setHoveredData(data);
      } else if (!active) {
        setHoveredData(null);
      }
    }, [active, payload, label, viewMode]);
    
    return null; // Não renderiza nada, apenas captura os dados
  };

  const formatYear = (ano: number) => ano.toString();

  const anos = useMemo(() => {
    return Array.from(new Set(dados?.map(d => d.ano) || [])).sort((a, b) => a - b);
  }, [dados]);

  // Análise de tendências
  const analisePatrimonio = useMemo(() => {
    if (dadosConsolidados.length === 0) return null;
    
    const ultimoAno = dadosConsolidados[dadosConsolidados.length - 1];
    const primeiroAno = dadosConsolidados[0];
    const crescimentoPatrimonio = ultimoAno.portfolioFinal - primeiroAno.portfolioFinal;
    const tempoProjecao = ultimoAno.ano - primeiroAno.ano;
    const mediaAnual = tempoProjecao > 0 ? crescimentoPatrimonio / tempoProjecao : 0;

    return {
      patrimonioInicial: primeiroAno.portfolioFinal,
      patrimonioFinal: ultimoAno.portfolioFinal,
      crescimentoTotal: crescimentoPatrimonio,
      crescimentoMedioAnual: mediaAnual,
      tempoProjecao,
      longevidadeUltimoAno: ultimoAno.longevidade
    };
  }, [dadosConsolidados]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando projeção do ciclo de vida...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Análise de Patrimônio */}
      {analisePatrimonio && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-sm text-gray-500">Patrimônio Inicial</div>
                  <div className="text-lg font-bold">{formatCurrencyDisplay(analisePatrimonio.patrimonioInicial)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-500">Patrimônio Final</div>
                  <div className="text-lg font-bold">{formatCurrencyDisplay(analisePatrimonio.patrimonioFinal)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-sm text-gray-500">Crescimento Total</div>
                  <div className="text-lg font-bold">{formatCurrencyDisplay(analisePatrimonio.crescimentoTotal)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                <div>
                  <div className="text-sm text-gray-500">Longevidade Final</div>
                  <div className="text-lg font-bold">{formatCurrencyDisplay(analisePatrimonio.longevidadeUltimoAno)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controles do Gráfico */}
      <div className="bg-white border rounded-lg">
        <div className="p-3 border-b">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              {viewMode === "detalhado" && selectedYear ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setViewMode("consolidado")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  Detalhes do Ano {selectedYear}
                </>
              ) : (
                "Ciclo de Vida Financeira - Projeção Completa"
              )}
            </h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {/* Linha 1: Controles do Gráfico */}
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                {/* Seletor de Moeda */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Moeda:</span>
                  <Select value={moeda} onValueChange={onMoedaChange}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">BRL</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Seletor de Tipo de Gráfico */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Tipo:</span>
                  <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">
                        <div className="flex items-center gap-2">
                          <LineChartIcon className="h-4 w-4" />
                          Linhas
                        </div>
                      </SelectItem>
                      <SelectItem value="bar">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Barras
                        </div>
                      </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Seletor de Ano (para consolidado) */}
              {viewMode === "consolidado" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Ano:</span>
                  <Select value={selectedYear?.toString() || "todos"} onValueChange={(value) => {
                    if (value === "todos") {
                      setSelectedYear(null);
                    } else {
                      setSelectedYear(parseInt(value));
                      setViewMode("detalhado");
                    }
                  }}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {anos.map(ano => (
                        <SelectItem key={ano} value={ano.toString()}>{ano}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            {/* Controle de Métricas */}
            <div className="flex gap-2">
              <Button
                variant={selectedMetrics.includes("receitasTotais") ? "default" : "outline"}
                size="sm"
                onClick={() => toggleMetric("receitasTotais")}
              >
                Receitas
              </Button>
              <Button
                variant={selectedMetrics.includes("despesasTotais") ? "default" : "outline"}
                size="sm"
                onClick={() => toggleMetric("despesasTotais")}
              >
                Despesas
              </Button>
              <Button
                variant={selectedMetrics.includes("portfolioFinal") ? "default" : "outline"}
                size="sm"
                onClick={() => toggleMetric("portfolioFinal")}
              >
                Portfolio
              </Button>
              <Button
                variant={selectedMetrics.includes("saving") ? "default" : "outline"}
                size="sm"
                onClick={() => toggleMetric("saving")}
              >
                Saving
              </Button>
            </div>

            {/* Linha 2: Simulação de Provedores */}
            {provedores.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Simulação:</span>
                </div>
                <div className="flex gap-2">
                  {provedores.map((provedor) => {
                    const status = getProvedorStatus(provedor);
                    const statusConfig = {
                      ativo: { 
                        color: "bg-green-100 text-green-800 border-green-200", 
                        icon: User, 
                        label: "Ativo"
                      },
                      ausente: { 
                        color: "bg-red-100 text-red-800 border-red-200", 
                        icon: X, 
                        label: "Ausente"
                      }
                    };
                    const config = statusConfig[status as keyof typeof statusConfig];
                    const IconComponent = config.icon;

                    return (
                      <Button
                        key={provedor.id}
                        onClick={() => toggleProvedorStatus(provedor)}
                        disabled={updateSimulacaoMutation.isPending}
                        className={`${config.color} border hover:opacity-80 transition-all duration-200 h-8 px-3`}
                        variant="outline"
                        size="sm"
                      >
                        <IconComponent className="h-3 w-3 mr-1.5" />
                        <span className="text-xs font-medium">{provedor.nome}</span>
                        <span className="text-[10px] opacity-60 ml-1">({config.label})</span>
                      </Button>
                    );
                  })}
                </div>
                {updateSimulacaoMutation.isPending && (
                  <div className="text-xs text-gray-500 animate-pulse">
                    Atualizando...
                  </div>
                )}
                
                {/* Botão para Calcular Capital Segurado - sempre visível, habilitado apenas com provedores ausentes */}
                <Button
                  onClick={() => setRegeneracaoRealizada(true)}
                  disabled={!provedores.some(p => getProvedorStatus(p) === 'ausente') || regeneracaoRealizada}
                  variant="outline"
                  size="sm"
                  className={`h-8 px-3 ${
                    provedores.some(p => getProvedorStatus(p) === 'ausente') && !regeneracaoRealizada
                      ? 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100'
                      : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                  }`}
                >
                  <Calculator className="h-3 w-3 mr-1.5" />
                  <span className="text-xs font-medium">
                    {provedores.some(p => getProvedorStatus(p) === 'ausente') 
                      ? 'Calcular CS' 
                      : 'Calcular CS (marque provedor ausente)'}
                  </span>
                </Button>
              </div>
            )}

            {/* Seção de Sugestões de Capital Segurado - Apenas após regeneração com provedores ausentes */}
            {calcularSugestaoCapitalSegurado && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <h4 className="font-semibold text-orange-800">Sugestões de Capital Segurado</h4>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(calcularSugestaoCapitalSegurado).map(([membroId, dados]) => {
                    const membro = membros.find(m => m.id === parseInt(membroId));
                    if (!membro) return null;
                    
                    return (
                      <div key={membroId} className="bg-white border border-orange-200 rounded p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="text-xs">
                              {membro.nome} - AUSENTE
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-orange-800">
                              Capital Segurado Sugerido = <span className="text-green-700">{formatCurrency(dados.sugestao)}</span>
                              {dados.totalProvedores > 1 && (
                                <div className="text-xs text-gray-600 mt-1">
                                  Valor dividido entre {dados.totalProvedores} provedores ausentes
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {dados.sugestao === 0 && (
                          <div className="mt-2 text-xs text-green-600 font-medium">
                            ✅ Capital segurado atual é suficiente para cobrir o déficit projetado
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Botão para regenerar com Capital Segurado */}
                  <div className="bg-green-50 border border-green-200 rounded p-3 mt-4">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => {
                          const totalCapitalSugerido = Object.values(calcularSugestaoCapitalSegurado)
                            .reduce((total, dados) => total + dados.sugestao, 0);
                          
                          const provedoresAusentes = simulacoes
                            .filter(s => s.status === 'ausente')
                            .map(s => s.membroId);
                          
                          regenerarMutation.mutate({
                            provedoresAusentes,
                            capitalSeguradoAdicional: totalCapitalSugerido
                          });
                        }}
                        disabled={regenerarMutation.isPending}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded font-medium text-sm flex items-center gap-2"
                      >
                        <RefreshCw className={`h-4 w-4 ${regenerarMutation.isPending ? 'animate-spin' : ''}`} />
                        Testar CS Ideal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
          </div>
        </div>
        
        <div className="p-2 pl-16">
          <ResponsiveContainer width="100%" height={650}>
            {chartType === "line" ? (
                <LineChart data={viewMode === "consolidado" ? dadosConsolidados : dadosDetalhados} margin={{ left: 20, right: 20, top: 20, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey={viewMode === "consolidado" ? "ano" : "periodo"} 
                    tickFormatter={viewMode === "consolidado" ? formatYear : undefined}
                    angle={viewMode === "detalhado" ? -45 : 0}
                    textAnchor={viewMode === "detalhado" ? "end" : "middle"}
                    height={viewMode === "detalhado" ? 60 : 40}
                    axisLine={true}
                    tickLine={true}
                  />
                  <YAxis 
                    width={80}
                    tickFormatter={(value) => {
                      const formatted = formatCurrencyDisplay(value);
                      const symbol = moeda === "USD" ? '$' : 'R$';
                      return formatted.replace(/[R$€£¥$]/g, '').slice(0, -3) + 'K ' + symbol;
                    }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {selectedMetrics.includes("receitasTotais") && (
                    <Line 
                      type="monotone" 
                      dataKey="receitasTotais" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Receitas Totais"
                    />
                  )}
                  {selectedMetrics.includes("despesasTotais") && (
                    <Line 
                      type="monotone" 
                      dataKey="despesasTotais" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Despesas Totais"
                    />
                  )}
                  {selectedMetrics.includes("portfolioFinal") && (
                    <Line 
                      type="monotone" 
                      dataKey="portfolioFinal" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Portfolio"
                    />
                  )}
                  {selectedMetrics.includes("saving") && (
                    <Line 
                      type="monotone" 
                      dataKey="saving" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      name="Poupança"
                    />
                  )}
                  
                  {viewMode === "detalhado" && (
                    <>
                      <Line type="monotone" dataKey="despesasBasicas" stroke="#f59e0b" name="Básicas" />
                      <Line type="monotone" dataKey="despesasDependentes" stroke="#06b6d4" name="Dependentes" />
                      <Line type="monotone" dataKey="despesasEstilo" stroke="#ec4899" name="Estilo" />
                      <Line type="monotone" dataKey="despesasViagens" stroke="#84cc16" name="Viagens" />
                      <Line type="monotone" dataKey="despesasPatrimoniais" stroke="#64748b" name="Patrimoniais" />
                    </>
                  )}
                </LineChart>
              ) : (
                <BarChart data={viewMode === "consolidado" ? dadosConsolidados : dadosDetalhados} margin={{ left: 20, right: 20, top: 20, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey={viewMode === "consolidado" ? "ano" : "periodo"} 
                    tickFormatter={viewMode === "consolidado" ? formatYear : undefined}
                    angle={viewMode === "detalhado" ? -45 : 0}
                    textAnchor={viewMode === "detalhado" ? "end" : "middle"}
                    height={viewMode === "detalhado" ? 60 : 40}
                    axisLine={true}
                    tickLine={true}
                  />
                  <YAxis 
                    width={80}
                    tickFormatter={(value) => {
                      const formatted = formatCurrencyDisplay(value);
                      const symbol = moeda === "USD" ? '$' : 'R$';
                      return formatted.replace(/[R$€£¥$]/g, '').slice(0, -3) + 'K ' + symbol;
                    }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  <Bar dataKey="receitasTotais" fill="#10b981" name="Receitas Totais" />
                  <Bar dataKey="despesasTotais" fill="#ef4444" name="Despesas Totais" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          
          {/* Área de exibição dos valores do tooltip */}
          {hoveredData && (
            <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-base font-semibold text-gray-700 mb-2">
                {hoveredData.label}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {hoveredData.payload.map((entry: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <div className="text-sm">
                      <div className="font-medium text-gray-600">{entry.name}</div>
                      <div className="font-bold text-gray-900">
                        {formatCurrencyDisplay(entry.value)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}