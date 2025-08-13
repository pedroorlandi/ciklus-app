import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { PlanejamentoProvider } from "@/hooks/usePlanejamentoContext";
import NotFound from "@/pages/not-found";
import InstitutionalLanding from "@/pages/InstitutionalLanding";
import Login from "@/pages/Login";
import Dashboard from "@/pages/dashboard";
import Planejamentos from "@/pages/planejamentos";
import PlanejamentoDetails from "@/pages/planejamento-details";
import Membros from "@/pages/membros";
import ImoveisSimples from "@/pages/imoveis-simples";
import Portfolio from "@/pages/portfolio";
import Receitas from "@/pages/receitas";
import Despesas from "@/pages/despesas";
import Objetivos from "@/pages/objetivos";
import Seguros from "@/pages/seguros";
import Indices from "@/pages/indices";
import Dados from "@/pages/dados";
import Simulacoes from "@/pages/simulacoes";
import Admin from "@/pages/admin";
import Configuracoes from "@/pages/configuracoes";



function Router() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // Simple test to see if routing works
  console.log('CURRENT ROUTE:', location.pathname);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-business-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Dashboard />} 
      />
      <Route path="/institucional" element={<InstitutionalLanding />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Login />} 
      />
      <Route 
        path="/planejamentos" 
        element={isAuthenticated ? <Planejamentos /> : <Login />} 
      />
      <Route 
        path="/planejamentos/:id" 
        element={isAuthenticated ? <PlanejamentoDetails /> : <Login />} 
      />
      <Route 
        path="/membros" 
        element={isAuthenticated ? <Membros /> : <Login />} 
      />
      <Route 
        path="/imoveis" 
        element={isAuthenticated ? <ImoveisSimples /> : <Login />} 
      />
      <Route 
        path="/portfolio" 
        element={isAuthenticated ? <Portfolio /> : <Login />} 
      />
      <Route 
        path="/receitas" 
        element={isAuthenticated ? <Receitas /> : <Login />} 
      />
      <Route 
        path="/despesas" 
        element={isAuthenticated ? <Despesas /> : <Login />} 
      />
      <Route 
        path="/objetivos" 
        element={isAuthenticated ? <Objetivos /> : <Login />} 
      />
      <Route 
        path="/seguros" 
        element={isAuthenticated ? <Seguros /> : <Login />} 
      />
      <Route 
        path="/indices" 
        element={isAuthenticated ? <Indices /> : <Login />} 
      />
      <Route 
        path="/dados" 
        element={isAuthenticated ? <Dados /> : <Login />} 
      />
      <Route 
        path="/simulacoes" 
        element={isAuthenticated ? <Simulacoes /> : <Login />} 
      />
      <Route 
        path="/admin" 
        element={isAuthenticated ? <Admin /> : <Login />} 
      />
      <Route 
        path="/configuracoes" 
        element={isAuthenticated ? <Configuracoes /> : <Login />} 
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <PlanejamentoProvider>
            <Toaster />
            <Router />
          </PlanejamentoProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
