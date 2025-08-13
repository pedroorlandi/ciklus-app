import { HeroSection } from "@/components/institutional/HeroSection";
import { PhilosophySection } from "@/components/institutional/PhilosophySection";
import { PillarsSection } from "@/components/institutional/PillarsSection";
import { TeamSection } from "@/components/institutional/TeamSection";
import { ContactSection } from "@/components/institutional/ContactSection";
import { Button } from "@/components/ui/button";
import ciklusLogo from "@/assets/ciklus-logo.png";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={ciklusLogo} 
                alt="CIKLUS" 
                className="h-8 w-auto"
              />
              <span className="font-bold text-xl text-gray-900">CIKLUS</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#filosofia" className="text-gray-600 hover:text-purple-600 transition-colors">
                Filosofia
              </a>
              <a href="#pilares" className="text-gray-600 hover:text-purple-600 transition-colors">
                Pilares
              </a>
              <a href="#equipe" className="text-gray-600 hover:text-purple-600 transition-colors">
                Equipe
              </a>
              <a href="#contato" className="text-gray-600 hover:text-purple-600 transition-colors">
                Contato
              </a>
            </nav>

            <div className="flex items-center space-x-3">
              <Button 
                variant="outline"
                onClick={() => window.open('https://bit.ly/Pedro-Disponibilidade', '_blank')}
                className="hidden sm:inline-flex"
              >
                Agendar Reunião
              </Button>
              <Button 
                onClick={() => {
                  const currentDomain = window.location.origin;
                  const authUrl = `https://replit.com/oidc/authorize?client_id=ciklus-app&response_type=code&scope=openid email profile&redirect_uri=${encodeURIComponent(currentDomain + '/api/callback')}`;
                  window.location.href = authUrl;
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Entrar no Sistema
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Philosophy Section */}
      <div id="filosofia">
        <PhilosophySection />
      </div>

      {/* Pillars Section */}
      <div id="pilares">
        <PillarsSection />
      </div>

      {/* Team Section */}
      <div id="equipe">
        <TeamSection />
      </div>

      {/* Contact Section */}
      <div id="contato">
        <ContactSection />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={ciklusLogo} 
                  alt="CIKLUS" 
                  className="h-8 w-auto"
                />
                <span className="font-bold text-xl">CIKLUS</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Life Centered Financial Planning - Transformando vidas através do 
                Return On Life com os mais altos padrões de excelência CFP®.
              </p>
              <div className="flex space-x-4">
                <span className="text-sm text-gray-500">Certificado CVM</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">CFP® Certified</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <div className="space-y-2">
                <a href="#filosofia" className="block text-gray-400 hover:text-white transition-colors">
                  Nossa Filosofia
                </a>
                <a href="#pilares" className="block text-gray-400 hover:text-white transition-colors">
                  Pilares
                </a>
                <a href="#equipe" className="block text-gray-400 hover:text-white transition-colors">
                  Equipe
                </a>
                <button 
                  onClick={() => window.location.href = '/api/login'}
                  className="block text-gray-400 hover:text-white transition-colors text-left"
                >
                  Acessar Sistema
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <div className="space-y-2">
                <a 
                  href="mailto:contato@ciklus.com.br" 
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  contato@ciklus.com.br
                </a>
                <button 
                  onClick={() => window.open('https://bit.ly/Pedro-Disponibilidade', '_blank')}
                  className="block text-gray-400 hover:text-white transition-colors text-left"
                >
                  Agendar Reunião
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 CIKLUS. Todos os direitos reservados. 
              Sistema de planejamento financeiro familiar.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
