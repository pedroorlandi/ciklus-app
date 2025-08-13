import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MESES_ANO } from '@shared/constants';

interface MonthSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function MonthSelector({ value, onChange, className = "" }: MonthSelectorProps) {
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

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
    onChange(newSelectedMonths.join(','));
  };

  return (
    <div className={`grid grid-cols-3 gap-2 p-3 border rounded-md bg-gray-50 ${className}`}>
      <div className="col-span-3 text-sm font-medium text-gray-700 mb-2">
        Selecione os meses:
      </div>
      {MESES_ANO.map((mes) => (
        <div key={mes.value} className="flex items-center space-x-2">
          <Checkbox
            id={`month-${mes.value}`}
            checked={selectedMonths.includes(mes.value)}
            onCheckedChange={(checked) => handleMonthToggle(mes.value, checked as boolean)}
          />
          <Label 
            htmlFor={`month-${mes.value}`}
            className="text-xs cursor-pointer"
          >
            {mes.label.substring(0, 3)}
          </Label>
        </div>
      ))}
      {selectedMonths.length > 0 && (
        <div className="col-span-3 text-xs text-gray-600 mt-2">
          Selecionados: {selectedMonths.map(m => MESES_ANO.find(mes => mes.value === m)?.label).join(', ')}
        </div>
      )}
    </div>
  );
}