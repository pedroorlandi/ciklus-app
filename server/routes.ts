import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { requireAdmin, requirePlanejadorOrAdmin, canAccessPlanejamento } from "./middleware/permissions";
import {
  insertPlanejamentoSchema,
  insertMembroFamilySchema,
  insertImovelSchema,
  insertPortfolioInvestimentoSchema,
  insertReceitaSchema,
  insertDespesaSchema,
  insertObjetivoSchema,
  insertInssSchema,
  insertSeguroSchema,
  insertIndiceEconomicoSchema,
  insertSimulacaoProvedorSchema,
} from "../shared/schema.js";
import { generateMoodInsights } from "./moodAnalyzer";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Render.com monitoring
  app.get('/api/health', (req, res) => {
    res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Sistema de atualização automática de índices a cada hora
  const iniciarAtualizacaoAutomatica = () => {
    console.log('[SISTEMA] Iniciando atualização automática de índices econômicos');
    
    // Verificar imediatamente na inicialização
    storage.verificarIndicesDesatualizados().then(desatualizado => {
      if (desatualizado) {
        console.log('[INICIALIZAÇÃO] Atualizando índices na inicialização');
        storage.atualizarIndicesAutomaticos();
      }
    }).catch(err => console.error('[INICIALIZAÇÃO] Erro:', err));
    
    // Configurar verificação a cada hora (3600000ms)
    setInterval(async () => {
      try {
        const desatualizado = await storage.verificarIndicesDesatualizados();
        if (desatualizado) {
          console.log('[AGENDADOR] Atualizando índices automaticamente');
          await storage.atualizarIndicesAutomaticos();
        }
      } catch (error) {
        console.error('[AGENDADOR] Erro na atualização automática:', error);
      }
    }, 3600000); // 1 hora
  };
  
  // Iniciar sistema automático
  iniciarAtualizacaoAutomatica();

  // Remove the problematic catch-all - let vite handle it

  // Simplified auth setup - apenas rotas API
  app.get('/api/login', (req, res) => {
    // For demo purposes, redirect to dashboard
    res.redirect('/dashboard');
  });

  // Auth routes with demo fallback
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Try authenticated route first
      if (req.user) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        res.json(user);
      } else {
        // Return Pedro Orlandi's real user for direct access
        const pedroUser = await storage.getUser('pedro-001');
        if (pedroUser) {
          res.json(pedroUser);
        } else {
          res.json({
            id: 'pedro-001',
            email: 'pedro.orlandi@ciklus.com.br',
            firstName: 'Pedro',
            lastName: 'Orlandi',
            role: 'administrador'
          });
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard - Allow direct access for demo
  const authMiddleware = async (req: any, res: any, next: any) => {
    // Mock user for direct access - Use Pedro Orlandi's real ID
    if (!req.user) {
      req.user = { claims: { sub: 'pedro-001' } };
    }
    next();
  };

  // Middleware para verificar e atualizar índices automaticamente
  const autoUpdateIndicesMiddleware = async (req: any, res: any, next: any) => {
    try {
      // Verificar se índices estão desatualizados (uma vez por dia)
      const indicesDesatualizados = await storage.verificarIndicesDesatualizados();
      if (indicesDesatualizados) {
        console.log('[AUTO-UPDATE] Atualizando índices automaticamente...');
        await storage.atualizarIndicesAutomaticos();
      }
    } catch (error) {
      console.error('[AUTO-UPDATE] Erro na atualização automática:', error);
      // Não bloquear a requisição em caso de erro
    }
    next();
  };

  app.get('/api/dashboard', authMiddleware, autoUpdateIndicesMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Get real dashboard data
      const dashboardData = await storage.getDashboardData(userId, 'administrador');
      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Planejamentos routes
  app.get('/api/planejamentos', authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Return all planejamentos for demo
      const planejamentos = await storage.getAllPlanejamentos();
      res.json(planejamentos);
    } catch (error) {
      console.error("Error fetching planejamentos:", error);
      res.status(500).json({ message: "Failed to fetch planejamentos" });
    }
  });

  app.get('/api/planejamentos/:id', authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const id = parseInt(req.params.id);
      const planejamento = await storage.getPlanejamento(id, userId, user?.role || 'cliente');
      
      if (!planejamento) {
        return res.status(404).json({ message: "Planejamento not found" });
      }
      
      res.json(planejamento);
    } catch (error) {
      console.error("Error fetching planejamento:", error);
      res.status(500).json({ message: "Failed to fetch planejamento" });
    }
  });

  app.post('/api/planejamentos', authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let data = insertPlanejamentoSchema.parse(req.body);
      
      // Keep dataInicio as string for Drizzle ORM (date fields expect YYYY-MM-DD format)
      // No conversion needed - Drizzle handles the date string properly
      
      const planejamento = await storage.createPlanejamento({
        ...data,
        userId,
      });
      
      res.status(201).json(planejamento);
    } catch (error) {
      console.error("Error creating planejamento:", error);
      res.status(500).json({ message: "Failed to create planejamento" });
    }
  });

  app.put('/api/planejamentos/:id', authMiddleware, async (req: any, res) => {
    try {
      console.log("=== PUT PLANEJAMENTO BACKEND START ===");
      console.log("URL params:", req.params);
      console.log("Request body:", req.body);
      
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const id = parseInt(req.params.id);
      
      console.log("User ID:", userId);
      console.log("User role:", user?.role);
      console.log("Planejamento ID:", id);
      
      let data = insertPlanejamentoSchema.partial().parse(req.body);
      
      // Keep dataInicio as string for Drizzle ORM (date fields expect YYYY-MM-DD format)
      // No conversion needed - Drizzle handles the date string properly
      if (data.dataInicio) {
        console.log("Data de início:", data.dataInicio);
      }
      
      console.log("Parsed data:", data);
      
      const planejamento = await storage.updatePlanejamento(id, data, userId, user?.role || 'cliente');
      console.log("Updated planejamento result:", planejamento);
      
      if (!planejamento) {
        console.log("❌ Planejamento not found or not authorized");
        return res.status(404).json({ message: "Planejamento not found" });
      }
      
      console.log("✅ Planejamento updated successfully");
      res.json(planejamento);
    } catch (error) {
      console.error("❌ Error updating planejamento:", error);
      res.status(500).json({ message: "Failed to update planejamento" });
    }
  });

  app.delete('/api/planejamentos/:id', authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const id = parseInt(req.params.id);
      
      const success = await storage.deletePlanejamento(id, userId, user?.role || 'cliente');
      
      if (!success) {
        return res.status(404).json({ message: "Planejamento not found" });
      }
      
      res.json({ message: "Planejamento deleted successfully" });
    } catch (error) {
      console.error("Error deleting planejamento:", error);
      res.status(500).json({ message: "Failed to delete planejamento" });
    }
  });

  // Membros da Família routes
  app.get('/api/planejamentos/:planejamentoId/membros', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const membros = await storage.getMembrosFamily(planejamentoId);
      res.json(membros);
    } catch (error) {
      console.error("Error fetching membros:", error);
      res.status(500).json({ message: "Failed to fetch membros" });
    }
  });

  app.post('/api/planejamentos/:planejamentoId/membros', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const data = insertMembroFamilySchema.parse({
        ...req.body,
        planejamentoId,
      });
      
      const membro = await storage.createMembroFamily(data);
      res.status(201).json(membro);
    } catch (error) {
      console.error("Error creating membro:", error);
      res.status(500).json({ message: "Failed to create membro" });
    }
  });

  app.put('/api/membros/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertMembroFamilySchema.partial().parse(req.body);
      
      const membro = await storage.updateMembroFamily(id, data);
      
      if (!membro) {
        return res.status(404).json({ message: "Membro not found" });
      }
      
      res.json(membro);
    } catch (error) {
      console.error("Error updating membro:", error);
      res.status(500).json({ message: "Failed to update membro" });
    }
  });

  app.delete('/api/membros/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMembroFamily(id);
      
      if (!success) {
        return res.status(404).json({ message: "Membro not found" });
      }
      
      res.json({ message: "Membro deleted successfully" });
    } catch (error) {
      console.error("Error deleting membro:", error);
      res.status(500).json({ message: "Failed to delete membro" });
    }
  });

  // Imóveis routes
  app.get('/api/planejamentos/:planejamentoId/imoveis', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const imoveis = await storage.getImoveis(planejamentoId);
      res.json(imoveis);
    } catch (error) {
      console.error("Error fetching imoveis:", error);
      res.status(500).json({ message: "Failed to fetch imoveis" });
    }
  });

  app.post('/api/planejamentos/:planejamentoId/imoveis', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      
      const data = insertImovelSchema.parse({
        ...req.body,
        planejamentoId,
      });
      
      const imovel = await storage.createImovel(data);
      res.status(201).json(imovel);
    } catch (error) {
      console.error("Error creating imovel:", error);
      res.status(500).json({ message: "Failed to create imovel" });
    }
  });

  // Endpoint direto para criação de imóveis (usado pelo frontend)
  app.post('/api/imoveis', authMiddleware, async (req: any, res) => {
    try {
      const data = insertImovelSchema.parse(req.body);
      const imovel = await storage.createImovel(data);
      res.status(201).json(imovel);
    } catch (error) {
      console.error("Error creating imovel:", error);
      res.status(500).json({ message: "Failed to create imovel", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.put('/api/imoveis/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Remover campos que não devem ser atualizados
      const bodyData = { ...req.body };
      delete bodyData.id;
      delete bodyData.createdAt;
      delete bodyData.updatedAt;
      delete bodyData.planejamentoId;
      
      const data = insertImovelSchema.partial().parse(bodyData);
      
      const imovel = await storage.updateImovel(id, data);
      
      if (!imovel) {
        return res.status(404).json({ message: "Imovel not found" });
      }
      
      res.json(imovel);
    } catch (error) {
      console.error("Error updating imovel:", error);
      res.status(500).json({ message: "Failed to update imovel" });
    }
  });

  app.delete('/api/imoveis/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteImovel(id);
      
      if (!success) {
        return res.status(404).json({ message: "Imovel not found" });
      }
      
      res.json({ message: "Imovel deleted successfully" });
    } catch (error) {
      console.error("Error deleting imovel:", error);
      res.status(500).json({ message: "Failed to delete imovel" });
    }
  });

  // Portfolio routes
  app.get('/api/planejamentos/:planejamentoId/portfolio', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const portfolio = await storage.getPortfolioInvestimentos(planejamentoId);
      res.json(portfolio);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  app.post('/api/planejamentos/:planejamentoId/portfolio', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const data = insertPortfolioInvestimentoSchema.parse({
        ...req.body,
        planejamentoId,
      });
      
      const investimento = await storage.createPortfolioInvestimento(data);
      res.status(201).json(investimento);
    } catch (error) {
      console.error("Error creating investimento:", error);
      res.status(500).json({ message: "Failed to create investimento" });
    }
  });

  app.put('/api/portfolio/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertPortfolioInvestimentoSchema.partial().parse(req.body);
      
      const investimento = await storage.updatePortfolioInvestimento(id, data);
      
      if (!investimento) {
        return res.status(404).json({ message: "Investimento not found" });
      }
      
      res.json(investimento);
    } catch (error) {
      console.error("Error updating investimento:", error);
      res.status(500).json({ message: "Failed to update investimento" });
    }
  });

  app.delete('/api/portfolio/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePortfolioInvestimento(id);
      
      if (!success) {
        return res.status(404).json({ message: "Investimento not found" });
      }
      
      res.json({ message: "Investimento deleted successfully" });
    } catch (error) {
      console.error("Error deleting investimento:", error);
      res.status(500).json({ message: "Failed to delete investimento" });
    }
  });

  // Receitas routes
  app.get('/api/planejamentos/:planejamentoId/receitas', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const receitas = await storage.getReceitas(planejamentoId);
      res.json(receitas);
    } catch (error) {
      console.error("Error fetching receitas:", error);
      res.status(500).json({ message: "Failed to fetch receitas" });
    }
  });

  app.post('/api/planejamentos/:planejamentoId/receitas', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const data = insertReceitaSchema.parse({
        ...req.body,
        planejamentoId,
      });
      
      const receita = await storage.createReceita(data);
      
      // Regenerar dados mensais automaticamente
      try {
        // await storage.regenerarDadosMensais(planejamentoId);
        console.log(`[SKIP-REGEN] Regeneração automática desabilitada para melhor UX - receita ${receita.id}`);
      } catch (error) {
        console.error("[SKIP-REGEN] Erro ao regenerar dados mensais:", error);
      }
      
      res.status(201).json(receita);
    } catch (error) {
      console.error("Error creating receita:", error);
      res.status(500).json({ message: "Failed to create receita" });
    }
  });

  app.put('/api/receitas/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log("Updating receita ID:", id);
      console.log("Request body:", req.body);
      
      const validationData = {
        ...req.body,
        membro: req.body.membro === null ? null : req.body.membro?.toString()
      };
      let data = insertReceitaSchema.partial().parse(validationData);
      
      // CORREÇÃO: Aplicar calcularDataFim quando prazoAnos estiver presente
      if (data.dataInicio && data.prazoAnos) {
        const { calcularDataFim } = await import('./utils/dateUtils');
        data.dataFim = calcularDataFim(data.dataInicio, data.prazoAnos);
        console.log(`Recalculando data fim: ${data.dataInicio} + ${data.prazoAnos} anos = ${data.dataFim}`);
      }
      
      console.log("Parsed data:", data);
      
      const receita = await storage.updateReceita(id, data);
      console.log("Updated receita:", receita);
      
      if (!receita) {
        return res.status(404).json({ message: "Receita not found" });
      }
      
      // Regenerar dados mensais automaticamente
      try {
        // await storage.regenerarDadosMensais(receita.planejamentoId);
        console.log(`[SKIP-REGEN] Regeneração automática desabilitada para melhor UX - receita ${id}`);
      } catch (error) {
        console.error("[SKIP-REGEN] Erro ao regenerar dados mensais:", error);
      }
      
      res.json(receita);
    } catch (error) {
      console.error("Error updating receita:", error);
      res.status(500).json({ message: "Failed to update receita", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.delete('/api/receitas/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Buscar receita antes de excluir para obter planejamentoId
      const receitaExistente = await storage.getReceita(id);
      if (!receitaExistente) {
        return res.status(404).json({ message: "Receita not found" });
      }
      
      const success = await storage.deleteReceita(id);
      
      if (!success) {
        return res.status(404).json({ message: "Receita not found" });
      }
      
      // Regenerar dados mensais automaticamente
      try {
        // await storage.regenerarDadosMensais(receitaExistente.planejamentoId);
        console.log(`[SKIP-REGEN] Regeneração automática desabilitada para melhor UX - receita ${id} excluída`);
      } catch (error) {
        console.error("[SKIP-REGEN] Erro ao regenerar dados mensais:", error);
      }
      
      res.json({ message: "Receita deleted successfully" });
    } catch (error) {
      console.error("Error deleting receita:", error);
      res.status(500).json({ message: "Failed to delete receita" });
    }
  });

  // Despesas routes
  app.get('/api/planejamentos/:planejamentoId/despesas', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const despesas = await storage.getDespesas(planejamentoId);
      res.json(despesas);
    } catch (error) {
      console.error("Error fetching despesas:", error);
      res.status(500).json({ message: "Failed to fetch despesas" });
    }
  });

  app.post('/api/planejamentos/:planejamentoId/despesas', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const data = insertDespesaSchema.parse({
        ...req.body,
        planejamentoId,
      });
      
      const despesa = await storage.createDespesa(data);
      
      // Regenerar dados mensais automaticamente
      try {
        // await storage.regenerarDadosMensais(planejamentoId);
        console.log(`[SKIP-REGEN] Regeneração automática desabilitada para melhor UX - despesa ${despesa.id}`);
      } catch (error) {
        console.error("[SKIP-REGEN] Erro ao regenerar dados mensais:", error);
      }
      
      res.status(201).json(despesa);
    } catch (error) {
      console.error("Error creating despesa:", error);
      res.status(500).json({ message: "Failed to create despesa" });
    }
  });

  app.put('/api/despesas/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      let data = insertDespesaSchema.partial().parse(req.body);
      
      // CORREÇÃO: Aplicar calcularDataFim quando prazoAnos estiver presente
      if (data.dataInicio && data.prazoAnos) {
        const { calcularDataFim } = await import('./utils/dateUtils');
        data.dataFim = calcularDataFim(data.dataInicio, data.prazoAnos);
        console.log(`Recalculando data fim (despesa): ${data.dataInicio} + ${data.prazoAnos} anos = ${data.dataFim}`);
      }
      
      const despesa = await storage.updateDespesa(id, data);
      
      if (!despesa) {
        return res.status(404).json({ message: "Despesa not found" });
      }
      
      // Regenerar dados mensais automaticamente
      try {
        // await storage.regenerarDadosMensais(despesa.planejamentoId);
        console.log(`[SKIP-REGEN] Regeneração automática desabilitada para melhor UX - despesa ${id}`);
      } catch (error) {
        console.error("[SKIP-REGEN] Erro ao regenerar dados mensais:", error);
      }
      
      res.json(despesa);
    } catch (error) {
      console.error("Error updating despesa:", error);
      res.status(500).json({ message: "Failed to update despesa" });
    }
  });

  app.delete('/api/despesas/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Buscar despesa antes de excluir para obter planejamentoId
      const despesaExistente = await storage.getDespesa(id);
      if (!despesaExistente) {
        return res.status(404).json({ message: "Despesa not found" });
      }
      
      const success = await storage.deleteDespesa(id);
      
      if (!success) {
        return res.status(404).json({ message: "Despesa not found" });
      }
      
      // Regenerar dados mensais automaticamente
      try {
        // await storage.regenerarDadosMensais(despesaExistente.planejamentoId);
        console.log(`[SKIP-REGEN] Regeneração automática desabilitada para melhor UX - despesa ${id} excluída`);
      } catch (error) {
        console.error("[SKIP-REGEN] Erro ao regenerar dados mensais:", error);
      }
      
      res.json({ message: "Despesa deleted successfully" });
    } catch (error) {
      console.error("Error deleting despesa:", error);
      res.status(500).json({ message: "Failed to delete despesa" });
    }
  });

  // Objetivos routes
  app.get('/api/planejamentos/:planejamentoId/objetivos', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const objetivos = await storage.getObjetivos(planejamentoId);
      res.json(objetivos);
    } catch (error) {
      console.error("Error fetching objetivos:", error);
      res.status(500).json({ message: "Failed to fetch objetivos" });
    }
  });

  app.post('/api/planejamentos/:planejamentoId/objetivos', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      // Garantir que dataAlvo está presente e não vazio
      const bodyData = { ...req.body };
      if (!bodyData.dataAlvo || bodyData.dataAlvo.trim() === '') {
        bodyData.dataAlvo = new Date().toISOString().split('T')[0]; // Data atual como fallback
      }
      
      const data = insertObjetivoSchema.parse({
        ...bodyData,
        planejamentoId,
      });
      
      const objetivo = await storage.createObjetivo(data);
      res.status(201).json(objetivo);
    } catch (error) {
      console.error("Error creating objetivo:", error);
      res.status(500).json({ message: "Failed to create objetivo" });
    }
  });

  app.put('/api/objetivos/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertObjetivoSchema.partial().parse(req.body);
      
      const objetivo = await storage.updateObjetivo(id, data);
      
      if (!objetivo) {
        return res.status(404).json({ message: "Objetivo not found" });
      }
      
      res.json(objetivo);
    } catch (error) {
      console.error("Error updating objetivo:", error);
      res.status(500).json({ message: "Failed to update objetivo" });
    }
  });

  app.delete('/api/objetivos/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteObjetivo(id);
      
      if (!success) {
        return res.status(404).json({ message: "Objetivo not found" });
      }
      
      res.json({ message: "Objetivo deleted successfully" });
    } catch (error) {
      console.error("Error deleting objetivo:", error);
      res.status(500).json({ message: "Failed to delete objetivo" });
    }
  });

  // INSS routes
  app.get('/api/planejamentos/:planejamentoId/inss', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const inssData = await storage.getInss(planejamentoId);
      res.json(inssData);
    } catch (error) {
      console.error("Error fetching INSS:", error);
      res.status(500).json({ message: "Failed to fetch INSS data" });
    }
  });

  app.post('/api/planejamentos/:planejamentoId/inss', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const data = insertInssSchema.parse({
        ...req.body,
        planejamentoId,
      });
      
      const inssData = await storage.createInss(data);
      res.status(201).json(inssData);
    } catch (error) {
      console.error("Error creating INSS:", error);
      res.status(500).json({ message: "Failed to create INSS data" });
    }
  });

  app.put('/api/inss/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertInssSchema.partial().parse(req.body);
      
      const inssData = await storage.updateInss(id, data);
      
      if (!inssData) {
        return res.status(404).json({ message: "INSS data not found" });
      }
      
      res.json(inssData);
    } catch (error) {
      console.error("Error updating INSS:", error);
      res.status(500).json({ message: "Failed to update INSS data" });
    }
  });

  app.delete('/api/inss/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteInss(id);
      
      if (!success) {
        return res.status(404).json({ message: "INSS data not found" });
      }
      
      res.json({ message: "INSS data deleted successfully" });
    } catch (error) {
      console.error("Error deleting INSS:", error);
      res.status(500).json({ message: "Failed to delete INSS data" });
    }
  });

  // Seguros routes
  app.get('/api/planejamentos/:planejamentoId/seguros', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const seguros = await storage.getSeguros(planejamentoId);
      res.json(seguros);
    } catch (error) {
      console.error("Error fetching seguros:", error);
      res.status(500).json({ message: "Failed to fetch seguros" });
    }
  });

  app.post('/api/planejamentos/:planejamentoId/seguros', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const bodyData = { ...req.body };
      
      if (!bodyData.dataInicio || bodyData.dataInicio.trim() === '') {
        bodyData.dataInicio = new Date().toISOString().split('T')[0];
      }
      
      const data = insertSeguroSchema.parse({
        ...bodyData,
        planejamentoId,
      });
      
      const seguro = await storage.createSeguro(data);
      res.status(201).json(seguro);
    } catch (error) {
      console.error("Error creating seguro:", error);
      res.status(500).json({ message: "Failed to create seguro" });
    }
  });

  app.put('/api/seguros/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertSeguroSchema.partial().parse(req.body);
      
      const seguro = await storage.updateSeguro(id, data);
      
      if (!seguro) {
        return res.status(404).json({ message: "Seguro not found" });
      }
      
      res.json(seguro);
    } catch (error) {
      console.error("Error updating seguro:", error);
      res.status(500).json({ message: "Failed to update seguro" });    
    }
  });

  app.delete('/api/seguros/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSeguro(id);
      
      if (!success) {
        return res.status(404).json({ message: "Seguro not found" });
      }
      
      res.json({ message: "Seguro deleted successfully" });
    } catch (error) {
      console.error("Error deleting seguro:", error);
      res.status(500).json({ message: "Failed to delete seguro" });
    }
  });

  // Direct seguros routes for frontend convenience
  app.get('/api/seguros/:planejamentoId', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const seguros = await storage.getSeguros(planejamentoId);
      res.json(seguros);
    } catch (error) {
      console.error("Error fetching seguros:", error);
      res.status(500).json({ message: "Failed to fetch seguros" });
    }
  });

  app.post('/api/seguros', authMiddleware, async (req: any, res) => {
    try {
      const bodyData = { ...req.body };
      
      const data = insertSeguroSchema.parse(bodyData);
      
      const seguro = await storage.createSeguro(data);
      res.status(201).json(seguro);
    } catch (error) {
      console.error("Error creating seguro:", error);
      res.status(500).json({ message: "Failed to create seguro" });
    }
  });

  // Índices Econômicos routes
  app.get('/api/indices', authMiddleware, autoUpdateIndicesMiddleware, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      
      if (user?.role !== 'administrador' && user?.role !== 'advisor') {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const indices = await storage.getIndicesEconomicos();
      
      // Disable caching to ensure fresh data
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      
      res.json(indices);
    } catch (error) {
      console.error("Error fetching indices:", error);
      res.status(500).json({ message: "Failed to fetch indices" });
    }
  });

  // Rota para atualizar índices automáticos
  app.post('/api/indices/auto-update', authMiddleware, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      
      if (user?.role !== 'administrador') {
        return res.status(403).json({ message: "Apenas administradores podem atualizar índices automáticos" });
      }
      
      await storage.atualizarIndicesAutomaticos();
      res.json({ message: "Índices automáticos atualizados com sucesso" });
    } catch (error) {
      console.error("Error updating automatic indices:", error);
      res.status(500).json({ message: "Failed to update automatic indices" });
    }
  });

  // Rota para verificar status da atualização automática
  app.get('/api/indices/auto-status', authMiddleware, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      
      if (user?.role !== 'administrador') {
        return res.status(403).json({ message: "Apenas administradores podem verificar status automático" });
      }
      
      const desatualizado = await storage.verificarIndicesDesatualizados();
      const ultimaAtualizacao = await storage.getUltimaAtualizacaoAutomatica();
      
      res.json({ 
        sistemaAtivo: true,
        indicesDesatualizados: desatualizado,
        ultimaAtualizacao,
        proximaVerificacao: "A cada hora"
      });
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      res.status(500).json({ message: "Erro ao verificar status da atualização automática" });
    }
  });

  app.post('/api/indices', authMiddleware, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      
      if (user?.role !== 'administrador' && user?.role !== 'advisor') {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const data = insertIndiceEconomicoSchema.parse(req.body);
      const indice = await storage.createIndiceEconomico(data);
      res.status(201).json(indice);
    } catch (error) {
      console.error("Error creating indice:", error);
      res.status(500).json({ message: "Failed to create indice" });
    }
  });

  app.put('/api/indices/:id', authMiddleware, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      
      if (user?.role !== 'administrador' && user?.role !== 'advisor') {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id);
      const data = insertIndiceEconomicoSchema.partial().parse(req.body);
      console.log(`[API] Atualizando índice ${id} com dados:`, data);
      const indice = await storage.updateIndiceEconomico(id, data);
      console.log(`[API] Índice atualizado:`, indice);
      res.json(indice);
    } catch (error) {
      console.error("Error updating indice:", error);
      res.status(500).json({ message: "Failed to update indice" });
    }
  });

  // Dados Mensais routes (Aba DADOS)
  app.get("/api/dados/:planejamentoId", authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const moeda = req.query.moeda as string || 'BRL';
      const ano = req.query.ano ? parseInt(req.query.ano as string) : undefined;
      const dados = await storage.getDadosMensais(planejamentoId, ano, moeda);
      res.json(dados);
    } catch (error) {
      console.error("Error fetching dados mensais:", error);
      res.status(500).json({ message: "Failed to fetch dados mensais" });
    }
  });

  // Removendo rota de teste - problema resolvido

  app.post("/api/dados/:planejamentoId/regenerar", authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      
      // Se há provedores ausentes no corpo da requisição, processar com simulação
      const { provedoresAusentes, capitalSeguradoAdicional } = req.body;
      console.log(`[API-REGENERAR] Planejamento ${planejamentoId}, provedores ausentes:`, provedoresAusentes);
      console.log(`[API-REGENERAR] Capital segurado adicional:`, capitalSeguradoAdicional);
      
      if (provedoresAusentes && Array.isArray(provedoresAusentes) && provedoresAusentes.length > 0) {
        // Salvar simulações temporariamente no banco para regeneração
        for (const membroId of provedoresAusentes) {
          await storage.upsertSimulacaoProvedor({
            planejamentoId,
            membroId,
            status: 'ausente'
          });
        }
        console.log(`[API-REGENERAR] Simulações configuradas para provedores ausentes: [${provedoresAusentes.join(', ')}]`);
      }
      
      await storage.regenerarDadosMensais(planejamentoId, capitalSeguradoAdicional);
      res.json({ message: "Dados mensais regenerados com sucesso" });
    } catch (error) {
      console.error("Error regenerating dados mensais:", error);
      res.status(500).json({ message: "Failed to regenerate dados mensais" });
    }
  });

  // Mood Insights routes
  app.get('/api/mood-insights/:planejamentoId', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const insights = await storage.getMoodInsights(planejamentoId);
      res.json(insights);
    } catch (error) {
      console.error("Error fetching mood insights:", error);
      res.status(500).json({ message: "Failed to fetch mood insights" });
    }
  });

  app.post('/api/mood-insights/:planejamentoId/generate', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const insights = await generateMoodInsights(planejamentoId);
      res.json(insights);
    } catch (error) {
      console.error("Error generating mood insights:", error);
      res.status(500).json({ message: "Failed to generate mood insights" });
    }
  });

  // ===== SIMULAÇÃO DE PROVEDORES ROUTES =====
  
  app.get('/api/simulacao-provedores/:planejamentoId', authMiddleware, async (req: any, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const simulacoes = await storage.getSimulacaoProvedores(planejamentoId);
      res.json(simulacoes);
    } catch (error) {
      console.error("Error fetching simulacao provedores:", error);
      res.status(500).json({ message: "Failed to fetch simulacao provedores" });
    }
  });

  app.post('/api/simulacao-provedores', authMiddleware, async (req: any, res) => {
    try {
      const validatedData = insertSimulacaoProvedorSchema.parse(req.body);
      const simulacao = await storage.upsertSimulacaoProvedor(validatedData);
      res.json(simulacao);
    } catch (error) {
      console.error("Error creating/updating simulacao provedor:", error);
      res.status(500).json({ message: "Failed to create/update simulacao provedor" });
    }
  });

  app.put('/api/simulacao-provedores/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const simulacao = await storage.updateSimulacaoProvedor(id, updateData);
      if (!simulacao) {
        return res.status(404).json({ message: "Simulacao provedor not found" });
      }
      res.json(simulacao);
    } catch (error) {
      console.error("Error updating simulacao provedor:", error);
      res.status(500).json({ message: "Failed to update simulacao provedor" });
    }
  });

  app.delete('/api/simulacao-provedores/:id', authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSimulacaoProvedor(id);
      if (!success) {
        return res.status(404).json({ message: "Simulacao provedor not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting simulacao provedor:", error);
      res.status(500).json({ message: "Failed to delete simulacao provedor" });
    }
  });

  // Admin routes - User management
  app.get('/api/admin/users', requireAdmin, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/users/by-role/:role', requireAdmin, async (req: any, res) => {
    try {
      const { role } = req.params;
      const users = await storage.getUsersByRole(role);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users by role:", error);
      res.status(500).json({ message: "Failed to fetch users by role" });
    }
  });

  app.patch('/api/admin/users/:id/role', requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      if (!['administrador', 'planejador', 'cliente'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      
      const updatedUser = await storage.updateUserRole(id, role);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  app.patch('/api/admin/users/:id/status', requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['ativo', 'inativo', 'suspenso'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedUser = await storage.updateUserStatus(id, status);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ message: "Failed to update user status" });
    }
  });

  app.patch('/api/admin/planejamentos/:id/planejador', requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { planejadorId } = req.body;
      
      const updatedPlanejamento = await storage.assignPlanejadorToPlanejamento(parseInt(id), planejadorId);
      if (!updatedPlanejamento) {
        return res.status(404).json({ message: "Planejamento not found" });
      }
      
      res.json(updatedPlanejamento);
    } catch (error) {
      console.error("Error assigning planejador:", error);
      res.status(500).json({ message: "Failed to assign planejador" });
    }
  });

  // Planejador routes - Access to assigned planejamentos
  app.get('/api/planejador/planejamentos', requirePlanejadorOrAdmin, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      let planejamentos;
      if (user?.role === 'administrador') {
        planejamentos = await storage.getPlanejamentos(userId, 'administrador');
      } else {
        planejamentos = await storage.getPlanejamentosByPlanejador(userId);
      }
      
      res.json(planejamentos);
    } catch (error) {
      console.error("Error fetching planejador's planejamentos:", error);
      res.status(500).json({ message: "Failed to fetch planejamentos" });
    }
  });

  // ===== AUTHENTICATION ROUTES =====
  
  // Login with email/password
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Simple demo check for admin
      if (email === 'admin@ciklus.com.br' && password === 'admin123') {
        const user = await storage.getUser('admin-001');
        if (user) {
          res.json({ success: true, user, role: 'administrador' });
          return;
        }
      }
      
      // Real authentication would hash/compare passwords
      const users = await storage.getAllUsers();
      const user = users.find(u => u.email === email);
      
      if (user) {
        res.json({ success: true, user, role: user.role });
      } else {
        res.status(401).json({ message: 'Email ou senha incorretos' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });
  
  // Register new user
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      // Check if user already exists
      const existingUsers = await storage.getAllUsers();
      if (existingUsers.find(u => u.email === email)) {
        res.status(400).json({ message: 'Email já está em uso' });
        return;
      }
      
      // Generate user ID
      const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create user (in real app, hash password)
      const newUser = await storage.createUser({
        id: userId,
        email,
        firstName,
        lastName,
        role: 'cliente',
        status: 'ativo'
      });
      
      res.json({ success: true, user: newUser });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Erro ao criar usuário' });
    }
  });
  
  // Forgot password
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      const users = await storage.getAllUsers();
      const user = users.find(u => u.email === email);
      
      if (user) {
        // In real app, send email with reset token
        console.log(`Password reset requested for: ${email}`);
        res.json({ success: true, message: 'Email de recuperação enviado' });
      } else {
        res.status(404).json({ message: 'Email não encontrado' });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Erro ao processar solicitação' });
    }
  });
  
  // Google OAuth placeholder
  app.get('/api/auth/google', (req, res) => {
    // In real app, redirect to Google OAuth
    res.redirect('/login?social=google&demo=true');
  });
  
  // Apple OAuth placeholder  
  app.get('/api/auth/apple', (req, res) => {
    // In real app, redirect to Apple OAuth
    res.redirect('/login?social=apple&demo=true');
  });

  // CSV Download endpoint
  app.get('/api/download/csv/:planejamentoId', async (req, res) => {
    try {
      const planejamentoId = parseInt(req.params.planejamentoId);
      const dados = await storage.getDadosMensais(planejamentoId);
      
      if (!dados || dados.length === 0) {
        return res.status(404).json({ message: "Dados mensais não encontrados" });
      }

      // Criar cabeçalho CSV
      const headers = [
        'Periodo',
        'Ano',
        'Mes',
        'Receitas_Ativas',
        'Receitas_Passivas', 
        'Total_Receitas',
        'Despesas_Operacionais',
        'Despesas_Patrimoniais',
        'Total_Despesas',
        'Financiamento1_Studio',
        'Financiamento2_Moradia', 
        'Financiamento3_Orlando',
        'Venda_Ativos',
        'Desembolso_Objetivos',
        'Portfolio_Inicial',
        'Rendimento_Portfolio',
        'Saving',
        'Portfolio_Final'
      ];

      // Criar conteúdo CSV
      let csvContent = headers.join(',') + '\n';
      
      dados.forEach(dado => {
        const periodo = `${dado.ano}/${String(dado.mes).padStart(2, '0')}`;
        
        const row = [
          periodo,
          dado.ano,
          dado.mes,
          parseFloat(dado.receitasAtivas || 0).toFixed(2),
          parseFloat(dado.receitasPassivas || 0).toFixed(2),
          parseFloat(dado.totalReceitas || 0).toFixed(2),
          parseFloat(dado.despesasOperacionais || 0).toFixed(2),
          parseFloat(dado.despesasPatrimoniais || 0).toFixed(2),
          parseFloat(dado.totalDespesas || 0).toFixed(2),
          parseFloat(dado.financiamento1 || 0).toFixed(2),
          parseFloat(dado.financiamento2 || 0).toFixed(2),
          parseFloat(dado.financiamento3 || 0).toFixed(2),
          parseFloat(dado.vendaAtivos || 0).toFixed(2),
          parseFloat(dado.desembolsoObjetivos || 0).toFixed(2),
          parseFloat(dado.portfolioInicial || 0).toFixed(2),
          parseFloat(dado.rendimentoPortfolio || 0).toFixed(2),
          parseFloat(dado.saving || 0).toFixed(2),
          parseFloat(dado.portfolioFinal || 0).toFixed(2)
        ];
        
        csvContent += row.join(',') + '\n';
      });

      // Configurar headers para download
      const nomeArquivo = `dados_mensais_ciklus_planejamento_${planejamentoId}_${new Date().toISOString().split('T')[0]}.csv`;
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);
      res.setHeader('Cache-Control', 'no-cache');
      
      res.send('\uFEFF' + csvContent); // BOM para UTF-8
      
    } catch (error) {
      console.error("Error generating CSV:", error);
      res.status(500).json({ message: "Failed to generate CSV" });
    }
  });

  // Importar e registrar rotas de administração de banco
  const adminRouter = await import('./routes/admin').then(m => m.default);
  app.use('/api/admin', authMiddleware, adminRouter);

  // Development shortcut - bypass login and go directly to dashboard
  app.get('/dev', (req, res) => {
    res.redirect('/dashboard?demo=auto');
  });

  // ===== SPA ROUTE TEST =====
  // Test route to confirm server is working
  app.get('/test-server', (req, res) => {
    res.json({ 
      message: 'Server is working!', 
      path: req.path,
      host: req.get('host'),
      originalUrl: req.originalUrl,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      buildVersion: '2025-07-21-v3-auth'
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
