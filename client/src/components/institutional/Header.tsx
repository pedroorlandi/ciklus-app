import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ciklusIcon from "@assets/c11eb372-82af-4a16-8a4a-1618dcd39801_1752844410133.png";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const handleLoginClick = () => {
    window.location.href = 'https://app.ciklus.com.br';
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-sm shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            className="flex items-center space-x-2 hover:scale-105 transition-all duration-300 group"
            title="CIKLUS - Início"
          >
            <div className="relative">
              <img 
                src={ciklusIcon} 
                alt="CIKLUS" 
                className="h-12 w-12 md:h-16 md:w-16 group-hover:animate-spin"
                style={{ animationDuration: '3s' }}
              />
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="text-gray-600 hover:text-business-600 transition-colors font-medium"
            >
              Sobre
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('services')}
              className="text-gray-600 hover:text-business-600 transition-colors font-medium"
            >
              Serviços
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('team')}
              className="text-gray-600 hover:text-business-600 transition-colors font-medium"
            >
              Equipe
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('credentials')}
              className="text-gray-600 hover:text-business-600 transition-colors font-medium"
            >
              Credenciais
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('articles')}
              className="text-gray-600 hover:text-business-600 transition-colors font-medium"
            >
              Artigos
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="text-gray-600 hover:text-business-600 transition-colors font-medium"
            >
              Contato
            </button>
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              type="button"
              onClick={() => scrollToSection('contact')}
              variant="outline"
              className="border-business-600 text-business-600 hover:bg-business-50 px-4 py-2 rounded-lg transition-colors"
            >
              Agendar Reunião
            </Button>
            <button
              type="button"
              onClick={handleLoginClick}
              style={{ 
                backgroundColor: '#7c3aed', 
                color: 'white', 
                padding: '8px 24px', 
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Entrar no Sistema
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-business-600 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
            <nav className="py-4 space-y-2">
              <button
                type="button"
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-6 py-3 text-gray-600 hover:text-business-600 hover:bg-gray-50 transition-colors"
              >
                Sobre
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('services')}
                className="block w-full text-left px-6 py-3 text-gray-600 hover:text-business-600 hover:bg-gray-50 transition-colors"
              >
                Serviços
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('team')}
                className="block w-full text-left px-6 py-3 text-gray-600 hover:text-business-600 hover:bg-gray-50 transition-colors"
              >
                Equipe
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('credentials')}
                className="block w-full text-left px-6 py-3 text-gray-600 hover:text-business-600 hover:bg-gray-50 transition-colors"
              >
                Credenciais
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('articles')}
                className="block w-full text-left px-6 py-3 text-gray-600 hover:text-business-600 hover:bg-gray-50 transition-colors"
              >
                Artigos
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-6 py-3 text-gray-600 hover:text-business-600 hover:bg-gray-50 transition-colors"
              >
                Contato
              </button>
              <div className="px-6 py-3 space-y-2">
                <Button
                  type="button"
                  onClick={() => scrollToSection('contact')}
                  variant="outline"
                  className="w-full border-business-600 text-business-600 hover:bg-business-50 py-2 rounded-lg transition-colors"
                >
                  Agendar Reunião
                </Button>
                <button
                  type="button"
                  onClick={handleLoginClick}
                  style={{ 
                    width: '100%',
                    backgroundColor: '#7c3aed', 
                    color: 'white', 
                    padding: '8px', 
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Entrar no Sistema
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}