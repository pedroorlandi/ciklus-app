import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, TrendingUp, DollarSign, Calendar, MapPin, Key } from "lucide-react";

interface ImovelData {
  id: number;
  nome: string;
  endereco?: string;
  area?: number;
  valorPatrimonial: string;
  valorAquisicao: string;
  taxaValorizacao: string;
  status: string;
  rendaAluguel?: string;
  financiamento: string;
  prestacaoMensal?: string;
  saldoDevedor?: string;
  dataAquisicao?: string;
  moeda: string;
}

interface DashboardImoveisProps {
  imoveis: ImovelData[];
}

export default function DashboardImoveis({ imoveis }: DashboardImoveisProps) {
  // console.log('DashboardImoveis recebeu:', imoveis?.length, 'imóveis:', imoveis);
  
  const formatCurrency = (value: string | number, moeda: string = 'BRL') => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    return new Intl.NumberFormat(moeda === 'USD' ? 'en-US' : 'pt-BR', {
      style: 'currency',
      currency: moeda,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  // Cálculos do dashboard
  const totalImoveis = imoveis.length;
  const totalValorPatrimonial = imoveis.reduce((sum, i) => sum + (parseFloat(i.valorPatrimonial) || 0), 0);
  const totalValorAquisicao = imoveis.reduce((sum, i) => sum + (parseFloat(i.valorAquisicao) || 0), 0);
  const totalRendaAluguel = imoveis.reduce((sum, i) => sum + (parseFloat(i.rendaAluguel || "0") || 0), 0);
  const totalSaldoDevedor = imoveis.reduce((sum, i) => sum + (parseFloat(i.saldoDevedor || "0") || 0), 0);
  const totalPrestacoes = imoveis.reduce((sum, i) => sum + (parseFloat(i.prestacaoMensal || "0") || 0), 0);
  
  const valorizacaoTotal = totalValorPatrimonial - totalValorAquisicao;
  const percentualValorizacao = totalValorAquisicao > 0 ? (valorizacaoTotal / totalValorAquisicao) * 100 : 0;

  const imoveisAtivos = imoveis.filter(i => i.status === 'ativo').length;
  const imoveisAlugados = imoveis.filter(i => i.status === 'alugado').length;
  const imoveisComFinanciamento = imoveis.filter(i => i.financiamento === 'SIM').length;

  const getMoedaColor = (moeda: string) => {
    switch (moeda) {
      case 'BRL': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'USD': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'EUR': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'alugado': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'vendido': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Imóveis</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImoveis}</div>
            <p className="text-xs text-muted-foreground">
              {imoveisAtivos} ativos • {imoveisAlugados} alugados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Patrimonial</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValorPatrimonial)}</div>
            <p className="text-xs text-muted-foreground">
              Valorização: {formatCurrency(valorizacaoTotal)} ({percentualValorizacao.toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renda de Aluguel</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRendaAluguel)}</div>
            <p className="text-xs text-muted-foreground">
              /mês de {imoveisAlugados} imóveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financiamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSaldoDevedor)}</div>
            <p className="text-xs text-muted-foreground">
              {imoveisComFinanciamento} imóveis • {formatCurrency(totalPrestacoes)}/mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de imóveis em cards compactos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {imoveis.map((imovel) => (
          <Card key={imovel.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Home className="h-5 w-5 text-purple-600" />
                    <span className="font-bold">{imovel.nome}</span>
                  </CardTitle>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className={getMoedaColor(imovel.moeda)}>
                      {imovel.moeda}
                    </Badge>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(imovel.valorPatrimonial, imovel.moeda)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <Badge className={getStatusColor(imovel.status)}>
                    {imovel.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Valor Aquisição</p>
                  <p className="font-semibold">{formatCurrency(imovel.valorAquisicao, imovel.moeda)}</p>
                </div>
                
                {imovel.area && (
                  <div>
                    <p className="text-muted-foreground">Área</p>
                    <p className="font-semibold">{imovel.area} m²</p>
                  </div>
                )}
                
                <div className="bg-yellow-100 p-2 rounded border-2 border-yellow-400">
                  <p className="text-muted-foreground font-bold">🎯 Taxa Valorização</p>
                  <p className="font-semibold text-lg text-green-600">{imovel.taxaValorizacao || '0'}% a.a.</p>
                </div>

                {imovel.rendaAluguel && parseFloat(imovel.rendaAluguel) > 0 && (
                  <div>
                    <p className="text-muted-foreground">Aluguel</p>
                    <p className="font-semibold text-green-600">{formatCurrency(imovel.rendaAluguel, imovel.moeda)}/mês</p>
                  </div>
                )}

                {imovel.financiamento === 'SIM' && imovel.saldoDevedor && parseFloat(imovel.saldoDevedor) > 0 && (
                  <div>
                    <p className="text-muted-foreground">Saldo Devedor</p>
                    <p className="font-semibold text-red-600">{formatCurrency(imovel.saldoDevedor, imovel.moeda)}</p>
                  </div>
                )}

                {imovel.prestacaoMensal && parseFloat(imovel.prestacaoMensal) > 0 && (
                  <div>
                    <p className="text-muted-foreground">Prestação</p>
                    <p className="font-semibold">{formatCurrency(imovel.prestacaoMensal, imovel.moeda)}/mês</p>
                  </div>
                )}
              </div>
              
              {/* Indicador de rentabilidade */}
              {imovel.status === 'alugado' && imovel.rendaAluguel && parseFloat(imovel.rendaAluguel) > 0 && imovel.valorPatrimonial && parseFloat(imovel.valorPatrimonial) > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rentabilidade mensal:</span>
                    <span className="font-semibold text-green-600">
                      {((parseFloat(imovel.rendaAluguel) / parseFloat(imovel.valorPatrimonial)) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}