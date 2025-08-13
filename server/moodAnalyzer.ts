import { db } from "./db";
import { 
  moodInsights, 
  dadosMensais, 
  receitas, 
  despesas, 
  objetivos, 
  portfolioInvestimentos,
  planejamentos,
  type MoodInsight 
} from "../shared/schema.js";
import { eq, and, gte, lte, sql } from "drizzle-orm";

interface FinancialData {
  planejamentoId: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  goalsProgress: number;
  portfolioValue: number;
  cashFlowTrend: number;
  emergencyFund: number;
  debtToIncome: number;
}

interface InsightConfig {
  mood: string;
  threshold: {
    min: number;
    max: number;
  };
  category: string;
  priority: string;
  insights: {
    primary: string;
    secondary?: string;
    action: string;
  };
}

const moodConfigs: InsightConfig[] = [
  // Otimista
  {
    mood: "optimistic",
    threshold: { min: 80, max: 100 },
    category: "cash_flow",
    priority: "low",
    insights: {
      primary: "Excelente controle financeiro! Sua taxa de poupança está acima de 20% e o fluxo de caixa é positivo.",
      secondary: "Continue mantendo este padrão de disciplina financeira.",
      action: "Considere aumentar investimentos em renda variável para acelerar o crescimento patrimonial."
    }
  },
  {
    mood: "confident",
    threshold: { min: 70, max: 85 },
    category: "goals",
    priority: "medium",
    insights: {
      primary: "Ótimo progresso nos objetivos financeiros! Você está no caminho certo para alcançar suas metas.",
      secondary: "Mais de 70% dos objetivos estão com progresso satisfatório.",
      action: "Revise as metas que estão atrasadas e reajuste prazos ou valores se necessário."
    }
  },
  {
    mood: "planning",
    threshold: { min: 60, max: 75 },
    category: "investments", 
    priority: "medium",
    insights: {
      primary: "Seu portfólio está bem diversificado, mas há espaço para otimização.",
      secondary: "A alocação atual está balanceada entre renda fixa e variável.",
      action: "Considere rebalancear o portfólio de acordo com seu perfil de risco e objetivos."
    }
  },
  // Cauteloso
  {
    mood: "cautious",
    threshold: { min: 40, max: 65 },
    category: "savings",
    priority: "high",
    insights: {
      primary: "Sua reserva de emergência está abaixo do recomendado (6 meses de despesas).",
      secondary: "Isso pode comprometer sua segurança financeira em imprevistos.",
      action: "Priorize formar uma reserva de emergência antes de novos investimentos."
    }
  },
  {
    mood: "stressed",
    threshold: { min: 0, max: 45 },
    category: "debt",
    priority: "high",
    insights: {
      primary: "Atenção: suas despesas estão muito próximas ou superiores à renda mensal.",
      secondary: "A taxa de endividamento está acima do recomendado (30% da renda).",
      action: "Revise gastos urgentemente e crie um plano de redução de despesas."
    }
  },
  // Insights adicionais baseados em situações específicas
  {
    mood: "planning",
    threshold: { min: 50, max: 70 },
    category: "cash_flow",
    priority: "medium",
    insights: {
      primary: "Fluxo de caixa estável, mas pode ser otimizado.",
      secondary: "Há oportunidades de aumentar a margem de segurança financeira.",
      action: "Analise despesas não essenciais e busque formas de aumentar a renda."
    }
  },
  {
    mood: "confident",
    threshold: { min: 75, max: 90 },
    category: "investments",
    priority: "low",
    insights: {
      primary: "Portfólio bem estruturado com boa diversificação.",
      secondary: "Rentabilidade está dentro do esperado para seu perfil.",
      action: "Mantenha a estratégia atual e revise periodicamente a alocação."
    }
  }
];

export class MoodAnalyzer {
  private planejamentoId: number;
  private financialData: FinancialData;

  constructor(planejamentoId: number) {
    this.planejamentoId = planejamentoId;
    this.financialData = {
      planejamentoId,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      savingsRate: 0,
      goalsProgress: 0,
      portfolioValue: 0,
      cashFlowTrend: 0,
      emergencyFund: 0,
      debtToIncome: 0
    };
  }

  async analyze(): Promise<MoodInsight[]> {
    // Collect financial data
    await this.collectFinancialData();
    
    // Calculate mood scores
    const moodScores = this.calculateMoodScores();
    
    // Generate insights
    const insights = await this.generateInsights(moodScores);
    
    // Save insights to database
    await this.saveInsights(insights);
    
    return insights;
  }

