import React from "react";

interface NavigationProps {
  onSectionClick: (sectionId: string) => void;
  onArticlesClick: () => void;
}

const Navigation = ({ onSectionClick, onArticlesClick }: NavigationProps) => {
  return (
    <nav className="hidden lg:flex items-center space-x-6">
      <button
        onClick={() => onSectionClick('about')}
        className="text-gray-700 hover:text-business-600 transition-colors font-medium"
      >
        Sobre
      </button>
      <button
        onClick={() => onSectionClick('services')}
        className="text-gray-700 hover:text-business-600 transition-colors font-medium"
      >
        Serviços
      </button>
      <button
        onClick={() => onSectionClick('team')}
        className="text-gray-700 hover:text-business-600 transition-colors font-medium"
      >
        Equipe
      </button>
      <button
        onClick={() => onSectionClick('contact')}
        className="text-gray-700 hover:text-business-600 transition-colors font-medium"
      >
        Contato
      </button>
    </nav>
  );
};

export default Navigation;