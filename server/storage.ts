import {
  users,
  planejamentos,
  membrosFamily,
  imoveis,
  portfolioInvestimentos,
  receitas,
  despesas,
  objetivos,
  inss,
  seguros,
  indicesEconomicos,
  dadosMensais,
  moodInsights,
  simulacaoProvedores,
  type User,
  type UpsertUser,
  type Planejamento,
  type InsertPlanejamento,
  type MembroFamily,
  type InsertMembroFamily,
  type Imovel,
  type InsertImovel,
  type PortfolioInvestimento,
  type InsertPortfolioInvestimento,
  type Receita,
  type InsertReceita,
  type Despesa,
  type InsertDespesa,
  type Objetivo,
  type InsertObjetivo,
  type Inss,
  type InsertInss,
  type Seguro,
  type InsertSeguro,
  type IndiceEconomico,
  type InsertIndiceEconomico,
  type DadoMensal,
  type InsertDadoMensal,
  type MoodInsight,
  type InsertMoodInsight,
  type SimulacaoProvedor,
  type InsertSimulacaoProvedor,
} from "../shared/schema.js";
import { db, supabaseClient } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { calcularDataFim, validarFormatoData } from "./utils/dateUtils";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Admin operations for user management
  getAllUsers(): Promise<User[]>;
  updateUserRole(id: string, role: string): Promise<User | undefined>;
  updateUserStatus(id: string, status: string): Promise<User | undefined>;
  getUsersByRole(role: string): Promise<User[]>;
  
  // Planejamento access methods
  getPlanejamentosByUser(userId: string): Promise<Planejamento[]>;
  getPlanejamentosByPlanejador(planejadorId: string): Promise<Planejamento[]>;
  assignPlanejadorToPlanejamento(planejamentoId: number, planejadorId: string): Promise<Planejamento | undefined>;

  // Planejamentos
  getAllPlanejamentos(): Promise<Planejamento[]>;
  getPlanejamentos(userId: string, userRole: string): Promise<Planejamento[]>;
  getPlanejamento(id: number, userId: string, userRole: string): Promise<Planejamento | undefined>;
  createPlanejamento(planejamento: InsertPlanejamento): Promise<Planejamento>;
  updatePlanejamento(id: number, planejamento: Partial<InsertPlanejamento>, userId: string, userRole: string): Promise<Planejamento | undefined>;
  deletePlanejamento(id: number, userId: string, userRole: string): Promise<boolean>;

  // Membros da Família
  getMembrosFamily(planejamentoId: number): Promise<MembroFamily[]>;
  createMembroFamily(membro: InsertMembroFamily): Promise<MembroFamily>;
  updateMembroFamily(id: number, membro: Partial<InsertMembroFamily>): Promise<MembroFamily | undefined>;
  deleteMembroFamily(id: number): Promise<boolean>;

  // Imóveis
  getImoveis(planejamentoId: number): Promise<Imovel[]>;
  createImovel(imovel: InsertImovel): Promise<Imovel>;
  updateImovel(id: number, imovel: Partial<InsertImovel>): Promise<Imovel | undefined>;
  deleteImovel(id: number): Promise<boolean>;

  // Portfolio
  getPortfolioInvestimentos(planejamentoId: number): Promise<PortfolioInvestimento[]>;
  createPortfolioInvestimento(investimento: InsertPortfolioInvestimento): Promise<PortfolioInvestimento>;
  updatePortfolioInvestimento(id: number, investimento: Partial<InsertPortfolioInvestimento>): Promise<PortfolioInvestimento | undefined>;
  deletePortfolioInvestimento(id: number): Promise<boolean>;

  // Receitas
  getReceitas(planejamentoId: number): Promise<Receita[]>;
  createReceita(receita: InsertReceita): Promise<Receita>;
  updateReceita(id: number, receita: Partial<InsertReceita>): Promise<Receita | undefined>;
  deleteReceita(id: number): Promise<boolean>;

  // Despesas
  getDespesas(planejamentoId: number): Promise<Despesa[]>;
  createDespesa(despesa: InsertDespesa): Promise<Despesa>;
  updateDespesa(id: number, despesa: Partial<InsertDespesa>): Promise<Despesa | undefined>;
  deleteDespesa(id: number): Promise<boolean>;

  // Objetivos
  getObjetivos(planejamentoId: number): Promise<Objetivo[]>;
  createObjetivo(objetivo: InsertObjetivo): Promise<Objetivo>;
  updateObjetivo(id: number, objetivo: Partial<InsertObjetivo>): Promise<Objetivo | undefined>;
  deleteObjetivo(id: number): Promise<boolean>;

  // Seguros
  getSeguros(planejamentoId: number): Promise<Seguro[]>;
  createSeguro(seguro: InsertSeguro): Promise<Seguro>;
  updateSeguro(id: number, seguro: Partial<InsertSeguro>): Promise<Seguro | undefined>;
  deleteSeguro(id: number): Promise<boolean>;

  // Índices Econômicos
  getIndicesEconomicos(): Promise<IndiceEconomico[]>;
  getLatestIndices(): Promise<IndiceEconomico[]>;
  createIndiceEconomico(indice: InsertIndiceEconomico): Promise<IndiceEconomico>;
  updateIndiceEconomico(id: number, indice: Partial<InsertIndiceEconomico>): Promise<IndiceEconomico | undefined>;

  // Dashboard Data
  getDashboardData(userId: string, userRole: string): Promise<any>;

  // Dados Mensais (Aba DADOS)
  regenerarDadosMensais(planejamentoId: number): Promise<void>;
  getDadosMensais(planejamentoId: number, ano?: number): Promise<any[]>;

  // Mood Insights
  getMoodInsights(planejamentoId: number): Promise<MoodInsight[]>;
  createMoodInsight(insight: InsertMoodInsight): Promise<MoodInsight>;
  clearMoodInsights(planejamentoId: number): Promise<void>;

  // Simulação de Provedores
  getSimulacaoProvedores(planejamentoId: number): Promise<SimulacaoProvedor[]>;
  createSimulacaoProvedor(simulacao: InsertSimulacaoProvedor): Promise<SimulacaoProvedor>;
  updateSimulacaoProvedor(id: number, simulacao: Partial<InsertSimulacaoProvedor>): Promise<SimulacaoProvedor | undefined>;
  deleteSimulacaoProvedor(id: number): Promise<boolean>;
  upsertSimulacaoProvedor(simulacao: InsertSimulacaoProvedor): Promise<SimulacaoProvedor>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Admin operations for user management
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: any): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        id: insertUser.id,
        email: insertUser.email,
        firstName: insertUser.firstName,
        lastName: insertUser.lastName,
        role: insertUser.role || 'cliente',
        status: insertUser.status || 'ativo',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return user;
  }

  async updateUserRole(id: string, role: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserStatus(id: string, status: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ status, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role));
  }

  // Planejamento access methods
  async getPlanejamentosByUser(userId: string): Promise<Planejamento[]> {
    return await db.select().from(planejamentos).where(eq(planejamentos.userId, userId));
  }

  async getPlanejamentosByPlanejador(planejadorId: string): Promise<Planejamento[]> {
    return await db.select().from(planejamentos).where(eq(planejamentos.planejadorId, planejadorId));
  }

  async assignPlanejadorToPlanejamento(planejamentoId: number, planejadorId: string): Promise<Planejamento | undefined> {
    const [planejamento] = await db
      .update(planejamentos)
      .set({ planejadorId, updatedAt: new Date() })
      .where(eq(planejamentos.id, planejamentoId))
      .returning();
    return planejamento;
  }

  // Planejamentos
  async getAllPlanejamentos(): Promise<Planejamento[]> {
    return await db.select().from(planejamentos).orderBy(desc(planejamentos.createdAt));
  }

  async getPlanejamentos(userId: string, userRole: string): Promise<Planejamento[]> {
    if (userRole === "administrador") {
      return await db.select().from(planejamentos).orderBy(desc(planejamentos.createdAt));
    } else if (userRole === "planejador") {
      return await db.select().from(planejamentos)
        .where(eq(planejamentos.planejadorId, userId))
        .orderBy(desc(planejamentos.createdAt));
    } else {
      return await db.select().from(planejamentos)
        .where(eq(planejamentos.userId, userId))
        .orderBy(desc(planejamentos.createdAt));
    }
  }

  async getPlanejamento(id: number, userId: string, userRole: string): Promise<Planejamento | undefined> {
    if (userRole === "administrador") {
      const [planejamento] = await db.select().from(planejamentos).where(eq(planejamentos.id, id));
      return planejamento;
    } else if (userRole === "planejador") {
      const [planejamento] = await db.select().from(planejamentos)
        .where(and(eq(planejamentos.id, id), eq(planejamentos.planejadorId, userId)));
      return planejamento;
    } else {
      const [planejamento] = await db.select().from(planejamentos)
        .where(and(eq(planejamentos.id, id), eq(planejamentos.userId, userId)));
      return planejamento;
    }
  }

  async createPlanejamento(planejamento: InsertPlanejamento): Promise<Planejamento> {
    const [newPlanejamento] = await db.insert(planejamentos).values(planejamento).returning();
    return newPlanejamento;
  }

  async updatePlanejamento(id: number, planejamento: Partial<InsertPlanejamento>, userId: string, userRole: string): Promise<Planejamento | undefined> {
    let whereClause = eq(planejamentos.id, id);
    
    if (userRole === "cliente") {
      whereClause = and(eq(planejamentos.id, id), eq(planejamentos.userId, userId))!;
    } else if (userRole === "planejador") {
      whereClause = and(eq(planejamentos.id, id), eq(planejamentos.planejadorId, userId))!;
    }

    const [updated] = await db.update(planejamentos)
      .set({ ...planejamento, updatedAt: new Date() })
      .where(whereClause)
      .returning();
    return updated;
  }

  async deletePlanejamento(id: number, userId: string, userRole: string): Promise<boolean> {
    let whereClause = eq(planejamentos.id, id);
    
    if (userRole === "cliente") {
      whereClause = and(eq(planejamentos.id, id), eq(planejamentos.userId, userId))!;
    } else if (userRole === "planejador") {
      whereClause = and(eq(planejamentos.id, id), eq(planejamentos.planejadorId, userId))!;
    }

    const result = await db.delete(planejamentos).where(whereClause);
    return (result.rowCount ?? 0) > 0;
  }

  // Membros da Família
  async getMembrosFamily(planejamentoId: number): Promise<MembroFamily[]> {
    return await db.select().from(membrosFamily)
      .where(eq(membrosFamily.planejamentoId, planejamentoId))
      .orderBy(membrosFamily.nome);
  }

  async createMembroFamily(membro: InsertMembroFamily): Promise<MembroFamily> {
    const [newMembro] = await db.insert(membrosFamily).values(membro).returning();
    return newMembro;
  }

  async updateMembroFamily(id: number, membro: Partial<InsertMembroFamily>): Promise<MembroFamily | undefined> {
    const [updated] = await db.update(membrosFamily)
      .set(membro)
      .where(eq(membrosFamily.id, id))
      .returning();
    return updated;
  }

  async deleteMembroFamily(id: number): Promise<boolean> {
    const result = await db.delete(membrosFamily).where(eq(membrosFamily.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Imóveis
  async getImoveis(planejamentoId: number): Promise<Imovel[]> {
    return await db.select().from(imoveis)
      .where(eq(imoveis.planejamentoId, planejamentoId))
      .orderBy(desc(imoveis.createdAt));
  }

  async createImovel(imovel: InsertImovel): Promise<Imovel> {
    const [newImovel] = await db.insert(imoveis).values(imovel).returning();
    return newImovel;
  }

  async updateImovel(id: number, imovel: Partial<InsertImovel>): Promise<Imovel | undefined> {
    const [updated] = await db.update(imoveis)
      .set(imovel)
      .where(eq(imoveis.id, id))
      .returning();
    return updated;
  }

  async deleteImovel(id: number): Promise<boolean> {
    const result = await db.delete(imoveis).where(eq(imoveis.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Portfolio
  async getPortfolioInvestimentos(planejamentoId: number): Promise<PortfolioInvestimento[]> {
    return await db.select().from(portfolioInvestimentos)
      .where(eq(portfolioInvestimentos.planejamentoId, planejamentoId))
      .orderBy(desc(portfolioInvestimentos.valorAtual));
  }

  async createPortfolioInvestimento(investimento: InsertPortfolioInvestimento): Promise<PortfolioInvestimento> {
    const [newInvestimento] = await db.insert(portfolioInvestimentos).values(investimento).returning();
    return newInvestimento;
  }

  async updatePortfolioInvestimento(id: number, investimento: Partial<InsertPortfolioInvestimento>): Promise<PortfolioInvestimento | undefined> {
    const [updated] = await db.update(portfolioInvestimentos)
      .set({ ...investimento, updatedAt: new Date() })
      .where(eq(portfolioInvestimentos.id, id))
      .returning();
    return updated;
  }

  async deletePortfolioInvestimento(id: number): Promise<boolean> {
    const result = await db.delete(portfolioInvestimentos).where(eq(portfolioInvestimentos.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Receitas
  async getReceitas(planejamentoId: number): Promise<Receita[]> {
    return await db.select().from(receitas)
      .where(eq(receitas.planejamentoId, planejamentoId))
      .orderBy(desc(receitas.valor));
  }

  async createReceita(receita: InsertReceita): Promise<Receita> {
    // Calcular dataFim automaticamente se prazoAnos for informado
    const receitaData = { ...receita };
    if (receita.prazoAnos && receita.dataInicio) {
      receitaData.dataFim = calcularDataFim(receita.dataInicio, receita.prazoAnos);
    }
    
    const [newReceita] = await db.insert(receitas).values(receitaData).returning();
    return newReceita;
  }

  async updateReceita(id: number, receita: Partial<InsertReceita>): Promise<Receita | undefined> {
    // Calcular dataFim automaticamente se prazoAnos for informado
    const receitaData = { ...receita };
    if (receita.prazoAnos && receita.dataInicio) {
      receitaData.dataFim = calcularDataFim(receita.dataInicio, receita.prazoAnos);
    }
    
    const [updated] = await db.update(receitas)
      .set(receitaData)
      .where(eq(receitas.id, id))
      .returning();
    return updated;
  }

  async getReceita(id: number): Promise<Receita | undefined> {
    const [receita] = await db.select().from(receitas).where(eq(receitas.id, id));
    return receita;
  }

  async deleteReceita(id: number): Promise<boolean> {
    const result = await db.delete(receitas).where(eq(receitas.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Despesas
  async getDespesas(planejamentoId: number): Promise<Despesa[]> {
    return await db.select().from(despesas)
      .where(eq(despesas.planejamentoId, planejamentoId))
      .orderBy(desc(despesas.valor));
  }

  async createDespesa(despesa: InsertDespesa): Promise<Despesa> {
    // Calcular dataFim automaticamente se prazoAnos for informado
    const despesaData = { ...despesa };
    if (despesa.prazoAnos && despesa.dataInicio) {
      despesaData.dataFim = calcularDataFim(despesa.dataInicio, despesa.prazoAnos);
    }
    
    const [newDespesa] = await db.insert(despesas).values(despesaData).returning();
    return newDespesa;
  }

  async updateDespesa(id: number, despesa: Partial<InsertDespesa>): Promise<Despesa | undefined> {
    // Calcular dataFim automaticamente se prazoAnos for informado
    const despesaData = { ...despesa };
    if (despesa.prazoAnos && despesa.dataInicio) {
      despesaData.dataFim = calcularDataFim(despesa.dataInicio, despesa.prazoAnos);
    }
    
    const [updated] = await db.update(despesas)
      .set(despesaData)
      .where(eq(despesas.id, id))
      .returning();
    return updated;
  }

  async getDespesa(id: number): Promise<Despesa | undefined> {
    const [despesa] = await db.select().from(despesas).where(eq(despesas.id, id));
    return despesa;
  }

  async deleteDespesa(id: number): Promise<boolean> {
    const result = await db.delete(despesas).where(eq(despesas.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Objetivos
  async getObjetivos(planejamentoId: number): Promise<Objetivo[]> {
    try {
      return await db.select().from(objetivos)
        .where(eq(objetivos.planejamentoId, planejamentoId));
    } catch (error) {
      console.error("Erro na consulta de objetivos:", error);
      return []; // Retorna array vazio em caso de erro
    }
  }

  async createObjetivo(objetivo: InsertObjetivo): Promise<Objetivo> {
    const [newObjetivo] = await db.insert(objetivos).values(objetivo).returning();
    return newObjetivo;
  }

  async updateObjetivo(id: number, objetivo: Partial<InsertObjetivo>): Promise<Objetivo | undefined> {
    const [updated] = await db.update(objetivos)
      .set({ ...objetivo, updatedAt: new Date() })
      .where(eq(objetivos.id, id))
      .returning();
    return updated;
  }

  async deleteObjetivo(id: number): Promise<boolean> {
    const result = await db.delete(objetivos).where(eq(objetivos.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // INSS
  async getInss(planejamentoId: number): Promise<Inss[]> {
    return await db.select().from(inss)
      .where(eq(inss.planejamentoId, planejamentoId))
      .orderBy(inss.idadeConcessao);
  }

  async createInss(inssData: InsertInss): Promise<Inss> {
    const [newInss] = await db.insert(inss).values(inssData).returning();
    return newInss;
  }

  async updateInss(id: number, inssData: Partial<InsertInss>): Promise<Inss | undefined> {
    const [updated] = await db.update(inss)
      .set({ ...inssData, updatedAt: new Date() })
      .where(eq(inss.id, id))
      .returning();
    return updated;
  }

  async deleteInss(id: number): Promise<boolean> {
    const result = await db.delete(inss).where(eq(inss.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Seguros
  async getSeguros(planejamentoId: number): Promise<Seguro[]> {
    return await db.select().from(seguros)
      .where(eq(seguros.planejamentoId, planejamentoId))
      .orderBy(seguros.seguradora);
  }

  async createSeguro(seguro: InsertSeguro): Promise<Seguro> {
    const [newSeguro] = await db.insert(seguros).values(seguro).returning();
    return newSeguro;
  }

  async updateSeguro(id: number, seguro: Partial<InsertSeguro>): Promise<Seguro | undefined> {
    const [updated] = await db.update(seguros)
      .set({ ...seguro, updatedAt: new Date() })
      .where(eq(seguros.id, id))
      .returning();
    return updated;
  }

  async deleteSeguro(id: number): Promise<boolean> {
    const result = await db.delete(seguros).where(eq(seguros.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Índices Econômicos
  async getIndicesEconomicos(): Promise<IndiceEconomico[]> {
    return await db.select().from(indicesEconomicos)
      .orderBy(desc(indicesEconomicos.data), indicesEconomicos.nome);
  }

  async getLatestIndices(): Promise<IndiceEconomico[]> {
    // Get the most recent value for each index
    const indices = await db.select().from(indicesEconomicos)
      .orderBy(desc(indicesEconomicos.data));
    
    const latest: { [key: string]: IndiceEconomico } = {};
    for (const indice of indices) {
      if (!latest[indice.nome]) {
        latest[indice.nome] = indice;
      }
    }
    
    return Object.values(latest);
  }

  async createIndiceEconomico(indice: InsertIndiceEconomico): Promise<IndiceEconomico> {
    const [newIndice] = await db.insert(indicesEconomicos).values(indice).returning();
    return newIndice;
  }



  // Método para buscar Taxa de Juros Real atual
  async getTaxaJurosReal(): Promise<number> {
    try {
      const [taxaJurosReal] = await db
        .select()
        .from(indicesEconomicos)
        .where(eq(indicesEconomicos.nome, 'Taxa de Juros Real'))
        .orderBy(desc(indicesEconomicos.createdAt))
        .limit(1);
      
      if (taxaJurosReal) {
        return parseFloat(taxaJurosReal.valor);
      }
      
      // Fallback para 0.8% mensal (9.6% anual) se não encontrar
      return 9.6;
    } catch (error) {
      console.error('Erro ao buscar Taxa de Juros Real:', error);
      return 9.6; // Fallback padrão
    }
  }

  // Método para buscar um índice econômico específico por nome
  async getIndiceEconomico(nome: string): Promise<IndiceEconomico | null> {
    try {
      const [indice] = await db
        .select()
        .from(indicesEconomicos)
        .where(eq(indicesEconomicos.nome, nome))
        .orderBy(desc(indicesEconomicos.createdAt))
        .limit(1);
      
      return indice || null;
    } catch (error) {
      console.error(`Erro ao buscar índice ${nome}:`, error);
      return null;
    }
  }

  // Função para calcular o último dia útil (D-1)
  private getUltimoDiaUtil(): Date {
    const hoje = new Date();
    let ultimoDiaUtil = new Date(hoje);
    
    // Retroceder um dia
    ultimoDiaUtil.setDate(ultimoDiaUtil.getDate() - 1);
    
    // Se for sábado (6) ou domingo (0), continuar retrocedendo até sexta
    while (ultimoDiaUtil.getDay() === 0 || ultimoDiaUtil.getDay() === 6) {
      ultimoDiaUtil.setDate(ultimoDiaUtil.getDate() - 1);
    }
    
    return ultimoDiaUtil;
  }

  // Função para verificar se índices precisam ser atualizados (dados não estão em D-1)
  async verificarIndicesDesatualizados(): Promise<boolean> {
    try {
      const ultimoDiaUtil = this.getUltimoDiaUtil();
      const dataEsperada = ultimoDiaUtil.toISOString().split('T')[0];
      
      // Buscar índice automático mais recente
      const indiceRecente = await db
        .select()
        .from(indicesEconomicos)
        .where(eq(indicesEconomicos.atualizacaoAutomatica, true))
        .orderBy(desc(indicesEconomicos.data))
        .limit(1);
      
      if (indiceRecente.length === 0) {
        console.log(`[INDICES] Nenhum índice automático encontrado - criando para ${dataEsperada}`);
        return true; 
      }
      
      const dataIndice = indiceRecente[0].data;
      const desatualizado = dataIndice !== dataEsperada;
      
      if (desatualizado) {
        console.log(`[INDICES] Índices precisam atualização - última: ${dataIndice}, esperada: ${dataEsperada}`);
      } else {
        console.log(`[INDICES] Índices estão atualizados para D-1: ${dataEsperada}`);
      }
      
      return desatualizado;
    } catch (error) {
      console.error('[INDICES] Erro ao verificar desatualização:', error);
      return true; // Em caso de erro, forçar atualização
    }
  }

  async getUltimaAtualizacaoAutomatica(): Promise<string | null> {
    try {
      const ultimoIndice = await db.select()
        .from(indicesEconomicos)
        .where(eq(indicesEconomicos.atualizacaoAutomatica, true))
        .orderBy(desc(indicesEconomicos.data))
        .limit(1);
      
      return ultimoIndice.length > 0 ? ultimoIndice[0].data : null;
    } catch (error) {
      console.error('[VERIFICAÇÃO] Erro ao buscar última atualização:', error);
      return null;
    }
  }

  // Função para buscar dados reais do BCB
  async buscarDadosBCB(): Promise<{[key: string]: string}> {
    try {
      const ultimoDiaUtil = this.getUltimoDiaUtil();
      const dataFormatada = ultimoDiaUtil.toISOString().split('T')[0].replace(/-/g, '');
      const dataD1 = `${dataFormatada.slice(6, 8)}/${dataFormatada.slice(4, 6)}/${dataFormatada.slice(0, 4)}`;
      
      console.log(`[BCB] Buscando dados para D-1: ${dataD1} (formato: ${dataFormatada})`);
      
      // URLs da API do BCB buscando período que inclua D-1
      // Buscamos últimos 5 dias úteis para garantir que temos D-1
      const urlsBCB = {
        'SELIC': `https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/5?formato=json`,
        'CDI': `https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados/ultimos/5?formato=json`,
        'IPCA': `https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/5?formato=json`,
        'Dólar': `https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/5?formato=json`,
        'Euro': `https://api.bcb.gov.br/dados/serie/bcdata.sgs.21619/dados/ultimos/5?formato=json`
      };
      
      const resultados: {[key: string]: string} = {};
      
      for (const [nome, url] of Object.entries(urlsBCB)) {
        try {
          console.log(`[BCB] Buscando ${nome} na API do BCB...`);
          const response = await fetch(url);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          const dados = await response.json();
          
          if (Array.isArray(dados) && dados.length > 0) {
            // Buscar especificamente o valor da data D-1
            const valorD1 = dados.find(item => item.data === dataD1);
            
            if (valorD1) {
              resultados[nome] = String(valorD1.valor);
              console.log(`[BCB] ${nome}: ${valorD1.valor} (data D-1 exata: ${valorD1.data})`);
            } else {
              // Se não encontrar D-1, buscar dado mais recente que seja <= D-1 (evitando dados futuros)
              const dataD1Obj = new Date(ultimoDiaUtil);
              const dadosValidos = dados.filter(item => {
                const [dia, mes, ano] = item.data.split('/');
                const dataItem = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
                return dataItem <= dataD1Obj;
              }).sort((a, b) => {
                const [diaA, mesA, anoA] = a.data.split('/');
                const [diaB, mesB, anoB] = b.data.split('/');
                const dataA = new Date(parseInt(anoA), parseInt(mesA) - 1, parseInt(diaA));
                const dataB = new Date(parseInt(anoB), parseInt(mesB) - 1, parseInt(diaB));
                return dataB.getTime() - dataA.getTime(); // Ordem decrescente
              });
              
              if (dadosValidos.length > 0) {
                const melhorValor = dadosValidos[0];
                resultados[nome] = String(melhorValor.valor);
                console.log(`[BCB] ${nome}: ${melhorValor.valor} (data mais recente ≤ D-1: ${melhorValor.data})`);
              } else {
                console.warn(`[BCB] ${nome}: Nenhum dado válido encontrado ≤ D-1`);
              }
            }
          } else {
            console.warn(`[BCB] Dados vazios para ${nome}`);
          }
        } catch (error) {
          console.error(`[BCB] Erro ao buscar ${nome}:`, error);
        }
      }
      
      return resultados;
    } catch (error) {
      console.error('[BCB] Erro geral na busca de dados:', error);
      return {};
    }
  }

  // Função para atualizar índices automáticos
  async atualizarIndicesAutomaticos(): Promise<void> {
    console.log('[INDICES] Atualizando índices automáticos...');
    
    // Usar data D-1 (último dia útil)
    const ultimoDiaUtil = this.getUltimoDiaUtil();
    const dataD1 = ultimoDiaUtil.toISOString().split('T')[0];
    
    console.log(`[INDICES] Atualizando para data D-1: ${dataD1}`);
    console.log(`[INDICES] Hoje: ${new Date().toISOString().split('T')[0]}`);
    
    // Buscar dados reais do BCB
    console.log('[INDICES] Iniciando busca de dados no BCB...');
    const dadosBCB = await this.buscarDadosBCB();
    console.log('[INDICES] Dados retornados do BCB:', dadosBCB);
    
    // Fallback para valores simulados caso a API falhe
    const valoresAtualizados = {
      'CDI': dadosBCB['CDI'] || '13.65',
      'SELIC': dadosBCB['SELIC'] || '13.25', 
      'IPCA': dadosBCB['IPCA'] || '4.23',
      'Dólar': dadosBCB['Dólar'] || '5.45',
      'Euro': dadosBCB['Euro'] || '5.92',
    };
    
    console.log('[INDICES] Valores finais a serem utilizados:', valoresAtualizados);

    // Mapear nomes de variáveis para nomes de índices no banco
    const mapeamentoNomes = {
      'CDI': 'CDI',
      'SELIC': 'SELIC', 
      'IPCA': 'IPCA',
      'Dólar': 'Dólar',
      'Euro': 'Euro',
    };

    for (const [nomeVariavel, valor] of Object.entries(valoresAtualizados)) {
      try {
        const nomeIndice = mapeamentoNomes[nomeVariavel as keyof typeof mapeamentoNomes];
        if (!nomeIndice) {
          console.warn(`[INDICES] Nome de índice não mapeado: ${nomeVariavel}`);
          continue;
        }

        // Buscar índice existente pelo nome correto
        const indiceExistente = await db.select()
          .from(indicesEconomicos)
          .where(eq(indicesEconomicos.nome, nomeIndice))
          .orderBy(desc(indicesEconomicos.data))
          .limit(1);

        if (indiceExistente.length > 0) {
          // Atualizar se for automático
          if (indiceExistente[0].atualizacaoAutomatica) {
            await db.update(indicesEconomicos)
              .set({ 
                valor: valor,
                data: dataD1,
              })
              .where(eq(indicesEconomicos.id, indiceExistente[0].id));
            
            console.log(`[INDICES] ${nomeIndice} atualizado: ${valor} (data: ${dataD1})`);
          } else {
            console.log(`[INDICES] ${nomeIndice} é manual, não atualizado automaticamente`);
          }
        } else {
          // Criar novo índice automático se não existir
          const tipoIndice = nomeIndice === 'IPCA' ? 'inflacao' : 
                           ['Dólar', 'Euro'].includes(nomeIndice) ? 'cambio' : 'taxa';
          const unidadeIndice = ['Dólar', 'Euro'].includes(nomeIndice) ? 'R$' : '%';

          await db.insert(indicesEconomicos).values({
            nome: nomeIndice,
            valor,
            data: dataD1,
            tipo: tipoIndice,
            unidade: unidadeIndice,
            manual: false,
            atualizacaoAutomatica: true,
          });
          
          console.log(`[INDICES] ${nomeIndice} criado: ${valor}`);
        }
      } catch (error) {
        console.error(`[INDICES] Erro ao atualizar ${nomeVariavel}:`, error);
      }
    }
  }

  async updateIndiceEconomico(id: number, indice: Partial<InsertIndiceEconomico>): Promise<IndiceEconomico | undefined> {
    const [updated] = await db.update(indicesEconomicos)
      .set(indice)
      .where(eq(indicesEconomicos.id, id))
      .returning();
    return updated;
  }

  // Dashboard Data
  async getDashboardData(userId: string, userRole: string): Promise<any> {
    // Get user's planejamentos
    const userPlanejamentos = await this.getPlanejamentos(userId, userRole);
    
    if (userPlanejamentos.length === 0) {
      return {
        totalAssets: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        goalsAchieved: 0,
        totalGoals: 0,
        recentTransactions: [],
        portfolioAllocation: [],
        recentGoals: [],
      };
    }

    const planejamentoIds = userPlanejamentos.map(p => p.id);
    
    // Calculate portfolio totals
    let totalAssets = 0;
    let portfolioAllocation: any[] = [];
    
    for (const planejamentoId of planejamentoIds) {
      const portfolio = await this.getPortfolioInvestimentos(planejamentoId);
      const imoveis = await this.getImoveis(planejamentoId);
      
      // Add portfolio values
      portfolio.forEach(investment => {
        totalAssets += parseFloat(investment.valorAtual);
        
        const existingCategory = portfolioAllocation.find(p => p.categoria === investment.categoria);
        if (existingCategory) {
          existingCategory.valor += parseFloat(investment.valorAtual);
        } else {
          portfolioAllocation.push({
            categoria: investment.categoria,
            valor: parseFloat(investment.valorAtual)
          });
        }
      });
      
      // Add real estate values
      imoveis.forEach(imovel => {
        totalAssets += parseFloat(imovel.valorPatrimonial || '0');
      });
    }

    // Calculate monthly income and expenses
    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    
    for (const planejamentoId of planejamentoIds) {
      const receitas = await this.getReceitas(planejamentoId);
      const despesas = await this.getDespesas(planejamentoId);
      
      receitas.forEach(receita => {
        if (receita.ativo && receita.frequencia === 'mensal') {
          monthlyIncome += parseFloat(receita.valor);
        }
      });
      
      despesas.forEach(despesa => {
        if (despesa.ativo && despesa.frequencia === 'mensal') {
          monthlyExpenses += parseFloat(despesa.valor);
        }
      });
    }

    // Calculate goals progress
    let goalsAchieved = 0;
    let totalGoals = 0;
    let recentGoals: any[] = [];
    
    for (const planejamentoId of planejamentoIds) {
      const objetivos = await this.getObjetivos(planejamentoId);
      totalGoals += objetivos.length;
      
      objetivos.forEach(objetivo => {
        if (objetivo.status === 'concluido') {
          goalsAchieved++;
        }
        
        const progress = parseFloat(objetivo.valorAtual || '0') / parseFloat(objetivo.valorObjetivo || '1') * 100;
        recentGoals.push({
          ...objetivo,
          progress: Math.min(progress, 100)
        });
      });
    }

    recentGoals = recentGoals.slice(0, 3); // Get top 3 recent goals

    return {
      totalPlanejamentos: userPlanejamentos.length,
      totalPatrimonio: totalAssets || 0,
      totalReceitas: monthlyIncome,
      totalDespesas: monthlyExpenses,
      portfolioValue: totalAssets || 0,
      recentActivity: [
        { type: 'planejamento', description: `${userPlanejamentos.length} planejamento(s) ativo(s)`, date: new Date().toISOString() },
        { type: 'receita', description: `Receitas mensais: R$ ${monthlyIncome.toLocaleString('pt-BR')}`, date: new Date().toISOString() },
        { type: 'despesa', description: `Despesas mensais: R$ ${monthlyExpenses.toLocaleString('pt-BR')}`, date: new Date().toISOString() }
      ]
    };
  }

  // =====================================
  // DADOS MENSAIS (Aba DADOS - Metodologia Excel)
  // =====================================

  private converterDataMMAAAA(dataStr: string): Date {
    if (!dataStr) return new Date();
    
    // Se já está no formato YYYY-MM-DD, usar direto
    if (dataStr.includes('-') && dataStr.length === 10) {
      return new Date(dataStr);
    }
    
    // Formato MM/YYYY
    const [mes, ano] = dataStr.split('/');
    return new Date(parseInt(ano), parseInt(mes) - 1, 1);
  }

  async regenerarDadosMensais(planejamentoId: number, capitalSeguradoAdicional?: number): Promise<void> {
    try {
      console.log(`🎯 [INICIO] ===============================================`);
      console.log(`🎯 [INICIO] REGENERANDO DADOS PARA PLANEJAMENTO ${planejamentoId}`);
      console.log(`🎯 [INICIO] ===============================================`);
      
      // SIMULAÇÃO DE PROVEDORES: Buscar simulações ativas PRIMEIRO
      console.log(`🔍 [SIMULAÇÃO] Iniciando busca de simulações para planejamento ${planejamentoId}`);
      
      const simulacoesProvedores = await this.getSimulacaoProvedores(planejamentoId);
      
      console.log(`🔍 [SIMULAÇÃO] Encontradas ${simulacoesProvedores.length} simulações:`, simulacoesProvedores.map(s => `ID:${s.membroId} status:${s.status}`));
      
      const provedoresAusentes = simulacoesProvedores
        .filter(sim => sim.status === 'ausente')
        .map(sim => sim.membroId);
      
      console.log(`🚨 [SIMULAÇÃO] Provedores ausentes: [${provedoresAusentes.join(', ')}]`);
      
      // Buscar a data de início do planejamento
      const [planejamento] = await db.select().from(planejamentos)
        .where(eq(planejamentos.id, planejamentoId));
      
      if (!planejamento) {
        throw new Error(`Planejamento ${planejamentoId} não encontrado`);
      }

      const dataInicioPlanejamento = new Date(planejamento.dataInicio);
      console.log(`[DADOS] Data de início do planejamento: ${planejamento.dataInicio}`);
      
      // Limpar dados existentes
      await db.delete(dadosMensais).where(eq(dadosMensais.planejamentoId, planejamentoId));
      console.log(`[DADOS] Dados antigos removidos`);

      // Buscar todas as receitas e despesas ativas do planejamento
      let receitasAtivas = await db.select().from(receitas)
        .where(and(eq(receitas.planejamentoId, planejamentoId), eq(receitas.ativo, true)));
      
      let despesasAtivas = await db.select().from(despesas)
        .where(and(eq(despesas.planejamentoId, planejamentoId), eq(despesas.ativo, true)));

      // Verificar se ambos provedores estão ausentes
      const membrosInfo = await this.getMembrosFamily(planejamentoId);
      const todosProvedores = membrosInfo.filter(m => !m.dependente);
      const todosTodosProvAbsent = todosProvedores.every(prov => provedoresAusentes.includes(prov.id));
      
      console.log(`[SIMULAÇÃO] Total provedores: ${todosProvedores.length}, Provedores ausentes: ${provedoresAusentes.length}, Todos provedores ausentes: ${todosTodosProvAbsent}`);
      
      // Buscar idade limite dos dependentes quando ambos provedores ausentes
      let idadeLimiteDependentes = 21; // Valor padrão
      if (todosTodosProvAbsent) {
        try {
          const indiceIdadeLimite = await db.select().from(indicesEconomicos)
            .where(eq(indicesEconomicos.nome, 'Idade Limite Dependentes'))
            .limit(1);
          if (indiceIdadeLimite.length > 0) {
            idadeLimiteDependentes = parseFloat(indiceIdadeLimite[0].valor);
            console.log(`[IDADE-LIMITE] Idade limite dependentes obtida dos parâmetros: ${idadeLimiteDependentes} anos`);
          }
        } catch (error) {
          console.log(`[IDADE-LIMITE] Erro ao buscar parâmetro, usando valor padrão: 21 anos`);
        }
      }

      // SIMULAÇÃO: Filtrar receitas e despesas de provedores ausentes
      if (provedoresAusentes.length > 0) {
        const receitasAntes = receitasAtivas.length;
        const despesasAntes = despesasAtivas.length;
        
        receitasAtivas = receitasAtivas.filter(receita => {
          // Campo 'membro' é string, convertendo para comparação
          const membroIdReceita = receita.membro ? parseInt(receita.membro) : null;
          const isExcluded = membroIdReceita && provedoresAusentes.includes(membroIdReceita);
          if (isExcluded) {
            console.log(`[SIMULAÇÃO] ❌ Excluindo receita "${receita.descricao}" (membro ID: ${membroIdReceita})`);
          }
          return !isExcluded;
        });
        
        despesasAtivas = despesasAtivas.filter(despesa => {
          // Campo 'membro' é string, convertendo para comparação
          const membroIdDespesa = despesa.membro ? parseInt(despesa.membro) : null;
          const isExcluded = membroIdDespesa && provedoresAusentes.includes(membroIdDespesa);
          if (isExcluded) {
            console.log(`[SIMULAÇÃO] ❌ Excluindo despesa "${despesa.descricao}" (membro ID: ${membroIdDespesa})`);
          }
          return !isExcluded;
        });
        
        console.log(`[SIMULAÇÃO] Receitas: ${receitasAntes} → ${receitasAtivas.length} (excluídas ${receitasAntes - receitasAtivas.length} de provedores ausentes)`);
        console.log(`[SIMULAÇÃO] Despesas: ${despesasAntes} → ${despesasAtivas.length} (excluídas ${despesasAntes - despesasAtivas.length} de provedores ausentes)`);
      }

      console.log(`[DADOS] Processando ${receitasAtivas.length} receitas e ${despesasAtivas.length} despesas ativas`);
      
      // DEBUG: Verificar se receitas de Eduardo foram realmente excluídas
      const receitasEduardo = receitasAtivas.filter(r => r.membro === '4');
      console.log(`[DEBUG-EDUARDO] Receitas restantes de Eduardo após simulação: ${receitasEduardo.length}`, receitasEduardo.map(r => r.descricao));

      // METODOLOGIA CIKLUS: Calcular ano limite baseado no provedor mais novo
      const membros = await this.getMembrosFamily(planejamentoId);
      const anoLimiteEterno = this.calcularAnoLimiteDespesasEternas(membros);
      console.log(`[DADOS] Ano limite para despesas eternas: ${anoLimiteEterno}`);

      // Determinar o período de análise baseado na data de início do planejamento
      const anoInicioPlanejamento = dataInicioPlanejamento.getFullYear();
      const mesInicioPlanejamento = dataInicioPlanejamento.getMonth() + 1; // getMonth() retorna 0-11
      const anoAtual = new Date().getFullYear();
      const anoInicial = Math.max(anoInicioPlanejamento, anoAtual); // Usar o maior entre data planejamento e ano atual
      
      // CORREÇÃO CRÍTICA: anoFinal sempre usar limite normal (2095), limitações específicas são aplicadas por módulo
      const anoFinal = anoLimiteEterno; // Sempre usar limite baseado no provedor mais novo completar 100 anos
      
      console.log(`[DADOS] Período de análise: ${anoInicial} a ${anoFinal} (início planejamento: ${anoInicioPlanejamento}/${mesInicioPlanejamento}, limite baseado em 100 anos do mais novo)`);
      
      // Data mínima para filtrar os dados
      const dataMinima = new Date(anoInicioPlanejamento, mesInicioPlanejamento - 1, 1); // Mês-1 porque Date usa 0-11

      // Mapa para consolidar dados por período
      const dadosConsolidados = new Map<string, any>();

      // INICIALIZAR TODOS OS PERÍODOS até anoFinal (2095) com valores zerados
      for (let ano = anoInicial; ano <= anoFinal; ano++) {
        for (let mes = 1; mes <= 12; mes++) {
          const dataAtual = new Date(ano, mes - 1, 1);
          if (dataAtual >= dataMinima) {
            const periodo = `${this.obterNomeMes(mes).toLowerCase()}-${ano.toString().slice(-2)}`;
            const chave = `${ano}-${mes.toString().padStart(2, '0')}`;
            
            dadosConsolidados.set(chave, {
              planejamentoId,
              ano,
              mes,
              periodo,
              data: dataAtual,
              // Receitas por categoria
              receitaAtiva: 0,
              receitaPassiva: 0,
              receitaPatrimonio: 0,
              inss: 0,
              // Despesas por categoria
              despesasBasicas: 0,
              despesasDependentes: 0,
              despesasEstilo: 0,
              despesasViagens: 0,
              despesasPatrimoniais: 0,
              // Financiamentos
              financiamento1: 0,
              financiamento2: 0,
              financiamento3: 0,
              financiamento4: 0,
              financiamento5: 0,
              // Venda de Ativos
              vendaAtivos: 0,
              // Objetivos
              objetivos: 0,
              // Totalizadores
              despesasTotais: 0,
              receitasTotais: 0,
              cs: 0,
              portfolioInicial: 0,
              totalVendas: 0,
              projetos: 0,
              saving: 0,
              rentaDolar: 0,
              portfolioFinal: 0,
              projetosBRL: 0,
              projetosUSD: 0,
              caixa: 300000, // Valor inicial padrão
              longevidade: 0,
            });
          }
        }
      }
      console.log(`[DADOS] Inicializados ${dadosConsolidados.size} períodos mensais de ${anoInicial} a ${anoFinal}`);

      // Buscar imóveis para verificar datas de venda
      const imoveisLista = await this.getImoveis(planejamentoId);
      
      // Processar receitas
      for (const receita of receitasAtivas) {
        const dataInicio = this.converterDataMMAAAA(receita.dataInicio);
        
        // CORREÇÃO: Para receitas sem prazo definido (eternas), usar anoFinal (até 100 anos do mais novo)
        // Para receitas com prazo específico, respeitar o limite da receita
        let dataFimCalculada: Date;
        if (!receita.prazoAnos || receita.prazoAnos === 0) {
          // Receita eterna: vai até o limite calculado (100 anos do mais novo)
          dataFimCalculada = new Date(anoFinal, 11, 31);
          console.log(`[RECEITA-ETERNA] "${receita.descricao}" sem prazo definido - estendida até ${anoFinal}`);
        } else {
          // Receita com prazo: respeitar data fim calculada
          dataFimCalculada = receita.dataFim ? 
            this.converterDataMMAAAA(receita.dataFim) : 
            new Date(anoFinal, 11, 31);
          console.log(`[RECEITA-PRAZO] "${receita.descricao}" com prazo ${receita.prazoAnos} anos - até ${dataFimCalculada.toLocaleDateString('pt-BR')}`);
        }
        
        // VINCULAÇÃO COM VENDA DE IMÓVEIS: Se receita patrimonial sem data fim, verificar venda de imóveis
        if (!receita.dataFim && ['patrimoniais', 'investimentos', 'imoveis', 'patrimonio'].includes(receita.categoria || '')) {
          // Buscar imóvel vinculado usando o campo específico 'imovel'
          let imovelVinculado = null;
          if (receita.imovel) {
            // Buscar imóvel pelo ID armazenado no campo 'imovel'
            const imovelId = parseInt(receita.imovel);
            imovelVinculado = imoveisLista.find(i => i.id === imovelId);
            console.log(`[VINCULAÇÃO-RECEITA] Receita "${receita.descricao}" (ID:${receita.id}) -> procurando imóvel ID:${imovelId}`);
          }
          
          // Se encontrou imóvel vinculado E tem data de venda, aplicar limite
          if (imovelVinculado && imovelVinculado.dataVenda) {
            dataFimCalculada = new Date(imovelVinculado.dataVenda);
            console.log(`[VINCULAÇÃO-RECEITA] ✅ Receita "${receita.descricao}" vinculada ao imóvel "${imovelVinculado.nome}" (ID:${imovelVinculado.id}) - limitada até ${dataFimCalculada.toLocaleDateString('pt-BR')}`);
          } else if (imovelVinculado && !imovelVinculado.dataVenda) {
            console.log(`[VINCULAÇÃO-RECEITA] ✅ Receita "${receita.descricao}" vinculada ao imóvel "${imovelVinculado.nome}" (ID:${imovelVinculado.id}) - SEM data de venda, mantém até final do planejamento`);
          } else if (receita.imovel) {
            console.log(`[VINCULAÇÃO-RECEITA] ❌ Receita "${receita.descricao}" - imóvel ID:${receita.imovel} não encontrado, mantém até final do planejamento`);
          } else {
            console.log(`[VINCULAÇÃO-RECEITA] ⚪ Receita "${receita.descricao}" - sem imóvel vinculado, mantém até final do planejamento`);
          }
        }

        for (let ano = anoInicial; ano <= anoFinal; ano++) {
          const mesesAtivos = this.obterMesesAtivos(receita, ano);
          
          for (const mes of mesesAtivos) {
            const dataAtual = new Date(ano, mes - 1, 1);
            // Filtrar por data de início do planejamento E por data da receita
            if (dataAtual >= dataInicio && dataAtual <= dataFimCalculada && dataAtual >= dataMinima) {
              const periodo = `${this.obterNomeMes(mes).toLowerCase()}-${ano.toString().slice(-2)}`;
              const chave = `${ano}-${mes.toString().padStart(2, '0')}`;
              
              if (!dadosConsolidados.has(chave)) {
                dadosConsolidados.set(chave, {
                  planejamentoId,
                  ano,
                  mes,
                  periodo,
                  data: dataAtual,
                  // Receitas por categoria
                  receitaAtiva: 0,
                  receitaPassiva: 0,
                  receitaPatrimonio: 0,
                  inss: 0,
                  // Despesas por categoria
                  despesasBasicas: 0,
                  despesasDependentes: 0,
                  despesasEstilo: 0,
                  despesasViagens: 0,
                  despesasPatrimoniais: 0,
                  // Financiamentos
                  financiamento1: 0,
                  financiamento2: 0,
                  financiamento3: 0,
                  financiamento4: 0,
                  financiamento5: 0,
                  // Venda de Ativos
                  vendaAtivos: 0,
                  // Objetivos
                  desembolsoObjetivos: 0,
                  // Totais
                  despesasTotais: 0,
                  receitasTotais: 0,
                  // Campos de análise financeira (iniciais)
                  cs: 0,
                  portfolioInicial: 0,
                  totalVendas: 0,
                  projetos: 0,
                  saving: 0,
                  rentaDolar: 0,
                  portfolioFinal: 0,
                  projetosBRL: 0,
                  projetosUSD: 0,
                  caixa: 300000, // Valor inicial padrão
                  longevidade: 0,
                });
              }

              const dadoMensal = dadosConsolidados.get(chave);
              const percentual = this.obterPercentualMes(receita, mes);
              
              // CONVERSÃO USD: Se a receita está em USD, converter para BRL
              let valorBase = parseFloat(receita.valor);
              if (receita.moeda === 'USD') {
                const taxaCambio = await this.getTaxaCambio();
                valorBase = valorBase * taxaCambio;
                console.log(`[CONVERSÃO-USD] Receita "${receita.descricao}": $${receita.valor} → R$ ${valorBase.toFixed(4)} (taxa: R$ ${taxaCambio})`);
              }
              
              const valorMensal = (valorBase * percentual) / 100;

              // Categorizar receita
              switch (receita.categoria) {
                // Categorias novas (sistema atual)
                case 'passivas':
                  dadoMensal.receitaPassiva += valorMensal;
                  break;
                case 'patrimoniais':
                  dadoMensal.receitaPatrimonio += valorMensal;
                  break;
                case 'laborais':
                  dadoMensal.receitaAtiva += valorMensal;
                  break;
                // Compatibilidade com categorias antigas
                case 'salario':
                case 'renda_fixa':
                  dadoMensal.receitaAtiva += valorMensal;
                  break;
                case 'investimentos':
                case 'dividendos':
                  dadoMensal.receitaPassiva += valorMensal;
                  break;
                case 'aluguel':
                case 'imovel':
                  dadoMensal.receitaPatrimonio += valorMensal;
                  break;
                case 'inss':
                case 'aposentadoria':
                  dadoMensal.inss += valorMensal;
                  break;
                default:
                  dadoMensal.receitaAtiva += valorMensal;
              }
            }
          }
        }
      }

      // Processar despesas
      for (const despesa of despesasAtivas) {
        const dataInicio = this.converterDataMMAAAA(despesa.dataInicio);
        
        // METODOLOGIA CIKLUS: Aplicar regra para despesas eternas
        let dataFimCalculada: Date;
        if (despesa.dataFim) {
          dataFimCalculada = this.converterDataMMAAAA(despesa.dataFim);
        } else {
          // Despesa sem prazo (eterna): limitar até provedor mais novo completar 100 anos
          dataFimCalculada = new Date(anoLimiteEterno, 11, 31);
          console.log(`[DADOS] Despesa ${despesa.id} (${despesa.descricao}) sem prazo - limitada até ${anoLimiteEterno}`);
          
          // METODOLOGIA CIKLUS CORRETA: Quando ambos provedores ausentes
          if (todosTodosProvAbsent) {
            if (!despesa.membro) {
              // Despesas SEM membro vinculado: limitadas até dependente mais novo atingir idade configurável
              const dependentes = membrosInfo.filter(m => m.dependente);
              if (dependentes.length > 0) {
                const dependenteMaisNovo = dependentes.reduce((menor, atual) => 
                  atual.idade < menor.idade ? atual : menor
                );
                
                const anoAtual = new Date().getFullYear();
                const anoLimiteDependente = anoAtual + (idadeLimiteDependentes - dependenteMaisNovo.idade);
                
                const dataLimiteDependente = new Date(anoLimiteDependente, 11, 31);
                if (dataLimiteDependente < dataFimCalculada) {
                  dataFimCalculada = dataLimiteDependente;
                  console.log(`[METODOLOGIA] ⚠️ Despesa "${despesa.descricao}" (sem membro vinculado) limitada até ${anoLimiteDependente} quando ${dependenteMaisNovo.nome} atingir ${idadeLimiteDependentes} anos`);
                } else {
                  console.log(`[METODOLOGIA] ✅ Despesa "${despesa.descricao}" (sem membro vinculado) mantida até ${anoLimiteEterno}`);
                }
              }
            } else {
              // Verificar se membro é dependente
              const membroVinculado = membrosInfo.find(m => m.id === parseInt(String(despesa.membro || '0')));
              if (membroVinculado && membroVinculado.dependente) {
                console.log(`[METODOLOGIA] ✅ Despesa "${despesa.descricao}" vinculada a dependente ${membroVinculado.nome} - mantida até prazo final`);
              }
            }
          }
        }
        
        // VINCULAÇÃO COM VENDA DE IMÓVEIS: Se despesa patrimonial sem data fim, verificar venda de imóveis
        // MAS SÓ APLICAR se não foi limitada anteriormente pela metodologia CIKLUS
        if (!despesa.dataFim && ['patrimoniais', 'investimentos', 'imoveis', 'patrimonio'].includes(despesa.categoria || '')) {
          // Buscar imóvel vinculado usando o campo específico 'imovel'
          let imovelVinculado = null;
          if (despesa.imovel) {
            // Buscar imóvel pelo ID armazenado no campo 'imovel'
            const imovelId = parseInt(despesa.imovel);
            imovelVinculado = imoveisLista.find(i => i.id === imovelId);
            console.log(`[VINCULAÇÃO] Despesa "${despesa.descricao}" (ID:${despesa.id}) -> procurando imóvel ID:${imovelId}`);
          }
          
          // Se encontrou imóvel vinculado E tem data de venda, aplicar limite (apenas se não foi limitado antes)
          if (imovelVinculado && imovelVinculado.dataVenda) {
            const dataVendaImovel = new Date(imovelVinculado.dataVenda);
            if (dataVendaImovel < dataFimCalculada) {
              dataFimCalculada = dataVendaImovel;
              console.log(`[VINCULAÇÃO] ✅ Despesa "${despesa.descricao}" vinculada ao imóvel "${imovelVinculado.nome}" (ID:${imovelVinculado.id}) - limitada até ${dataFimCalculada.toLocaleDateString('pt-BR')}`);
            } else {
              console.log(`[VINCULAÇÃO] ⚪ Despesa "${despesa.descricao}" já limitada por metodologia CIKLUS - mantém limitação anterior`);
            }
          } else if (imovelVinculado && !imovelVinculado.dataVenda) {
            console.log(`[VINCULAÇÃO] ✅ Despesa "${despesa.descricao}" vinculada ao imóvel "${imovelVinculado.nome}" (ID:${imovelVinculado.id}) - SEM data de venda, respeita limitação anterior`);
          } else if (despesa.imovel) {
            console.log(`[VINCULAÇÃO] ❌ Despesa "${despesa.descricao}" - imóvel ID:${despesa.imovel} não encontrado, respeita limitação anterior`);
          } else {
            console.log(`[VINCULAÇÃO] ⚪ Despesa "${despesa.descricao}" - sem imóvel vinculado, respeita limitação anterior`);
          }
        }

        for (let ano = anoInicial; ano <= anoFinal; ano++) {
          const mesesAtivos = this.obterMesesAtivos(despesa, ano);
          
          for (const mes of mesesAtivos) {
            const dataAtual = new Date(ano, mes - 1, 1);
            // Filtrar por data de início do planejamento E por data da despesa
            if (dataAtual >= dataInicio && dataAtual <= dataFimCalculada && dataAtual >= dataMinima) {
              const chave = `${ano}-${mes.toString().padStart(2, '0')}`;
              
              if (!dadosConsolidados.has(chave)) {
                const periodo = `${this.obterNomeMes(mes).toLowerCase()}-${ano.toString().slice(-2)}`;
                dadosConsolidados.set(chave, {
                  planejamentoId,
                  ano,
                  mes,
                  periodo,
                  data: dataAtual,
                  receitaAtiva: 0, receitaPassiva: 0, receitaPatrimonio: 0, inss: 0,
                  despesasBasicas: 0, despesasDependentes: 0, despesasEstilo: 0, 
                  despesasViagens: 0, despesasPatrimoniais: 0,
                  financiamento1: 0, financiamento2: 0, financiamento3: 0, 
                  financiamento4: 0, financiamento5: 0,
                  vendaAtivos: 0, desembolsoObjetivos: 0,
                  despesasTotais: 0, receitasTotais: 0,
                  cs: 0, portfolioInicial: 0, totalVendas: 0, projetos: 0,
                  saving: 0, rentaDolar: 0, portfolioFinal: 0,
                  projetosBRL: 0, projetosUSD: 0, caixa: 300000, longevidade: 0,
                });
              }

              const dadoMensal = dadosConsolidados.get(chave);
              const percentual = this.obterPercentualMes(despesa, mes);
              
              // CONVERSÃO USD: Se a despesa está em USD, converter para BRL
              let valorBase = parseFloat(despesa.valor);
              if (despesa.moeda === 'USD') {
                const taxaCambio = await this.getTaxaCambio();
                valorBase = valorBase * taxaCambio;
                console.log(`[CONVERSÃO-USD] Despesa "${despesa.descricao}": $${despesa.valor} → R$ ${valorBase.toFixed(4)} (taxa: R$ ${taxaCambio})`);
              }
              
              const valorMensal = (valorBase * percentual) / 100;

              // Categorizar despesa
              switch (despesa.categoria) {
                case 'basicas':
                case 'alimentacao':
                case 'moradia':
                  dadoMensal.despesasBasicas += valorMensal;
                  break;
                case 'dependentes':
                case 'educacao':
                case 'filhos':
                  dadoMensal.despesasDependentes += valorMensal;
                  break;
                case 'estilo':
                case 'lazer':
                case 'roupas':
                  dadoMensal.despesasEstilo += valorMensal;
                  break;
                case 'viagens':
                case 'ferias':
                  dadoMensal.despesasViagens += valorMensal;
                  break;
                case 'patrimoniais':
                case 'investimentos':
                case 'imoveis':
                  dadoMensal.despesasPatrimoniais += valorMensal;
                  break;
                case 'financiamento':
                case 'emprestimo':
                  dadoMensal.financiamento1 += valorMensal;
                  break;
                default:
                  dadoMensal.despesasBasicas += valorMensal;
              }
            }
          }
        }
      }

      // Processar financiamentos dos imóveis automaticamente
      console.log(`[FINANCIAMENTOS] Processando financiamentos dos imóveis...`);
      const imoveisComFinanciamentoRaw = imoveisLista.filter(imovel => imovel.financiamento === 'SIM');
      
      // Ordenar por data de início para manter correspondência correta com colunas
      const imoveisComFinanciamento = imoveisComFinanciamentoRaw.sort((a, b) => {
        const dataA = new Date(a.dataInicio || '2030-01-01');
        const dataB = new Date(b.dataInicio || '2030-01-01');
        return dataA.getTime() - dataB.getTime();
      });
      
      console.log(`[FINANCIAMENTOS] Encontrados ${imoveisComFinanciamento.length} imóveis com financiamento`);
      console.log(`[FINANCIAMENTOS] Ordem cronológica: ${imoveisComFinanciamento.map((i, idx) => `${i.nome}(${i.dataInicio})→financiamento${idx+1}`).join(', ')}`);
      
      // Importar utilitários de financiamento
      const { calcularFinanciamento, converterDataParaISOInicio } = await import('./utils/financiamentoUtils');
      
      for (let indiceImovel = 0; indiceImovel < imoveisComFinanciamento.length; indiceImovel++) {
        const imovel = imoveisComFinanciamento[indiceImovel];
        
        console.log(`[FINANCIAMENTO-${indiceImovel + 1}] Processando imóvel: ${imovel.nome}`);
        console.log(`[FINANCIAMENTO-${indiceImovel + 1}] Tipo: ${imovel.tipoAmortizacao}, Juros: ${imovel.juros}%`);
        
        try {
          const valorAquisicao = parseFloat(imovel.valorAquisicao || '0') || 0;
          const entrada = parseFloat(imovel.entrada || '0') || 0;
          const taxaJuros = parseFloat(imovel.juros || '0') || 0;
          const prazoAnos = parseInt(imovel.prazoAnos?.toString() || '0') || 0;
          
          if (valorAquisicao > 0 && prazoAnos > 0 && taxaJuros > 0 && imovel.dataInicio) {
            const dataInicioISO = converterDataParaISOInicio(imovel.dataInicio);
            const dataVendaISO = imovel.dataVenda ? converterDataParaISOInicio(imovel.dataVenda) : undefined;
            
            // Calcular parcelas do financiamento
            const parcelas = calcularFinanciamento(
              valorAquisicao,
              entrada,
              taxaJuros,
              prazoAnos,
              dataInicioISO,
              imovel.tipoAmortizacao as 'SAC' | 'PRICE',
              dataVendaISO
            );
            
            console.log(`[FINANCIAMENTO-${indiceImovel + 1}] Calculadas ${parcelas.length} parcelas`);
            
            // Apropriar parcelas nos dados mensais em colunas específicas de financiamento
            for (const parcela of parcelas) {
              const [ano, mes] = parcela.anoMes.split('-');
              const chave = `${ano}-${mes}`;
              
              // Verificar se a parcela está dentro do período válido do planejamento
              const dataParcela = new Date(parseInt(ano), parseInt(mes) - 1, 1);
              if (dataParcela < dataMinima) {
                continue; // Pular parcelas anteriores à data de início do planejamento
              }
              
              if (dadosConsolidados.has(chave)) {
                const dadoMensal = dadosConsolidados.get(chave);
                
                // Distribuir nas colunas de financiamento (financiamento1 a financiamento5)
                const colunaFinanciamento = `financiamento${indiceImovel + 1}` as keyof typeof dadoMensal;
                if (indiceImovel < 5) { // Máximo 5 financiamentos
                  // CONVERSÃO USD: Se o imóvel está em USD, converter a parcela para BRL
                  let valorParcelaBRL = parcela.valorParcela;
                  if (imovel.moeda === 'USD') {
                    const taxaCambio = await this.getTaxaCambio();
                    valorParcelaBRL = parcela.valorParcela * taxaCambio;
                    console.log(`[FINANCIAMENTO-${indiceImovel + 1}] CONVERSÃO USD: $${parcela.valorParcela.toFixed(4)} → R$ ${valorParcelaBRL.toFixed(4)} (taxa: R$ ${taxaCambio})`);
                  }
                  
                  // APLICAR REDUÇÃO POR SEGURO: Se há provedores ausentes, aplicar % de seguro
                  let valorFinalParcela = valorParcelaBRL;
                  if (provedoresAusentes.length > 0) {
                    let percentualSeguroTotal = 0;
                    
                    // Eduardo (ID: 4) ausente - aplicar seguro Eduardo
                    if (provedoresAusentes.includes(4) && imovel.seguroEduardo) {
                      const seguroEduardo = parseFloat(imovel.seguroEduardo) || 0;
                      percentualSeguroTotal += seguroEduardo;
                      console.log(`[SEGURO] Eduardo ausente - seguro do imóvel "${imovel.nome}": ${seguroEduardo}%`);
                    }
                    
                    // Mônica (ID: 1) ausente - aplicar seguro Mônica  
                    if (provedoresAusentes.includes(1) && imovel.seguroMonica) {
                      const seguroMonica = parseFloat(imovel.seguroMonica) || 0;
                      percentualSeguroTotal += seguroMonica;
                      console.log(`[SEGURO] Mônica ausente - seguro do imóvel "${imovel.nome}": ${seguroMonica}%`);
                    }
                    
                    // Aplicar redução total (limitado a 100%)
                    const reducaoPercentual = Math.min(percentualSeguroTotal, 100) / 100;
                    const valorReducao = valorParcelaBRL * reducaoPercentual;
                    valorFinalParcela = valorParcelaBRL - valorReducao;
                    
                    console.log(`[SEGURO] Imóvel "${imovel.nome}" - Redução total: ${percentualSeguroTotal}% | Parcela original: R$ ${valorParcelaBRL.toFixed(4)} → Final: R$ ${valorFinalParcela.toFixed(4)} (economia: R$ ${valorReducao.toFixed(4)})`);
                  }
                  
                  (dadoMensal as any)[colunaFinanciamento] += valorFinalParcela;
                  console.log(`[FINANCIAMENTO-${indiceImovel + 1}] ${parcela.anoMes}: R$ ${valorFinalParcela.toFixed(4)} -> ${String(colunaFinanciamento)}`);
                }
              } else {
                // Criar entrada se não existir (apenas se estiver dentro do período válido)
                const anoNum = parseInt(ano);
                const mesNum = parseInt(mes);
                const dataAtual = new Date(anoNum, mesNum - 1, 1);
                
                // Verificar novamente se está dentro do período do planejamento
                if (dataAtual < dataMinima) {
                  continue;
                }
                
                const periodo = `${this.obterNomeMes(mesNum).toLowerCase()}-${anoNum.toString().slice(-2)}`;
                
                const novoDado = {
                  planejamentoId,
                  ano: anoNum,
                  mes: mesNum,
                  periodo,
                  data: dataAtual,
                  receitaAtiva: 0, receitaPassiva: 0, receitaPatrimonio: 0, inss: 0,
                  despesasBasicas: 0, despesasDependentes: 0, despesasEstilo: 0, 
                  despesasViagens: 0, despesasPatrimoniais: 0,
                  financiamento1: 0, financiamento2: 0, financiamento3: 0, 
                  financiamento4: 0, financiamento5: 0,
                  despesasTotais: 0, receitasTotais: 0,
                  cs: 0, portfolioInicial: 0, totalVendas: 0, projetos: 0,
                  saving: 0, rentaDolar: 0, portfolioFinal: 0,
                  projetosBRL: 0, projetosUSD: 0, caixa: 300000, longevidade: 0,
                };
                
                const colunaFinanciamento = `financiamento${indiceImovel + 1}` as keyof typeof novoDado;
                // CONVERSÃO USD: Se o imóvel está em USD, converter a parcela para BRL
                let valorParcelaBRL = parcela.valorParcela;
                if (indiceImovel < 5) {
                  if (imovel.moeda === 'USD') {
                    const taxaCambio = await this.getTaxaCambio();
                    valorParcelaBRL = parcela.valorParcela * taxaCambio;
                    console.log(`[FINANCIAMENTO-${indiceImovel + 1}] CONVERSÃO USD (novo): $${parcela.valorParcela.toFixed(4)} → R$ ${valorParcelaBRL.toFixed(4)} (taxa: R$ ${taxaCambio})`);
                  }
                  
                  // APLICAR REDUÇÃO POR SEGURO: Se há provedores ausentes, aplicar % de seguro
                  let valorFinalParcela = valorParcelaBRL;
                  if (provedoresAusentes.length > 0) {
                    let percentualSeguroTotal = 0;
                    
                    // Eduardo (ID: 4) ausente - aplicar seguro Eduardo
                    if (provedoresAusentes.includes(4) && imovel.seguroEduardo) {
                      const seguroEduardo = parseFloat(imovel.seguroEduardo) || 0;
                      percentualSeguroTotal += seguroEduardo;
                      console.log(`[SEGURO] Eduardo ausente - seguro do imóvel "${imovel.nome}": ${seguroEduardo}%`);
                    }
                    
                    // Mônica (ID: 1) ausente - aplicar seguro Mônica  
                    if (provedoresAusentes.includes(1) && imovel.seguroMonica) {
                      const seguroMonica = parseFloat(imovel.seguroMonica) || 0;
                      percentualSeguroTotal += seguroMonica;
                      console.log(`[SEGURO] Mônica ausente - seguro do imóvel "${imovel.nome}": ${seguroMonica}%`);
                    }
                    
                    // Aplicar redução total (limitado a 100%)
                    const reducaoPercentual = Math.min(percentualSeguroTotal, 100) / 100;
                    const valorReducao = valorParcelaBRL * reducaoPercentual;
                    valorFinalParcela = valorParcelaBRL - valorReducao;
                    
                    console.log(`[SEGURO] Imóvel "${imovel.nome}" (novo) - Redução total: ${percentualSeguroTotal}% | Parcela original: R$ ${valorParcelaBRL.toFixed(4)} → Final: R$ ${valorFinalParcela.toFixed(4)} (economia: R$ ${valorReducao.toFixed(4)})`);
                  }
                  
                  (novoDado as any)[colunaFinanciamento] = valorFinalParcela;
                }
                
                dadosConsolidados.set(chave, novoDado);
                const valorFinalLog = imovel.moeda === 'USD' ? valorParcelaBRL : parcela.valorParcela;
                console.log(`[FINANCIAMENTO-${indiceImovel + 1}] Criado novo período ${parcela.anoMes}: R$ ${valorFinalLog.toFixed(4)} -> ${String(colunaFinanciamento)}`);
              }
            }
          } else {
            console.log(`[FINANCIAMENTO-${indiceImovel + 1}] Dados insuficientes - pulando cálculo`);
          }
        } catch (error) {
          console.error(`[FINANCIAMENTO-${indiceImovel + 1}] Erro ao calcular:`, error);
        }
      }

      // Processar venda de ativos (imóveis)
      console.log(`[VENDA-ATIVOS] Processando vendas de imóveis...`);
      
      for (const imovel of imoveisLista) {
        if (imovel.dataVenda && imovel.taxaValorizacao) {
          const dataVenda = new Date(imovel.dataVenda);
          const dataInicio = new Date(imovel.dataInicio || '2025-01-01');
          
          // Calcular meses entre data início e data venda
          const mesesValorizacao = Math.round((dataVenda.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
          
          // Calcular valor patrimonial na venda: valor_inicial * (1 + taxa_mensal)^meses
          const valorPatrimonialInicial = parseFloat(imovel.valorPatrimonial || imovel.valorAquisicao || '0');
          const taxaValorizacaoAnual = parseFloat(imovel.taxaValorizacao || '0') / 100; // Converter % para decimal
          const taxaValorizacaoMensal = Math.pow(1 + taxaValorizacaoAnual, 1/12) - 1; // Converter para taxa mensal equivalente
          const valorVendaBruto = valorPatrimonialInicial * Math.pow(1 + taxaValorizacaoMensal, mesesValorizacao);
          
          // Calcular saldo devedor do financiamento na data da venda (se houver)
          let saldoDevedorVenda = 0;
          if (imovel.financiamento === 'SIM' && imovel.juros && imovel.prazoAnos && imovel.entrada) {
            const valorAquisicao = parseFloat(imovel.valorAquisicao || imovel.valorPatrimonial || '0');
            const entrada = parseFloat(imovel.entrada || '0');
            const valorFinanciado = valorAquisicao - entrada;
            const taxaJurosAnual = parseFloat(imovel.juros || '0') / 100;
            const taxaJurosMensal = Math.pow(1 + taxaJurosAnual, 1/12) - 1;
            const prazoMeses = parseFloat(String(imovel.prazoAnos || '0')) * 12;
            
            // Calcular meses decorridos entre data início e data venda
            const dataInicioFinanc = new Date(imovel.dataInicio || '2025-01-01');
            const mesesDecorridos = Math.round((dataVenda.getTime() - dataInicioFinanc.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
            
            if (mesesDecorridos > 0 && mesesDecorridos < prazoMeses) {
              // Calcular saldo devedor usando fórmula do financiamento
              const fatorPotencia = Math.pow(1 + taxaJurosMensal, prazoMeses);
              const prestacao = (valorFinanciado * taxaJurosMensal * fatorPotencia) / (fatorPotencia - 1);
              
              // Saldo devedor = VF * [(1+i)^n - (1+i)^p] / [(1+i)^n - 1]
              const fatorTotal = Math.pow(1 + taxaJurosMensal, prazoMeses);
              const fatorPago = Math.pow(1 + taxaJurosMensal, mesesDecorridos);
              saldoDevedorVenda = valorFinanciado * (fatorTotal - fatorPago) / (fatorTotal - 1);
              
              // APLICAR REDUÇÃO POR SEGURO NO SALDO DEVEDOR: Se há provedores ausentes, aplicar % de seguro
              if (provedoresAusentes.length > 0) {
                let percentualSeguroTotal = 0;
                
                // Eduardo (ID: 4) ausente - aplicar seguro Eduardo
                if (provedoresAusentes.includes(4) && imovel.seguroEduardo) {
                  const seguroEduardo = parseFloat(imovel.seguroEduardo) || 0;
                  percentualSeguroTotal += seguroEduardo;
                  console.log(`[SEGURO-SALDO] Eduardo ausente - seguro do imóvel "${imovel.nome}": ${seguroEduardo}%`);
                }
                
                // Mônica (ID: 1) ausente - aplicar seguro Mônica  
                if (provedoresAusentes.includes(1) && imovel.seguroMonica) {
                  const seguroMonica = parseFloat(imovel.seguroMonica) || 0;
                  percentualSeguroTotal += seguroMonica;
                  console.log(`[SEGURO-SALDO] Mônica ausente - seguro do imóvel "${imovel.nome}": ${seguroMonica}%`);
                }
                
                // Aplicar redução total no saldo devedor (limitado a 100%)
                const reducaoPercentual = Math.min(percentualSeguroTotal, 100) / 100;
                const saldoOriginal = saldoDevedorVenda;
                const valorReducaoSaldo = saldoDevedorVenda * reducaoPercentual;
                saldoDevedorVenda = saldoDevedorVenda - valorReducaoSaldo;
                
                console.log(`[SEGURO-SALDO] Imóvel "${imovel.nome}" - Redução saldo devedor: ${percentualSeguroTotal}% | Saldo original: R$ ${saldoOriginal.toLocaleString('pt-BR')} → Final: R$ ${saldoDevedorVenda.toLocaleString('pt-BR')} (economia: R$ ${valorReducaoSaldo.toLocaleString('pt-BR')})`);
              }
              
              console.log(`[VENDA-ATIVOS] ${imovel.nome}: Financiamento - ${mesesDecorridos} meses pagos de ${prazoMeses}, saldo devedor final: R$ ${saldoDevedorVenda.toLocaleString('pt-BR')}`);
            }
          }
          
          // Valor líquido da venda = valor bruto - saldo devedor
          const valorVendaLiquido = valorVendaBruto - saldoDevedorVenda;
          
          console.log(`[VENDA-ATIVOS] ${imovel.nome}: Taxa ${taxaValorizacaoAnual*100}% a.a. = ${(taxaValorizacaoMensal*100).toFixed(6)}% a.m. | ${mesesValorizacao} meses | Valor bruto R$ ${valorVendaBruto.toLocaleString('pt-BR')} - Saldo devedor R$ ${saldoDevedorVenda.toLocaleString('pt-BR')} = Líquido R$ ${valorVendaLiquido.toLocaleString('pt-BR')}`);
          
          // Apropriar valor líquido no mês da venda
          const anoVenda = dataVenda.getFullYear();
          const mesVenda = dataVenda.getMonth() + 1;
          const chaveVenda = `${anoVenda}-${mesVenda.toString().padStart(2, '0')}`;
          
          if (dadosConsolidados.has(chaveVenda)) {
            const dadoMensal = dadosConsolidados.get(chaveVenda);
            
            // CONVERSÃO USD: Se o imóvel está em USD, converter para BRL
            let valorVendaLiquidoBRL = valorVendaLiquido;
            if (imovel.moeda === 'USD') {
              const taxaCambio = await this.getTaxaCambio();
              valorVendaLiquidoBRL = valorVendaLiquido * taxaCambio;
              console.log(`[VENDA-ATIVOS] CONVERSÃO USD: $${valorVendaLiquido.toFixed(4)} → R$ ${valorVendaLiquidoBRL.toFixed(4)} (taxa: R$ ${taxaCambio})`);
            }
            
            dadoMensal.vendaAtivos += valorVendaLiquidoBRL;
            console.log(`[VENDA-ATIVOS] Apropriado valor líquido R$ ${valorVendaLiquidoBRL.toLocaleString('pt-BR')} em ${anoVenda}/${mesVenda.toString().padStart(2, '0')}`);
          } else {
            console.log(`[VENDA-ATIVOS] Período ${anoVenda}/${mesVenda.toString().padStart(2, '0')} não encontrado nos dados mensais`);
          }
        }
      }

      // Processar benefícios INSS
      console.log(`[INSS] Processando benefícios do INSS...`);
      
      // Buscar parâmetro de idade limite para INSS (quando ambos provedores ausentes)
      const idadeLimiteINSS = await this.getIndiceEconomico("Idade Limite INSS");
      const limiteAnosINSS = idadeLimiteINSS ? parseFloat(idadeLimiteINSS.valor) : 21;
      console.log(`[INSS] Idade limite INSS configurada: ${limiteAnosINSS} anos`);
      console.log(`[INSS] Provedores ausentes na simulação:`, provedoresAusentes);
      
      // Buscar todos os membros e seus benefícios INSS
      const membrosFamily = await this.getMembrosFamily(planejamentoId);
      const beneficiosINSS = await db.select().from(inss)
        .where(eq(inss.planejamentoId, planejamentoId));
      
      console.log(`[INSS] Encontrados ${beneficiosINSS.length} benefícios configurados`);
      console.log(`[INSS] Benefícios:`, beneficiosINSS.map(b => ({ id: b.id, membroId: b.membroId, beneficio: b.beneficio })));
      
      for (const beneficio of beneficiosINSS) {
        // Buscar dados do membro
        const membro = membrosFamily.find(m => m.id === beneficio.membroId);
        if (!membro || !membro.dataNascimento) {
          console.log(`[INSS] Membro ID:${beneficio.membroId} não encontrado ou sem data de nascimento - pulando`);
          continue;
        }
        
        // Verificar se o membro é um provedor ausente na simulação
        const provedorAusente = provedoresAusentes.includes(beneficio.membroId || 0);
        
        // Verificar se AMBOS os provedores estão ausentes (Eduardo ID:4 e Mônica ID:1)
        const ambosProvedoresAusentes = provedoresAusentes.includes(4) && provedoresAusentes.includes(1);
        
        let dataConcessao: Date;
        let anoLimiteINSS = anoFinal; // Por padrão, vai até o final do planejamento
        
        if (provedorAusente) {
          // Se o provedor está ausente, benefício INSS inicia imediatamente
          dataConcessao = new Date(dataMinima);
          console.log(`[INSS] 🚨 SIMULAÇÃO: ${membro.nome} está AUSENTE - benefício INSS iniciará imediatamente em ${dataConcessao.toLocaleDateString('pt-BR')}`);
          
          // Se AMBOS provedores estão ausentes, limitar benefícios até dependente mais novo atingir idade limite
          if (ambosProvedoresAusentes) {
            // Buscar dependente mais novo (menor idade)
            const dependentes = membrosFamily.filter(m => m.dependente === true);
            if (dependentes.length > 0) {
              let menorIdadeDependente = 100;
              let dependenteMaisNovo = null;
              
              for (const dependente of dependentes) {
                if (dependente.idade && dependente.idade < menorIdadeDependente) {
                  menorIdadeDependente = dependente.idade;
                  dependenteMaisNovo = dependente;
                }
              }
              
              if (dependenteMaisNovo) {
                const anoAtual = new Date().getFullYear();
                anoLimiteINSS = anoAtual + (limiteAnosINSS - menorIdadeDependente);
                console.log(`[INSS] 🚨 AMBOS PROVEDORES AUSENTES: Benefícios limitados até ${dependenteMaisNovo.nome} atingir ${limiteAnosINSS} anos (ano ${anoLimiteINSS})`);
              }
            }
          }
        } else {
          // Calcular data de concessão normal: data nascimento + idade concessão
          const dataNascimento = new Date(membro.dataNascimento);
          const idadeConcessao = beneficio.idadeConcessao || 65;
          dataConcessao = new Date(dataNascimento);
          dataConcessao.setFullYear(dataNascimento.getFullYear() + idadeConcessao);
          
          console.log(`[INSS] ${membro.nome}: nascimento ${dataNascimento.toLocaleDateString('pt-BR')} + ${idadeConcessao} anos = concessão ${dataConcessao.toLocaleDateString('pt-BR')}`);
          
          // Filtrar apenas datas dentro do período do planejamento
          if (dataConcessao < dataMinima) {
            console.log(`[INSS] Data de concessão ${dataConcessao.toLocaleDateString('pt-BR')} anterior ao início do planejamento - ajustando para data mínima`);
            // Se já deveria estar recebendo, começar a partir da data mínima do planejamento
            dataConcessao.setTime(dataMinima.getTime());
          }
        }
        
        const anoConcessao = dataConcessao.getFullYear();
        const mesConcessao = dataConcessao.getMonth() + 1;
        
        // Apropriar benefício mensalmente a partir da data de concessão até o limite calculado
        for (let ano = anoConcessao; ano <= anoLimiteINSS; ano++) {
          for (let mes = 1; mes <= 12; mes++) {
            // Só começar a partir do mês de concessão no primeiro ano
            if (ano === anoConcessao && mes < mesConcessao) continue;
            
            const dataAtual = new Date(ano, mes - 1, 1);
            // Verificar se está dentro do período válido do planejamento
            if (dataAtual < dataMinima) continue;
            
            const chave = `${ano}-${mes.toString().padStart(2, '0')}`;
            
            if (dadosConsolidados.has(chave)) {
              const dadoMensal = dadosConsolidados.get(chave);
              
              // Converter benefício para BRL se necessário
              let valorBeneficio = parseFloat(beneficio.beneficio || '0');
              if (beneficio.moeda === 'USD') {
                const taxaCambio = await this.getTaxaCambio();
                valorBeneficio = valorBeneficio * taxaCambio;
                console.log(`[INSS] CONVERSÃO USD: $${beneficio.beneficio} → R$ ${valorBeneficio.toFixed(4)} (taxa: R$ ${taxaCambio})`);
              }
              
              dadoMensal.receitaPassiva += valorBeneficio;
              console.log(`[INSS] ${membro.nome}: R$ ${valorBeneficio.toLocaleString('pt-BR')} apropriado em Receitas Passivas ${ano}/${mes.toString().padStart(2, '0')}`);
            } else {
              // Criar entrada se não existir
              const periodo = `${this.obterNomeMes(mes).toLowerCase()}-${ano.toString().slice(-2)}`;
              
              // Converter benefício para BRL se necessário
              let valorBeneficio = parseFloat(beneficio.beneficio || '0');
              if (beneficio.moeda === 'USD') {
                const taxaCambio = await this.getTaxaCambio();
                valorBeneficio = valorBeneficio * taxaCambio;
              }
              
              const novoDado = {
                planejamentoId,
                ano,
                mes,
                periodo,
                data: dataAtual,
                receitaAtiva: 0, receitaPassiva: valorBeneficio, receitaPatrimonio: 0, inss: 0,
                despesasBasicas: 0, despesasDependentes: 0, despesasEstilo: 0, 
                despesasViagens: 0, despesasPatrimoniais: 0,
                financiamento1: 0, financiamento2: 0, financiamento3: 0, 
                financiamento4: 0, financiamento5: 0,
                vendaAtivos: 0, desembolsoObjetivos: 0,
                despesasTotais: 0, receitasTotais: 0,
                cs: 0, portfolioInicial: 0, totalVendas: 0, projetos: 0,
                saving: 0, rentaDolar: 0, portfolioFinal: 0,
                projetosBRL: 0, projetosUSD: 0, caixa: 300000, longevidade: 0,
              };
              
              dadosConsolidados.set(chave, novoDado);
              console.log(`[INSS] Criado novo período ${ano}/${mes.toString().padStart(2, '0')}: R$ ${valorBeneficio.toLocaleString('pt-BR')} para ${membro.nome}`);
            }
          }
        }
      }

      // Processar desembolsos de objetivos
      console.log(`[OBJETIVOS] Processando desembolsos de objetivos...`);
      
      // Buscar todos os objetivos ativos do planejamento
      let objetivosAtivos = await this.getObjetivos(planejamentoId);
      console.log(`[OBJETIVOS] Encontrados ${objetivosAtivos.length} objetivos`);
      console.log(`[OBJETIVOS] Data mínima do planejamento: ${dataMinima.toLocaleDateString('pt-BR')}`);
      
      // SIMULAÇÃO: Filtrar objetivos de provedores ausentes
      if (provedoresAusentes.length > 0) {
        const objetivosAntes = objetivosAtivos.length;
        
        objetivosAtivos = objetivosAtivos.filter(objetivo => {
          const isExcluded = objetivo.membroId && provedoresAusentes.includes(objetivo.membroId);
          if (isExcluded) {
            console.log(`[SIMULAÇÃO] ❌ Excluindo objetivo "${objetivo.nome}" (membro ID: ${objetivo.membroId})`);
          }
          return !isExcluded;
        });
        
        console.log(`[SIMULAÇÃO] Objetivos: ${objetivosAntes} → ${objetivosAtivos.length} (excluídos ${objetivosAntes - objetivosAtivos.length} de provedores ausentes)`);
      }
      
      for (const objetivo of objetivosAtivos) {
        if (objetivo.dataAlvo && objetivo.valorObjetivo) {
          const dataAlvo = new Date(objetivo.dataAlvo);
          const anoAlvo = dataAlvo.getFullYear();
          const mesAlvo = dataAlvo.getMonth() + 1;
          const chaveAlvo = `${anoAlvo}-${mesAlvo.toString().padStart(2, '0')}`;
          
          console.log(`[OBJETIVOS] ${objetivo.nome}: Data alvo ${dataAlvo.toLocaleDateString('pt-BR')}, valor ${objetivo.valorObjetivo}`);
          
          // Verificar se a data alvo está dentro do período válido do planejamento
          if (dataAlvo < dataMinima) {
            console.log(`[OBJETIVOS] Data alvo anterior ao início do planejamento - pulando`);
            continue;
          }
          
          if (dadosConsolidados.has(chaveAlvo)) {
            const dadoMensal = dadosConsolidados.get(chaveAlvo);
            
            // Converter valor para BRL se necessário
            let valorDesembolso = parseFloat(objetivo.valorObjetivo || '0');
            if (objetivo.moeda === 'USD') {
              const taxaCambio = await this.getTaxaCambio();
              valorDesembolso = valorDesembolso * taxaCambio;
              console.log(`[OBJETIVOS] CONVERSÃO USD: $${objetivo.valorObjetivo} → R$ ${valorDesembolso.toFixed(4)} (taxa: R$ ${taxaCambio})`);
            }
            
            dadoMensal.desembolsoObjetivos += valorDesembolso;
            console.log(`[OBJETIVOS] Apropriado desembolso R$ ${valorDesembolso.toLocaleString('pt-BR')} para "${objetivo.nome}" em ${anoAlvo}/${mesAlvo.toString().padStart(2, '0')}`);
          } else {
            // Criar entrada se não existir
            const periodo = `${this.obterNomeMes(mesAlvo).toLowerCase()}-${anoAlvo.toString().slice(-2)}`;
            
            // Converter valor para BRL se necessário
            let valorDesembolso = parseFloat(objetivo.valorObjetivo || '0');
            if (objetivo.moeda === 'USD') {
              const taxaCambio = await this.getTaxaCambio();
              valorDesembolso = valorDesembolso * taxaCambio;
            }
            
            const novoDado = {
              planejamentoId,
              ano: anoAlvo,
              mes: mesAlvo,
              periodo,
              data: dataAlvo,
              receitaAtiva: 0, receitaPassiva: 0, receitaPatrimonio: 0, inss: 0,
              despesasBasicas: 0, despesasDependentes: 0, despesasEstilo: 0, 
              despesasViagens: 0, despesasPatrimoniais: 0,
              financiamento1: 0, financiamento2: 0, financiamento3: 0, 
              financiamento4: 0, financiamento5: 0,
              vendaAtivos: 0,
              desembolsoObjetivos: valorDesembolso,
              despesasTotais: 0, receitasTotais: 0,
              cs: 0, portfolioInicial: 0, totalVendas: 0, projetos: 0,
              saving: 0, rentaDolar: 0, portfolioFinal: 0,
              projetosBRL: 0, projetosUSD: 0, caixa: 300000, longevidade: 0,
            };
            
            dadosConsolidados.set(chaveAlvo, novoDado);
            console.log(`[OBJETIVOS] Criado novo período ${anoAlvo}/${mesAlvo.toString().padStart(2, '0')}: R$ ${valorDesembolso.toLocaleString('pt-BR')} para "${objetivo.nome}"`);
          }
        }
      }

      // Calcular totais e campos derivados
      const dadosOrdenados = Array.from(dadosConsolidados.values()).sort((a, b) => {
        if (a.ano !== b.ano) return a.ano - b.ano;
        return a.mes - b.mes;
      });

      // Buscar valor real do portfolio no banco de dados
      const portfolioAtual = await this.getPortfolioInvestimentos(planejamentoId);
      let portfolioAcumulado = portfolioAtual.reduce((total, inv) => total + parseFloat(inv.valorAtual), 0);
      
      console.log(`[DADOS] Portfolio inicial calculado: R$ ${portfolioAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
      
      // Se não houver investimentos, manter valor zero
      if (portfolioAcumulado === 0) {
        console.log(`[DADOS] Portfolio vazio - mantendo valor zero`);
      }
      
      // Adicionar capital segurado adicional se fornecido
      if (capitalSeguradoAdicional && capitalSeguradoAdicional > 0) {
        portfolioAcumulado += capitalSeguradoAdicional;
        console.log(`[DADOS] 🎯 Capital segurado adicional: R$ ${capitalSeguradoAdicional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
        console.log(`[DADOS] 🎯 Portfolio inicial final: R$ ${portfolioAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
      }
      
      for (const dado of dadosOrdenados) {
        // Calcular totais com verificação de segurança para evitar NaN
        const receitaAtiva = isNaN(dado.receitaAtiva) ? 0 : dado.receitaAtiva;
        const receitaPassiva = isNaN(dado.receitaPassiva) ? 0 : dado.receitaPassiva;
        const receitaPatrimonio = isNaN(dado.receitaPatrimonio) ? 0 : dado.receitaPatrimonio;
        const inss = isNaN(dado.inss) ? 0 : dado.inss;
        const vendaAtivos = isNaN(dado.vendaAtivos) ? 0 : dado.vendaAtivos;
        
        dado.receitasTotais = receitaAtiva + receitaPassiva + receitaPatrimonio + inss + vendaAtivos;
        
        const despesasBasicas = isNaN(dado.despesasBasicas) ? 0 : dado.despesasBasicas;
        const despesasDependentes = isNaN(dado.despesasDependentes) ? 0 : dado.despesasDependentes;
        const despesasEstilo = isNaN(dado.despesasEstilo) ? 0 : dado.despesasEstilo;
        const despesasViagens = isNaN(dado.despesasViagens) ? 0 : dado.despesasViagens;
        const despesasPatrimoniais = isNaN(dado.despesasPatrimoniais) ? 0 : dado.despesasPatrimoniais;
        const financiamento1 = isNaN(dado.financiamento1) ? 0 : dado.financiamento1;
        const financiamento2 = isNaN(dado.financiamento2) ? 0 : dado.financiamento2;
        const financiamento3 = isNaN(dado.financiamento3) ? 0 : dado.financiamento3;
        const financiamento4 = isNaN(dado.financiamento4) ? 0 : dado.financiamento4;
        const financiamento5 = isNaN(dado.financiamento5) ? 0 : dado.financiamento5;
        const desembolsoObjetivos = isNaN(dado.desembolsoObjetivos) ? 0 : dado.desembolsoObjetivos;
        
        dado.despesasTotais = despesasBasicas + despesasDependentes + despesasEstilo + 
                              despesasViagens + despesasPatrimoniais + financiamento1 + 
                              financiamento2 + financiamento3 + financiamento4 + financiamento5 + 
                              desembolsoObjetivos;

        // Calcular saving (receitas + venda de ativos - despesas)
        dado.saving = dado.receitasTotais - dado.despesasTotais;
        
        // Log de debug para detectar problemas
        if (isNaN(dado.receitasTotais) || isNaN(dado.despesasTotais) || isNaN(dado.saving)) {
          console.log(`[ERRO-NaN] ${dado.ano}/${dado.mes}: receitas=${dado.receitasTotais}, despesas=${dado.despesasTotais}, saving=${dado.saving}`);
          console.log(`[ERRO-NaN] Componentes receitas: ativa=${receitaAtiva}, passiva=${receitaPassiva}, patrimonio=${receitaPatrimonio}, inss=${inss}, vendas=${vendaAtivos}`);
        }

        // Simular evolução do portfolio usando Taxa de Juros Real
        dado.portfolioInicial = portfolioAcumulado;
        
        // Buscar Taxa de Juros Real atual dos índices econômicos
        const taxaJurosReal = await this.getTaxaJurosReal();
        // CORREÇÃO: A taxa já vem como decimal (0.04 = 4%), não dividir por 100
        const taxaAnualDecimal = taxaJurosReal; // Valor já em decimal
        const taxaMensalDecimal = Math.pow(1 + taxaAnualDecimal, 1/12) - 1;
        const retornoMensal = portfolioAcumulado * taxaMensalDecimal;
        
        // CORRETO: Salvar o rendimento na coluna rentaDolar
        dado.rentaDolar = retornoMensal;
        
        dado.portfolioFinal = portfolioAcumulado + retornoMensal + dado.saving;
        portfolioAcumulado = dado.portfolioFinal;

        // Calcular longevidade (valor que sobra para sustentabilidade)
        dado.longevidade = dado.portfolioFinal - dado.caixa;
      }

      // Inserir dados no banco
      if (dadosOrdenados.length > 0) {
        await db.insert(dadosMensais).values(dadosOrdenados);
        console.log(`[DADOS] Inseridos ${dadosOrdenados.length} registros mensais`);
      }

      console.log(`[DADOS] Regeneração concluída com sucesso!`);
    } catch (error) {
      console.error(`[DADOS] Erro ao regenerar dados mensais:`, error);
      throw error;
    }
  }

  private obterNomeMes(mes: number): string {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return meses[mes - 1] || 'Janeiro';
  }

  private obterMesesAtivos(item: Receita | Despesa, ano: number): number[] {
    console.log(`[MESES] Processando item ${item.id} para ano ${ano}`);
    console.log(`[MESES] Frequência: ${item.frequencia}`);
    
    // Se tem meses específicos definidos
    if (item.mesesRecorrencia && item.mesesRecorrencia.trim()) {
      const meses = item.mesesRecorrencia.split(',').map(m => parseInt(m.trim()));
      console.log(`[MESES] Meses específicos definidos:`, meses);
      return meses;
    }

    // Determinar meses baseado na frequência
    switch (item.frequencia?.toLowerCase()) {
      case 'mensal':
        const mesesMensais = Array.from({ length: 12 }, (_, i) => i + 1);
        console.log(`[MESES] Mensal - gerando meses:`, mesesMensais);
        return mesesMensais;
      case 'personalizada':
        // Para personalizada, usar os meses específicos (já tratados acima)
        console.log(`[MESES] Personalizada - sem meses específicos definidos`);
        return [];
      case 'anual':
        // Para anual, assumir janeiro
        const mesesAnuais = [1];
        console.log(`[MESES] Anual - gerando meses:`, mesesAnuais);
        return mesesAnuais;
      case 'unica':
        const mesesUnicos = [1];
        console.log(`[MESES] Única - gerando meses:`, mesesUnicos);
        return mesesUnicos;
      default:
        console.log(`[MESES] Frequência desconhecida: ${item.frequencia}`);
        return [];
    }
  }

  /**
   * METODOLOGIA CIKLUS: Calcular ano limite para despesas eternas
   * LÓGICA UNIVERSAL: Para qualquer planejamento, os dados mensais devem ir até 
   * quando o PROVEDOR mais novo completar 100 anos de idade
   */
  private calcularAnoLimiteDespesasEternas(membros: any[]): number {
    const anoAtual = new Date().getFullYear();
    
    if (!membros || membros.length === 0) {
      console.log(`[METODOLOGIA-CIKLUS] ⚠️ Nenhum membro encontrado - usando limite padrão de 100 anos (idade 30)`);
      return anoAtual + (100 - 30); // Assumir provedor de 30 anos como padrão
    }

    // Filtrar apenas os PROVEDORES (dependente = false)
    const provedores = membros.filter(membro => membro.dependente === false);
    
    if (provedores.length === 0) {
      console.log(`[METODOLOGIA-CIKLUS] ⚠️ Nenhum provedor encontrado - usando limite padrão de 100 anos (idade 30)`);
      return anoAtual + (100 - 30);
    }

    // Encontrar o PROVEDOR mais novo (menor idade) baseado na data de nascimento
    let provedorMaisNovo = null;
    let menorIdade = 100; // Idade inicial alta
    
    for (const provedor of provedores) {
      let idadeProvedor = provedor.idade;
      
      // Se não tem idade direta, calcular pela data de nascimento
      if (!idadeProvedor && provedor.dataNascimento) {
        const dataNasc = new Date(provedor.dataNascimento);
        const hoje = new Date();
        idadeProvedor = hoje.getFullYear() - dataNasc.getFullYear();
        
        // Ajustar se ainda não fez aniversário este ano
        if (hoje.getMonth() < dataNasc.getMonth() || 
            (hoje.getMonth() === dataNasc.getMonth() && hoje.getDate() < dataNasc.getDate())) {
          idadeProvedor--;
        }
      }
      
      if (idadeProvedor && idadeProvedor < menorIdade) {
        menorIdade = idadeProvedor;
        provedorMaisNovo = provedor;
        console.log(`[METODOLOGIA-CIKLUS] Provedor ${provedor.nome} idade ${idadeProvedor} - candidato a mais novo`);
      }
    }

    // Garantir limite mínimo razoável
    if (menorIdade === 100 || !provedorMaisNovo) {
      console.log(`[METODOLOGIA-CIKLUS] ⚠️ Nenhuma idade válida encontrada entre provedores - usando idade padrão 30 anos`);
      menorIdade = 30;
    }

    // Calcular ano quando o PROVEDOR mais novo completará 100 anos
    const anoLimite = anoAtual + (100 - menorIdade);
    
    console.log(`[METODOLOGIA-CIKLUS] ✅ PROVEDOR mais novo: ${provedorMaisNovo?.nome || 'Padrão'} (${menorIdade} anos)`);
    console.log(`[METODOLOGIA-CIKLUS] ✅ Dados mensais calculados até: ${anoLimite} (quando completar 100 anos)`);
    console.log(`[METODOLOGIA-CIKLUS] ✅ Período total de análise: ${anoLimite - anoAtual} anos`);
    
    return anoLimite;
  }

  private obterPercentualMes(item: Receita | Despesa, mes: number): number {
    // Se tem percentuais específicos por mês (ex: "11:50,12:50" para 13º)
    if ((item as any).percentualMensal && (item as any).percentualMensal.trim()) {
      const percentuais = (item as any).percentualMensal.split(',');
      for (const p of percentuais) {
        const [mesP, valorP] = p.split(':');
        if (parseInt(mesP.trim()) === mes) {
          return parseFloat(valorP.trim());
        }
      }
      return 0; // Se o mês não está na lista, valor 0
    }

    // Caso padrão: 100% do valor
    return 100;
  }

  async getDadosMensais(planejamentoId: number, ano?: number, moeda: string = 'BRL'): Promise<any[]> {
    let query = db.select().from(dadosMensais)
      .where(eq(dadosMensais.planejamentoId, planejamentoId));

    if (ano) {
      query = db.select().from(dadosMensais)
        .where(and(
          eq(dadosMensais.planejamentoId, planejamentoId),
          eq(dadosMensais.ano, ano)
        ));
    }

    const result = await query.orderBy(dadosMensais.ano, dadosMensais.mes);

    // Se a moeda solicitada for USD, converter todos os valores
    if (moeda === 'USD') {
      const taxaCambio = await this.getTaxaCambio();
      return result.map(dado => ({
        ...dado,
        receitaAtiva: this.converterParaUSD(parseFloat(dado.receitaAtiva || '0'), taxaCambio).toString(),
        receitaPassiva: this.converterParaUSD(parseFloat(dado.receitaPassiva || '0'), taxaCambio).toString(),
        receitaPatrimonio: this.converterParaUSD(parseFloat(dado.receitaPatrimonio || '0'), taxaCambio).toString(),
        inss: this.converterParaUSD(parseFloat(dado.inss || '0'), taxaCambio).toString(),
        vendaAtivos: this.converterParaUSD(parseFloat(dado.vendaAtivos || '0'), taxaCambio).toString(),
        receitasTotais: this.converterParaUSD(parseFloat(dado.receitasTotais || '0'), taxaCambio).toString(),
        despesasBasicas: this.converterParaUSD(parseFloat(dado.despesasBasicas || '0'), taxaCambio).toString(),
        despesasDependentes: this.converterParaUSD(parseFloat(dado.despesasDependentes || '0'), taxaCambio).toString(),
        despesasEstilo: this.converterParaUSD(parseFloat(dado.despesasEstilo || '0'), taxaCambio).toString(),
        despesasViagens: this.converterParaUSD(parseFloat(dado.despesasViagens || '0'), taxaCambio).toString(),
        despesasPatrimoniais: this.converterParaUSD(parseFloat(dado.despesasPatrimoniais || '0'), taxaCambio).toString(),
        financiamento1: this.converterParaUSD(parseFloat(dado.financiamento1 || '0'), taxaCambio).toString(),
        financiamento2: this.converterParaUSD(parseFloat(dado.financiamento2 || '0'), taxaCambio).toString(),
        financiamento3: this.converterParaUSD(parseFloat(dado.financiamento3 || '0'), taxaCambio).toString(),
        financiamento4: this.converterParaUSD(parseFloat(dado.financiamento4 || '0'), taxaCambio).toString(),
        financiamento5: this.converterParaUSD(parseFloat(dado.financiamento5 || '0'), taxaCambio).toString(),
        despesasTotais: this.converterParaUSD(parseFloat(dado.despesasTotais || '0'), taxaCambio).toString(),
        saving: this.converterParaUSD(parseFloat(dado.saving || '0'), taxaCambio).toString(),
        portfolioInicial: this.converterParaUSD(parseFloat(dado.portfolioInicial || '0'), taxaCambio).toString(),
        portfolioFinal: this.converterParaUSD(parseFloat(dado.portfolioFinal || '0'), taxaCambio).toString(),
        caixa: this.converterParaUSD(parseFloat(dado.caixa || '0'), taxaCambio).toString(),
        longevidade: this.converterParaUSD(parseFloat(dado.longevidade || '0'), taxaCambio).toString(),
      }));
    }

    return result;
  }

  private async getTaxaCambio(): Promise<number> {
    const [indice] = await db.select()
      .from(indicesEconomicos)
      .where(eq(indicesEconomicos.nome, 'Dólar'));
    
    return indice ? parseFloat(indice.valor) : 5.45; // Fallback se não encontrar
  }

  private converterParaUSD(valorBRL: number, taxaCambio: number): number {
    return parseFloat((valorBRL / taxaCambio).toFixed(4));
  }

  // Mood Insights
  async getMoodInsights(planejamentoId: number): Promise<MoodInsight[]> {
    const now = new Date();
    return await db.select().from(moodInsights)
      .where(and(
        eq(moodInsights.planejamentoId, planejamentoId),
        // Only get insights that haven't expired
        // gte(moodInsights.validUntil, now)
      ))
      .orderBy(desc(moodInsights.createdAt));
  }

  async createMoodInsight(insight: InsertMoodInsight): Promise<MoodInsight> {
    const [newInsight] = await db
      .insert(moodInsights)
      .values(insight)
      .returning();
    return newInsight;
  }

  async clearMoodInsights(planejamentoId: number): Promise<void> {
    await db.delete(moodInsights)
      .where(eq(moodInsights.planejamentoId, planejamentoId));
  }

  // Simulação de Provedores
  async getSimulacaoProvedores(planejamentoId: number): Promise<SimulacaoProvedor[]> {
    console.log(`🔍 [DEBUG] Buscando simulações para planejamento ${planejamentoId}`);
    const result = await db.select()
      .from(simulacaoProvedores)
      .where(eq(simulacaoProvedores.planejamentoId, planejamentoId))
      .orderBy(desc(simulacaoProvedores.createdAt));
    console.log(`🔍 [DEBUG] Encontrou ${result.length} simulações:`, JSON.stringify(result, null, 2));
    return result;
  }

  async createSimulacaoProvedor(simulacao: InsertSimulacaoProvedor): Promise<SimulacaoProvedor> {
    const [newSimulacao] = await db
      .insert(simulacaoProvedores)
      .values(simulacao)
      .returning();
    return newSimulacao;
  }

  async updateSimulacaoProvedor(id: number, simulacao: Partial<InsertSimulacaoProvedor>): Promise<SimulacaoProvedor | undefined> {
    const [updated] = await db
      .update(simulacaoProvedores)
      .set(simulacao)
      .where(eq(simulacaoProvedores.id, id))
      .returning();
    return updated;
  }

  async deleteSimulacaoProvedor(id: number): Promise<boolean> {
    const result = await db.delete(simulacaoProvedores)
      .where(eq(simulacaoProvedores.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async upsertSimulacaoProvedor(simulacao: InsertSimulacaoProvedor): Promise<SimulacaoProvedor> {
    // Verificar se já existe uma simulação para este membro
    const [existing] = await db.select()
      .from(simulacaoProvedores)
      .where(and(
        eq(simulacaoProvedores.planejamentoId, simulacao.planejamentoId),
        eq(simulacaoProvedores.membroId, simulacao.membroId)
      ));

    if (existing) {
      // Atualizar existente
      const [updated] = await db
        .update(simulacaoProvedores)
        .set({
          status: simulacao.status,
          dataSimulacao: simulacao.dataSimulacao,
          observacoes: simulacao.observacoes,
          updatedAt: new Date(),
        })
        .where(eq(simulacaoProvedores.id, existing.id))
        .returning();
      return updated;
    } else {
      // Criar novo
      const [newSimulacao] = await db
        .insert(simulacaoProvedores)
        .values(simulacao)
        .returning();
      return newSimulacao;
    }
  }
}

export const storage = new DatabaseStorage();