  private async collectFinancialData(): Promise<void> {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // Get monthly income from dados_mensais
    const monthlyIncomeResult = await db
      .select({
        total: sql<number>`SUM(${dadosMensais.receitasTotais})::numeric`
      })
      .from(dadosMensais)
      .where(
        and(
          eq(dadosMensais.planejamentoId, this.planejamentoId),
          eq(dadosMensais.ano, currentYear),
          eq(dadosMensais.mes, currentMonth)
        )
      );
    
    this.financialData.monthlyIncome = Number(monthlyIncomeResult[0]?.total || 0);
    
    // Get monthly expenses from dados_mensais
    const monthlyExpensesResult = await db
      .select({
        total: sql<number>`SUM(${dadosMensais.despesasTotais})::numeric`
      })
      .from(dadosMensais)
      .where(
        and(
          eq(dadosMensais.planejamentoId, this.planejamentoId),
          eq(dadosMensais.ano, currentYear),
          eq(dadosMensais.mes, currentMonth)
        )
      );
    
    this.financialData.monthlyExpenses = Number(monthlyExpensesResult[0]?.total || 0);
    
    // Calculate savings rate
    const netIncome = this.financialData.monthlyIncome - this.financialData.monthlyExpenses;
    this.financialData.savingsRate = this.financialData.monthlyIncome > 0 
      ? (netIncome / this.financialData.monthlyIncome) * 100 
      : 0;
    
    // Get portfolio value
    const portfolioResult = await db
      .select({
        total: sql<number>`SUM(${portfolioInvestimentos.valorAtual})::numeric`
      })
      .from(portfolioInvestimentos)
      .where(eq(portfolioInvestimentos.planejamentoId, this.planejamentoId));
    
    this.financialData.portfolioValue = Number(portfolioResult[0]?.total || 0);
    
    // Get goals progress
    const goalsResult = await db
      .select({
        totalGoals: sql<number>`COUNT(*)::numeric`,
        completedGoals: sql<number>`SUM(CASE WHEN ${objetivos.valorAtual} >= ${objetivos.valorObjetivo} THEN 1 ELSE 0 END)::numeric`
      })
      .from(objetivos)
      .where(eq(objetivos.planejamentoId, this.planejamentoId));
    
    const totalGoals = Number(goalsResult[0]?.totalGoals || 0);
    const completedGoals = Number(goalsResult[0]?.completedGoals || 0);
    this.financialData.goalsProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
    
    // Calculate emergency fund (assuming 6 months of expenses)
    const emergencyTarget = this.financialData.monthlyExpenses * 6;
    this.financialData.emergencyFund = emergencyTarget > 0 
      ? Math.min((this.financialData.portfolioValue / emergencyTarget) * 100, 100)
      : 0;
    
    // Calculate debt to income ratio (simplified)
    this.financialData.debtToIncome = this.financialData.monthlyIncome > 0
      ? Math.max(0, ((this.financialData.monthlyExpenses - this.financialData.monthlyIncome) / this.financialData.monthlyIncome) * 100)
      : 0;
  }

  private calculateMoodScores(): { [key: string]: number } {
    const scores: { [key: string]: number } = {};
    
    // Optimistic score (based on savings rate and positive cash flow)
    scores.optimistic = Math.min(100, 
      (this.financialData.savingsRate * 2) + 
      (this.financialData.goalsProgress * 0.5) +
      (this.financialData.emergencyFund * 0.3)
    );
    
    // Confident score (based on goals progress and portfolio growth)
    scores.confident = Math.min(100,
      (this.financialData.goalsProgress * 0.6) +
      (this.financialData.savingsRate * 0.4) +
      (this.financialData.portfolioValue > 0 ? 20 : 0)
    );
    
    // Planning score (balanced approach)
    scores.planning = Math.min(100,
      (this.financialData.emergencyFund * 0.4) +
      (this.financialData.savingsRate * 0.3) +
      (this.financialData.goalsProgress * 0.3)
    );
    
    // Cautious score (inversely related to risk factors)
    scores.cautious = Math.min(100,
      Math.max(0, 100 - this.financialData.debtToIncome) * 0.5 +
      (this.financialData.emergencyFund * 0.5)
    );
    
    // Stressed score (based on financial stress indicators)
    scores.stressed = Math.min(100,
      this.financialData.debtToIncome +
      (this.financialData.savingsRate < 0 ? 30 : 0) +
      (this.financialData.emergencyFund < 50 ? 20 : 0)
    );
    
    return scores;
  }

  private async generateInsights(moodScores: { [key: string]: number }): Promise<MoodInsight[]> {
    const insights: MoodInsight[] = [];
    
    for (const config of moodConfigs) {
      const score = moodScores[config.mood] || 0;
      
      if (score >= config.threshold.min && score <= config.threshold.max) {
        const insight: MoodInsight = {
          id: 0, // Will be set by database
          planejamentoId: this.planejamentoId,
          mood: config.mood,
          score: score.toString(),
          primaryInsight: config.insights.primary,
          secondaryInsight: config.insights.secondary || null,
          actionItem: config.insights.action,
          category: config.category,
          priority: config.priority,
          dataPoints: {
            monthlyIncome: this.financialData.monthlyIncome,
            monthlyExpenses: this.financialData.monthlyExpenses,
            savingsRate: this.financialData.savingsRate,
            goalsProgress: this.financialData.goalsProgress,
            portfolioValue: this.financialData.portfolioValue,
            emergencyFund: this.financialData.emergencyFund,
            debtToIncome: this.financialData.debtToIncome
          },
          validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // Valid for 24 hours
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        insights.push(insight);
      }
    }
    
    // Sort by priority and score
    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return Number(b.score) - Number(a.score);
    });
  }

  private async saveInsights(insights: MoodInsight[]): Promise<void> {
    // Clear existing insights for this planejamento
    await db
      .delete(moodInsights)
      .where(eq(moodInsights.planejamentoId, this.planejamentoId));
    
    // Insert new insights
    if (insights.length > 0) {
      await db.insert(moodInsights).values(
        insights.map(insight => ({
          planejamentoId: insight.planejamentoId,
          mood: insight.mood,
          score: insight.score,
          primaryInsight: insight.primaryInsight,
          secondaryInsight: insight.secondaryInsight,
          actionItem: insight.actionItem,
          category: insight.category,
          priority: insight.priority,
          dataPoints: insight.dataPoints,
          validUntil: insight.validUntil
        }))
      );
    }
  }
}

export async function generateMoodInsights(planejamentoId: number): Promise<MoodInsight[]> {
  const analyzer = new MoodAnalyzer(planejamentoId);
  return await analyzer.analyze();
}