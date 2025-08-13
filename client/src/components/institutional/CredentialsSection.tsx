import { Shield, Award, CheckCircle, Star } from "lucide-react";
import planejarLogo from "@assets/0mCuFuGOnN9T9Ux7ioZdPGcujw.png_1752844934006.webp";
import cfpLogo from "@assets/cfp-o-que-e_9f39552b-7912-41d7-85ab-356c743249ec.png_1752844934006.webp";
import cvmLogo from "@assets/logo_cvm_1752844934006.png";

export default function CredentialsSection() {
  const credentials = [
    {
      logo: planejarLogo,
      name: "PLANEJAR",
      description: "25 anos de experiência em planejamento financeiro",
      category: "Experiência",
      icon: Award
    },
    {
      logo: cfpLogo,
      name: "CFP - Certified Financial Planner",
      description: "Certificação internacional em planejamento financeiro",
      category: "Certificação",
      icon: Shield
    },
    {
      logo: cvmLogo,
      name: "CVM - Comissão de Valores Mobiliários",
      description: "Regulamentação e supervisão do mercado de capitais",
      category: "Regulamentação",
      icon: CheckCircle
    }
  ];

  const stats = [
    { number: "25+", label: "Anos de Experiência", icon: Star },
    { number: "500+", label: "Famílias Atendidas", icon: Award },
    { number: "100%", label: "Conformidade Regulatória", icon: Shield },
    { number: "95%", label: "Satisfação dos Clientes", icon: CheckCircle }
  ];

  return (
    <section id="credentials" className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              <span className="text-business-600">Credibilidade</span> e Acreditações
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nossa expertise é respaldada por certificações reconhecidas internacionalmente 
              e décadas de experiência no mercado financeiro brasileiro.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="reveal delay-300 mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="text-center p-6 bg-gray-50 rounded-xl hover:bg-business-50 transition-colors"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-business-100 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-business-600" />
                  </div>
                  <div className="text-3xl font-bold text-business-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="reveal delay-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {credentials.map((credential, index) => {
              const Icon = credential.icon;
              return (
                <div 
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:border-business-200"
                >
                  {/* Category Badge */}
                  <div className="inline-flex items-center space-x-2 bg-business-100 text-business-600 px-3 py-1 rounded-full text-sm font-semibold mb-6">
                    <Icon className="h-4 w-4" />
                    <span>{credential.category}</span>
                  </div>

                  {/* Logo */}
                  <div className="mb-6 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <img 
                        src={credential.logo} 
                        alt={credential.name}
                        className="h-16 w-auto max-w-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {credential.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {credential.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Statement */}
        <div className="reveal mt-16">
          <div className="bg-gradient-to-r from-business-600 to-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                <Shield className="h-8 w-8" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                Confiança e Transparência em Cada Decisão
              </h3>
              
              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                Nossa atuação é pautada pelos mais altos padrões éticos e regulamentares. 
                Somos certificados pela CFP Board e seguimos rigorosamente as diretrizes da CVM, 
                garantindo que seus investimentos estejam sempre em conformidade com a legislação vigente.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold mb-2">ISO 27001</div>
                  <div className="text-sm text-blue-100">Segurança da Informação</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold mb-2">LGPD</div>
                  <div className="text-sm text-blue-100">Proteção de Dados</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold mb-2">Fiduciário</div>
                  <div className="text-sm text-blue-100">Dever de Diligência</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}