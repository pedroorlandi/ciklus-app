import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Percent } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

interface IndiceEconomico {
  id: number;
  nome: string;
  valor: string;
  data: string;
  tipo: string;
  unidade: string;
  manual: boolean;
  atualizacaoAutomatica: boolean;
}

export default function Configuracoes() {
  const [taxaJurosReal, setTaxaJurosReal] = useState<IndiceEconomico | null>(null);
  const [novoValor, setNovoValor] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    carregarTaxaJurosReal();
  }, []);

  const carregarTaxaJurosReal = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/indices");
      const indices: IndiceEconomico[] = await response.json();
      
      const taxa = indices.find(indice => indice.nome === "Taxa de Juros Real");
      if (taxa) {
        setTaxaJurosReal(taxa);
        setNovoValor((parseFloat(taxa.valor) * 100).toFixed(2)); // Converter para porcentagem
      } else {
        // Criar índice se não existir
        await criarTaxaJurosReal();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const criarTaxaJurosReal = async () => {
    try {
      const response = await fetch("/api/indices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: "Taxa de Juros Real",
          valor: "0.096", // 9.6% padrão
          data: new Date().toISOString().split('T')[0],
          tipo: "taxa",
          unidade: "%",
          manual: true,
          atualizacaoAutomatica: false,
        }),
      });

      if (response.ok) {
        await carregarTaxaJurosReal();
      }
    } catch (error) {
      console.error("Erro ao criar Taxa de Juros Real:", error);
    }
  };

  const salvarTaxaJurosReal = async () => {
    if (!taxaJurosReal) return;

    try {
      setSaving(true);
      const valorDecimal = parseFloat(novoValor) / 100; // Converter de porcentagem para decimal

      const response = await fetch(`/api/indices/${taxaJurosReal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          valor: valorDecimal.toString(),
          data: new Date().toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Taxa de Juros Real atualizada com sucesso",
        });
        await carregarTaxaJurosReal();
      } else {
        throw new Error("Erro ao salvar");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar Taxa de Juros Real",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Configure os parâmetros do sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Taxa de Juros Real
            </CardTitle>
            <CardDescription>
              Taxa utilizada para cálculo de rendimentos em Dados Mensais. 
              Esta taxa é usada quando não há índices específicos configurados.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="taxa">Taxa (%)</Label>
              <Input
                id="taxa"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={novoValor}
                onChange={(e) => setNovoValor(e.target.value)}
                placeholder="9.60"
              />
            </div>
            
            {taxaJurosReal && (
              <div className="text-sm text-muted-foreground">
                Valor atual: {(parseFloat(taxaJurosReal.valor) * 100).toFixed(2)}% 
                (atualizado em {new Date(taxaJurosReal.data).toLocaleDateString('pt-BR')})
              </div>
            )}

            <Button 
              onClick={salvarTaxaJurosReal} 
              disabled={saving || !novoValor}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Taxa
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}