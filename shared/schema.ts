import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("cliente"), // administrador, planejador, cliente
  status: varchar("status").notNull().default("ativo"), // ativo, inativo, suspenso
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const planejamentos = pgTable("planejamentos", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  userId: varchar("user_id").notNull().references(() => users.id),
  planejadorId: varchar("planejador_id").references(() => users.id),
  status: varchar("status").notNull().default("ativo"), // ativo, inativo, concluido
  dataInicio: date("data_inicio").notNull(),
  dataFim: date("data_fim"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const membrosFamily = pgTable("membros_family", {
  id: serial("id").primaryKey(),
  planejamentoId: integer("planejamento_id").notNull().references(() => planejamentos.id),
  nome: varchar("nome", { length: 255 }).notNull(),
  parentesco: varchar("parentesco").notNull(), // conjuge, filho, pai, mae, etc
  idade: integer("idade").notNull(),
  dataNascimento: date("data_nascimento"), // Nova coluna para data de nascimento
  dependente: boolean("dependente").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const imoveis = pgTable("imoveis", {
  id: serial("id").primaryKey(),
  planejamentoId: integer("planejamento_id").notNull().references(() => planejamentos.id),
  nome: varchar("nome", { length: 255 }).notNull(),

  endereco: varchar("endereco", { length: 500 }), // endereço completo
  area: decimal("area", { precision: 10, scale: 2 }), // área em m²
  quartos: integer("quartos"),
  banheiros: integer("banheiros"),
  vagas: integer("vagas"),
  moeda: varchar("moeda").notNull().default("BRL"),
  valorPatrimonial: varchar("valor_patrimonial").notNull().default("0"),
  valorAquisicao: varchar("valor_aquisicao").notNull().default("0"), 
  taxaValorizacao: varchar("taxa_valorizacao").default("0"), // percentual anual
  dataAquisicao: date("data_aquisicao"),
  dataVenda: date("data_venda"),
  status: varchar("status").notNull().default("ativo"), // ativo, vendido, alugado
  rendaAluguel: varchar("renda_aluguel").default("0"), // se estiver alugado
  financiamento: varchar("financiamento").notNull().default("NAO"), // SIM, NAO
  // Campos de financiamento (só preenchidos se financiamento = SIM)
  tipoAmortizacao: varchar("tipo_amortizacao").default("SAC"), // SAC, PRICE
  valorFinanciado: varchar("valor_financiado").default("0"),
  entrada: varchar("entrada").default("0"),
  juros: varchar("juros").default("0"), // Taxa de juros anual
  dataInicio: date("data_inicio"),
  prazoAnos: integer("prazo_anos"), // em anos
  prestacaoMensal: varchar("prestacao_mensal").default("0"),
  saldoDevedor: varchar("saldo_devedor").default("0"),
  percentualRendaProvedorA: varchar("percentual_renda_provedor_a").default("0"),
  percentualRendaProvedorB: varchar("percentual_renda_provedor_b").default("0"),
  // Campos de seguro - percentual de cobertura em caso de ausência de cada provedor
  seguroEduardo: varchar("seguro_eduardo").default("0"), // % de seguro se Eduardo ausente
  seguroMonica: varchar("seguro_monica").default("0"), // % de seguro se Mônica ausente  
  observacoes: text("observacoes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const portfolioInvestimentos = pgTable("portfolio_investimentos", {
  id: serial("id").primaryKey(),
  planejamentoId: integer("planejamento_id").notNull().references(() => planejamentos.id),
  categoria: varchar("categoria").notNull(), // renda_fixa, acoes, fundos_imobiliarios, criptomoedas, reserva_emergencia
  ativo: varchar("ativo").notNull(),
  quantidade: decimal("quantidade", { precision: 15, scale: 8 }).notNull(),
  precoMedio: decimal("preco_medio", { precision: 15, scale: 8 }).notNull(),
  valorAtual: decimal("valor_atual", { precision: 15, scale: 2 }).notNull(),
  moeda: varchar("moeda").notNull().default("BRL"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const receitas = pgTable("receitas", {
  id: serial("id").primaryKey(),
  planejamentoId: integer("planejamento_id").notNull().references(() => planejamentos.id),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  categoria: varchar("categoria").notNull(), // salario, investimentos, aluguel, outros
  valor: decimal("valor", { precision: 15, scale: 2 }).notNull(),
  moeda: varchar("moeda").notNull().default("BRL"),
  membro: varchar("membro"), // opcional, pode ser associado a um membro
  imovel: varchar("imovel"), // opcional, pode ser associado a um imóvel
  dataInicio: varchar("data_inicio").notNull(), // formato MM/AAAA
  prazoAnos: integer("prazo_anos"), // Prazo em anos
  dataFim: varchar("data_fim"), // formato MM/AAAA - calculado automaticamente se prazoAnos informado
  frequencia: varchar("frequencia").notNull(), // mensal, anual, unica
  mesesRecorrencia: varchar("meses_recorrencia", { length: 50 }), // "1,2,3,4,5,6,7,8,9,10" para IPTU
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const despesas = pgTable("despesas", {
  id: serial("id").primaryKey(),
  planejamentoId: integer("planejamento_id").notNull().references(() => planejamentos.id),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  categoria: varchar("categoria").notNull(), // moradia, educacao, saude, lazer, outros
  valor: decimal("valor", { precision: 15, scale: 2 }).notNull(),
  moeda: varchar("moeda").notNull().default("BRL"),
  membro: varchar("membro"), // opcional, pode ser associado a um membro
  imovel: varchar("imovel"), // opcional, pode ser associado a um imóvel
  dataInicio: varchar("data_inicio").notNull(), // formato MM/AAAA
  prazoAnos: integer("prazo_anos"), // Prazo em anos
  dataFim: varchar("data_fim"), // formato MM/AAAA - calculado automaticamente se prazoAnos informado
  frequencia: varchar("frequencia").notNull(), // mensal, anual, unica
  mesesRecorrencia: varchar("meses_recorrencia", { length: 50 }), // "1,2,3,4,5,6,7,8,9,10" para IPTU
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Removida versão anterior do objetivos - substituída pela versão mais avançada abaixo

export const indicesEconomicos = pgTable("indices_economicos", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 50 }).notNull(), // CDI, SELIC, IPCA, USD_BRL, Taxa de Juros Real
  valor: decimal("valor", { precision: 10, scale: 4 }).notNull(),
  data: date("data").notNull(),
  tipo: varchar("tipo").notNull(), // taxa, cambio, inflacao, manual
  unidade: varchar("unidade").notNull().default("%"), // %, R$
  manual: boolean("manual").notNull().default(false), // true para índices definidos pelo usuário (Taxa Juros Real)
  atualizacaoAutomatica: boolean("atualizacao_automatica").notNull().default(true), // false para índices manuais
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabela DADOS - Aba central para análises (replicando metodologia Excel)
export const dadosMensais = pgTable("dados_mensais", {
  id: serial("id").primaryKey(),
  planejamentoId: integer("planejamento_id").notNull().references(() => planejamentos.id),
  ano: integer("ano").notNull(),
  mes: integer("mes").notNull(), // 1-12
  periodo: varchar("periodo").notNull(), // "janeiro-25", "fevereiro-25"
  data: date("data").notNull(), // YYYY-MM-01 
  
  // Despesas por Categoria (consolidadas)
  despesasBasicas: decimal("despesas_basicas", { precision: 15, scale: 2 }).default("0"),
  despesasDependentes: decimal("despesas_dependentes", { precision: 15, scale: 2 }).default("0"),
  despesasEstilo: decimal("despesas_estilo", { precision: 15, scale: 2 }).default("0"),
  despesasViagens: decimal("despesas_viagens", { precision: 15, scale: 2 }).default("0"),
  despesasPatrimoniais: decimal("despesas_patrimoniais", { precision: 15, scale: 2 }).default("0"),
  
  // Financiamentos
  financiamento1: decimal("financiamento_1", { precision: 15, scale: 2 }).default("0"),
  financiamento2: decimal("financiamento_2", { precision: 15, scale: 2 }).default("0"),
  financiamento3: decimal("financiamento_3", { precision: 15, scale: 2 }).default("0"),
  financiamento4: decimal("financiamento_4", { precision: 15, scale: 2 }).default("0"),
  financiamento5: decimal("financiamento_5", { precision: 15, scale: 2 }).default("0"),
  
  // Receitas por Categoria (consolidadas)
  receitaAtiva: decimal("receita_ativa", { precision: 15, scale: 2 }).default("0"),
  receitaPassiva: decimal("receita_passiva", { precision: 15, scale: 2 }).default("0"),
  receitaPatrimonio: decimal("receita_patrimonio", { precision: 15, scale: 2 }).default("0"),
  inss: decimal("inss", { precision: 15, scale: 2 }).default("0"),
  
  // Venda de Ativos
  vendaAtivos: decimal("venda_ativos", { precision: 15, scale: 2 }).default("0"),
  
  // Desembolso para Objetivos
  desembolsoObjetivos: decimal("desembolso_objetivos", { precision: 15, scale: 2 }).default("0"),
  
  // Totais Calculados
  despesasTotais: decimal("despesas_totais", { precision: 15, scale: 2 }).default("0"),
  receitasTotais: decimal("receitas_totais", { precision: 15, scale: 2 }).default("0"),
  
  // Campos de Análise Financeira
  cs: decimal("cs", { precision: 15, scale: 2 }).default("0"), // Cash Flow
  portfolioInicial: decimal("portfolio_inicial", { precision: 15, scale: 2 }).default("0"),
  totalVendas: decimal("total_vendas", { precision: 15, scale: 2 }).default("0"),
  projetos: decimal("projetos", { precision: 15, scale: 2 }).default("0"),
  saving: decimal("saving", { precision: 15, scale: 2 }).default("0"),
  rentaDolar: decimal("renta_dolar", { precision: 15, scale: 2 }).default("0"),
  portfolioFinal: decimal("portfolio_final", { precision: 15, scale: 2 }).default("0"),
  projetosBRL: decimal("projetos_brl", { precision: 15, scale: 2 }).default("0"),
  projetosUSD: decimal("projetos_usd", { precision: 15, scale: 2 }).default("0"),
  caixa: decimal("caixa", { precision: 15, scale: 2 }).default("0"),
  longevidade: decimal("longevidade", { precision: 15, scale: 2 }).default("0"),
  
  // Metadados
  geradoEm: timestamp("gerado_em").defaultNow(),
  versao: integer("versao").default(1), // para controle de atualizações
});

// Tabela de detalhes para drill-down granular
export const dadosDetalhados = pgTable("dados_detalhados", {
  id: serial("id").primaryKey(),
  dadoMensalId: integer("dado_mensal_id").notNull().references(() => dadosMensais.id),
  planejamentoId: integer("planejamento_id").notNull().references(() => planejamentos.id),
  ano: integer("ano").notNull(),
  mes: integer("mes").notNull(),
  
  // Referência ao item original
  itemId: integer("item_id").notNull(), // ID da receita ou despesa original
  itemTipo: varchar("item_tipo").notNull(), // "receita" ou "despesa"
  itemDescricao: varchar("item_descricao").notNull(),
  itemCategoria: varchar("item_categoria").notNull(),
  itemValor: decimal("item_valor", { precision: 15, scale: 2 }).notNull(),
  itemMoeda: varchar("item_moeda").default("BRL"),
  
  // Metadados para drill-down
  geradoEm: timestamp("gerado_em").defaultNow(),
});

// Tabela para insights baseados em humor financeiro
export const moodInsights = pgTable("mood_insights", {
  id: serial("id").primaryKey(),
  planejamentoId: integer("planejamento_id").notNull().references(() => planejamentos.id),
  mood: varchar("mood").notNull(), // "optimistic", "cautious", "stressed", "confident", "planning"
  score: decimal("score", { precision: 5, scale: 2 }).notNull(), // 0-100
  primaryInsight: text("primary_insight").notNull(),
  secondaryInsight: text("secondary_insight"),
  actionItem: text("action_item").notNull(),
  category: varchar("category").notNull(), // "cash_flow", "investments", "goals", "debt", "savings"
  priority: varchar("priority").notNull().default("medium"), // "high", "medium", "low"
  dataPoints: jsonb("data_points"), // Stores calculation details
  validUntil: timestamp("valid_until").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabela para simulação de status dos provedores (para demonstrar impacto de falecimento)
export const simulacaoProvedores = pgTable("simulacao_provedores", {
  id: serial("id").primaryKey(),
  planejamentoId: integer("planejamento_id").notNull().references(() => planejamentos.id),
  membroId: integer("membro_id").notNull().references(() => membrosFamily.id),
  status: varchar("status").notNull().default("ativo"), // ativo, ausente, inválido
  dataSimulacao: date("data_simulacao"), // Data a partir da qual considerar ausência/invalidez
  observacoes: text("observacoes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabela de Objetivos Financeiros
export const objetivos = pgTable("objetivos", {
  id: serial("id").primaryKey(),
  planejamentoId: integer("planejamento_id").notNull().references(() => planejamentos.id),
  membroId: integer("membro_id").references(() => membrosFamily.id), // vincula ao membro da família
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  categoria: varchar("categoria").notNull(), // "emergencia", "aposentadoria", "casa", "educacao", "viagem", "investimento", "outros"
  valorObjetivo: decimal("valor_objetivo", { precision: 15, scale: 2 }).notNull(),
  valorAtual: decimal("valor_atual", { precision: 15, scale: 2 }).default("0"),
  moeda: varchar("moeda").notNull().default("BRL"),
  prioridade: integer("prioridade").notNull().default(1), // ordem numérica de prioridade (1 = mais prioritário)
  dataAlvo: date("data_alvo"), // nova data alvo mais simples
  status: varchar("status").notNull().default("ativo"), // "ativo", "pausado", "concluido", "cancelado"
  aporteManual: decimal("aporte_manual", { precision: 15, scale: 2 }).default("0"), // aporte mensal sugerido
  estrategia: varchar("estrategia"), // "conservadora", "moderada", "agressiva"
  observacoes: text("observacoes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabela de INSS (Previdência Social)
export const inss = pgTable("inss", {
  id: serial("id").primaryKey(),
  planejamentoId: integer("planejamento_id").notNull().references(() => planejamentos.id),
  membroId: integer("membro_id").references(() => membrosFamily.id), // vincula ao membro da família
  idadeConcessao: integer("idade_concessao").notNull(), // idade para concessão do benefício
  beneficio: decimal("beneficio", { precision: 15, scale: 2 }).notNull(),
  moeda: varchar("moeda").notNull().default("BRL"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabela de Seguros de Mercado
export const seguros = pgTable("seguros", {
  id: serial("id").primaryKey(),
  planejamentoId: integer("planejamento_id").notNull().references(() => planejamentos.id),
  membroId: integer("membro_id").references(() => membrosFamily.id), // vincula ao membro da família
  cobertura: varchar("cobertura").notNull(), // "vida", "invalidez"
  seguradora: varchar("seguradora", { length: 255 }).notNull(),
  cs: decimal("cs", { precision: 15, scale: 2 }).notNull(), // Capital Segurado
  custo: decimal("custo", { precision: 15, scale: 2 }).notNull(),
  moeda: varchar("moeda").notNull().default("BRL"),
  frequencia: varchar("frequencia").notNull().default("mensal"), // "mensal", "anual", "semestral"
  csSugerido: decimal("cs_sugerido", { precision: 15, scale: 2 }).notNull(), // CS Sugerido
  observacoes: text("observacoes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  planejamentos: many(planejamentos),
  planejamentosAdvisor: many(planejamentos),
}));

export const planejamentosRelations = relations(planejamentos, ({ one, many }) => ({
  user: one(users, {
    fields: [planejamentos.userId],
    references: [users.id],
  }),
  planejador: one(users, {
    fields: [planejamentos.planejadorId],
    references: [users.id],
  }),
  membrosFamily: many(membrosFamily),
  imoveis: many(imoveis),
  portfolioInvestimentos: many(portfolioInvestimentos),
  receitas: many(receitas),
  despesas: many(despesas),
  objetivos: many(objetivos),
  inss: many(inss),
  seguros: many(seguros),
}));

export const membrosFamilyRelations = relations(membrosFamily, ({ one }) => ({
  planejamento: one(planejamentos, {
    fields: [membrosFamily.planejamentoId],
    references: [planejamentos.id],
  }),
}));

export const imoveisRelations = relations(imoveis, ({ one }) => ({
  planejamento: one(planejamentos, {
    fields: [imoveis.planejamentoId],
    references: [planejamentos.id],
  }),
}));

export const portfolioInvestimentosRelations = relations(portfolioInvestimentos, ({ one }) => ({
  planejamento: one(planejamentos, {
    fields: [portfolioInvestimentos.planejamentoId],
    references: [planejamentos.id],
  }),
}));

export const receitasRelations = relations(receitas, ({ one }) => ({
  planejamento: one(planejamentos, {
    fields: [receitas.planejamentoId],
    references: [planejamentos.id],
  }),
}));

export const despesasRelations = relations(despesas, ({ one }) => ({
  planejamento: one(planejamentos, {
    fields: [despesas.planejamentoId],
    references: [planejamentos.id],
  }),
}));

export const objetivosRelations = relations(objetivos, ({ one }) => ({
  planejamento: one(planejamentos, {
    fields: [objetivos.planejamentoId],
    references: [planejamentos.id],
  }),
  membro: one(membrosFamily, {
    fields: [objetivos.membroId],
    references: [membrosFamily.id],
  }),
}));

export const inssRelations = relations(inss, ({ one }) => ({
  planejamento: one(planejamentos, {
    fields: [inss.planejamentoId],
    references: [planejamentos.id],
  }),
  membro: one(membrosFamily, {
    fields: [inss.membroId],
    references: [membrosFamily.id],
  }),
}));

export const segurosRelations = relations(seguros, ({ one }) => ({
  planejamento: one(planejamentos, {
    fields: [seguros.planejamentoId],
    references: [planejamentos.id],
  }),
  membro: one(membrosFamily, {
    fields: [seguros.membroId],
    references: [membrosFamily.id],
  }),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Tipos para DADOS
export type DadoMensal = typeof dadosMensais.$inferSelect;
export type InsertDadoMensal = typeof dadosMensais.$inferInsert;
export type DadoDetalhado = typeof dadosDetalhados.$inferSelect;
export type InsertDadoDetalhado = typeof dadosDetalhados.$inferInsert;

export type InsertPlanejamento = typeof planejamentos.$inferInsert;
export type Planejamento = typeof planejamentos.$inferSelect;

export type InsertMembroFamily = typeof membrosFamily.$inferInsert;
export type MembroFamily = typeof membrosFamily.$inferSelect;

export type InsertImovel = typeof imoveis.$inferInsert;
export type Imovel = typeof imoveis.$inferSelect;

export type InsertPortfolioInvestimento = typeof portfolioInvestimentos.$inferInsert;
export type PortfolioInvestimento = typeof portfolioInvestimentos.$inferSelect;

export type InsertReceita = typeof receitas.$inferInsert;
export type Receita = typeof receitas.$inferSelect;

export type InsertDespesa = typeof despesas.$inferInsert;
export type Despesa = typeof despesas.$inferSelect;

export type InsertObjetivo = typeof objetivos.$inferInsert;
export type Objetivo = typeof objetivos.$inferSelect;

export type InsertInss = typeof inss.$inferInsert;
export type Inss = typeof inss.$inferSelect;

export type InsertSeguro = typeof seguros.$inferInsert;
export type Seguro = typeof seguros.$inferSelect;

export type InsertIndiceEconomico = typeof indicesEconomicos.$inferInsert;
export type IndiceEconomico = typeof indicesEconomicos.$inferSelect;



export type InsertMoodInsight = typeof moodInsights.$inferInsert;
export type MoodInsight = typeof moodInsights.$inferSelect;

export type InsertSimulacaoProvedor = typeof simulacaoProvedores.$inferInsert;
export type SimulacaoProvedor = typeof simulacaoProvedores.$inferSelect;

// Insert Schemas
export const insertPlanejamentoSchema = createInsertSchema(planejamentos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMembroFamilySchema = createInsertSchema(membrosFamily).omit({
  id: true,
  createdAt: true,
}).extend({
  renda: z.string().or(z.number().transform(String)).optional(),
});

export const insertImovelSchema = createInsertSchema(imoveis).omit({
  id: true,
  createdAt: true,
}).extend({
  valorPatrimonial: z.string().or(z.number().transform(String)),
  valorAquisicao: z.string().or(z.number().transform(String)),
  taxaValorizacao: z.string().or(z.number().transform(String)).optional(),
  amortizacao: z.string().or(z.number().transform(String)).optional(),
  entrada: z.string().or(z.number().transform(String)).optional(),
  juros: z.string().or(z.number().transform(String)).optional(),
  prazoAnos: z.number().or(z.string().transform(Number)).optional(),
  percentualRendaProvedorA: z.string().or(z.number().transform(String)).optional(),
  percentualRendaProvedorB: z.string().or(z.number().transform(String)).optional(),
});

export const insertPortfolioInvestimentoSchema = createInsertSchema(portfolioInvestimentos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  quantidade: z.string().or(z.number().transform(String)),
  precoMedio: z.string().or(z.number().transform(String)),
  valorAtual: z.string().or(z.number().transform(String)),
});

export const insertReceitaSchema = createInsertSchema(receitas).omit({
  id: true,
  createdAt: true,
}).extend({
  valor: z.string().or(z.number().transform(String)),
  prazoAnos: z.number().nullable().optional(),
  mesesRecorrencia: z.string().nullable().optional(),
  percentualMensal: z.string().nullable().optional(),
});

export const insertDespesaSchema = createInsertSchema(despesas).omit({
  id: true,
  createdAt: true,
}).extend({
  valor: z.string().or(z.number().transform(String)),
  prazoAnos: z.number().nullable().optional(),
  mesesRecorrencia: z.string().nullable().optional(),
  percentualMensal: z.string().nullable().optional(),
});

export const insertObjetivoSchema = createInsertSchema(objetivos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  valorObjetivo: z.string().or(z.number().transform(String)),
  valorAtual: z.string().or(z.number().transform(String)).optional(),
  dataAlvo: z.string().min(1, "Data alvo é obrigatória"),
  prioridade: z.number().min(1, "Prioridade deve ser maior que 0"),
});

export const insertInssSchema = createInsertSchema(inss).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  beneficio: z.string().or(z.number().transform(String)),
});

export const insertSeguroSchema = createInsertSchema(seguros).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  cs: z.string().or(z.number().transform(String)),
  custo: z.string().or(z.number().transform(String)),
  csSugerido: z.string().or(z.number().transform(String)),
});

export const insertIndiceEconomicoSchema = createInsertSchema(indicesEconomicos).omit({
  id: true,
  createdAt: true,
}).extend({
  valor: z.string().or(z.number().transform(String)),
});

export const insertMoodInsightSchema = createInsertSchema(moodInsights).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  score: z.string().or(z.number().transform(String)),
});

export const insertSimulacaoProvedorSchema = createInsertSchema(simulacaoProvedores).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
