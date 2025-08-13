import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MESES_ANO } from '@shared/constants';
import { Calendar } from 'lucide-react';

interface MonthSelectorModalProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function MonthSelectorModal({ value, onChange, disabled = false }: MonthSelectorModalProps) {
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Inicializar com os valores existentes
  useEffect(() => {
    if (value && value.trim()) {
      const months = value.split(',').map(m => m.trim()).filter(m => m);
      setSelectedMonths(months);
    } else {
      setSelectedMonths([]);
    }
  }, [value]);

  const handleMonthToggle = (monthValue: string, checked: boolean) => {
    let newSelectedMonths: string[];
    
    if (checked) {
      newSelectedMonths = [...selectedMonths, monthValue].sort((a, b) => parseInt(a) - parseInt(b));
    } else {
      newSelectedMonths = selectedMonths.filter(m => m !== monthValue);
    }
    
    setSelectedMonths(newSelectedMonths);
  };

  const handleConfirm = () => {
    onChange(selectedMonths.join(','));
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedMonths.length === 0) return "Selecionar meses";
    if (selectedMonths.length <= 3) {
      return selectedMonths
        .map(m => MESES_ANO.find(mes => mes.value === m)?.label.substring(0, 3))
        .join(', ');
    }
    return `${selectedMonths.length} meses selecionados`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={disabled}
          className={`w-full justify-start text-left font-normal ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {disabled ? "Selecione 'personalizada' na frequência" : getDisplayText()}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Selecionar Meses para Frequência Personalizada</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-3 py-4">
          {MESES_ANO.map((mes) => (
            <div key={mes.value} className="flex items-center space-x-2">
              <Checkbox
                id={`modal-month-${mes.value}`}
                checked={selectedMonths.includes(mes.value)}
                onCheckedChange={(checked) => handleMonthToggle(mes.value, checked as boolean)}
              />
              <Label 
                htmlFor={`modal-month-${mes.value}`}
                className="text-sm cursor-pointer"
              >
                {mes.label}
              </Label>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedMonths([]);
            }}
          >
            Limpar
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>
              Confirmar
            </Button>
          </div>
        </div>
        {selectedMonths.length > 0 && (
          <div className="text-xs text-gray-600 border-t pt-2">
            Selecionados: {selectedMonths.map(m => MESES_ANO.find(mes => mes.value === m)?.label).join(', ')}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}