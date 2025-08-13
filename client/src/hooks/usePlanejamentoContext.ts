import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PlanejamentoContextType {
  selectedPlanejamento: number | null;
  setSelectedPlanejamento: (id: number | null) => void;
  planejamentoNome: string;
  setPlanejamentoNome: (nome: string) => void;
}

const PlanejamentoContext = createContext<PlanejamentoContextType | undefined>(undefined);

export function PlanejamentoProvider({ children }: { children: ReactNode }) {
  const [selectedPlanejamento, setSelectedPlanejamento] = useState<number | null>(() => {
    // Carrega do localStorage se existir
    const saved = localStorage.getItem('selectedPlanejamento');
    return saved ? parseInt(saved, 10) : null;
  });

  const [planejamentoNome, setPlanejamentoNome] = useState<string>(() => {
    // Carrega do localStorage se existir
    return localStorage.getItem('planejamentoNome') || '';
  });

  // Salva no localStorage quando muda
  useEffect(() => {
    if (selectedPlanejamento !== null) {
      localStorage.setItem('selectedPlanejamento', selectedPlanejamento.toString());
    } else {
      localStorage.removeItem('selectedPlanejamento');
    }
  }, [selectedPlanejamento]);

  useEffect(() => {
    if (planejamentoNome) {
      localStorage.setItem('planejamentoNome', planejamentoNome);
    } else {
      localStorage.removeItem('planejamentoNome');
    }
  }, [planejamentoNome]);

  return React.createElement(
    PlanejamentoContext.Provider,
    { 
      value: { 
        selectedPlanejamento, 
        setSelectedPlanejamento, 
        planejamentoNome, 
        setPlanejamentoNome 
      }
    },
    children
  );
}

export function usePlanejamentoContext() {
  const context = useContext(PlanejamentoContext);
  if (context === undefined) {
    throw new Error('usePlanejamentoContext must be used within a PlanejamentoProvider');
  }
  return context;
}