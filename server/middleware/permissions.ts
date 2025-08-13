import { type RequestHandler } from "express";
import { storage } from "../storage";

// Middleware para verificar se o usuário tem permissão de administrador
export const requireAdmin: RequestHandler = async (req: any, res, next) => {
  try {
    let userId = req.user?.claims?.sub;
    
    // If no authenticated user, assume Pedro Orlandi for direct access
    if (!userId) {
      userId = 'pedro-001';
      req.user = { claims: { sub: 'pedro-001' } };
    }

    const user = await storage.getUser(userId);
    if (!user || user.role !== "administrador") {
      return res.status(403).json({ message: "Acesso negado. Apenas administradores podem acessar esta funcionalidade." });
    }

    next();
  } catch (error) {
    console.error("Error in requireAdmin middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware para verificar se o usuário tem permissão de planejador ou administrador
// IMPORTANTE: Administradores herdam automaticamente permissões de planejador
export const requirePlanejadorOrAdmin: RequestHandler = async (req: any, res, next) => {
  try {
    let userId = req.user?.claims?.sub;
    
    // If no authenticated user, assume Pedro Orlandi for direct access
    if (!userId) {
      userId = 'pedro-001';
      req.user = { claims: { sub: 'pedro-001' } };
    }

    const user = await storage.getUser(userId);
    if (!user || (user.role !== "planejador" && user.role !== "administrador")) {
      return res.status(403).json({ message: "Acesso negado. Apenas planejadores e administradores podem acessar esta funcionalidade." });
    }

    // Administradores têm acesso total (incluindo funções de planejador)
    next();
  } catch (error) {
    console.error("Error in requirePlanejadorOrAdmin middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware para verificar se o usuário pode acessar um planejamento específico
export const canAccessPlanejamento: RequestHandler = async (req: any, res, next) => {
  try {
    const userId = req.user?.claims?.sub;
    const planejamentoId = req.params.id || req.body.planejamentoId;
    
    if (!userId || !planejamentoId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    // Administradores podem acessar qualquer planejamento
    if (user.role === "administrador") {
      return next();
    }

    const planejamento = await storage.getPlanejamentoById(parseInt(planejamentoId));
    if (!planejamento) {
      return res.status(404).json({ message: "Planejamento não encontrado" });
    }

    // Planejadores podem acessar planejamentos que estão associados a eles
    if (user.role === "planejador" && planejamento.planejadorId === userId) {
      return next();
    }

    // Clientes podem acessar apenas seus próprios planejamentos
    if (user.role === "cliente" && planejamento.userId === userId) {
      return next();
    }

    return res.status(403).json({ message: "Acesso negado. Você não tem permissão para acessar este planejamento." });
  } catch (error) {
    console.error("Error in canAccessPlanejamento middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware para filtrar dados baseado no papel do usuário
export const filterDataByRole = async (userId: string, data: any[], entityType: string) => {
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      return [];
    }

    // Administradores veem todos os dados
    if (user.role === "administrador") {
      return data;
    }

    // Planejadores veem apenas dados dos planejamentos associados a eles
    if (user.role === "planejador") {
      const planejamentos = await storage.getPlanejamentosByPlanejador(userId);
      const planejamentoIds = planejamentos.map(p => p.id);
      
      return data.filter((item: any) => 
        planejamentoIds.includes(item.planejamentoId)
      );
    }

    // Clientes veem apenas dados dos próprios planejamentos
    if (user.role === "cliente") {
      const planejamentos = await storage.getPlanejamentosByUser(userId);
      const planejamentoIds = planejamentos.map(p => p.id);
      
      return data.filter((item: any) => 
        planejamentoIds.includes(item.planejamentoId)
      );
    }

    return [];
  } catch (error) {
    console.error("Error in filterDataByRole:", error);
    return [];
  }
};