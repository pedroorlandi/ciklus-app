import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Target, Calendar, BarChart3 } from "lucide-react";

interface DadoMensal {
  id: number;
  ano: number;
  mes: number;
  data: string;
  tipo: 'receita' | 'despesa';
  receitaId?: number;
  receitaDescricao?: string;
  receitaCategoria?: string;
  receitaValor: string;
  receitaMoeda?: string;
  despesaId?: number;
  despesaDescricao?: string;
  despesaCategoria?: string;
  despesaValor: string;
  despesaMoeda?: string;
}

interface AnaliseAvancadaProps {
  dados: DadoMensal[];
  anoSelecionado: number;
}

interface InsightFinanceiro {
  tipo: 'sucesso' | 'alerta' | 'info' | 'critico';
  titulo: string;
  descricao: string;
  valor?: string;
  tendencia?: 'positiva' | 'negativa' | 'estavel';
  categoria?: string;
}

export default function AnaliseAvancada({ dados, anoSelecionado }: AnaliseAvancadaProps) {
  const [periodoAnalise, setPeriodoAnalise] = useState<string>("12meses");
  
  // Cálculos baseados nos dados mensais
  const calcularInsights = (): InsightFinanceiro[] => {
    if (!dados || dados.length === 0) return [];

    const receitas = dados.filter(d => d.tipo === 'receita');
    const despesas = dados.filter(d => d.tipo === 'despesa');

    const totalReceitas = receitas.reduce((acc, r) => acc + parseFloat(r.receitaValor || '0'), 0);
    const totalDespesas = despesas.reduce((acc, d) => acc + parseFloat(d.despesaValor || '0'), 0);
    const saldoMensal = totalReceitas - totalDespesas;

    // Análise por categoria
    const receitasPorCategoria = receitas.reduce((acc, r) => {
      const categoria = r.receitaCategoria || 'Outros';
      acc[categoria] = (acc[categoria] || 0) + parseFloat(r.receitaValor || '0');
      return acc;
    }, {} as Record<string, number>);

    const despesasPorCategoria = despesas.reduce((acc, d) => {
      const categoria = d.despesaCategoria || 'Outros';
      acc[categoria] = (acc[categoria] || 0) + parseFloat(d.despesaValor || '0');
      return acc;
    }, {} as Record<string, number>);

    const insights: InsightFinanceiro[] = [];

    // Insight 1: Saldo Geral
    if (saldoMensal > 0) {
      insights.push({
        tipo: 'sucesso',
        titulo: 'Saldo Positivo',
        descricao: `Sua família está poupando mensalmente`,
        valor: `R$ ${saldoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        tendencia: 'positiva'
      });
    } else if (saldoMensal < 0) {
      insights.push({
        tipo: 'critico',
        titulo: 'Déficit Mensal',
        descricao: `Gastos excedem receitas`,
        valor: `R$ ${Math.abs(saldoMensal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        tendencia: 'negativa'
      });
    }

    // Insight 2: Maior categoria de despesa
    const maiorDespesa = Object.entries(despesasPorCategoria)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (maiorDespesa) {
      const [categoria, valor] = maiorDespesa;
      const percentual = (valor / totalDespesas * 100).toFixed(1);
      
      insights.push({
        tipo: valor > totalReceitas * 0.3 ? 'alerta' : 'info',
        titulo: 'Maior Gasto',
        descricao: `${categoria} representa ${percentual}% dos gastos`,
        valor: `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        categoria
      });
    }

    // Insight 3: Diversificação de receitas
    const numFontesReceita = Object.keys(receitasPorCategoria).length;
    if (numFontesReceita === 1) {
      insights.push({
        tipo: 'alerta',
        titulo: 'Concentração de Renda',
        descricao: 'Apenas uma fonte de receita identificada',
        tendencia: 'negativa'
      });
    } else if (numFontesReceita >= 3) {
      insights.push({
        tipo: 'sucesso',
        titulo: 'Receitas Diversificadas',
        descricao: `${numFontesReceita} fontes de receita ativas`,
        tendencia: 'positiva'
      });
    }

    // Insight 4: Projeção anual
    const projecaoAnual = saldoMensal * 12;
    if (projecaoAnual > 50000) {
      insights.push({
        tipo: 'sucesso',
        titulo: 'Excelente Capacidade de Poupança',
        descricao: 'Projeção anual permite investimentos significativos',
        valor: `R$ ${projecaoAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / ano`
      });
    }

    return insights;
  };

  const insights = calcularInsights();

  const getInsightIcon = (tipo: string) => {
    switch (tipo) {
      case 'sucesso': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'alerta': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critico': return <TrendingDown className="h-5 w-5 text-red-600" />;
      default: return <BarChart3 className="h-5 w-5 text-blue-600" />;
    }
  };

  const getInsightBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'sucesso': return 'bg-green-100 text-green-800';
      case 'alerta': return 'bg-yellow-100 text-yellow-800';
      case 'critico': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-900">
            🧠 Análise Inteligente dos Dados
          </CardTitle>
          <div className="flex gap-3">
            <Select value={periodoAnalise} onValueChange={setPeriodoAnalise}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3meses">3 Meses</SelectItem>
                <SelectItem value="6meses">6 Meses</SelectItem>
                <SelectItem value="12meses">12 Meses</SelectItem>
                <SelectItem value="24meses">24 Meses</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Target className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Ainda não há dados suficientes para análise.</p>
            <p className="text-sm">Adicione receitas e despesas para ver insights inteligentes.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getInsightIcon(insight.tipo)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{insight.titulo}</h4>
                        <Badge className={`text-xs ${getInsightBadgeColor(insight.tipo)}`}>
                          {insight.tipo}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{insight.descricao}</p>
                      {insight.categoria && (
                        <p className="text-xs text-gray-500 mt-1">Categoria: {insight.categoria}</p>
                      )}
                    </div>
                  </div>
                  
                  {insight.valor && (
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{insight.valor}</p>
                      {insight.tendencia && (
                        <div className="flex items-center gap-1 mt-1">
                          {insight.tendencia === 'positiva' ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : insight.tendencia === 'negativa' ? (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          ) : (
                            <div className="h-3 w-3 bg-gray-400 rounded-full" />
                          )}
                          <span className="text-xs text-gray-500 capitalize">{insight.tendencia}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Resumo rápido */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mt-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-primary-600" />
                <h4 className="font-medium text-primary-900">Resumo {anoSelecionado}</h4>
              </div>
              <p className="text-sm text-primary-700">
                Análise baseada em <strong>{dados.length} registros mensais</strong> da metodologia DADOS.
                Dados expandidos permitindo análise detalhada de fluxo de caixa e projeções futuras.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}