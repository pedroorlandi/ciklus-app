import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { Download, Database, Table, BarChart3, Users, FileText } from 'lucide-react';

interface DatabaseStats {
  totalPlanejamentos: number;
  totalMembros: number;
  totalDadosMensais: number;
  totalObjetivos: number;
  totalImoveis: number;
  totalReceitas: number;
  totalDespesas: number;
  totalInvestimentos: number;
}

interface TableInfo {
  tableName: string;
  recordCount: number;
  lastUpdated: string;
  size: string;
}

export default function DatabaseAdmin() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDatabaseStats();
    loadTablesInfo();
  }, []);

  const loadDatabaseStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/database-stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTablesInfo = async () => {
    try {
      const response = await fetch('/api/admin/tables-info');
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Erro ao carregar informações das tabelas:', error);
    }
  };

  const loadTableData = async (tableName: string) => {
    try {
      setLoading(true);
      setSelectedTable(tableName);
      const response = await fetch(`/api/admin/table-data/${tableName}`);
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error('Erro ao carregar dados da tabela:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportTableData = async (tableName: string) => {
    try {
      const response = await fetch(`/api/admin/export/${tableName}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tableName}_export.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
    }
  };

  const exportFullDatabase = async () => {
    try {
      const response = await fetch('/api/admin/export/full-database');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ciklus_database_backup_${new Date().toISOString().split('T')[0]}.sql`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar banco completo:', error);
    }
  };

  if (loading && !stats) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
              <p>Carregando dados do banco...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Administração do Banco de Dados</h1>
            <p className="text-muted-foreground">Controle total e visualização dos dados CIKLUS</p>
          </div>
          <Button onClick={exportFullDatabase} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar Banco Completo
          </Button>
        </div>

        {/* Estatísticas Gerais */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalPlanejamentos}</p>
                    <p className="text-sm text-muted-foreground">Planejamentos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalMembros}</p>
                    <p className="text-sm text-muted-foreground">Membros</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalDadosMensais}</p>
                    <p className="text-sm text-muted-foreground">Dados Mensais</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalObjetivos}</p>
                    <p className="text-sm text-muted-foreground">Objetivos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="tables" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tables">Tabelas</TabsTrigger>
            <TabsTrigger value="data">Visualizar Dados</TabsTrigger>
            <TabsTrigger value="exports">Exportações</TabsTrigger>
          </TabsList>

          <TabsContent value="tables" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  Informações das Tabelas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {tables.map((table) => (
                    <div key={table.tableName} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{table.tableName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {table.recordCount} registros • Tamanho: {table.size}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Última atualização: {table.lastUpdated}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => loadTableData(table.tableName)}
                        >
                          Visualizar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => exportTableData(table.tableName)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedTable ? `Dados da Tabela: ${selectedTable}` : 'Selecione uma tabela para visualizar'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tableData.length > 0 ? (
                  <ScrollArea className="h-96 w-full">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            {Object.keys(tableData[0]).map((key) => (
                              <th key={key} className="text-left p-2 font-semibold">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.slice(0, 50).map((row, index) => (
                            <tr key={index} className="border-b">
                              {Object.values(row).map((value: any, cellIndex) => (
                                <td key={cellIndex} className="p-2">
                                  {typeof value === 'object' && value !== null 
                                    ? JSON.stringify(value) 
                                    : String(value || '')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {tableData.length > 50 && (
                        <div className="p-4 text-center text-muted-foreground">
                          Mostrando primeiros 50 registros de {tableData.length} total
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                ) : selectedTable ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {loading ? 'Carregando dados...' : 'Nenhum dado encontrado'}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Selecione uma tabela na aba "Tabelas" para visualizar os dados
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Exportações Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Backup Completo do Banco</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Exporta todos os dados em formato SQL para backup ou migração
                    </p>
                    <Button onClick={exportFullDatabase}>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar SQL Completo
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Dados por Tabela</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Exporta dados específicos de cada tabela em formato CSV
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {tables.map((table) => (
                        <Button 
                          key={table.tableName}
                          variant="outline" 
                          size="sm"
                          onClick={() => exportTableData(table.tableName)}
                        >
                          {table.tableName}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}