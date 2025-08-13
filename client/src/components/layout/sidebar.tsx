import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/hooks/useSidebar";
import {
  Calendar,
  ChartLine,
  LayoutDashboard,
  PieChart,
  Users,
  Home,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  BarChart3,
  Settings,
  LogOut,
  Calculator,
  Menu,
  X,
} from "lucide-react";
import ciklusLogo from "@/assets/ciklus-logo.png";

const getNavigation = (userRole: string) => {
  const baseNavigation = [
    {
      section: "PRINCIPAL",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Planejamentos", href: "/planejamentos", icon: PieChart },
      ],
    },
    {
      section: "CADASTROS",
      items: [
        { name: "Membros", href: "/membros", icon: Users },
        { name: "Imóveis", href: "/imoveis", icon: Home },
        { name: "Portfolio", href: "/portfolio", icon: Briefcase },
        { name: "Receitas", href: "/receitas", icon: TrendingUp },
        { name: "Despesas", href: "/despesas", icon: TrendingDown },
        { name: "Objetivos", href: "/objetivos", icon: Target },
        { name: "Seguros", href: "/seguros", icon: Shield },
      ],
    },
    {
      section: "ANÁLISE",
      items: [
        { name: "Dados Mensais", href: "/dados", icon: Calendar },
        { name: "Simulações", href: "/simulacoes", icon: Calculator },
      ],
    },
    {
      section: "CONFIGURAÇÕES",
      items: [
        { name: "Parâmetros e Índices", href: "/indices", icon: BarChart3 },
        { name: "Configurações", href: "/configuracoes", icon: Settings },
      ],
    },
  ];

  // Adicionar seção de administração apenas para administradores
  if (userRole === "administrador") {
    baseNavigation.push({
      section: "ADMINISTRAÇÃO",
      items: [
        { name: "Gerenciar Usuários", href: "/admin", icon: Shield },
      ],
    });
  }

  return baseNavigation;
};

export default function Sidebar() {
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  
  const navigation = getNavigation(user?.role || "cliente");
  
  if (isLoading) {
    return (
      <>
        <button className="fixed top-4 left-4 z-50 bg-white shadow-md rounded-md p-2">
          <Menu className="h-5 w-5" />
        </button>
        <aside className="w-64 bg-white shadow-lg fixed h-full z-50 -left-64">
          <div className="p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </aside>
      </>
    );
  }

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed top-4 z-50 bg-white shadow-md rounded-md p-2 transition-all duration-300",
          isCollapsed ? "left-4" : "left-72"
        )}
      >
        {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "bg-white shadow-lg fixed h-full z-50 flex flex-col transition-all duration-300",
        isCollapsed ? "-left-64 w-64" : "left-0 w-64"
      )}>
        {/* Header - Fixed */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-24 h-8 flex items-center justify-center">
                <img src={ciklusLogo} alt="CIKLUS" className="h-full object-contain" />
              </div>
            </div>
          </div>
        </div>

      {/* User Profile - Fixed */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <img
            src={user?.profileImageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"}
            alt="Foto do usuário"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName || user?.email}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
            Online
          </span>
        </div>
      </div>

      {/* Navigation Menu - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <nav className="py-4">
          {navigation.map((section) => (
            <div key={section.section}>
              <div className="px-4 mb-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.section}
                </h3>
              </div>
              <ul className="space-y-1 px-2 mb-8">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                          isActive
                            ? "text-white bg-primary"
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout Button - Fixed at bottom */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('ciklus-user');
            window.location.href = "/login";
          }}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </button>
      </div>
    </aside>

    {/* Overlay - funciona em desktop e mobile para fechar sidebar ao clicar fora */}
    {!isCollapsed && (
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={toggleSidebar}
      />
    )}
  </>
  );
}
