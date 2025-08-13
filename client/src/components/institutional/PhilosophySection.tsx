import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PhilosophySection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-purple-600 border-purple-200">
            Nossa Filosofia
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Return On Life</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Return On Life: Além do Retorno Financeiro
            </h3>
            
            <p className="text-gray-600 leading-relaxed">
              Nossa filosofia é baseada nos conceitos revolucionários de <strong>Mitch Anthony</strong>: 
              o <strong>Life Centered Financial Planning</strong> e o <strong>Return On Life (ROL)</strong>. 
              Enquanto o mercado tradicional foca no retorno sobre investimento (ROI), nós priorizamos 
              o retorno sobre a vida - como suas decisões financeiras podem maximizar sua satisfação, 
              liberdade e realização pessoal.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Como profissionais certificados CFP®, combinamos conhecimento técnico multidisciplinar 
              com uma abordagem humanizada que coloca você e seus objetivos de vida no centro de 
              todas as decisões financeiras. Para nós, o dinheiro não é o objetivo final, mas sim 
              uma ferramenta para viver melhor, ter mais tempo com quem ama e realizar seus sonhos 
              mais importantes.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-gray-700">Certificação CFP® - máximo padrão de excelência em planejamento financeiro</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-gray-700">Abordagem multiespecialista integrando todas as áreas financeiras</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-gray-700">Filosofia Life Centered Financial Planning de Mitch Anthony</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-gray-700">Foco no Return On Life (ROL) - retorno sobre a qualidade de vida</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200" 
              alt="Nossa equipe em reunião"
              className="rounded-lg shadow-xl w-full h-80 object-cover"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h4 className="font-bold text-gray-900 mb-3">Nossa Missão</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Transformar vidas através de um planejamento financeiro que maximiza o Return On Life, 
                colocando seus sonhos e bem-estar no centro de todas as decisões, seguindo os mais 
                altos padrões de excelência da certificação CFP®.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h4 className="font-bold text-gray-900 mb-3">Nossa Equipe</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Profissionais multiespecialistas certificados CFP® com expertise em investimentos, 
                proteção, tributos, sucessão e planejamento de fluxo de caixa, unidos pela paixão 
                em maximizar o Return On Life de nossos clientes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h4 className="font-bold text-gray-900 mb-3">Nossa Metodologia</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Utilizamos as abordagens de Mitch Anthony: Life Centered Financial Planning e 
                Return On Life (ROL), focando primeiro em entender seus valores e sonhos para 
                depois construir estratégias financeiras que maximizem sua qualidade de vida.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}