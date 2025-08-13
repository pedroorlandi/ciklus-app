import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { 
  Calculator,
  TrendingUp,
  Target,
  PiggyBank,
  Home,
  Car,
  GraduationCap,
  Plane,
  Heart,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Play,
  RotateCcw
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";

import { usePlanejamentoContext } from "@/hooks/usePlanejamentoContext";

interface CenarioSimulacao {
  id: string;
  nome: string;
  tipo: 'aposentadoria' | 'casa_propria' | 'educacao' | 'viagem' | 'emergencia' | 'investimento';
  valorMeta: number;
  prazoMeses: number;
  aporteInicial: number;
  aporteMensal: number;
  rentabilidadeAno: number;
  resultados?: {
    valorFinal: number;
    totalAportes: number;
    totalRendimentos: number;
    viabilidade: 'viavel' | 'ajustar' | 'inviavel';
  };
}

export default function Simulacoes() {
  const { selectedPlanejamento, planejamentoNome } = usePlanejamentoContext();
  
  const [cenarioAtual, setCenarioAtual] = useState<CenarioSimulacao>({
    id: 'novo',
    nome: 'Nova Simulação',
    tipo: 'aposentadoria',
    valorMeta: 1000000,
    prazoMeses: 240, // 20 anos
    aporteInicial: 10000,
    aporteMensal: 1000,
    rentabilidadeAno: 10.5
  });

  const [cenariosSalvos, setCenariosSalvos] = useState<CenarioSimulacao[]>([]);

  const calcularSimulacao = (cenario: CenarioSimulacao) => {
    const { aporteInicial, aporteMensal, rentabilidadeAno, prazoMeses } = cenario;
    const taxaMensal = rentabilidadeAno / 100 / 12;
    
    // Cálculo de juros compostos
    const valorInicialFinal = aporteInicial * Math.pow(1 + taxaMensal, prazoMeses);
    
    // Cálculo de anuidade (aportes mensais)
    const valorAportesFinal = aporteMensal * 
      ((Math.pow(1 + taxaMensal, prazoMeses) - 1) / taxaMensal);
    
    const valorFinal = valorInicialFinal + valorAportesFinal;
    const totalAportes = aporteInicial + (aporteMensal * prazoMeses);
    const totalRendimentos = valorFinal - totalAportes;
    
    // Determinar viabilidade
    let viabilidade: 'viavel' | 'ajustar' | 'inviavel' = 'viavel';
    if (valorFinal < cenario.valorMeta * 0.8) {
      viabilidade = 'inviavel';
    } else if (valorFinal < cenario.valorMeta * 0.95) {
      viabilidade = 'ajustar';
    }
    
    return {
      valorFinal,
      totalAportes,
      totalRendimentos,
      viabilidade
    };
  };

  const gerarDadosGrafico = () => {
    const dados = [];
    const { aporteInicial, aporteMensal, rentabilidadeAno, prazoMeses } = cenarioAtual;
    const taxaMensal = rentabilidadeAno / 100 / 12;
    
    let saldoAcumulado = aporteInicial;
    let totalAportes = aporteInicial;
    
    for (let mes = 0; mes <= prazoMeses; mes += 6) { // Pontos a cada 6 meses
      if (mes > 0) {
        // Aplicar juros e aportes
        const mesesDecorridos = Math.min(6, prazoMeses - mes + 6);
        saldoAcumulado = saldoAcumulado * Math.pow(1 + taxaMensal, mesesDecorridos);
        totalAportes += aporteMensal * mesesDecorridos;
        saldoAcumulado += aporteMensal * mesesDecorridos;
      }
      
      dados.push({
        mes,
        ano: Math.floor(mes / 12),
        valorTotal: Math.round(saldoAcumulado),
        aportes: Math.round(totalAportes),
        rendimentos: Math.round(saldoAcumulado - totalAportes)
      });
    }
    
    return dados;
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getIconeTipo = (tipo: string) => {
    switch (tipo) {
      case 'aposentadoria': return <PiggyBank className="h-5 w-5" />;
      case 'casa_propria': return <Home className="h-5 w-5" />;
      case 'educacao': return <GraduationCap className="h-5 w-5" />;
      case 'viagem': return <Plane className="h-5 w-5" />;
      case 'emergencia': return <Heart className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const resultados = calcularSimulacao(cenarioAtual);
  const dadosGrafico = gerarDadosGrafico();

  const executarSimulacao = () => {
    const novosCenarios = [...cenariosSalvos];
    const cenarioComResultados = {
      ...cenarioAtual,
      id: Date.now().toString(),
      resultados
    };
    
    novosCenarios.push(cenarioComResultados);
    setCenariosSalvos(novosCenarios);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <main className="flex-1 p-6">
          <div className="space-y-6">
            
            <Tabs defaultValue="simulador" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="simulador" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Simulador
                </TabsTrigger>
                <TabsTrigger value="cenarios" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Cenários Salvos
                </TabsTrigger>
                <TabsTrigger value="comparacao" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Comparação
                </TabsTrigger>
              </TabsList>

              {/* ABA SIMULADOR */}
              <TabsContent value="simulador">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Configuração da Simulação */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getIconeTipo(cenarioAtual.tipo)}
                        Configurar Simulação
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="nome">Nome da Simulação</Label>
                        <Input
                          id="nome"
                          value={cenarioAtual.nome}
                          onChange={(e) => setCenarioAtual({...cenarioAtual, nome: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="tipo">Tipo de Objetivo</Label>
                        <Select 
                          value={cenarioAtual.tipo} 
                          onValueChange={(value: any) => setCenarioAtual({...cenarioAtual, tipo: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aposentadoria">🏖️ Aposentadoria</SelectItem>
                            <SelectItem value="casa_propria">🏠 Casa Própria</SelectItem>
                            <SelectItem value="educacao">🎓 Educação</SelectItem>
                            <SelectItem value="viagem">✈️ Viagem</SelectItem>
                            <SelectItem value="emergencia">🚨 Reserva de Emergência</SelectItem>
                            <SelectItem value="investimento">💰 Investimento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="valorMeta">Valor da Meta (R$)</Label>
                        <Input
                          id="valorMeta"
                          type="number"
                          value={cenarioAtual.valorMeta}
                          onChange={(e) => setCenarioAtual({...cenarioAtual, valorMeta: parseFloat(e.target.value) || 0})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="prazoMeses">Prazo (meses)</Label>
                        <div className="space-y-2">
                          <Slider
                            value={[cenarioAtual.prazoMeses]}
                            onValueChange={([value]) => setCenarioAtual({...cenarioAtual, prazoMeses: value})}
                            max={480} // 40 anos
                            min={12}
                            step={6}
                            className="w-full"
                          />
                          <p className="text-sm text-gray-600">
                            {cenarioAtual.prazoMeses} meses ({(cenarioAtual.prazoMeses / 12).toFixed(1)} anos)
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="aporteInicial">Aporte Inicial (R$)</Label>
                        <Input
                          id="aporteInicial"
                          type="number"
                          value={cenarioAtual.aporteInicial}
                          onChange={(e) => setCenarioAtual({...cenarioAtual, aporteInicial: parseFloat(e.target.value) || 0})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="aporteMensal">Aporte Mensal (R$)</Label>
                        <Input
                          id="aporteMensal"
                          type="number"
                          value={cenarioAtual.aporteMensal}
                          onChange={(e) => setCenarioAtual({...cenarioAtual, aporteMensal: parseFloat(e.target.value) || 0})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="rentabilidade">Rentabilidade Anual (%)</Label>
                        <div className="space-y-2">
                          <Slider
                            value={[cenarioAtual.rentabilidadeAno]}
                            onValueChange={([value]) => setCenarioAtual({...cenarioAtual, rentabilidadeAno: value})}
                            max={25}
                            min={1}
                            step={0.5}
                            className="w-full"
                          />
                          <p className="text-sm text-gray-600">
                            {cenarioAtual.rentabilidadeAno}% ao ano
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={executarSimulacao} className="flex-1">
                          <Play className="h-4 w-4 mr-2" />
                          Simular
                        </Button>
                        <Button variant="outline" onClick={() => setCenarioAtual({
                          id: 'novo',
                          nome: 'Nova Simulação',
                          tipo: 'aposentadoria',
                          valorMeta: 1000000,
                          prazoMeses: 240,
                          aporteInicial: 10000,
                          aporteMensal: 1000,
                          rentabilidadeAno: 10.5
                        })}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Resultados */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Resultados da Simulação
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {/* KPIs */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Valor Final</p>
                            <p className="text-lg font-bold text-green-600">
                              {formatarMoeda(resultados.valorFinal)}
                            </p>
                          </div>
                          
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <PiggyBank className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Total Investido</p>
                            <p className="text-lg font-bold text-blue-600">
                              {formatarMoeda(resultados.totalAportes)}
                            </p>
                          </div>
                          
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Rendimentos</p>
                            <p className="text-lg font-bold text-purple-600">
                              {formatarMoeda(resultados.totalRendimentos)}
                            </p>
                          </div>
                          
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <Target className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">% da Meta</p>
                            <p className="text-lg font-bold text-orange-600">
                              {((resultados.valorFinal / cenarioAtual.valorMeta) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {resultados.viabilidade === 'viavel' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-yellow-600" />
                            )}
                            <Badge className={
                              resultados.viabilidade === 'viavel' ? 'bg-green-100 text-green-800' :
                              resultados.viabilidade === 'ajustar' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {resultados.viabilidade === 'viavel' ? 'Meta Viável' :
                               resultados.viabilidade === 'ajustar' ? 'Ajustar Plano' : 'Meta Inviável'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600">
                            {resultados.viabilidade === 'viavel' 
                              ? 'Parabéns! Com esta estratégia você conseguirá atingir sua meta financeira.'
                              : resultados.viabilidade === 'ajustar'
                              ? 'Você está próximo da meta. Considere aumentar os aportes ou prazo.'
                              : 'A meta atual requer ajustes nos aportes, prazo ou rentabilidade.'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Gráfico de Evolução */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Evolução do Investimento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dadosGrafico}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="ano" />
                          <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                          <Tooltip formatter={(value: number) => [formatarMoeda(value), '']} />
                          <Bar dataKey="aportes" stackId="a" fill="#3B82F6" name="Aportes" />
                          <Bar dataKey="rendimentos" stackId="a" fill="#27156B" name="Rendimentos" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ABA CENÁRIOS SALVOS */}
              <TabsContent value="cenarios">
                <Card>
                  <CardHeader>
                    <CardTitle>Cenários Salvos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cenariosSalvos.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>Nenhum cenário salvo ainda.</p>
                        <p className="text-sm">Execute simulações para salvá-las aqui.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cenariosSalvos.map((cenario) => (
                          <div key={cenario.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                {getIconeTipo(cenario.tipo)}
                                <h4 className="font-medium">{cenario.nome}</h4>
                              </div>
                              <Badge className={
                                cenario.resultados?.viabilidade === 'viavel' ? 'bg-green-100 text-green-800' :
                                cenario.resultados?.viabilidade === 'ajustar' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }>
                                {cenario.resultados?.viabilidade}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Meta</p>
                                <p className="font-medium">{formatarMoeda(cenario.valorMeta)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Resultado</p>
                                <p className="font-medium">{formatarMoeda(cenario.resultados?.valorFinal || 0)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Prazo</p>
                                <p className="font-medium">{(cenario.prazoMeses / 12).toFixed(1)} anos</p>
                              </div>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-3"
                              onClick={() => setCenarioAtual(cenario)}
                            >
                              Carregar Cenário
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ABA COMPARAÇÃO */}
              <TabsContent value="comparacao">
                <Card>
                  <CardHeader>
                    <CardTitle>Comparação de Cenários</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>Funcionalidade em desenvolvimento.</p>
                      <p className="text-sm">Em breve você poderá comparar múltiplos cenários lado a lado.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}