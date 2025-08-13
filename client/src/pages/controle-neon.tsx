import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { Database, Shield, Download, ExternalLink, Copy, CheckCircle } from 'lucide-react';

export default function ControleNeon() {
  const [copied, setCopied] = useState<string | null>(null);

  const projectInfo = {
    projectId: 'ep-sparkling-leaf-af0jhs8y',
    host: 'ep-sparkling-leaf-af0jhs8y.c-2.us-west-2.aws.neon.tech',
    database: 'neondb',
    username: 'neondb_owner'
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const strategies = [
    {
      title: "Controle Imediato (30 min)",
      status: "recommended",
      description: "Dashboard completo no próprio CIKLUS",
      benefits: ["✅ Visualização total dos dados", "✅ Controle sem dependências", "✅ Export/backup integrado", "✅ Interface personalizada"],
      action: "Implementado - Disponível em /database-admin"
    },
    {
      title: "Investigação de Propriedade (1 dia)",
      status: "pending",
      description: "Verificar acesso ao console Neon",
      benefits: ["🔍 Tentar acessar console.neon.tech", "📧 Contatar suporte se necessário", "⚡ Transferência de propriedade", "🎯 Controle total do console"],
      action: "A ser executado pelo usuário"
    },
    {
      title: "Migração Controlada (1 semana)",
      status: "alternative",
      description: "Criar conta Neon própria e migrar",
      benefits: ["🔒 Propriedade 100% garantida", "💰 Controle total de custos", "⚙️ Configurações avançadas", "🛡️ Segurança máxima"],
      action: "Opção de longo prazo"
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Controle Total do Banco Neon</h1>
            <p className="text-muted-foreground">Estratégias para obter propriedade e controle dos seus dados</p>
          </div>
          <Button asChild>
            <a href="/database-admin" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Acessar Dashboard Admin
            </a>
          </Button>
        </div>

        {/* Informações do Banco Atual */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Informações do Seu Banco Neon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Project ID:</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-white px-2 py-1 rounded text-sm">{projectInfo.projectId}</code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(projectInfo.projectId, 'projectId')}
                    >
                      {copied === 'projectId' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Host:</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-white px-2 py-1 rounded text-sm text-xs">{projectInfo.host}</code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(projectInfo.host, 'host')}
                    >
                      {copied === 'host' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Database:</span>
                  <code className="bg-white px-2 py-1 rounded text-sm">{projectInfo.database}</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Username:</span>
                  <code className="bg-white px-2 py-1 rounded text-sm">{projectInfo.username}</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="strategies" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="strategies">Estratégias</TabsTrigger>
            <TabsTrigger value="instructions">Instruções</TabsTrigger>
            <TabsTrigger value="contacts">Contatos</TabsTrigger>
          </TabsList>

          <TabsContent value="strategies" className="space-y-4">
            <div className="grid gap-4">
              {strategies.map((strategy, index) => (
                <Card key={index} className={strategy.status === 'recommended' ? 'border-green-200 bg-green-50' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{strategy.title}</CardTitle>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        strategy.status === 'recommended' ? 'bg-green-100 text-green-800' :
                        strategy.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {strategy.status === 'recommended' ? 'Recomendado' :
                         strategy.status === 'pending' ? 'Pendente' : 'Alternativa'}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{strategy.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {strategy.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="text-sm">{benefit}</div>
                        ))}
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Status:</span>
                          <span className="text-sm">{strategy.action}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="instructions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Passos para Investigar Propriedade</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold">1. Tentar Acesso Direto</h3>
                      <p className="text-sm text-muted-foreground">Acesse console.neon.tech com seus emails</p>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <a href="https://console.neon.tech" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Abrir Console Neon
                        </a>
                      </Button>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h3 className="font-semibold">2. Procurar o Projeto</h3>
                      <p className="text-sm text-muted-foreground">
                        Após login, procure por projeto com ID: <code className="bg-gray-100 px-1 rounded">{projectInfo.projectId}</code>
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-semibold">3. Se Encontrar</h3>
                      <p className="text-sm text-muted-foreground">
                        Parabéns! Você já tem controle total. Pode configurar backups, monitoramento, etc.
                      </p>
                    </div>

                    <div className="border-l-4 border-red-500 pl-4">
                      <h3 className="font-semibold">4. Se Não Encontrar</h3>
                      <p className="text-sm text-muted-foreground">
                        Contate o suporte Neon para transferência de propriedade
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contatos para Suporte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold">Suporte Neon</h3>
                    <p className="text-sm text-muted-foreground">Para transferência de propriedade</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Email:</span>
                        <code className="text-sm">support@neon.tech</code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard('support@neon.tech', 'email')}
                        >
                          {copied === 'email' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Assunto:</span> Project Transfer Request - {projectInfo.projectId}
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold">Mensagem Sugerida</h3>
                    <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                      <p>Hello Neon Support,</p>
                      <br />
                      <p>I have a database project (ID: {projectInfo.projectId}) that was automatically created by Replit integration. I would like to request ownership transfer to my Neon account so I can have full control over the database.</p>
                      <br />
                      <p>Project details:</p>
                      <p>- Project ID: {projectInfo.projectId}</p>
                      <p>- Database: {projectInfo.database}</p>
                      <p>- Host: {projectInfo.host}</p>
                      <br />
                      <p>Please let me know what information you need to proceed with the transfer.</p>
                      <br />
                      <p>Thank you for your assistance.</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => copyToClipboard(`Hello Neon Support,\n\nI have a database project (ID: ${projectInfo.projectId}) that was automatically created by Replit integration. I would like to request ownership transfer to my Neon account so I can have full control over the database.\n\nProject details:\n- Project ID: ${projectInfo.projectId}\n- Database: ${projectInfo.database}\n- Host: ${projectInfo.host}\n\nPlease let me know what information you need to proceed with the transfer.\n\nThank you for your assistance.`, 'message')}
                    >
                      {copied === 'message' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      Copiar Mensagem
                    </Button>
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