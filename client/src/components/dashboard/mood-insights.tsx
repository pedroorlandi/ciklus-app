import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Brain,
  Lightbulb,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { type MoodInsight } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface MoodInsightsProps {
  planejamentoId?: number;
}

const moodIcons = {
  optimistic: { icon: TrendingUp, color: "text-green-500", bgColor: "bg-green-50", label: "Otimista" },
  confident: { icon: CheckCircle, color: "text-blue-500", bgColor: "bg-blue-50", label: "Confiante" },
  planning: { icon: Target, color: "text-purple-500", bgColor: "bg-purple-50", label: "Planejamento" },
  cautious: { icon: AlertTriangle, color: "text-yellow-500", bgColor: "bg-yellow-50", label: "Cauteloso" },
  stressed: { icon: TrendingDown, color: "text-red-500", bgColor: "bg-red-50", label: "Estressado" },
};

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800", 
  low: "bg-green-100 text-green-800",
};

const priorityLabels = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

const categoryLabels = {
  cash_flow: "Fluxo de Caixa",
  investments: "Investimentos",
  goals: "Objetivos",
  debt: "Dívidas",
  savings: "Poupança",
};

export default function MoodInsights({ planejamentoId }: MoodInsightsProps) {
  const queryClient = useQueryClient();
  
  const { data: insights = [], isLoading } = useQuery({
    queryKey: ["/api/mood-insights", planejamentoId],
    enabled: !!planejamentoId,
    retry: false,
  });

  const generateInsightsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/mood-insights/${planejamentoId}/generate`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/mood-insights", planejamentoId],
      });
    },
  });

  if (!planejamentoId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Insights Financeiros Inteligentes
          </CardTitle>
          <CardDescription>
            Selecione um planejamento para ver insights personalizados baseados na sua situação financeira
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Insights Financeiros Inteligentes
          </CardTitle>
          <CardDescription>
            Análise personalizada baseada na sua situação financeira atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Insights Financeiros Inteligentes
          </CardTitle>
          <CardDescription>
            Análise personalizada baseada na sua situação financeira atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">
              Não há insights disponíveis no momento
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Adicione receitas, despesas e objetivos para gerar insights personalizados
            </p>
            <Button 
              onClick={() => generateInsightsMutation.mutate()}
              disabled={generateInsightsMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {generateInsightsMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Brain className="w-4 h-4 mr-2" />
              )}
              Gerar Insights
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Insights Financeiros Inteligentes
        </CardTitle>
        <CardDescription>
          Análise personalizada baseada na sua situação financeira atual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => {
            const moodConfig = moodIcons[insight.mood as keyof typeof moodIcons];
            const IconComponent = moodConfig.icon;
            
            return (
              <div
                key={insight.id}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${moodConfig.bgColor}`}>
                      <IconComponent className={`w-4 h-4 ${moodConfig.color}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {moodConfig.label}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {categoryLabels[insight.category as keyof typeof categoryLabels]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={priorityColors[insight.priority as keyof typeof priorityColors]}
                    >
                      {priorityLabels[insight.priority as keyof typeof priorityLabels]}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {insight.score}%
                      </div>
                      <div className="text-xs text-gray-500">pontuação</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    {insight.primaryInsight}
                  </p>
                  {insight.secondaryInsight && (
                    <p className="text-sm text-gray-600">
                      {insight.secondaryInsight}
                    </p>
                  )}
                  <div className="flex items-start gap-2 mt-3 p-3 bg-gray-50 rounded-lg">
                    <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <strong>Ação recomendada:</strong> {insight.actionItem}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => generateInsightsMutation.mutate()}
              disabled={generateInsightsMutation.isPending}
            >
              {generateInsightsMutation.isPending ? (
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Brain className="w-3 h-3 mr-1" />
              )}
              Gerar novos insights
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}