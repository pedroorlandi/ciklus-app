import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Target, 
  DollarSign, 
  AlertCircle,
  CheckCircle2 
} from "lucide-react";
import { usePlanejamentoContext } from "@/hooks/usePlanejamentoContext";

interface ProjecaoData {
  mes: string;
  ano: number;
  receitas: number;
  despesas: number;
  saldo: number;
  saldoAcumulado: number;
}

interface MetaFinanceira {
  id: number;
  nome: string;
  valorMeta: number;
  valorAtual: number;
  prazoMeses: number;
  categoria: string;
  status: 'em_progresso' | 'alcancada' | 'atrasada';
}

export default function ProjecoesFuturas() {
  const { selectedPlanejamento } = usePlanejamentoContext();
  const [horizonte, setHorizonte] = useState<string>("12");
  const [tipoProjecao, setTipoProjecao] = useState<string>("conservadora");

  const { data: projecaoData, isLoading } = useQuery({
    queryKey: [`/api/dados/${selectedPlanejamento}?horizonte=${horizonte}&tipo=${tipoProjecao}`],
    enabled: !!selectedPlanejamento,
    retry: false,
  });

  const { data: metas = [] } = useQuery({
    queryKey: [`/api/objetivos/${selectedPlanejamento}`],
    enabled: !!selectedPlanejamento,
    retry: false,
  });

  // Simulação de dados de projeção baseados na metodologia DADOS
  const gerarProjecaoSimulada = (): ProjecaoData[] => {
    const dados: ProjecaoData[] = [];
    const dataAtual = new Date();
    let saldoAcumulado = 50000; // Saldo inicial simulado
    
    for (let i = 0; i < parseInt(horizonte); i++) {
      const mes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + i);
      const variacao = tipoProjecao === 'otimista' ? 1.05 : 
                      tipoProjecao === 'pessimista' ? 0.95 : 1.02;
      
      const receitas = 15000 + (Math.random() * 2000 - 1000) * variacao;
      const despesas = 12000 + (Math.random() * 1500 - 750) * variacao;
      const saldo = receitas - despesas;
      saldoAcumulado += saldo;
      
      dados.push({
        mes: mes.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        ano: mes.getFullYear(),
        receitas: Math.round(receitas),
        despesas: Math.round(despesas),
        saldo: Math.round(saldo),
        saldoAcumulado: Math.round(saldoAcumulado)
      });
    }
    
    return dados;
  };

  const dadosProjecao = projecaoData || gerarProjecaoSimulada();

  const calcularMetricas = () => {
    if (!dadosProjecao.length) return null;
    
    const ultimoMes = dadosProjecao[dadosProjecao.length - 1];
    const saldoFinal = ultimoMes.saldoAcumulado;
    const saldoInicial = dadosProjecao[0].saldoAcumulado - dadosProjecao[0].saldo;
    const crescimentoTotal = saldoFinal - saldoInicial;
    const crescimentoPercentual = (crescimentoTotal / saldoInicial) * 100;
    
    return {
      saldoFinal,
      crescimentoTotal,
      crescimentoPercentual,
      mediaMensal: crescimentoTotal / dadosProjecao.length
    };
  };

  const metricas = calcularMetricas();

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'alcancada':
        return <Badge className="bg-green-100 text-green-800">Alcançada</Badge>;
      case 'atrasada':
        return <Badge className="bg-red-100 text-red-800">Atrasada</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Em Progresso</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">
              📈 Projeções Financeiras
            </CardTitle>
            <div className="flex gap-3">
              <Select value={tipoProjecao} onValueChange={setTipoProjecao}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservadora">Conservadora</SelectItem>
                  <SelectItem value="otimista">Otimista</SelectItem>
                  <SelectItem value="pessimista">Pessimista</SelectItem>
                </SelectContent>
              </Select>
              <Select value={horizonte} onValueChange={setHorizonte}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 Meses</SelectItem>
                  <SelectItem value="12">12 Meses</SelectItem>
                  <SelectItem value="24">24 Meses</SelectItem>
                  <SelectItem value="36">36 Meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {metricas && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Saldo Projetado</p>
                <p className="text-lg font-bold text-green-600">
                  {formatarMoeda(metricas.saldoFinal)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Crescimento Total</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatarMoeda(metricas.crescimentoTotal)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Crescimento %</p>
                <p className="text-lg font-bold text-purple-600">
                  {metricas.crescimentoPercentual.toFixed(1)}%
                </p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Média Mensal</p>
                <p className="text-lg font-bold text-orange-600">
                  {formatarMoeda(metricas.mediaMensal)}
                </p>
              </div>
            </div>
          )}

          {/* Gráfico de Projeção */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dadosProjecao}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number) => [formatarMoeda(value), '']}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="saldoAcumulado" 
                  stroke="#27156B" 
                  fill="#27156B" 
                  fillOpacity={0.3}
                  name="Saldo Acumulado"
                />
                <Line 
                  type="monotone" 
                  dataKey="saldo" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Saldo Mensal"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Metas e Objetivos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Progresso das Metas Financeiras
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {metas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>Nenhuma meta financeira definida.</p>
              <Button variant="outline" className="mt-2">
                Definir Primeira Meta
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {metas.map((meta: MetaFinanceira) => {
                const progresso = (meta.valorAtual / meta.valorMeta) * 100;
                const faltam = meta.valorMeta - meta.valorAtual;
                
                return (
                  <div key={meta.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{meta.nome}</h4>
                        <p className="text-sm text-gray-600">{meta.categoria}</p>
                      </div>
                      {getStatusBadge(meta.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso: {formatarMoeda(meta.valorAtual)}</span>
                        <span>Meta: {formatarMoeda(meta.valorMeta)}</span>
                      </div>
                      <Progress value={progresso} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{progresso.toFixed(1)}% concluído</span>
                        <span>Faltam: {formatarMoeda(faltam)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}