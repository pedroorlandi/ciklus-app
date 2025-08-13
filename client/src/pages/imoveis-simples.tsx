import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Plus, Home, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { MemoriaCalculoModal } from "@/components/imoveis/memoria-calculo-modal";

interface Imovel {
  id: number;
  nome: string;
  moeda: string;
  valorPatrimonial: string;
  valorAquisicao: string;
  taxaValorizacao?: string;
  dataVenda?: string;
  financiamento: string;
  tipoAmortizacao?: "SAC" | "PRICE";
  entrada?: string;
  juros?: string;
  dataInicio?: string;
  prazoAnos?: number;
  seguroEduardo?: string;
  seguroMonica?: string;
  planejamentoId: number;
}

interface NovoImovel {
  nome: string;
  moeda: string;
  valorPatrimonial: string;
  valorAquisicao: string;
  taxaValorizacao: string;
  dataVenda: string;
  financiamento: string;
  tipoAmortizacao: string;
  entrada: string;
  juros: string;
  dataInicio: string;
  prazoAnos: string;
  seguroEduardo: string;
  seguroMonica: string;
}

export default function ImoveisSimples() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<number | null>(null);
  const [criando, setCriando] = useState(false);
  const [memoriaCalculo, setMemoriaCalculo] = useState<Imovel | null>(null);
  const { toast } = useToast();

  const [novoImovel, setNovoImovel] = useState<NovoImovel>({
    nome: "",
    moeda: "BRL",
    valorPatrimonial: "",
    valorAquisicao: "",
    taxaValorizacao: "",
    dataVenda: "",
    financiamento: "NAO",
    tipoAmortizacao: "SAC",
    entrada: "",
    juros: "",
    dataInicio: "",
    prazoAnos: "",
    seguroEduardo: "",
    seguroMonica: ""
  });

  const carregarImoveis = async () => {
    try {
      const response = await fetch('/api/planejamentos/2/imoveis', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (response.ok) {
        const data = await response.json();
        setImoveis(data);
      }
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarImoveis();
  }, []);

  const criarImovel = async () => {
    try {
      const dados = {
        ...novoImovel,
        planejamentoId: 2,
        prazoAnos: novoImovel.prazoAnos ? parseInt(novoImovel.prazoAnos) : null,
        dataVenda: novoImovel.dataVenda || null,
        entrada: novoImovel.entrada || null,
        juros: novoImovel.juros || null,
        dataInicio: novoImovel.dataInicio || null
      };

      const response = await fetch('/api/imoveis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (response.ok) {
        toast({ title: "Sucesso", description: "Imóvel criado com sucesso!" });
        setCriando(false);
        setNovoImovel({
          nome: "",
          moeda: "BRL",
          valorPatrimonial: "",
          valorAquisicao: "",
          taxaValorizacao: "",
          dataVenda: "",
          financiamento: "NAO",
          tipoAmortizacao: "SAC",
          entrada: "",
          juros: "",
          dataInicio: "",
          prazoAnos: "",
          seguroEduardo: "",
          seguroMonica: ""
        });
        await carregarImoveis();
      } else {
        const error = await response.json();
        toast({ title: "Erro", description: error.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao criar imóvel", variant: "destructive" });
    }
  };

  const atualizarImovel = async (id: number, dados: Partial<Imovel>) => {
    try {
      const response = await fetch(`/api/imoveis/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (response.ok) {
        toast({ title: "Sucesso", description: "Imóvel atualizado!" });
        setEditando(null);
        await carregarImoveis();
      } else {
        const error = await response.json();
        toast({ title: "Erro", description: error.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao atualizar imóvel", variant: "destructive" });
    }
  };

  const excluirImovel = async (id: number) => {
    if (!confirm('Excluir imóvel permanentemente?')) return;
    
    try {
      const response = await fetch(`/api/imoveis/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({ title: "Sucesso", description: "Imóvel excluído!" });
        await carregarImoveis();
      } else {
        const error = await response.json();
        toast({ title: "Erro", description: error.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao excluir imóvel", variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="p-6">Carregando imóveis...</div>;
  }

  return (
    <MainLayout>
      <div className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Imóveis</h1>
          <Button onClick={() => setCriando(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Imóvel
          </Button>
        </div>

        {/* Formulário de criação */}
        {criando && (
          <Card>
              <CardHeader>
                <CardTitle>Novo Imóvel</CardTitle>
              </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={novoImovel.nome}
                  onChange={(e) => setNovoImovel(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome do imóvel"
                />
              </div>
              <div>
                <Label>Moeda</Label>
                <Select value={novoImovel.moeda} onValueChange={(value) => setNovoImovel(prev => ({ ...prev, moeda: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">BRL</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Valor Patrimonial</Label>
                <Input
                  type="number"
                  value={novoImovel.valorPatrimonial}
                  onChange={(e) => setNovoImovel(prev => ({ ...prev, valorPatrimonial: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Valor Aquisição</Label>
                <Input
                  type="number"
                  value={novoImovel.valorAquisicao}
                  onChange={(e) => setNovoImovel(prev => ({ ...prev, valorAquisicao: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label>Taxa de Valorização (% ao ano)</Label>
              <Input
                type="number"
                step="0.1"
                value={novoImovel.taxaValorizacao}
                onChange={(e) => setNovoImovel(prev => ({ ...prev, taxaValorizacao: e.target.value }))}
                placeholder="Ex: 5.5"
              />
            </div>

            {/* Campos de Seguro */}
            <div className="space-y-4 p-4 border rounded-lg bg-yellow-50">
              <h4 className="font-medium text-gray-800">💛 Seguro por Provedor (% do valor em caso de ausência)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">🧑‍💼 Seguro Eduardo (%)</Label>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={novoImovel.seguroEduardo}
                    onChange={(e) => setNovoImovel(prev => ({ ...prev, seguroEduardo: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label className="text-sm">👩‍💼 Seguro Mônica (%)</Label>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={novoImovel.seguroMonica}
                    onChange={(e) => setNovoImovel(prev => ({ ...prev, seguroMonica: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-600">
                Define que % do valor do imóvel será compensado por seguro caso o provedor fique ausente
              </p>
            </div>

            <div>
              <Label>Data de Venda (opcional)</Label>
              <Input
                type="text"
                placeholder="MM/AAAA"
                value={novoImovel.dataVenda}
                onChange={(e) => {
                  let inputValue = e.target.value.replace(/\D/g, ''); // Remove caracteres não-numéricos
                  
                  // Aplicar formatação automática MM/AAAA
                  if (inputValue.length >= 3) {
                    inputValue = `${inputValue.slice(0, 2)}/${inputValue.slice(2, 6)}`;
                  }
                  
                  // Limitar a 7 caracteres (MM/AAAA)
                  if (inputValue.length > 7) {
                    inputValue = inputValue.slice(0, 7);
                  }
                  
                  setNovoImovel(prev => ({ ...prev, dataVenda: inputValue }));
                }}
                onKeyDown={(e) => {
                  // Permitir navegação e backspace/delete
                  if (['Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Backspace', 'Delete', 'Escape'].includes(e.key)) {
                    return;
                  }
                  
                  // Só permitir números
                  if (!/\d/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onFocus={(e) => {
                  // Auto-selecionar conteúdo existente para facilitar sobrescrita
                  setTimeout(() => e.target.select(), 0);
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Financiamento</Label>
                <Select value={novoImovel.financiamento} onValueChange={(value) => setNovoImovel(prev => ({ ...prev, financiamento: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SIM">SIM</SelectItem>
                    <SelectItem value="NAO">NÃO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Campos de financiamento condicionais */}
            {novoImovel.financiamento === "SIM" && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium">Detalhes do Financiamento</h4>
                
                <div>
                  <Label>Tipo de Amortização</Label>
                  <Select value={novoImovel.tipoAmortizacao} onValueChange={(value) => setNovoImovel(prev => ({ ...prev, tipoAmortizacao: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAC">SAC</SelectItem>
                      <SelectItem value="PRICE">PRICE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Entrada</Label>
                    <Input
                      type="number"
                      value={novoImovel.entrada}
                      onChange={(e) => setNovoImovel(prev => ({ ...prev, entrada: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Juros (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={novoImovel.juros}
                      onChange={(e) => setNovoImovel(prev => ({ ...prev, juros: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Data Início</Label>
                    <Input
                      type="text"
                      placeholder="MM/AAAA"
                      value={novoImovel.dataInicio}
                      onChange={(e) => {
                        let inputValue = e.target.value.replace(/\D/g, ''); // Remove caracteres não-numéricos
                        
                        // Aplicar formatação automática MM/AAAA
                        if (inputValue.length >= 3) {
                          inputValue = `${inputValue.slice(0, 2)}/${inputValue.slice(2, 6)}`;
                        }
                        
                        // Limitar a 7 caracteres (MM/AAAA)
                        if (inputValue.length > 7) {
                          inputValue = inputValue.slice(0, 7);
                        }
                        
                        setNovoImovel(prev => ({ ...prev, dataInicio: inputValue }));
                      }}
                      onKeyDown={(e) => {
                        // Permitir navegação e backspace/delete
                        if (['Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Backspace', 'Delete', 'Escape'].includes(e.key)) {
                          return;
                        }
                        
                        // Só permitir números
                        if (!/\d/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onFocus={(e) => {
                        // Auto-selecionar conteúdo existente para facilitar sobrescrita
                        setTimeout(() => e.target.select(), 0);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Prazo (anos)</Label>
                    <Input
                      type="number"
                      value={novoImovel.prazoAnos}
                      onChange={(e) => setNovoImovel(prev => ({ ...prev, prazoAnos: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={criarImovel}>Salvar</Button>
              <Button variant="outline" onClick={() => setCriando(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de imóveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {imoveis.map((imovel) => (
          <Card key={imovel.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  {imovel.nome}
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setMemoriaCalculo(imovel)}
                    title="Memória de Cálculo"
                  >
                    <Calculator className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditando(editando === imovel.id ? null : imovel.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => excluirImovel(imovel.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editando === imovel.id ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Nome</Label>
                    <Input
                      value={imovel.nome}
                      onChange={(e) => setImoveis(prev => prev.map(i => i.id === imovel.id ? {...i, nome: e.target.value} : i))}
                      className="text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Moeda</Label>
                      <Select value={imovel.moeda} onValueChange={(value) => setImoveis(prev => prev.map(i => i.id === imovel.id ? {...i, moeda: value} : i))}>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BRL">BRL</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Financiamento</Label>
                      <Select value={imovel.financiamento} onValueChange={(value) => setImoveis(prev => prev.map(i => i.id === imovel.id ? {...i, financiamento: value} : i))}>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SIM">SIM</SelectItem>
                          <SelectItem value="NAO">NÃO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Valor Patrimonial</Label>
                    <Input
                      type="number"
                      value={imovel.valorPatrimonial}
                      onChange={(e) => setImoveis(prev => prev.map(i => i.id === imovel.id ? {...i, valorPatrimonial: e.target.value} : i))}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Valor Aquisição</Label>
                    <Input
                      type="number"
                      value={imovel.valorAquisicao}
                      onChange={(e) => setImoveis(prev => prev.map(i => i.id === imovel.id ? {...i, valorAquisicao: e.target.value} : i))}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Taxa de Valorização (% ao ano)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={imovel.taxaValorizacao || ''}
                      onChange={(e) => setImoveis(prev => prev.map(i => i.id === imovel.id ? {...i, taxaValorizacao: e.target.value} : i))}
                      className="text-sm"
                      placeholder="Ex: 5.5"
                    />
                  </div>
                  
                  {/* Campos de Seguro */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">🧑‍💼 Seguro Eduardo (%)</Label>
                      <Input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={imovel.seguroEduardo || ''}
                        onChange={(e) => setImoveis(prev => prev.map(i => i.id === imovel.id ? {...i, seguroEduardo: e.target.value} : i))}
                        className="text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">👩‍💼 Seguro Mônica (%)</Label>
                      <Input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={imovel.seguroMonica || ''}
                        onChange={(e) => setImoveis(prev => prev.map(i => i.id === imovel.id ? {...i, seguroMonica: e.target.value} : i))}
                        className="text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Data de Venda (opcional)</Label>
                    <Input
                      type="text"
                      placeholder="MM/AAAA"
                      value={imovel.dataVenda || ''}
                      onChange={(e) => {
                        let inputValue = e.target.value.replace(/\D/g, ''); // Remove caracteres não-numéricos
                        
                        // Aplicar formatação automática MM/AAAA
                        if (inputValue.length >= 3) {
                          inputValue = `${inputValue.slice(0, 2)}/${inputValue.slice(2, 6)}`;
                        }
                        
                        // Limitar a 7 caracteres (MM/AAAA)
                        if (inputValue.length > 7) {
                          inputValue = inputValue.slice(0, 7);
                        }
                        
                        setImoveis(prev => prev.map(i => i.id === imovel.id ? {...i, dataVenda: inputValue} : i));
                      }}
                      onKeyDown={(e) => {
                        // Permitir navegação e backspace/delete
                        if (['Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Backspace', 'Delete', 'Escape'].includes(e.key)) {
                          return;
                        }
                        
                        // Só permitir números
                        if (!/\d/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onFocus={(e) => {
                        // Auto-selecionar conteúdo existente para facilitar sobrescrita
                        setTimeout(() => e.target.select(), 0);
                      }}
                      className="text-sm"
                    />
                  </div>
                  
                  {/* Campos de financiamento condicionais */}
                  {imovel.financiamento === "SIM" && (
                    <div className="space-y-2 p-2 border rounded bg-gray-50">
                      <h5 className="text-xs font-medium">Financiamento</h5>
                      <div>
                        <Label className="text-xs">Tipo Amortização</Label>
                        <Select value={imovel.tipoAmortizacao || 'SAC'} onValueChange={(value) => setImoveis(prev => prev.map(i => i.id === imovel.id ? {...i, tipoAmortizacao: value} : i))}>
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SAC">SAC</SelectItem>
                            <SelectItem value="PRICE">PRICE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Entrada</Label>
                          <Input
                            type="number"
                            value={imovel.entrada || ''}
                            onChange={(e) => setImoveis(prev => prev.map(i => i.id === imovel.id ? {...i, entrada: e.target.value} : i))}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Juros (%)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={imovel.juros || ''}
                            onChange={(e) => setImoveis(prev => prev.map(i => i.id === imovel.id ? {...i, juros: e.target.value} : i))}
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Data Início</Label>
                          <Input
                            type="text"
                            placeholder="MM/AAAA"
                            value={imovel.dataInicio || ''}
                            onChange={(e) => {
                              let inputValue = e.target.value.replace(/\D/g, ''); // Remove caracteres não-numéricos
                              
                              // Aplicar formatação automática MM/AAAA
                              if (inputValue.length >= 3) {
                                inputValue = `${inputValue.slice(0, 2)}/${inputValue.slice(2, 6)}`;
                              }
                              
                              // Limitar a 7 caracteres (MM/AAAA)
                              if (inputValue.length > 7) {
                                inputValue = inputValue.slice(0, 7);
                              }
                              
                              setImoveis(prev => prev.map(i => i.id === imovel.id ? {...i, dataInicio: inputValue} : i));
                            }}
                            onKeyDown={(e) => {
                              // Permitir navegação e backspace/delete
                              if (['Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Backspace', 'Delete', 'Escape'].includes(e.key)) {
                                return;
                              }
                              
                              // Só permitir números
                              if (!/\d/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            onFocus={(e) => {
                              // Auto-selecionar conteúdo existente para facilitar sobrescrita
                              setTimeout(() => e.target.select(), 0);
                            }}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Prazo (anos)</Label>
                          <Input
                            type="number"
                            value={imovel.prazoAnos || ''}
                            onChange={(e) => setImoveis(prev => prev.map(i => i.id === imovel.id ? {...i, prazoAnos: parseInt(e.target.value) || undefined} : i))}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => atualizarImovel(imovel.id, imovel)}>Salvar</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditando(null)}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Moeda:</span>
                    <span className="font-medium">{imovel.moeda}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Valor Patrimonial:</span>
                    <span className="font-medium">{imovel.moeda === 'BRL' ? 'R$' : '$'} {parseFloat(imovel.valorPatrimonial).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Valor Aquisição:</span>
                    <span className="font-medium">{imovel.moeda === 'BRL' ? 'R$' : '$'} {parseFloat(imovel.valorAquisicao).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Taxa de Valorização:</span>
                    <span className="font-medium">{imovel.taxaValorizacao || '0'}% ao ano</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Financiamento:</span>
                    <span className="font-medium">{imovel.financiamento}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">🧑‍💼 Seguro Eduardo:</span>
                    <span className="font-medium">{imovel.seguroEduardo || '0'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">👩‍💼 Seguro Mônica:</span>
                    <span className="font-medium">{imovel.seguroMonica || '0'}%</span>
                  </div>
                  {imovel.dataVenda && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Data Venda:</span>
                      <span className="font-medium">{new Date(imovel.dataVenda + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {imoveis.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum imóvel cadastrado
        </div>
      )}

      {/* Modal de Memória de Cálculo */}
      <MemoriaCalculoModal 
        imovel={memoriaCalculo}
        isOpen={!!memoriaCalculo}
        onClose={() => setMemoriaCalculo(null)}
      />
      </div>
    </MainLayout>
  );
}