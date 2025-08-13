import { CheckCircle, Target, Users, TrendingUp } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom">
        {/* Philosophy Section */}
        <div className="mb-20">
          <div className="reveal">
            <div className="bg-gradient-to-r from-business-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Return On Life: Além do Retorno Financeiro
                </h2>
                
                <div className="text-lg leading-relaxed space-y-6">
                  <p className="text-blue-100">
                    Nossa filosofia é baseada nos conceitos revolucionários de <strong className="text-white">Mitch Anthony</strong>: 
                    o <strong className="text-white">Life Centered Financial Planning</strong> e o <strong className="text-white">Return On Life (ROL)</strong>. 
                    Enquanto o mercado tradicional foca no retorno sobre investimento (ROI), nós priorizamos o retorno sobre a vida - 
                    como suas decisões financeiras podem maximizar sua satisfação, liberdade e realização pessoal.
                  </p>
                  
                  <p className="text-blue-100">
                    Como profissionais certificados <strong className="text-white">CFP®</strong>, combinamos conhecimento técnico 
                    multidisciplinar com uma abordagem humanizada que coloca você e seus objetivos de vida no centro de todas as 
                    decisões financeiras. Para nós, o dinheiro não é o objetivo final, mas sim uma ferramenta para viver melhor, 
                    ter mais tempo com quem ama e realizar seus sonhos mais importantes.
                  </p>
                </div>
                
                {/* Philosophy Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-2xl font-bold mb-2">CFP®</div>
                    <div className="text-sm text-blue-100">Máximo padrão de excelência em planejamento financeiro</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-2xl font-bold mb-2">Multi</div>
                    <div className="text-sm text-blue-100">Abordagem multiespecialista integrando todas as áreas</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-2xl font-bold mb-2">Life Centered</div>
                    <div className="text-sm text-blue-100">Filosofia Life Centered Financial Planning</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-2xl font-bold mb-2">ROL</div>
                    <div className="text-sm text-blue-100">Foco no Return On Life - qualidade de vida</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <div className="reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Sobre o <span className="text-business-600">CIKLUS APP</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desenvolvemos uma solução completa para famílias que buscam organizar, 
              controlar e fazer crescer seu patrimônio de forma inteligente e segura.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Column - Content */}
          <div className="reveal delay-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Nossa Missão
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Democratizar o acesso ao planejamento financeiro familiar através de uma plataforma 
              tecnológica avançada que replica metodologias comprovadas de gestão patrimonial.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Acreditamos que toda família merece ter acesso às mesmas ferramentas e estratégias 
              utilizadas pelos grandes gestores de patrimônio, adaptadas para a realidade brasileira.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-business-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Metodologia Comprovada</h4>
                  <p className="text-gray-600">Baseada em anos de experiência em planejamento financeiro</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-business-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Tecnologia Avançada</h4>
                  <p className="text-gray-600">Plataforma moderna com segurança empresarial</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-business-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Suporte Especializado</h4>
                  <p className="text-gray-600">Acompanhamento de profissionais certificados</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats/Features */}
          <div className="reveal delay-600">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-business-50 to-blue-50 p-6 rounded-xl text-center">
                <div className="bg-business-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-business-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">100%</h4>
                <p className="text-gray-600 text-sm">Metodologia Personalizada</p>
              </div>
              
              <div className="bg-gradient-to-br from-business-50 to-blue-50 p-6 rounded-xl text-center">
                <div className="bg-business-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-business-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">24/7</h4>
                <p className="text-gray-600 text-sm">Acesso à Plataforma</p>
              </div>
              
              <div className="bg-gradient-to-br from-business-50 to-blue-50 p-6 rounded-xl text-center">
                <div className="bg-business-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-business-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">+15%</h4>
                <p className="text-gray-600 text-sm">Melhoria Média no Planejamento</p>
              </div>
              
              <div className="bg-gradient-to-br from-business-50 to-blue-50 p-6 rounded-xl text-center">
                <div className="bg-business-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-business-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">5+</h4>
                <p className="text-gray-600 text-sm">Anos de Experiência</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Values */}
        <div className="reveal">
          <div className="bg-gradient-to-r from-business-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Nossos Valores
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-xl font-semibold mb-3">Transparência</h4>
                <p className="text-blue-100">
                  Informações claras e acessíveis sobre todas as operações e custos.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-3">Segurança</h4>
                <p className="text-blue-100">
                  Proteção máxima dos seus dados financiais e informações pessoais.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-3">Resultados</h4>
                <p className="text-blue-100">
                  Foco em entregar valor real através de estratégias comprovadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}