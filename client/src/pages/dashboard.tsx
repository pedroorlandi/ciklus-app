import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import MainLayout from "@/components/layout/MainLayout";
import Header from "@/components/layout/header";
import KPICards from "@/components/dashboard/kpi-cards";
import FinancialChart from "@/components/dashboard/financial-chart";
import EconomicIndicators from "@/components/dashboard/economic-indicators";
import RecentGoals from "@/components/dashboard/recent-goals";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import PortfolioOverview from "@/components/dashboard/portfolio-overview";
import FamilyMembers from "@/components/dashboard/family-members";
import MoodInsights from "@/components/dashboard/mood-insights";
import ProjecoesFuturas from "@/components/dashboard/projacoes-futuras";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: dashboardData, isLoading: isDashboardLoading, error } = useQuery({
    queryKey: ["/api/dashboard"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: planejamentos = [] } = useQuery({
    queryKey: ["/api/planejamentos"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Handle unauthorized errors at the endpoint level
  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [error, toast]);

  if (isLoading || isDashboardLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 h-96 bg-gray-100 rounded-xl animate-pulse"></div>
            <div className="h-96 bg-gray-100 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const defaultData = {
    totalAssets: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    goalsAchieved: 0,
    totalGoals: 0,
    recentGoals: [],
    portfolioAllocation: [],
  };

  const data = dashboardData || defaultData;
  const firstPlanejamento = Array.isArray(planejamentos) ? planejamentos[0] : null;

  return (
    <MainLayout>
      <Header 
        title="Dashboard" 
        subtitle="Visão geral do planejamento financeiro" 
      />
      
      <KPICards data={data} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
        {/* Financial Projection Chart */}
        <div className="xl:col-span-2">
          <FinancialChart />
        </div>

        {/* Economic Indicators */}
        <div className="space-y-6">
          <EconomicIndicators />
          <RecentGoals goals={data?.recentGoals || []} />
        </div>
      </div>

      {/* Mood Insights */}
      <div className="mt-8">
        <MoodInsights planejamentoId={firstPlanejamento?.id} />
      </div>

      {/* Projeções Futuras */}
      <div className="mt-8">
        <ProjecoesFuturas />
      </div>

      {/* Recent Transactions and Portfolio */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
        <RecentTransactions />
        <PortfolioOverview allocation={data?.portfolioAllocation || []} />
      </div>

      {/* Family Members Panel */}
      <div className="mt-8">
        <FamilyMembers planejamentoId={firstPlanejamento?.id} />
      </div>
    </MainLayout>
  );
}
