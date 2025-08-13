import React from "react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onSectionClick: (sectionId: string) => void;
  onArticlesClick: () => void;
  onSchedulingClick: () => void;
  onSystemClick: () => void;
}

const MobileMenu = ({ 
  isOpen, 
  onSectionClick, 
  onArticlesClick, 
  onSchedulingClick,
  onSystemClick 
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
      <div className="container-custom py-4">
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => onSectionClick('about')}
            className="text-left text-gray-700 hover:text-business-600 transition-colors font-medium py-2"
          >
            Sobre
          </button>
          <button
            onClick={() => onSectionClick('services')}
            className="text-left text-gray-700 hover:text-business-600 transition-colors font-medium py-2"
          >
            Serviços
          </button>
          <button
            onClick={() => onSectionClick('team')}
            className="text-left text-gray-700 hover:text-business-600 transition-colors font-medium py-2"
          >
            Equipe
          </button>
          <button
            onClick={() => onSectionClick('contact')}
            className="text-left text-gray-700 hover:text-business-600 transition-colors font-medium py-2"
          >
            Contato
          </button>
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={onSystemClick}
            >
              Entrar no Sistema
            </Button>
            <Button
              size="sm"
              className="w-full"
              onClick={onSchedulingClick}
            >
              Agendar Reunião
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;