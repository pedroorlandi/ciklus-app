import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { usePlanejamentoContext } from "@/hooks/usePlanejamentoContext";
import { Building2 } from "lucide-react";

interface Planejamento {
  id: number;
  nome: string;
  descricao?: string;
}

interface PlanejamentoSelectorProps {
  compact?: boolean;
}

export default function PlanejamentoSelector({ compact = false }: PlanejamentoSelectorProps) {
  const { selectedPlanejamento, setSelectedPlanejamento, setPlanejamentoNome } = usePlanejamentoContext();

  const { data: planejamentos = [] } = useQuery<Planejamento[]>({
    queryKey: ["/api/planejamentos"],
  });

  const handlePlanejamentoChange = (value: string) => {
    const id = parseInt(value);
    const planejamento = planejamentos.find((p) => p.id === id);
    setSelectedPlanejamento(id);
    setPlanejamentoNome(planejamento?.nome || '');
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Building2 className="h-4 w-4 text-gray-500" />
        <Select 
          value={selectedPlanejamento?.toString() || ""} 
          onValueChange={handlePlanejamentoChange}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecionar planejamento..." />
          </SelectTrigger>
          <SelectContent>
            {planejamentos.map((planejamento) => (
              <SelectItem key={planejamento.id} value={planejamento.id.toString()}>
                {planejamento.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <Label htmlFor="planejamento-select" className="text-sm font-medium text-gray-700">
              Planejamento Ativo
            </Label>
            <Select 
              value={selectedPlanejamento?.toString() || ""} 
              onValueChange={handlePlanejamentoChange}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione um planejamento para trabalhar..." />
              </SelectTrigger>
              <SelectContent>
                {planejamentos.map((planejamento) => (
                  <SelectItem key={planejamento.id} value={planejamento.id.toString()}>
                    {planejamento.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}