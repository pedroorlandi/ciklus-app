import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface Imovel {
  id: number;
  nome: string;
  valorPatrimonial: string;
  entrada?: string;
  juros?: string;
  prazoAnos?: number;
  tipoAmortizacao?: 'SAC' | 'PRICE';
  dataInicio?: string;
  dataVenda?: string;
  taxaValorizacao?: string;
  moeda: string;
}

interface MemoriaCalculoModalProps {
  imovel: Imovel | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatCurrency(value: number, moeda: 'BRL' | 'USD' = 'BRL'): string {
  const symbol = moeda === 'USD' ? '$' : 'R$';
  return `${symbol} ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(4)}%`;
}

export function MemoriaCalculoModal({ imovel, isOpen, onClose }: MemoriaCalculoModalProps) {
  if (!imovel) return null;

  // Dados básicos
  const valorPatrimonial = parseFloat(imovel.valorPatrimonial || '0');
  const entrada = parseFloat(imovel.entrada || '0');
  const valorFinanciado = valorPatrimonial - entrada;
  const taxaJurosAnual = parseFloat(imovel.juros || '0') / 100;
  const taxaJurosMensal = Math.pow(1 + taxaJurosAnual, 1/12) - 1;
  const prazoMeses = parseFloat(String(imovel.prazoAnos || 0)) * 12;
  const taxaValorizacao = parseFloat(imovel.taxaValorizacao || '0') / 100;

  // Cálculo da parcela
  let valorParcela = 0;
  if (imovel.tipoAmortizacao === 'PRICE') {
    valorParcela = valorFinanciado * (taxaJurosMensal * Math.pow(1 + taxaJurosMensal, prazoMeses)) / 
                   (Math.pow(1 + taxaJurosMensal, prazoMeses) - 1);
  } else {
    // SAC - primeira parcela (maior)
    const amortizacao = valorFinanciado / prazoMeses;
    const jurosPrimeiraParcela = valorFinanciado * taxaJurosMensal;
    valorParcela = amortizacao + jurosPrimeiraParcela;
  }

  // Cálculo do valor de venda
  const anoInicio = new Date(imovel.dataInicio || '2025-01-01').getFullYear();
  const anoVenda = imovel.dataVenda ? new Date(imovel.dataVenda).getFullYear() : anoInicio + parseFloat(String(imovel.prazoAnos || 0));
  const anosValorizacao = anoVenda - anoInicio;
  const valorVendaBruto = valorPatrimonial * Math.pow(1 + taxaValorizacao, anosValorizacao);

  // Saldo devedor na venda (simplificado)
  const mesesDecorridos = anosValorizacao * 12;
  let saldoDevedor = 0;
  
  if (imovel.tipoAmortizacao === 'PRICE') {
    saldoDevedor = valorFinanciado * Math.pow(1 + taxaJurosMensal, mesesDecorridos) - 
                   valorParcela * ((Math.pow(1 + taxaJurosMensal, mesesDecorridos) - 1) / taxaJurosMensal);
  } else {
    // SAC
    const amortizacaoMensal = valorFinanciado / prazoMeses;
    saldoDevedor = valorFinanciado - (amortizacaoMensal * mesesDecorridos);
  }
  
  const valorVendaLiquido = valorVendaBruto - Math.max(0, saldoDevedor);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Memória de Cálculo - {imovel.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dados Básicos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4" />
                Dados Básicos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Valor Patrimonial:</span>
                <span className="font-mono">{formatCurrency(valorPatrimonial, imovel.moeda)}</span>
              </div>
              <div className="flex justify-between">
                <span>Entrada:</span>
                <span className="font-mono">{formatCurrency(entrada, imovel.moeda)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Valor Financiado:</span>
                <span className="font-mono font-semibold">{formatCurrency(valorFinanciado, imovel.moeda)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa Juros (ano):</span>
                <span className="font-mono">{formatPercent(taxaJurosAnual * 100)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa Juros (mês):</span>
                <span className="font-mono">{formatPercent(taxaJurosMensal * 100)}</span>
              </div>
              <div className="flex justify-between">
                <span>Prazo:</span>
                <span className="font-mono">{prazoMeses} meses</span>
              </div>
              <div className="flex justify-between">
                <span>Amortização:</span>
                <span className="font-mono">{imovel.tipoAmortizacao}</span>
              </div>
            </CardContent>
          </Card>

          {/* Cálculo da Parcela */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Calculator className="h-4 w-4" />
                Cálculo da Parcela ({imovel.tipoAmortizacao})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {imovel.tipoAmortizacao === 'PRICE' ? (
                <>
                  <div className="text-xs text-gray-600">
                    Fórmula PRICE: PMT = PV × [(1+i)^n × i] / [(1+i)^n - 1]
                  </div>
                  <div className="flex justify-between">
                    <span>PV (Valor Presente):</span>
                    <span className="font-mono">{formatCurrency(valorFinanciado, imovel.moeda)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>i (Taxa mensal):</span>
                    <span className="font-mono">{formatPercent(taxaJurosMensal * 100)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>n (Períodos):</span>
                    <span className="font-mono">{prazoMeses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>(1+i)^n:</span>
                    <span className="font-mono">{Math.pow(1 + taxaJurosMensal, prazoMeses).toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Parcela Fixa:</span>
                    <span className="font-mono font-semibold">{formatCurrency(valorParcela, imovel.moeda)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xs text-gray-600">
                    Sistema SAC: Amortização constante + Juros decrescentes
                  </div>
                  <div className="flex justify-between">
                    <span>Amortização mensal:</span>
                    <span className="font-mono">{formatCurrency(valorFinanciado / prazoMeses, imovel.moeda)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Juros 1ª parcela:</span>
                    <span className="font-mono">{formatCurrency(valorFinanciado * taxaJurosMensal, imovel.moeda)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">1ª Parcela (maior):</span>
                    <span className="font-mono font-semibold">{formatCurrency(valorParcela, imovel.moeda)}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Valorização */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                Valorização do Imóvel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Valor Inicial:</span>
                <span className="font-mono">{formatCurrency(valorPatrimonial, imovel.moeda)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa Valorização:</span>
                <span className="font-mono">{formatPercent(taxaValorizacao * 100)}</span>
              </div>
              <div className="flex justify-between">
                <span>Anos de Valorização:</span>
                <span className="font-mono">{anosValorizacao} anos</span>
              </div>
              <div className="flex justify-between">
                <span>Fator (1+taxa)^anos:</span>
                <span className="font-mono">{Math.pow(1 + taxaValorizacao, anosValorizacao).toFixed(6)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Valor na Venda:</span>
                <span className="font-mono font-semibold">{formatCurrency(valorVendaBruto, imovel.moeda)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Venda Líquida */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                Valor Líquido da Venda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Ano Início:</span>
                <span className="font-mono">{anoInicio}</span>
              </div>
              <div className="flex justify-between">
                <span>Ano Venda:</span>
                <span className="font-mono">{anoVenda}</span>
              </div>
              <div className="flex justify-between">
                <span>Meses Decorridos:</span>
                <span className="font-mono">{mesesDecorridos}</span>
              </div>
              <div className="flex justify-between">
                <span>Valor Bruto Venda:</span>
                <span className="font-mono">{formatCurrency(valorVendaBruto, imovel.moeda)}</span>
              </div>
              <div className="flex justify-between">
                <span>(-) Saldo Devedor:</span>
                <span className="font-mono">-{formatCurrency(Math.max(0, saldoDevedor), imovel.moeda)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Valor Líquido:</span>
                <span className="font-mono font-semibold text-green-600">{formatCurrency(valorVendaLiquido, imovel.moeda)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}