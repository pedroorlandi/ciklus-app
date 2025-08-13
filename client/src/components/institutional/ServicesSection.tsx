import { TrendingUp, Calculator, Target, Shield, Receipt, Users } from "lucide-react";

export default function ServicesSection() {
  // Os pilares fundamentais do planejamento financeiro centrado na vida (textos originais)
  const pilares = [
    {
      icon: TrendingUp,
      title: "Investimentos",
      description: "Consultoria especializada para construir e gerenciar uma carteira de investimentos diversificada e alinhada aos seus objetivos de vida e perfil de risco.",
      subtitle: "Destaque",
      highlight: true, // Destaque especial para CVM
      regulation: "CVM"
    },
    {
      icon: Calculator,
      title: "Fluxo de Caixa",
      description: "Análise detalhada de receitas e despesas para otimizar sua gestão financeira diária e criar uma base sólida para o crescimento patrimonial."
    },
    {
      icon: Target,
      title: "Projetos e Longevidade",
      description: "Planejamento estratégico para seus objetivos de curto, médio e longo prazo, garantindo recursos para realizar seus sonhos e manter qualidade de vida."
    },
    {
      icon: Shield,
      title: "Proteção",
      description: "Estratégias para mitigar riscos financeiros e proteger seu patrimônio e entes queridos contra imprevistos, garantindo tranquilidade em qualquer cenário."
    },
    {
      icon: Receipt,
      title: "Tributos",
      description: "Orientação para otimização fiscal dentro da legalidade, reduzindo a carga tributária e maximizando a eficiência do seu planejamento financeiro."
    },
    {
      icon: Users,
      title: "Legado",
      description: "Estruturação do seu patrimônio para transmissão de bens e valores às próximas gerações, alinhando aspectos financeiros, legais e emocionais."
    }
  ];

  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Serviço Principal */}
        <div className="text-center mb-20">
          <div className="reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nosso <span className="text-business-600">Serviço</span>
            </h2>
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-business-600 mb-6">
                Life Centered Financial Planning
              </h3>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                Oferecemos planejamento financeiro centrado na vida, uma abordagem revolucionária que 
                coloca seus valores, sonhos e objetivos pessoais no centro de todas as decisões financeiras.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Através do <strong className="text-business-600">CIKLUS APP</strong>, nossa ferramenta 
                proprietária, materializamos esta metodologia cobrindo todos os pilares do planejamento 
                financeiro de forma integrada e personalizada.
              </p>
            </div>
          </div>
        </div>

        {/* Pilares do Planejamento */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="reveal">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Pilares do <span className="text-business-600">Planejamento Financeiro</span>
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Nossa abordagem Life Centered integra todos os aspectos essenciais do planejamento 
                financeiro, sempre priorizando seus objetivos de vida.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pilares.map((pilar, index) => {
            const Icon = pilar.icon;
            return (
              <div 
                key={index}
                className={`reveal delay-${(index % 3) * 300} bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-business-200 ${
                  pilar.highlight ? 'ring-2 ring-business-300 relative' : ''
                }`}
              >
                {pilar.regulation && (
                  <div className="absolute -top-3 -right-3 bg-business-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Regulado {pilar.regulation}
                  </div>
                )}
                
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  pilar.highlight ? 'bg-business-600' : 'bg-business-100'
                }`}>
                  <Icon className={`h-6 w-6 ${pilar.highlight ? 'text-white' : 'text-business-600'}`} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {pilar.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {pilar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CIKLUS APP - Nossa Ferramenta */}
        <div className="mt-20">
          <div className="reveal">
            <div className="bg-gradient-to-r from-business-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                CIKLUS APP: Nossa Metodologia Digital
              </h3>
              <p className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
                O CIKLUS APP é nossa ferramenta proprietária que materializa a filosofia Life Centered Financial Planning. 
                Através dele, integramos todos os pilares do planejamento financeiro em uma plataforma única, 
                proporcionando visão completa e integrada do seu patrimônio e objetivos de vida.
              </p>
            </div>
            
            <div className="text-center mb-12">
              <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Como Funciona Nossa Metodologia
              </h4>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Um processo estruturado que combina conhecimento especializado com tecnologia avançada.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Descoberta", description: "Conhecemos você, seus valores e objetivos de vida", icon: Users },
              { step: "2", title: "Planejamento", description: "Estruturamos estratégias personalizadas usando o CIKLUS APP", icon: Target },
              { step: "3", title: "Implementação", description: "Colocamos o plano em ação integrando todos os pilares", icon: TrendingUp },
              { step: "4", title: "Acompanhamento", description: "Monitoramos e ajustamos continuamente seu progresso", icon: Shield }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className={`reveal delay-${(index + 1) * 200} text-center`}>
                  <div className="relative">
                    <div className="bg-business-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                      {item.step}
                    </div>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-business-200 -translate-y-1/2"></div>
                    )}
                  </div>
                  
                  <div className="bg-business-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-business-600" />
                  </div>
                  
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h4>
                  
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}