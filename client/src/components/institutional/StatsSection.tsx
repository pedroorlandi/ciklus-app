import React from "react";
import { TrendingUp, Users, Shield, Award } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: TrendingUp,
      value: "95%",
      label: "Taxa de Satisfação",
      description: "dos nossos clientes"
    },
    {
      icon: Users,
      value: "15+",
      label: "Anos de Experiência",
      description: "no mercado financeiro"
    },
    {
      icon: Shield,
      value: "100%",
      label: "Transparência",
      description: "em todos os processos"
    },
    {
      icon: Award,
      value: "CFP®",
      label: "Certificação",
      description: "máximo padrão global"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index}
                className="text-center reveal fade-bottom"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="h-16 w-16 bg-business-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="text-business-600" size={24} />
                </div>
                <div className="text-3xl font-bold text-business-950 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;