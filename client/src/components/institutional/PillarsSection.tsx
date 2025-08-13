import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calculator, Target, Shield, Receipt, Users } from "lucide-react";

const pillars = [
  {
    icon: TrendingUp,
    title: "Investimentos",
    subtitle: "Destaque",
    description: "Consultoria especializada para construir e gerenciar uma carteira de investimentos diversificada e alinhada aos seus objetivos de vida e perfil de risco.",
    featured: true
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

export function PillarsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pilares do Planejamento Financeiro
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Card 
                key={index} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  pillar.featured ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-white' : 'border-gray-200'
                }`}
              >
                {pillar.featured && (
                  <Badge className="absolute top-4 right-4 bg-purple-600 text-white">
                    {pillar.subtitle}
                  </Badge>
                )}
                
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      pillar.featured ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        pillar.featured ? 'text-purple-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <h3 className={`text-xl font-bold ${
                      pillar.featured ? 'text-purple-900' : 'text-gray-900'
                    }`}>
                      {pillar.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
            onClick={() => window.open('https://bit.ly/Pedro-Disponibilidade', '_blank')}
          >
            Agendar Reunião
          </Button>
        </div>
      </div>
    </section>
  );
}