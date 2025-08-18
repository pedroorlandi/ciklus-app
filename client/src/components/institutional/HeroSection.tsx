import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Shield } from "lucide-react";
import ciklusLogo from "@assets/color_logo_transparent_1752762036069.png";

export default function HeroSection() {
  const handleLoginClick = () => {
    window.location.href = 'https://app.ciklus.com.br';
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-business-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <div className="animate-fade-in">
              <div className="mb-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-2">
                  <span className="text-business-600">Life Centered</span>
                  <br />
                  Financial Planning
                </h1>
                <h2 className="text-2xl md:text-3xl text-gray-700 font-medium mb-6">
                  Planejamento Financeiro e Consultoria de Investimentos
                </h2>
              </div>
            </div>
            
            <div className="animate-fade-in delay-200">
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed font-light italic">
                "Para quem sabe que as experiências guiam os números e a vida é feita de <span className="text-business-600 font-medium">Ciklus</span>."
              </p>
            </div>

            <div className="animate-fade-in delay-400">
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Button
                  onClick={handleLoginClick}
                  size="lg"
                  className="bg-business-600 hover:bg-business-700 text-white px-8 py-4 text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button
                  onClick={() => scrollToSection('contact')}
                  variant="outline"
                  size="lg"
                  className="border-business-600 text-business-600 hover:bg-business-50 px-8 py-4 text-lg rounded-lg transition-all duration-300"
                >
                  📅 Agendar Apresentação
                </Button>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-business-200 inline-block">
                <p className="text-sm text-gray-600">
                  💡 <strong>Demonstração gratuita</strong> - Veja como funciona antes de decidir
                </p>
              </div>
            </div>

            {/* Key Features */}
            <div className="animate-fade-in delay-600">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <div className="bg-business-100 p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-business-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Crescimento Patrimonial</span>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <div className="bg-business-100 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-business-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Gestão Familiar</span>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <div className="bg-business-100 p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-business-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Segurança Total</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Logo and Visual Elements */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Logo */}
              <div className="logo-container animate-fade-in delay-800">
                <img 
                  src={ciklusLogo} 
                  alt="CIKLUS APP" 
                  className="h-64 w-auto md:h-80 lg:h-96 drop-shadow-lg"
                />
                
                {/* Orbiting Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-orbit-1">
                    <div className="w-4 h-4 bg-business-500 rounded-full shadow-lg"></div>
                  </div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-orbit-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg"></div>
                  </div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-orbit-3">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full shadow-lg"></div>
                  </div>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-radial from-business-200/20 via-transparent to-transparent rounded-full blur-3xl transform scale-150"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-business-400 rounded-full p-1">
          <div className="w-1 h-3 bg-business-400 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}