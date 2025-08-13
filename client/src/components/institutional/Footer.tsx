import { Mail, Phone, MapPin, Linkedin, Instagram, Twitter } from "lucide-react";
import ciklusLogo from "@assets/color_logo_transparent_1752762036069.png";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginClick = () => {
    window.location.href = '/api/login';
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={ciklusLogo} 
                alt="CIKLUS" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold">CIKLUS APP</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Democratizando o acesso ao planejamento financeiro familiar através de 
              tecnologia avançada e metodologias comprovadas.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-business-600 p-2 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-business-600 p-2 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-business-600 p-2 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Serviços
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('team')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Equipe
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('credentials')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Credenciais
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('articles')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Artigos
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contato
                </button>
              </li>
              <li>
                <button
                  onClick={handleLoginClick}
                  className="text-business-400 hover:text-business-300 transition-colors font-semibold"
                >
                  Acessar Plataforma
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-business-400" />
                <span className="text-gray-300 text-sm">contato@ciklus.com.br</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-business-400" />
                <span className="text-gray-300 text-sm">+55 (11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-business-400" />
                <span className="text-gray-300 text-sm">São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="text-gray-400 text-sm">
              © 2025 CIKLUS APP. Todos os direitos reservados.
            </div>
            
            <div className="flex flex-wrap justify-start md:justify-end space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>

        {/* Security & Trust */}
        <div className="py-6 border-t border-gray-800">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">
              Seus dados são protegidos com criptografia de nível bancário
            </p>
            <div className="flex justify-center items-center space-x-6 opacity-60">
              <div className="bg-gray-800 px-4 py-2 rounded">
                <span className="text-xs text-gray-300">SSL 256-bit</span>
              </div>
              <div className="bg-gray-800 px-4 py-2 rounded">
                <span className="text-xs text-gray-300">LGPD</span>
              </div>
              <div className="bg-gray-800 px-4 py-2 rounded">
                <span className="text-xs text-gray-300">ISO 27001</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}