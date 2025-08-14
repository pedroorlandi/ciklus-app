--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: dados_detalhados; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.dados_detalhados (
    id integer NOT NULL,
    dado_mensal_id integer NOT NULL,
    planejamento_id integer NOT NULL,
    ano integer NOT NULL,
    mes integer NOT NULL,
    item_id integer NOT NULL,
    item_tipo character varying NOT NULL,
    item_descricao character varying NOT NULL,
    item_categoria character varying NOT NULL,
    item_valor numeric(15,2) NOT NULL,
    item_moeda character varying DEFAULT 'BRL'::character varying,
    gerado_em timestamp without time zone DEFAULT now()
);


ALTER TABLE public.dados_detalhados OWNER TO neondb_owner;

--
-- Name: dados_detalhados_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.dados_detalhados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dados_detalhados_id_seq OWNER TO neondb_owner;

--
-- Name: dados_detalhados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.dados_detalhados_id_seq OWNED BY public.dados_detalhados.id;


--
-- Name: dados_mensais; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.dados_mensais (
    id integer NOT NULL,
    planejamento_id integer NOT NULL,
    ano integer NOT NULL,
    mes integer NOT NULL,
    periodo character varying NOT NULL,
    data date NOT NULL,
    despesas_basicas numeric(15,2) DEFAULT '0'::numeric,
    despesas_dependentes numeric(15,2) DEFAULT '0'::numeric,
    despesas_estilo numeric(15,2) DEFAULT '0'::numeric,
    despesas_viagens numeric(15,2) DEFAULT '0'::numeric,
    despesas_patrimoniais numeric(15,2) DEFAULT '0'::numeric,
    financiamento_1 numeric(15,2) DEFAULT '0'::numeric,
    financiamento_2 numeric(15,2) DEFAULT '0'::numeric,
    financiamento_3 numeric(15,2) DEFAULT '0'::numeric,
    financiamento_4 numeric(15,2) DEFAULT '0'::numeric,
    financiamento_5 numeric(15,2) DEFAULT '0'::numeric,
    receita_ativa numeric(15,2) DEFAULT '0'::numeric,
    receita_passiva numeric(15,2) DEFAULT '0'::numeric,
    receita_patrimonio numeric(15,2) DEFAULT '0'::numeric,
    inss numeric(15,2) DEFAULT '0'::numeric,
    venda_ativos numeric(15,2) DEFAULT '0'::numeric,
    desembolso_objetivos numeric(15,2) DEFAULT '0'::numeric,
    despesas_totais numeric(15,2) DEFAULT '0'::numeric,
    receitas_totais numeric(15,2) DEFAULT '0'::numeric,
    cs numeric(15,2) DEFAULT '0'::numeric,
    portfolio_inicial numeric(15,2) DEFAULT '0'::numeric,
    total_vendas numeric(15,2) DEFAULT '0'::numeric,
    projetos numeric(15,2) DEFAULT '0'::numeric,
    saving numeric(15,2) DEFAULT '0'::numeric,
    renta_dolar numeric(15,2) DEFAULT '0'::numeric,
    portfolio_final numeric(15,2) DEFAULT '0'::numeric,
    projetos_brl numeric(15,2) DEFAULT '0'::numeric,
    projetos_usd numeric(15,2) DEFAULT '0'::numeric,
    caixa numeric(15,2) DEFAULT '0'::numeric,
    longevidade numeric(15,2) DEFAULT '0'::numeric,
    gerado_em timestamp without time zone DEFAULT now(),
    versao integer DEFAULT 1
);


ALTER TABLE public.dados_mensais OWNER TO neondb_owner;

--
-- Name: dados_mensais_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.dados_mensais_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dados_mensais_id_seq OWNER TO neondb_owner;

--
-- Name: dados_mensais_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.dados_mensais_id_seq OWNED BY public.dados_mensais.id;


--
-- Name: despesas; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.despesas (
    id integer NOT NULL,
    planejamento_id integer NOT NULL,
    descricao character varying(255) NOT NULL,
    categoria character varying NOT NULL,
    valor numeric(15,2) NOT NULL,
    moeda character varying DEFAULT 'BRL'::character varying NOT NULL,
    membro character varying,
    imovel character varying,
    data_inicio character varying NOT NULL,
    prazo_anos integer,
    data_fim character varying,
    frequencia character varying NOT NULL,
    meses_recorrencia character varying(50),
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.despesas OWNER TO neondb_owner;

--
-- Name: despesas_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.despesas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.despesas_id_seq OWNER TO neondb_owner;

--
-- Name: despesas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.despesas_id_seq OWNED BY public.despesas.id;


--
-- Name: imoveis; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.imoveis (
    id integer NOT NULL,
    planejamento_id integer NOT NULL,
    nome character varying(255) NOT NULL,
    endereco character varying(500),
    area numeric(10,2),
    quartos integer,
    banheiros integer,
    vagas integer,
    moeda character varying DEFAULT 'BRL'::character varying NOT NULL,
    valor_patrimonial character varying DEFAULT '0'::character varying NOT NULL,
    valor_aquisicao character varying DEFAULT '0'::character varying NOT NULL,
    taxa_valorizacao character varying DEFAULT '0'::character varying,
    data_aquisicao date,
    data_venda date,
    status character varying DEFAULT 'ativo'::character varying NOT NULL,
    renda_aluguel character varying DEFAULT '0'::character varying,
    financiamento character varying DEFAULT 'NAO'::character varying NOT NULL,
    tipo_amortizacao character varying DEFAULT 'SAC'::character varying,
    valor_financiado character varying DEFAULT '0'::character varying,
    entrada character varying DEFAULT '0'::character varying,
    juros character varying DEFAULT '0'::character varying,
    data_inicio date,
    prazo_anos integer,
    prestacao_mensal character varying DEFAULT '0'::character varying,
    saldo_devedor character varying DEFAULT '0'::character varying,
    percentual_renda_provedor_a character varying DEFAULT '0'::character varying,
    percentual_renda_provedor_b character varying DEFAULT '0'::character varying,
    seguro_eduardo character varying DEFAULT '0'::character varying,
    seguro_monica character varying DEFAULT '0'::character varying,
    observacoes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.imoveis OWNER TO neondb_owner;

--
-- Name: imoveis_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.imoveis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.imoveis_id_seq OWNER TO neondb_owner;

--
-- Name: imoveis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.imoveis_id_seq OWNED BY public.imoveis.id;


--
-- Name: indices_economicos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.indices_economicos (
    id integer NOT NULL,
    nome character varying(50) NOT NULL,
    valor numeric(10,4) NOT NULL,
    data date NOT NULL,
    tipo character varying NOT NULL,
    unidade character varying DEFAULT '%'::character varying NOT NULL,
    manual boolean DEFAULT false NOT NULL,
    atualizacao_automatica boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.indices_economicos OWNER TO neondb_owner;

--
-- Name: indices_economicos_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.indices_economicos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.indices_economicos_id_seq OWNER TO neondb_owner;

--
-- Name: indices_economicos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.indices_economicos_id_seq OWNED BY public.indices_economicos.id;


--
-- Name: inss; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inss (
    id integer NOT NULL,
    planejamento_id integer NOT NULL,
    membro_id integer,
    idade_concessao integer NOT NULL,
    beneficio numeric(15,2) NOT NULL,
    moeda character varying DEFAULT 'BRL'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.inss OWNER TO neondb_owner;

--
-- Name: inss_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.inss_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inss_id_seq OWNER TO neondb_owner;

--
-- Name: inss_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.inss_id_seq OWNED BY public.inss.id;


--
-- Name: membros_family; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.membros_family (
    id integer NOT NULL,
    planejamento_id integer NOT NULL,
    nome character varying(255) NOT NULL,
    parentesco character varying NOT NULL,
    idade integer NOT NULL,
    data_nascimento date,
    dependente boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.membros_family OWNER TO neondb_owner;

--
-- Name: membros_family_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.membros_family_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.membros_family_id_seq OWNER TO neondb_owner;

--
-- Name: membros_family_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.membros_family_id_seq OWNED BY public.membros_family.id;


--
-- Name: mood_insights; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.mood_insights (
    id integer NOT NULL,
    planejamento_id integer NOT NULL,
    mood character varying NOT NULL,
    score numeric(5,2) NOT NULL,
    primary_insight text NOT NULL,
    secondary_insight text,
    action_item text NOT NULL,
    category character varying NOT NULL,
    priority character varying DEFAULT 'medium'::character varying NOT NULL,
    data_points jsonb,
    valid_until timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.mood_insights OWNER TO neondb_owner;

--
-- Name: mood_insights_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.mood_insights_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mood_insights_id_seq OWNER TO neondb_owner;

--
-- Name: mood_insights_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.mood_insights_id_seq OWNED BY public.mood_insights.id;


--
-- Name: objetivos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.objetivos (
    id integer NOT NULL,
    planejamento_id integer NOT NULL,
    membro_id integer,
    nome character varying(255) NOT NULL,
    descricao text,
    categoria character varying NOT NULL,
    valor_objetivo numeric(15,2) NOT NULL,
    valor_atual numeric(15,2) DEFAULT '0'::numeric,
    moeda character varying DEFAULT 'BRL'::character varying NOT NULL,
    prioridade integer DEFAULT 1 NOT NULL,
    data_alvo date,
    status character varying DEFAULT 'ativo'::character varying NOT NULL,
    aporte_manual numeric(15,2) DEFAULT '0'::numeric,
    estrategia character varying,
    observacoes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.objetivos OWNER TO neondb_owner;

--
-- Name: objetivos_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.objetivos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.objetivos_id_seq OWNER TO neondb_owner;

--
-- Name: objetivos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.objetivos_id_seq OWNED BY public.objetivos.id;


--
-- Name: planejamentos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.planejamentos (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    descricao text,
    user_id character varying NOT NULL,
    planejador_id character varying,
    status character varying DEFAULT 'ativo'::character varying NOT NULL,
    data_inicio date NOT NULL,
    data_fim date,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.planejamentos OWNER TO neondb_owner;

--
-- Name: planejamentos_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.planejamentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.planejamentos_id_seq OWNER TO neondb_owner;

--
-- Name: planejamentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.planejamentos_id_seq OWNED BY public.planejamentos.id;


--
-- Name: portfolio_investimentos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.portfolio_investimentos (
    id integer NOT NULL,
    planejamento_id integer NOT NULL,
    categoria character varying NOT NULL,
    ativo character varying NOT NULL,
    quantidade numeric(15,8) NOT NULL,
    preco_medio numeric(15,8) NOT NULL,
    valor_atual numeric(15,2) NOT NULL,
    moeda character varying DEFAULT 'BRL'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.portfolio_investimentos OWNER TO neondb_owner;

--
-- Name: portfolio_investimentos_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.portfolio_investimentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.portfolio_investimentos_id_seq OWNER TO neondb_owner;

--
-- Name: portfolio_investimentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.portfolio_investimentos_id_seq OWNED BY public.portfolio_investimentos.id;


--
-- Name: receitas; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.receitas (
    id integer NOT NULL,
    planejamento_id integer NOT NULL,
    descricao character varying(255) NOT NULL,
    categoria character varying NOT NULL,
    valor numeric(15,2) NOT NULL,
    moeda character varying DEFAULT 'BRL'::character varying NOT NULL,
    membro character varying,
    imovel character varying,
    data_inicio character varying NOT NULL,
    prazo_anos integer,
    data_fim character varying,
    frequencia character varying NOT NULL,
    meses_recorrencia character varying(50),
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.receitas OWNER TO neondb_owner;

--
-- Name: receitas_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.receitas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.receitas_id_seq OWNER TO neondb_owner;

--
-- Name: receitas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.receitas_id_seq OWNED BY public.receitas.id;


--
-- Name: seguros; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.seguros (
    id integer NOT NULL,
    planejamento_id integer NOT NULL,
    membro_id integer,
    cobertura character varying NOT NULL,
    seguradora character varying(255) NOT NULL,
    cs numeric(15,2) NOT NULL,
    custo numeric(15,2) NOT NULL,
    moeda character varying DEFAULT 'BRL'::character varying NOT NULL,
    frequencia character varying DEFAULT 'mensal'::character varying NOT NULL,
    cs_sugerido numeric(15,2) NOT NULL,
    observacoes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.seguros OWNER TO neondb_owner;

--
-- Name: seguros_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.seguros_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seguros_id_seq OWNER TO neondb_owner;

--
-- Name: seguros_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.seguros_id_seq OWNED BY public.seguros.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: simulacao_provedores; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.simulacao_provedores (
    id integer NOT NULL,
    planejamento_id integer NOT NULL,
    membro_id integer NOT NULL,
    status character varying DEFAULT 'ativo'::character varying NOT NULL,
    data_simulacao date,
    observacoes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.simulacao_provedores OWNER TO neondb_owner;

--
-- Name: simulacao_provedores_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.simulacao_provedores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.simulacao_provedores_id_seq OWNER TO neondb_owner;

--
-- Name: simulacao_provedores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.simulacao_provedores_id_seq OWNED BY public.simulacao_provedores.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id character varying NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    role character varying DEFAULT 'cliente'::character varying NOT NULL,
    status character varying DEFAULT 'ativo'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: dados_detalhados id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dados_detalhados ALTER COLUMN id SET DEFAULT nextval('public.dados_detalhados_id_seq'::regclass);


--
-- Name: dados_mensais id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dados_mensais ALTER COLUMN id SET DEFAULT nextval('public.dados_mensais_id_seq'::regclass);


--
-- Name: despesas id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.despesas ALTER COLUMN id SET DEFAULT nextval('public.despesas_id_seq'::regclass);


--
-- Name: imoveis id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.imoveis ALTER COLUMN id SET DEFAULT nextval('public.imoveis_id_seq'::regclass);


--
-- Name: indices_economicos id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.indices_economicos ALTER COLUMN id SET DEFAULT nextval('public.indices_economicos_id_seq'::regclass);


--
-- Name: inss id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inss ALTER COLUMN id SET DEFAULT nextval('public.inss_id_seq'::regclass);


--
-- Name: membros_family id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.membros_family ALTER COLUMN id SET DEFAULT nextval('public.membros_family_id_seq'::regclass);


--
-- Name: mood_insights id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mood_insights ALTER COLUMN id SET DEFAULT nextval('public.mood_insights_id_seq'::regclass);


--
-- Name: objetivos id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.objetivos ALTER COLUMN id SET DEFAULT nextval('public.objetivos_id_seq'::regclass);


--
-- Name: planejamentos id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.planejamentos ALTER COLUMN id SET DEFAULT nextval('public.planejamentos_id_seq'::regclass);


--
-- Name: portfolio_investimentos id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.portfolio_investimentos ALTER COLUMN id SET DEFAULT nextval('public.portfolio_investimentos_id_seq'::regclass);


--
-- Name: receitas id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.receitas ALTER COLUMN id SET DEFAULT nextval('public.receitas_id_seq'::regclass);


--
-- Name: seguros id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.seguros ALTER COLUMN id SET DEFAULT nextval('public.seguros_id_seq'::regclass);


--
-- Name: simulacao_provedores id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.simulacao_provedores ALTER COLUMN id SET DEFAULT nextval('public.simulacao_provedores_id_seq'::regclass);


--
-- Data for Name: dados_detalhados; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.dados_detalhados (id, dado_mensal_id, planejamento_id, ano, mes, item_id, item_tipo, item_descricao, item_categoria, item_valor, item_moeda, gerado_em) FROM stdin;
\.


--
-- Data for Name: dados_mensais; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.dados_mensais (id, planejamento_id, ano, mes, periodo, data, despesas_basicas, despesas_dependentes, despesas_estilo, despesas_viagens, despesas_patrimoniais, financiamento_1, financiamento_2, financiamento_3, financiamento_4, financiamento_5, receita_ativa, receita_passiva, receita_patrimonio, inss, venda_ativos, desembolso_objetivos, despesas_totais, receitas_totais, cs, portfolio_inicial, total_vendas, projetos, saving, renta_dolar, portfolio_final, projetos_brl, projetos_usd, caixa, longevidade, gerado_em, versao) FROM stdin;
9421	2	2025	1	janeiro-25	2025-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9422	2	2025	2	fevereiro-25	2025-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9423	2	2025	3	março-25	2025-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9424	2	2025	4	abril-25	2025-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9425	2	2025	5	maio-25	2025-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9426	2	2025	6	junho-25	2025-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9427	2	2025	7	julho-25	2025-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9428	2	2025	8	agosto-25	2025-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9429	2	2025	9	setembro-25	2025-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9430	2	2025	10	outubro-25	2025-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9431	2	2025	11	novembro-25	2025-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9432	2	2025	12	dezembro-25	2025-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9433	2	2026	1	janeiro-26	2026-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9434	2	2026	2	fevereiro-26	2026-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9435	2	2026	3	março-26	2026-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9436	2	2026	4	abril-26	2026-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9437	2	2026	5	maio-26	2026-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9438	2	2026	6	junho-26	2026-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9439	2	2026	7	julho-26	2026-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9440	2	2026	8	agosto-26	2026-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9441	2	2026	9	setembro-26	2026-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9442	2	2026	10	outubro-26	2026-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9443	2	2026	11	novembro-26	2026-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9444	2	2026	12	dezembro-26	2026-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9445	2	2027	1	janeiro-27	2027-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9446	2	2027	2	fevereiro-27	2027-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9447	2	2027	3	março-27	2027-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9448	2	2027	4	abril-27	2027-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9449	2	2027	5	maio-27	2027-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9450	2	2027	6	junho-27	2027-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9451	2	2027	7	julho-27	2027-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9452	2	2027	8	agosto-27	2027-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9453	2	2027	9	setembro-27	2027-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9454	2	2027	10	outubro-27	2027-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9455	2	2027	11	novembro-27	2027-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9456	2	2027	12	dezembro-27	2027-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9457	2	2028	1	janeiro-28	2028-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9458	2	2028	2	fevereiro-28	2028-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9459	2	2028	3	março-28	2028-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9460	2	2028	4	abril-28	2028-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9461	2	2028	5	maio-28	2028-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9462	2	2028	6	junho-28	2028-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9463	2	2028	7	julho-28	2028-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9464	2	2028	8	agosto-28	2028-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9465	2	2028	9	setembro-28	2028-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9466	2	2028	10	outubro-28	2028-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9467	2	2028	11	novembro-28	2028-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9468	2	2028	12	dezembro-28	2028-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9469	2	2029	1	janeiro-29	2029-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9470	2	2029	2	fevereiro-29	2029-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9471	2	2029	3	março-29	2029-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9472	2	2029	4	abril-29	2029-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9473	2	2029	5	maio-29	2029-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9474	2	2029	6	junho-29	2029-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9475	2	2029	7	julho-29	2029-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9476	2	2029	8	agosto-29	2029-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9477	2	2029	9	setembro-29	2029-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9478	2	2029	10	outubro-29	2029-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9479	2	2029	11	novembro-29	2029-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9480	2	2029	12	dezembro-29	2029-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9481	2	2030	1	janeiro-30	2030-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9482	2	2030	2	fevereiro-30	2030-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9483	2	2030	3	março-30	2030-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9484	2	2030	4	abril-30	2030-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9485	2	2030	5	maio-30	2030-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9486	2	2030	6	junho-30	2030-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9487	2	2030	7	julho-30	2030-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9488	2	2030	8	agosto-30	2030-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9489	2	2030	9	setembro-30	2030-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9490	2	2030	10	outubro-30	2030-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9491	2	2030	11	novembro-30	2030-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9492	2	2030	12	dezembro-30	2030-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9493	2	2031	1	janeiro-31	2031-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9494	2	2031	2	fevereiro-31	2031-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9495	2	2031	3	março-31	2031-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9496	2	2031	4	abril-31	2031-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9497	2	2031	5	maio-31	2031-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9498	2	2031	6	junho-31	2031-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9499	2	2031	7	julho-31	2031-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9500	2	2031	8	agosto-31	2031-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9501	2	2031	9	setembro-31	2031-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9502	2	2031	10	outubro-31	2031-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9503	2	2031	11	novembro-31	2031-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9504	2	2031	12	dezembro-31	2031-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9505	2	2032	1	janeiro-32	2032-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9506	2	2032	2	fevereiro-32	2032-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9507	2	2032	3	março-32	2032-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9508	2	2032	4	abril-32	2032-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9509	2	2032	5	maio-32	2032-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9510	2	2032	6	junho-32	2032-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9511	2	2032	7	julho-32	2032-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9512	2	2032	8	agosto-32	2032-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9513	2	2032	9	setembro-32	2032-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9514	2	2032	10	outubro-32	2032-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9515	2	2032	11	novembro-32	2032-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9516	2	2032	12	dezembro-32	2032-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9517	2	2033	1	janeiro-33	2033-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9518	2	2033	2	fevereiro-33	2033-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9519	2	2033	3	março-33	2033-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9520	2	2033	4	abril-33	2033-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9521	2	2033	5	maio-33	2033-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9522	2	2033	6	junho-33	2033-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9523	2	2033	7	julho-33	2033-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9524	2	2033	8	agosto-33	2033-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9525	2	2033	9	setembro-33	2033-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9526	2	2033	10	outubro-33	2033-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9527	2	2033	11	novembro-33	2033-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9528	2	2033	12	dezembro-33	2033-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9529	2	2034	1	janeiro-34	2034-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9530	2	2034	2	fevereiro-34	2034-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9531	2	2034	3	março-34	2034-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9532	2	2034	4	abril-34	2034-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9533	2	2034	5	maio-34	2034-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9534	2	2034	6	junho-34	2034-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9535	2	2034	7	julho-34	2034-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9536	2	2034	8	agosto-34	2034-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9537	2	2034	9	setembro-34	2034-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9538	2	2034	10	outubro-34	2034-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9539	2	2034	11	novembro-34	2034-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9540	2	2034	12	dezembro-34	2034-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9541	2	2035	1	janeiro-35	2035-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9542	2	2035	2	fevereiro-35	2035-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9543	2	2035	3	março-35	2035-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9544	2	2035	4	abril-35	2035-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9545	2	2035	5	maio-35	2035-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9546	2	2035	6	junho-35	2035-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9547	2	2035	7	julho-35	2035-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9548	2	2035	8	agosto-35	2035-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9549	2	2035	9	setembro-35	2035-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9550	2	2035	10	outubro-35	2035-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9551	2	2035	11	novembro-35	2035-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9552	2	2035	12	dezembro-35	2035-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9553	2	2036	1	janeiro-36	2036-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9554	2	2036	2	fevereiro-36	2036-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9555	2	2036	3	março-36	2036-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9556	2	2036	4	abril-36	2036-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9557	2	2036	5	maio-36	2036-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9558	2	2036	6	junho-36	2036-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9559	2	2036	7	julho-36	2036-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9560	2	2036	8	agosto-36	2036-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9561	2	2036	9	setembro-36	2036-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9562	2	2036	10	outubro-36	2036-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9563	2	2036	11	novembro-36	2036-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9564	2	2036	12	dezembro-36	2036-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9565	2	2037	1	janeiro-37	2037-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9566	2	2037	2	fevereiro-37	2037-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9567	2	2037	3	março-37	2037-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9568	2	2037	4	abril-37	2037-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9569	2	2037	5	maio-37	2037-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9570	2	2037	6	junho-37	2037-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9571	2	2037	7	julho-37	2037-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9572	2	2037	8	agosto-37	2037-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9573	2	2037	9	setembro-37	2037-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9574	2	2037	10	outubro-37	2037-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9575	2	2037	11	novembro-37	2037-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9576	2	2037	12	dezembro-37	2037-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9577	2	2038	1	janeiro-38	2038-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9578	2	2038	2	fevereiro-38	2038-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9579	2	2038	3	março-38	2038-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9580	2	2038	4	abril-38	2038-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9581	2	2038	5	maio-38	2038-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9582	2	2038	6	junho-38	2038-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9583	2	2038	7	julho-38	2038-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9584	2	2038	8	agosto-38	2038-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9585	2	2038	9	setembro-38	2038-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9586	2	2038	10	outubro-38	2038-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9587	2	2038	11	novembro-38	2038-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9588	2	2038	12	dezembro-38	2038-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9589	2	2039	1	janeiro-39	2039-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9590	2	2039	2	fevereiro-39	2039-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9591	2	2039	3	março-39	2039-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9592	2	2039	4	abril-39	2039-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9593	2	2039	5	maio-39	2039-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9594	2	2039	6	junho-39	2039-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9595	2	2039	7	julho-39	2039-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9596	2	2039	8	agosto-39	2039-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9597	2	2039	9	setembro-39	2039-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9598	2	2039	10	outubro-39	2039-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9599	2	2039	11	novembro-39	2039-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9600	2	2039	12	dezembro-39	2039-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9601	2	2040	1	janeiro-40	2040-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9602	2	2040	2	fevereiro-40	2040-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9603	2	2040	3	março-40	2040-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9604	2	2040	4	abril-40	2040-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9605	2	2040	5	maio-40	2040-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9606	2	2040	6	junho-40	2040-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9607	2	2040	7	julho-40	2040-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9608	2	2040	8	agosto-40	2040-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9609	2	2040	9	setembro-40	2040-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9610	2	2040	10	outubro-40	2040-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9611	2	2040	11	novembro-40	2040-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9612	2	2040	12	dezembro-40	2040-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9613	2	2041	1	janeiro-41	2041-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9614	2	2041	2	fevereiro-41	2041-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9615	2	2041	3	março-41	2041-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9616	2	2041	4	abril-41	2041-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9617	2	2041	5	maio-41	2041-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9618	2	2041	6	junho-41	2041-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9619	2	2041	7	julho-41	2041-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9620	2	2041	8	agosto-41	2041-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9621	2	2041	9	setembro-41	2041-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9622	2	2041	10	outubro-41	2041-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9623	2	2041	11	novembro-41	2041-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9624	2	2041	12	dezembro-41	2041-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9625	2	2042	1	janeiro-42	2042-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9626	2	2042	2	fevereiro-42	2042-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9627	2	2042	3	março-42	2042-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9628	2	2042	4	abril-42	2042-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9629	2	2042	5	maio-42	2042-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9630	2	2042	6	junho-42	2042-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9631	2	2042	7	julho-42	2042-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9632	2	2042	8	agosto-42	2042-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9633	2	2042	9	setembro-42	2042-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9634	2	2042	10	outubro-42	2042-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9635	2	2042	11	novembro-42	2042-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9636	2	2042	12	dezembro-42	2042-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9637	2	2043	1	janeiro-43	2043-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9638	2	2043	2	fevereiro-43	2043-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9639	2	2043	3	março-43	2043-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9640	2	2043	4	abril-43	2043-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9641	2	2043	5	maio-43	2043-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9642	2	2043	6	junho-43	2043-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9643	2	2043	7	julho-43	2043-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9644	2	2043	8	agosto-43	2043-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9645	2	2043	9	setembro-43	2043-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9646	2	2043	10	outubro-43	2043-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9647	2	2043	11	novembro-43	2043-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9648	2	2043	12	dezembro-43	2043-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9649	2	2044	1	janeiro-44	2044-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9650	2	2044	2	fevereiro-44	2044-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9651	2	2044	3	março-44	2044-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9652	2	2044	4	abril-44	2044-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9653	2	2044	5	maio-44	2044-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9654	2	2044	6	junho-44	2044-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9655	2	2044	7	julho-44	2044-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9656	2	2044	8	agosto-44	2044-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9657	2	2044	9	setembro-44	2044-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9658	2	2044	10	outubro-44	2044-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9659	2	2044	11	novembro-44	2044-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9660	2	2044	12	dezembro-44	2044-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9661	2	2045	1	janeiro-45	2045-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9662	2	2045	2	fevereiro-45	2045-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9663	2	2045	3	março-45	2045-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9664	2	2045	4	abril-45	2045-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9665	2	2045	5	maio-45	2045-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9666	2	2045	6	junho-45	2045-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9667	2	2045	7	julho-45	2045-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9668	2	2045	8	agosto-45	2045-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9669	2	2045	9	setembro-45	2045-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9670	2	2045	10	outubro-45	2045-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9671	2	2045	11	novembro-45	2045-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9672	2	2045	12	dezembro-45	2045-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9673	2	2046	1	janeiro-46	2046-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9674	2	2046	2	fevereiro-46	2046-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9675	2	2046	3	março-46	2046-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9676	2	2046	4	abril-46	2046-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9677	2	2046	5	maio-46	2046-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9678	2	2046	6	junho-46	2046-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9679	2	2046	7	julho-46	2046-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9680	2	2046	8	agosto-46	2046-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9681	2	2046	9	setembro-46	2046-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9682	2	2046	10	outubro-46	2046-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9683	2	2046	11	novembro-46	2046-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9684	2	2046	12	dezembro-46	2046-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9685	2	2047	1	janeiro-47	2047-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9686	2	2047	2	fevereiro-47	2047-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9687	2	2047	3	março-47	2047-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9688	2	2047	4	abril-47	2047-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9689	2	2047	5	maio-47	2047-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9690	2	2047	6	junho-47	2047-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9691	2	2047	7	julho-47	2047-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9692	2	2047	8	agosto-47	2047-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9693	2	2047	9	setembro-47	2047-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9694	2	2047	10	outubro-47	2047-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9695	2	2047	11	novembro-47	2047-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9696	2	2047	12	dezembro-47	2047-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9697	2	2048	1	janeiro-48	2048-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9698	2	2048	2	fevereiro-48	2048-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9699	2	2048	3	março-48	2048-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9700	2	2048	4	abril-48	2048-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9701	2	2048	5	maio-48	2048-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9702	2	2048	6	junho-48	2048-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9703	2	2048	7	julho-48	2048-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9704	2	2048	8	agosto-48	2048-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9705	2	2048	9	setembro-48	2048-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9706	2	2048	10	outubro-48	2048-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9707	2	2048	11	novembro-48	2048-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9708	2	2048	12	dezembro-48	2048-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9709	2	2049	1	janeiro-49	2049-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9710	2	2049	2	fevereiro-49	2049-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9711	2	2049	3	março-49	2049-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9712	2	2049	4	abril-49	2049-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9713	2	2049	5	maio-49	2049-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9714	2	2049	6	junho-49	2049-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9715	2	2049	7	julho-49	2049-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9716	2	2049	8	agosto-49	2049-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9717	2	2049	9	setembro-49	2049-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9718	2	2049	10	outubro-49	2049-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9719	2	2049	11	novembro-49	2049-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9720	2	2049	12	dezembro-49	2049-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9721	2	2050	1	janeiro-50	2050-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9722	2	2050	2	fevereiro-50	2050-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9723	2	2050	3	março-50	2050-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9724	2	2050	4	abril-50	2050-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9725	2	2050	5	maio-50	2050-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9726	2	2050	6	junho-50	2050-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9727	2	2050	7	julho-50	2050-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9728	2	2050	8	agosto-50	2050-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9729	2	2050	9	setembro-50	2050-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9730	2	2050	10	outubro-50	2050-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9731	2	2050	11	novembro-50	2050-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9732	2	2050	12	dezembro-50	2050-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9733	2	2051	1	janeiro-51	2051-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9734	2	2051	2	fevereiro-51	2051-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9735	2	2051	3	março-51	2051-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9736	2	2051	4	abril-51	2051-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9737	2	2051	5	maio-51	2051-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9738	2	2051	6	junho-51	2051-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9739	2	2051	7	julho-51	2051-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9740	2	2051	8	agosto-51	2051-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9741	2	2051	9	setembro-51	2051-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9742	2	2051	10	outubro-51	2051-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9743	2	2051	11	novembro-51	2051-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9744	2	2051	12	dezembro-51	2051-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9745	2	2052	1	janeiro-52	2052-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9746	2	2052	2	fevereiro-52	2052-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9747	2	2052	3	março-52	2052-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9748	2	2052	4	abril-52	2052-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9749	2	2052	5	maio-52	2052-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9750	2	2052	6	junho-52	2052-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9751	2	2052	7	julho-52	2052-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9752	2	2052	8	agosto-52	2052-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9753	2	2052	9	setembro-52	2052-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9754	2	2052	10	outubro-52	2052-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9755	2	2052	11	novembro-52	2052-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9756	2	2052	12	dezembro-52	2052-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9757	2	2053	1	janeiro-53	2053-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9758	2	2053	2	fevereiro-53	2053-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9759	2	2053	3	março-53	2053-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9760	2	2053	4	abril-53	2053-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9761	2	2053	5	maio-53	2053-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9762	2	2053	6	junho-53	2053-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9763	2	2053	7	julho-53	2053-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9764	2	2053	8	agosto-53	2053-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9765	2	2053	9	setembro-53	2053-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9766	2	2053	10	outubro-53	2053-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9767	2	2053	11	novembro-53	2053-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9768	2	2053	12	dezembro-53	2053-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9769	2	2054	1	janeiro-54	2054-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9770	2	2054	2	fevereiro-54	2054-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9771	2	2054	3	março-54	2054-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9772	2	2054	4	abril-54	2054-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9773	2	2054	5	maio-54	2054-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9774	2	2054	6	junho-54	2054-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9775	2	2054	7	julho-54	2054-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9776	2	2054	8	agosto-54	2054-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9777	2	2054	9	setembro-54	2054-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9778	2	2054	10	outubro-54	2054-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9779	2	2054	11	novembro-54	2054-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9780	2	2054	12	dezembro-54	2054-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9781	2	2055	1	janeiro-55	2055-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9782	2	2055	2	fevereiro-55	2055-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9783	2	2055	3	março-55	2055-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9784	2	2055	4	abril-55	2055-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9785	2	2055	5	maio-55	2055-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9786	2	2055	6	junho-55	2055-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9787	2	2055	7	julho-55	2055-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9788	2	2055	8	agosto-55	2055-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9789	2	2055	9	setembro-55	2055-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9790	2	2055	10	outubro-55	2055-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9791	2	2055	11	novembro-55	2055-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9792	2	2055	12	dezembro-55	2055-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9793	2	2056	1	janeiro-56	2056-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9794	2	2056	2	fevereiro-56	2056-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9795	2	2056	3	março-56	2056-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9796	2	2056	4	abril-56	2056-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9797	2	2056	5	maio-56	2056-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9798	2	2056	6	junho-56	2056-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9799	2	2056	7	julho-56	2056-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9800	2	2056	8	agosto-56	2056-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9801	2	2056	9	setembro-56	2056-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9802	2	2056	10	outubro-56	2056-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9803	2	2056	11	novembro-56	2056-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9804	2	2056	12	dezembro-56	2056-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9805	2	2057	1	janeiro-57	2057-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9806	2	2057	2	fevereiro-57	2057-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9807	2	2057	3	março-57	2057-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9808	2	2057	4	abril-57	2057-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9809	2	2057	5	maio-57	2057-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9810	2	2057	6	junho-57	2057-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9811	2	2057	7	julho-57	2057-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9812	2	2057	8	agosto-57	2057-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9813	2	2057	9	setembro-57	2057-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9814	2	2057	10	outubro-57	2057-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9815	2	2057	11	novembro-57	2057-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9816	2	2057	12	dezembro-57	2057-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9817	2	2058	1	janeiro-58	2058-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9818	2	2058	2	fevereiro-58	2058-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9819	2	2058	3	março-58	2058-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9820	2	2058	4	abril-58	2058-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9821	2	2058	5	maio-58	2058-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9822	2	2058	6	junho-58	2058-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9823	2	2058	7	julho-58	2058-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9824	2	2058	8	agosto-58	2058-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9825	2	2058	9	setembro-58	2058-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9826	2	2058	10	outubro-58	2058-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9827	2	2058	11	novembro-58	2058-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9828	2	2058	12	dezembro-58	2058-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9829	2	2059	1	janeiro-59	2059-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9830	2	2059	2	fevereiro-59	2059-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9831	2	2059	3	março-59	2059-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9832	2	2059	4	abril-59	2059-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9833	2	2059	5	maio-59	2059-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9834	2	2059	6	junho-59	2059-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9835	2	2059	7	julho-59	2059-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9836	2	2059	8	agosto-59	2059-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9837	2	2059	9	setembro-59	2059-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9838	2	2059	10	outubro-59	2059-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9839	2	2059	11	novembro-59	2059-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9840	2	2059	12	dezembro-59	2059-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9841	2	2060	1	janeiro-60	2060-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9842	2	2060	2	fevereiro-60	2060-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9843	2	2060	3	março-60	2060-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9844	2	2060	4	abril-60	2060-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9845	2	2060	5	maio-60	2060-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9846	2	2060	6	junho-60	2060-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9847	2	2060	7	julho-60	2060-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9848	2	2060	8	agosto-60	2060-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9849	2	2060	9	setembro-60	2060-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9850	2	2060	10	outubro-60	2060-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9851	2	2060	11	novembro-60	2060-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9852	2	2060	12	dezembro-60	2060-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9853	2	2061	1	janeiro-61	2061-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9854	2	2061	2	fevereiro-61	2061-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9855	2	2061	3	março-61	2061-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9856	2	2061	4	abril-61	2061-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9857	2	2061	5	maio-61	2061-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9858	2	2061	6	junho-61	2061-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9859	2	2061	7	julho-61	2061-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9860	2	2061	8	agosto-61	2061-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9861	2	2061	9	setembro-61	2061-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9862	2	2061	10	outubro-61	2061-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9863	2	2061	11	novembro-61	2061-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9864	2	2061	12	dezembro-61	2061-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9865	2	2062	1	janeiro-62	2062-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9866	2	2062	2	fevereiro-62	2062-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9867	2	2062	3	março-62	2062-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9868	2	2062	4	abril-62	2062-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9869	2	2062	5	maio-62	2062-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9870	2	2062	6	junho-62	2062-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9871	2	2062	7	julho-62	2062-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9872	2	2062	8	agosto-62	2062-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9873	2	2062	9	setembro-62	2062-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9874	2	2062	10	outubro-62	2062-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9875	2	2062	11	novembro-62	2062-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9876	2	2062	12	dezembro-62	2062-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9877	2	2063	1	janeiro-63	2063-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9878	2	2063	2	fevereiro-63	2063-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9879	2	2063	3	março-63	2063-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9880	2	2063	4	abril-63	2063-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9881	2	2063	5	maio-63	2063-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9882	2	2063	6	junho-63	2063-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9883	2	2063	7	julho-63	2063-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9884	2	2063	8	agosto-63	2063-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9885	2	2063	9	setembro-63	2063-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9886	2	2063	10	outubro-63	2063-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9887	2	2063	11	novembro-63	2063-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9888	2	2063	12	dezembro-63	2063-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9889	2	2064	1	janeiro-64	2064-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9890	2	2064	2	fevereiro-64	2064-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9891	2	2064	3	março-64	2064-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9892	2	2064	4	abril-64	2064-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9893	2	2064	5	maio-64	2064-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9894	2	2064	6	junho-64	2064-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9895	2	2064	7	julho-64	2064-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9896	2	2064	8	agosto-64	2064-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9897	2	2064	9	setembro-64	2064-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9898	2	2064	10	outubro-64	2064-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9899	2	2064	11	novembro-64	2064-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9900	2	2064	12	dezembro-64	2064-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9901	2	2065	1	janeiro-65	2065-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9902	2	2065	2	fevereiro-65	2065-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9903	2	2065	3	março-65	2065-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9904	2	2065	4	abril-65	2065-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9905	2	2065	5	maio-65	2065-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9906	2	2065	6	junho-65	2065-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9907	2	2065	7	julho-65	2065-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9908	2	2065	8	agosto-65	2065-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9909	2	2065	9	setembro-65	2065-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9910	2	2065	10	outubro-65	2065-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9911	2	2065	11	novembro-65	2065-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9912	2	2065	12	dezembro-65	2065-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9913	2	2066	1	janeiro-66	2066-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9914	2	2066	2	fevereiro-66	2066-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9915	2	2066	3	março-66	2066-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9916	2	2066	4	abril-66	2066-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9917	2	2066	5	maio-66	2066-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9918	2	2066	6	junho-66	2066-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9919	2	2066	7	julho-66	2066-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9920	2	2066	8	agosto-66	2066-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9921	2	2066	9	setembro-66	2066-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9922	2	2066	10	outubro-66	2066-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9923	2	2066	11	novembro-66	2066-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9924	2	2066	12	dezembro-66	2066-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9925	2	2067	1	janeiro-67	2067-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9926	2	2067	2	fevereiro-67	2067-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9927	2	2067	3	março-67	2067-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9928	2	2067	4	abril-67	2067-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9929	2	2067	5	maio-67	2067-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9930	2	2067	6	junho-67	2067-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9931	2	2067	7	julho-67	2067-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9932	2	2067	8	agosto-67	2067-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9933	2	2067	9	setembro-67	2067-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9934	2	2067	10	outubro-67	2067-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9935	2	2067	11	novembro-67	2067-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9936	2	2067	12	dezembro-67	2067-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9937	2	2068	1	janeiro-68	2068-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9938	2	2068	2	fevereiro-68	2068-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9939	2	2068	3	março-68	2068-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9940	2	2068	4	abril-68	2068-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9941	2	2068	5	maio-68	2068-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9942	2	2068	6	junho-68	2068-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9943	2	2068	7	julho-68	2068-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9944	2	2068	8	agosto-68	2068-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9945	2	2068	9	setembro-68	2068-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9946	2	2068	10	outubro-68	2068-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9947	2	2068	11	novembro-68	2068-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9948	2	2068	12	dezembro-68	2068-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9949	2	2069	1	janeiro-69	2069-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9950	2	2069	2	fevereiro-69	2069-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9951	2	2069	3	março-69	2069-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9952	2	2069	4	abril-69	2069-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9953	2	2069	5	maio-69	2069-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9954	2	2069	6	junho-69	2069-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9955	2	2069	7	julho-69	2069-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9956	2	2069	8	agosto-69	2069-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9957	2	2069	9	setembro-69	2069-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9958	2	2069	10	outubro-69	2069-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9959	2	2069	11	novembro-69	2069-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9960	2	2069	12	dezembro-69	2069-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9961	2	2070	1	janeiro-70	2070-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9962	2	2070	2	fevereiro-70	2070-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9963	2	2070	3	março-70	2070-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9964	2	2070	4	abril-70	2070-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9965	2	2070	5	maio-70	2070-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9966	2	2070	6	junho-70	2070-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9967	2	2070	7	julho-70	2070-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9968	2	2070	8	agosto-70	2070-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9969	2	2070	9	setembro-70	2070-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9970	2	2070	10	outubro-70	2070-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9971	2	2070	11	novembro-70	2070-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9972	2	2070	12	dezembro-70	2070-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9973	2	2071	1	janeiro-71	2071-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9974	2	2071	2	fevereiro-71	2071-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9975	2	2071	3	março-71	2071-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9976	2	2071	4	abril-71	2071-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9977	2	2071	5	maio-71	2071-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9978	2	2071	6	junho-71	2071-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9979	2	2071	7	julho-71	2071-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9980	2	2071	8	agosto-71	2071-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9981	2	2071	9	setembro-71	2071-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9982	2	2071	10	outubro-71	2071-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9983	2	2071	11	novembro-71	2071-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9984	2	2071	12	dezembro-71	2071-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9985	2	2072	1	janeiro-72	2072-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9986	2	2072	2	fevereiro-72	2072-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9987	2	2072	3	março-72	2072-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9988	2	2072	4	abril-72	2072-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9989	2	2072	5	maio-72	2072-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9990	2	2072	6	junho-72	2072-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9991	2	2072	7	julho-72	2072-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9992	2	2072	8	agosto-72	2072-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9993	2	2072	9	setembro-72	2072-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9994	2	2072	10	outubro-72	2072-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9995	2	2072	11	novembro-72	2072-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9996	2	2072	12	dezembro-72	2072-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9997	2	2073	1	janeiro-73	2073-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9998	2	2073	2	fevereiro-73	2073-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
9999	2	2073	3	março-73	2073-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10000	2	2073	4	abril-73	2073-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10001	2	2073	5	maio-73	2073-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10002	2	2073	6	junho-73	2073-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10003	2	2073	7	julho-73	2073-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10004	2	2073	8	agosto-73	2073-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10005	2	2073	9	setembro-73	2073-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10006	2	2073	10	outubro-73	2073-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10007	2	2073	11	novembro-73	2073-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10008	2	2073	12	dezembro-73	2073-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10009	2	2074	1	janeiro-74	2074-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10010	2	2074	2	fevereiro-74	2074-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10011	2	2074	3	março-74	2074-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10012	2	2074	4	abril-74	2074-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10013	2	2074	5	maio-74	2074-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10014	2	2074	6	junho-74	2074-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10015	2	2074	7	julho-74	2074-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10016	2	2074	8	agosto-74	2074-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10017	2	2074	9	setembro-74	2074-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10018	2	2074	10	outubro-74	2074-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10019	2	2074	11	novembro-74	2074-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10020	2	2074	12	dezembro-74	2074-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10021	2	2075	1	janeiro-75	2075-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10022	2	2075	2	fevereiro-75	2075-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10023	2	2075	3	março-75	2075-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10024	2	2075	4	abril-75	2075-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10025	2	2075	5	maio-75	2075-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10026	2	2075	6	junho-75	2075-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10027	2	2075	7	julho-75	2075-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10028	2	2075	8	agosto-75	2075-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10029	2	2075	9	setembro-75	2075-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10030	2	2075	10	outubro-75	2075-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10031	2	2075	11	novembro-75	2075-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10032	2	2075	12	dezembro-75	2075-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10033	2	2076	1	janeiro-76	2076-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10034	2	2076	2	fevereiro-76	2076-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10035	2	2076	3	março-76	2076-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10036	2	2076	4	abril-76	2076-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10037	2	2076	5	maio-76	2076-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10038	2	2076	6	junho-76	2076-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10039	2	2076	7	julho-76	2076-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10040	2	2076	8	agosto-76	2076-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10041	2	2076	9	setembro-76	2076-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10042	2	2076	10	outubro-76	2076-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10043	2	2076	11	novembro-76	2076-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10044	2	2076	12	dezembro-76	2076-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10045	2	2077	1	janeiro-77	2077-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10046	2	2077	2	fevereiro-77	2077-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10047	2	2077	3	março-77	2077-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10048	2	2077	4	abril-77	2077-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10049	2	2077	5	maio-77	2077-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10050	2	2077	6	junho-77	2077-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10051	2	2077	7	julho-77	2077-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10052	2	2077	8	agosto-77	2077-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10053	2	2077	9	setembro-77	2077-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10054	2	2077	10	outubro-77	2077-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10055	2	2077	11	novembro-77	2077-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10056	2	2077	12	dezembro-77	2077-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10057	2	2078	1	janeiro-78	2078-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10058	2	2078	2	fevereiro-78	2078-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10059	2	2078	3	março-78	2078-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10060	2	2078	4	abril-78	2078-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10061	2	2078	5	maio-78	2078-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10062	2	2078	6	junho-78	2078-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10063	2	2078	7	julho-78	2078-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10064	2	2078	8	agosto-78	2078-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10065	2	2078	9	setembro-78	2078-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10066	2	2078	10	outubro-78	2078-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10067	2	2078	11	novembro-78	2078-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10068	2	2078	12	dezembro-78	2078-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10069	2	2079	1	janeiro-79	2079-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10070	2	2079	2	fevereiro-79	2079-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10071	2	2079	3	março-79	2079-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10072	2	2079	4	abril-79	2079-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10073	2	2079	5	maio-79	2079-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10074	2	2079	6	junho-79	2079-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10075	2	2079	7	julho-79	2079-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10076	2	2079	8	agosto-79	2079-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10077	2	2079	9	setembro-79	2079-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10078	2	2079	10	outubro-79	2079-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10079	2	2079	11	novembro-79	2079-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10080	2	2079	12	dezembro-79	2079-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10081	2	2080	1	janeiro-80	2080-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10082	2	2080	2	fevereiro-80	2080-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10083	2	2080	3	março-80	2080-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10084	2	2080	4	abril-80	2080-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10085	2	2080	5	maio-80	2080-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10086	2	2080	6	junho-80	2080-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10087	2	2080	7	julho-80	2080-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10088	2	2080	8	agosto-80	2080-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10089	2	2080	9	setembro-80	2080-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10090	2	2080	10	outubro-80	2080-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10091	2	2080	11	novembro-80	2080-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10092	2	2080	12	dezembro-80	2080-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10093	2	2081	1	janeiro-81	2081-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10094	2	2081	2	fevereiro-81	2081-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10095	2	2081	3	março-81	2081-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10096	2	2081	4	abril-81	2081-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10097	2	2081	5	maio-81	2081-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10098	2	2081	6	junho-81	2081-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10099	2	2081	7	julho-81	2081-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10100	2	2081	8	agosto-81	2081-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10101	2	2081	9	setembro-81	2081-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10102	2	2081	10	outubro-81	2081-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10103	2	2081	11	novembro-81	2081-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10104	2	2081	12	dezembro-81	2081-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10105	2	2082	1	janeiro-82	2082-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10106	2	2082	2	fevereiro-82	2082-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10107	2	2082	3	março-82	2082-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10108	2	2082	4	abril-82	2082-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10109	2	2082	5	maio-82	2082-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10110	2	2082	6	junho-82	2082-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10111	2	2082	7	julho-82	2082-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10112	2	2082	8	agosto-82	2082-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10113	2	2082	9	setembro-82	2082-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10114	2	2082	10	outubro-82	2082-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10115	2	2082	11	novembro-82	2082-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10116	2	2082	12	dezembro-82	2082-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10117	2	2083	1	janeiro-83	2083-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10118	2	2083	2	fevereiro-83	2083-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10119	2	2083	3	março-83	2083-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10120	2	2083	4	abril-83	2083-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10121	2	2083	5	maio-83	2083-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10122	2	2083	6	junho-83	2083-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10123	2	2083	7	julho-83	2083-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10124	2	2083	8	agosto-83	2083-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10125	2	2083	9	setembro-83	2083-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10126	2	2083	10	outubro-83	2083-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10127	2	2083	11	novembro-83	2083-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10128	2	2083	12	dezembro-83	2083-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10129	2	2084	1	janeiro-84	2084-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10130	2	2084	2	fevereiro-84	2084-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10131	2	2084	3	março-84	2084-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10132	2	2084	4	abril-84	2084-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10133	2	2084	5	maio-84	2084-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10134	2	2084	6	junho-84	2084-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10135	2	2084	7	julho-84	2084-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10136	2	2084	8	agosto-84	2084-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10137	2	2084	9	setembro-84	2084-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10138	2	2084	10	outubro-84	2084-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10139	2	2084	11	novembro-84	2084-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10140	2	2084	12	dezembro-84	2084-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10141	2	2085	1	janeiro-85	2085-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10142	2	2085	2	fevereiro-85	2085-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10143	2	2085	3	março-85	2085-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10144	2	2085	4	abril-85	2085-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10145	2	2085	5	maio-85	2085-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10146	2	2085	6	junho-85	2085-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10147	2	2085	7	julho-85	2085-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10148	2	2085	8	agosto-85	2085-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10149	2	2085	9	setembro-85	2085-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10150	2	2085	10	outubro-85	2085-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10151	2	2085	11	novembro-85	2085-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10152	2	2085	12	dezembro-85	2085-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10153	2	2086	1	janeiro-86	2086-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10154	2	2086	2	fevereiro-86	2086-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10155	2	2086	3	março-86	2086-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10156	2	2086	4	abril-86	2086-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10157	2	2086	5	maio-86	2086-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10158	2	2086	6	junho-86	2086-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10159	2	2086	7	julho-86	2086-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10160	2	2086	8	agosto-86	2086-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10161	2	2086	9	setembro-86	2086-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10162	2	2086	10	outubro-86	2086-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10163	2	2086	11	novembro-86	2086-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10164	2	2086	12	dezembro-86	2086-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10165	2	2087	1	janeiro-87	2087-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10166	2	2087	2	fevereiro-87	2087-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10167	2	2087	3	março-87	2087-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10168	2	2087	4	abril-87	2087-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10169	2	2087	5	maio-87	2087-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10170	2	2087	6	junho-87	2087-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10171	2	2087	7	julho-87	2087-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10172	2	2087	8	agosto-87	2087-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10173	2	2087	9	setembro-87	2087-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10174	2	2087	10	outubro-87	2087-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10175	2	2087	11	novembro-87	2087-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10176	2	2087	12	dezembro-87	2087-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10177	2	2088	1	janeiro-88	2088-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10178	2	2088	2	fevereiro-88	2088-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10179	2	2088	3	março-88	2088-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10180	2	2088	4	abril-88	2088-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10181	2	2088	5	maio-88	2088-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10182	2	2088	6	junho-88	2088-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10183	2	2088	7	julho-88	2088-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10184	2	2088	8	agosto-88	2088-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10185	2	2088	9	setembro-88	2088-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10186	2	2088	10	outubro-88	2088-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10187	2	2088	11	novembro-88	2088-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10188	2	2088	12	dezembro-88	2088-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10189	2	2089	1	janeiro-89	2089-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10190	2	2089	2	fevereiro-89	2089-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10191	2	2089	3	março-89	2089-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10192	2	2089	4	abril-89	2089-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10193	2	2089	5	maio-89	2089-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10194	2	2089	6	junho-89	2089-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10195	2	2089	7	julho-89	2089-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10196	2	2089	8	agosto-89	2089-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10197	2	2089	9	setembro-89	2089-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10198	2	2089	10	outubro-89	2089-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10199	2	2089	11	novembro-89	2089-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10200	2	2089	12	dezembro-89	2089-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10201	2	2090	1	janeiro-90	2090-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10202	2	2090	2	fevereiro-90	2090-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10203	2	2090	3	março-90	2090-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10204	2	2090	4	abril-90	2090-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10205	2	2090	5	maio-90	2090-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10206	2	2090	6	junho-90	2090-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10207	2	2090	7	julho-90	2090-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10208	2	2090	8	agosto-90	2090-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10209	2	2090	9	setembro-90	2090-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10210	2	2090	10	outubro-90	2090-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10211	2	2090	11	novembro-90	2090-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10212	2	2090	12	dezembro-90	2090-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10213	2	2091	1	janeiro-91	2091-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10214	2	2091	2	fevereiro-91	2091-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10215	2	2091	3	março-91	2091-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10216	2	2091	4	abril-91	2091-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10217	2	2091	5	maio-91	2091-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10218	2	2091	6	junho-91	2091-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10219	2	2091	7	julho-91	2091-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10220	2	2091	8	agosto-91	2091-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10221	2	2091	9	setembro-91	2091-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10222	2	2091	10	outubro-91	2091-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10223	2	2091	11	novembro-91	2091-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10224	2	2091	12	dezembro-91	2091-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10225	2	2092	1	janeiro-92	2092-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10226	2	2092	2	fevereiro-92	2092-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10227	2	2092	3	março-92	2092-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10228	2	2092	4	abril-92	2092-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10229	2	2092	5	maio-92	2092-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10230	2	2092	6	junho-92	2092-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10231	2	2092	7	julho-92	2092-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10232	2	2092	8	agosto-92	2092-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10233	2	2092	9	setembro-92	2092-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10234	2	2092	10	outubro-92	2092-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10235	2	2092	11	novembro-92	2092-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10236	2	2092	12	dezembro-92	2092-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10237	2	2093	1	janeiro-93	2093-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10238	2	2093	2	fevereiro-93	2093-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10239	2	2093	3	março-93	2093-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10240	2	2093	4	abril-93	2093-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10241	2	2093	5	maio-93	2093-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10242	2	2093	6	junho-93	2093-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10243	2	2093	7	julho-93	2093-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10244	2	2093	8	agosto-93	2093-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10245	2	2093	9	setembro-93	2093-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10246	2	2093	10	outubro-93	2093-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10247	2	2093	11	novembro-93	2093-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10248	2	2093	12	dezembro-93	2093-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10249	2	2094	1	janeiro-94	2094-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10250	2	2094	2	fevereiro-94	2094-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10251	2	2094	3	março-94	2094-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10252	2	2094	4	abril-94	2094-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10253	2	2094	5	maio-94	2094-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10254	2	2094	6	junho-94	2094-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10255	2	2094	7	julho-94	2094-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10256	2	2094	8	agosto-94	2094-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10257	2	2094	9	setembro-94	2094-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10258	2	2094	10	outubro-94	2094-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10259	2	2094	11	novembro-94	2094-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10260	2	2094	12	dezembro-94	2094-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10261	2	2095	1	janeiro-95	2095-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10262	2	2095	2	fevereiro-95	2095-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10263	2	2095	3	março-95	2095-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10264	2	2095	4	abril-95	2095-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10265	2	2095	5	maio-95	2095-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10266	2	2095	6	junho-95	2095-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10267	2	2095	7	julho-95	2095-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10268	2	2095	8	agosto-95	2095-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10269	2	2095	9	setembro-95	2095-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10270	2	2095	10	outubro-95	2095-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10271	2	2095	11	novembro-95	2095-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10272	2	2095	12	dezembro-95	2095-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	300000.00	-300000.00	2025-08-13 16:45:05.055505	1
10273	3	2025	1	janeiro-25	2025-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	25000.00	0.00	25000.00	0.00	0.00	300000.00	-275000.00	2025-08-13 16:47:29.972043	1
10274	3	2025	2	fevereiro-25	2025-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	25000.00	0.00	0.00	25000.00	81.84	50081.84	0.00	0.00	300000.00	-249918.16	2025-08-13 16:47:29.972043	1
10275	3	2025	3	março-25	2025-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	50081.84	0.00	0.00	25000.00	163.95	75245.80	0.00	0.00	300000.00	-224754.20	2025-08-13 16:47:29.972043	1
10276	3	2025	4	abril-25	2025-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	75245.80	0.00	0.00	25000.00	246.34	100492.13	0.00	0.00	300000.00	-199507.87	2025-08-13 16:47:29.972043	1
10277	3	2025	5	maio-25	2025-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	100492.13	0.00	0.00	25000.00	328.99	125821.12	0.00	0.00	300000.00	-174178.88	2025-08-13 16:47:29.972043	1
10278	3	2025	6	junho-25	2025-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	125821.12	0.00	0.00	25000.00	411.91	151233.02	0.00	0.00	300000.00	-148766.98	2025-08-13 16:47:29.972043	1
10279	3	2025	7	julho-25	2025-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	151233.02	0.00	0.00	25000.00	495.10	176728.12	0.00	0.00	300000.00	-123271.88	2025-08-13 16:47:29.972043	1
10280	3	2025	8	agosto-25	2025-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	176728.12	0.00	0.00	25000.00	578.56	202306.68	0.00	0.00	300000.00	-97693.32	2025-08-13 16:47:29.972043	1
10281	3	2025	9	setembro-25	2025-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	202306.68	0.00	0.00	25000.00	662.30	227968.98	0.00	0.00	300000.00	-72031.02	2025-08-13 16:47:29.972043	1
10282	3	2025	10	outubro-25	2025-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	227968.98	0.00	0.00	25000.00	746.31	253715.29	0.00	0.00	300000.00	-46284.71	2025-08-13 16:47:29.972043	1
10283	3	2025	11	novembro-25	2025-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	253715.29	0.00	0.00	25000.00	830.60	279545.89	0.00	0.00	300000.00	-20454.11	2025-08-13 16:47:29.972043	1
10284	3	2025	12	dezembro-25	2025-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	279545.89	0.00	0.00	25000.00	915.16	305461.05	0.00	0.00	300000.00	5461.05	2025-08-13 16:47:29.972043	1
10285	3	2026	1	janeiro-26	2026-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	305461.05	0.00	0.00	25000.00	1000.00	331461.05	0.00	0.00	300000.00	31461.05	2025-08-13 16:47:29.972043	1
10286	3	2026	2	fevereiro-26	2026-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	331461.05	0.00	0.00	25000.00	1085.12	357546.17	0.00	0.00	300000.00	57546.17	2025-08-13 16:47:29.972043	1
10287	3	2026	3	março-26	2026-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	357546.17	0.00	0.00	25000.00	1170.51	383716.68	0.00	0.00	300000.00	83716.68	2025-08-13 16:47:29.972043	1
10288	3	2026	4	abril-26	2026-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	383716.68	0.00	0.00	25000.00	1256.19	409972.87	0.00	0.00	300000.00	109972.87	2025-08-13 16:47:29.972043	1
10289	3	2026	5	maio-26	2026-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	409972.87	0.00	0.00	25000.00	1342.14	436315.02	0.00	0.00	300000.00	136315.02	2025-08-13 16:47:29.972043	1
10290	3	2026	6	junho-26	2026-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	436315.02	0.00	0.00	25000.00	1428.38	462743.40	0.00	0.00	300000.00	162743.40	2025-08-13 16:47:29.972043	1
10291	3	2026	7	julho-26	2026-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	462743.40	0.00	0.00	25000.00	1514.90	489258.30	0.00	0.00	300000.00	189258.30	2025-08-13 16:47:29.972043	1
10292	3	2026	8	agosto-26	2026-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	489258.30	0.00	0.00	25000.00	1601.70	515860.00	0.00	0.00	300000.00	215860.00	2025-08-13 16:47:29.972043	1
10293	3	2026	9	setembro-26	2026-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	515860.00	0.00	0.00	25000.00	1688.79	542548.80	0.00	0.00	300000.00	242548.80	2025-08-13 16:47:29.972043	1
10294	3	2026	10	outubro-26	2026-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	542548.80	0.00	0.00	25000.00	1776.16	569324.96	0.00	0.00	300000.00	269324.96	2025-08-13 16:47:29.972043	1
10295	3	2026	11	novembro-26	2026-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	569324.96	0.00	0.00	25000.00	1863.82	596188.78	0.00	0.00	300000.00	296188.78	2025-08-13 16:47:29.972043	1
10296	3	2026	12	dezembro-26	2026-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	596188.78	0.00	0.00	25000.00	1951.77	623140.55	0.00	0.00	300000.00	323140.55	2025-08-13 16:47:29.972043	1
10297	3	2027	1	janeiro-27	2027-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	623140.55	0.00	0.00	25000.00	2040.00	650180.55	0.00	0.00	300000.00	350180.55	2025-08-13 16:47:29.972043	1
10298	3	2027	2	fevereiro-27	2027-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	650180.55	0.00	0.00	25000.00	2128.52	677309.07	0.00	0.00	300000.00	377309.07	2025-08-13 16:47:29.972043	1
10299	3	2027	3	março-27	2027-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	677309.07	0.00	0.00	25000.00	2217.33	704526.40	0.00	0.00	300000.00	404526.40	2025-08-13 16:47:29.972043	1
10300	3	2027	4	abril-27	2027-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	704526.40	0.00	0.00	25000.00	2306.44	731832.84	0.00	0.00	300000.00	431832.84	2025-08-13 16:47:29.972043	1
10301	3	2027	5	maio-27	2027-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	731832.84	0.00	0.00	25000.00	2395.83	759228.67	0.00	0.00	300000.00	459228.67	2025-08-13 16:47:29.972043	1
10302	3	2027	6	junho-27	2027-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	759228.67	0.00	0.00	25000.00	2485.52	786714.19	0.00	0.00	300000.00	486714.19	2025-08-13 16:47:29.972043	1
10303	3	2027	7	julho-27	2027-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	786714.19	0.00	0.00	25000.00	2575.50	814289.68	0.00	0.00	300000.00	514289.68	2025-08-13 16:47:29.972043	1
10304	3	2027	8	agosto-27	2027-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	814289.68	0.00	0.00	25000.00	2665.77	841955.46	0.00	0.00	300000.00	541955.46	2025-08-13 16:47:29.972043	1
10305	3	2027	9	setembro-27	2027-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	841955.46	0.00	0.00	25000.00	2756.34	869711.80	0.00	0.00	300000.00	569711.80	2025-08-13 16:47:29.972043	1
10306	3	2027	10	outubro-27	2027-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	869711.80	0.00	0.00	25000.00	2847.21	897559.01	0.00	0.00	300000.00	597559.01	2025-08-13 16:47:29.972043	1
10307	3	2027	11	novembro-27	2027-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	897559.01	0.00	0.00	25000.00	2938.37	925497.38	0.00	0.00	300000.00	625497.38	2025-08-13 16:47:29.972043	1
10308	3	2027	12	dezembro-27	2027-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	925497.38	0.00	0.00	25000.00	3029.84	953527.22	0.00	0.00	300000.00	653527.22	2025-08-13 16:47:29.972043	1
10309	3	2028	1	janeiro-28	2028-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	953527.22	0.00	0.00	25000.00	3121.60	981648.82	0.00	0.00	300000.00	681648.82	2025-08-13 16:47:29.972043	1
10310	3	2028	2	fevereiro-28	2028-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	981648.82	0.00	0.00	25000.00	3213.66	1009862.48	0.00	0.00	300000.00	709862.48	2025-08-13 16:47:29.972043	1
10311	3	2028	3	março-28	2028-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1009862.48	0.00	0.00	25000.00	3306.03	1038168.51	0.00	0.00	300000.00	738168.51	2025-08-13 16:47:29.972043	1
10312	3	2028	4	abril-28	2028-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1038168.51	0.00	0.00	25000.00	3398.69	1066567.21	0.00	0.00	300000.00	766567.21	2025-08-13 16:47:29.972043	1
10313	3	2028	5	maio-28	2028-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1066567.21	0.00	0.00	25000.00	3491.66	1095058.87	0.00	0.00	300000.00	795058.87	2025-08-13 16:47:29.972043	1
10314	3	2028	6	junho-28	2028-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1095058.87	0.00	0.00	25000.00	3584.94	1123643.81	0.00	0.00	300000.00	823643.81	2025-08-13 16:47:29.972043	1
10315	3	2028	7	julho-28	2028-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1123643.81	0.00	0.00	25000.00	3678.52	1152322.32	0.00	0.00	300000.00	852322.32	2025-08-13 16:47:29.972043	1
10316	3	2028	8	agosto-28	2028-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1152322.32	0.00	0.00	25000.00	3772.40	1181094.73	0.00	0.00	300000.00	881094.73	2025-08-13 16:47:29.972043	1
10317	3	2028	9	setembro-28	2028-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1181094.73	0.00	0.00	25000.00	3866.60	1209961.32	0.00	0.00	300000.00	909961.32	2025-08-13 16:47:29.972043	1
10318	3	2028	10	outubro-28	2028-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1209961.32	0.00	0.00	25000.00	3961.10	1238922.42	0.00	0.00	300000.00	938922.42	2025-08-13 16:47:29.972043	1
10319	3	2028	11	novembro-28	2028-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1238922.42	0.00	0.00	25000.00	4055.91	1267978.33	0.00	0.00	300000.00	967978.33	2025-08-13 16:47:29.972043	1
10320	3	2028	12	dezembro-28	2028-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1267978.33	0.00	0.00	25000.00	4151.03	1297129.36	0.00	0.00	300000.00	997129.36	2025-08-13 16:47:29.972043	1
10321	3	2029	1	janeiro-29	2029-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1297129.36	0.00	0.00	25000.00	4246.46	1326375.83	0.00	0.00	300000.00	1026375.83	2025-08-13 16:47:29.972043	1
10322	3	2029	2	fevereiro-29	2029-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1326375.83	0.00	0.00	25000.00	4342.21	1355718.04	0.00	0.00	300000.00	1055718.04	2025-08-13 16:47:29.972043	1
10323	3	2029	3	março-29	2029-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1355718.04	0.00	0.00	25000.00	4438.27	1385156.30	0.00	0.00	300000.00	1085156.30	2025-08-13 16:47:29.972043	1
10324	3	2029	4	abril-29	2029-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1385156.30	0.00	0.00	25000.00	4534.64	1414690.95	0.00	0.00	300000.00	1114690.95	2025-08-13 16:47:29.972043	1
10325	3	2029	5	maio-29	2029-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1414690.95	0.00	0.00	25000.00	4631.33	1444322.28	0.00	0.00	300000.00	1144322.28	2025-08-13 16:47:29.972043	1
10326	3	2029	6	junho-29	2029-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1444322.28	0.00	0.00	25000.00	4728.34	1474050.61	0.00	0.00	300000.00	1174050.61	2025-08-13 16:47:29.972043	1
10327	3	2029	7	julho-29	2029-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1474050.61	0.00	0.00	25000.00	4825.66	1503876.27	0.00	0.00	300000.00	1203876.27	2025-08-13 16:47:29.972043	1
10328	3	2029	8	agosto-29	2029-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1503876.27	0.00	0.00	25000.00	4923.30	1533799.57	0.00	0.00	300000.00	1233799.57	2025-08-13 16:47:29.972043	1
10329	3	2029	9	setembro-29	2029-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1533799.57	0.00	0.00	25000.00	5021.26	1563820.83	0.00	0.00	300000.00	1263820.83	2025-08-13 16:47:29.972043	1
10330	3	2029	10	outubro-29	2029-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1563820.83	0.00	0.00	25000.00	5119.54	1593940.37	0.00	0.00	300000.00	1293940.37	2025-08-13 16:47:29.972043	1
10331	3	2029	11	novembro-29	2029-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1593940.37	0.00	0.00	25000.00	5218.15	1624158.52	0.00	0.00	300000.00	1324158.52	2025-08-13 16:47:29.972043	1
10332	3	2029	12	dezembro-29	2029-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1624158.52	0.00	0.00	25000.00	5317.07	1654475.59	0.00	0.00	300000.00	1354475.59	2025-08-13 16:47:29.972043	1
10333	3	2030	1	janeiro-30	2030-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1654475.59	0.00	0.00	25000.00	5416.32	1684891.91	0.00	0.00	300000.00	1384891.91	2025-08-13 16:47:29.972043	1
10334	3	2030	2	fevereiro-30	2030-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1684891.91	0.00	0.00	25000.00	5515.90	1715407.81	0.00	0.00	300000.00	1415407.81	2025-08-13 16:47:29.972043	1
10335	3	2030	3	março-30	2030-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1715407.81	0.00	0.00	25000.00	5615.80	1746023.61	0.00	0.00	300000.00	1446023.61	2025-08-13 16:47:29.972043	1
10336	3	2030	4	abril-30	2030-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1746023.61	0.00	0.00	25000.00	5716.03	1776739.64	0.00	0.00	300000.00	1476739.64	2025-08-13 16:47:29.972043	1
10337	3	2030	5	maio-30	2030-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1776739.64	0.00	0.00	25000.00	5816.58	1807556.22	0.00	0.00	300000.00	1507556.22	2025-08-13 16:47:29.972043	1
10338	3	2030	6	junho-30	2030-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1807556.22	0.00	0.00	25000.00	5917.47	1838473.69	0.00	0.00	300000.00	1538473.69	2025-08-13 16:47:29.972043	1
10339	3	2030	7	julho-30	2030-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1838473.69	0.00	0.00	25000.00	6018.68	1869492.37	0.00	0.00	300000.00	1569492.37	2025-08-13 16:47:29.972043	1
10340	3	2030	8	agosto-30	2030-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1869492.37	0.00	0.00	25000.00	6120.23	1900612.60	0.00	0.00	300000.00	1600612.60	2025-08-13 16:47:29.972043	1
10341	3	2030	9	setembro-30	2030-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1900612.60	0.00	0.00	25000.00	6222.11	1931834.72	0.00	0.00	300000.00	1631834.72	2025-08-13 16:47:29.972043	1
10342	3	2030	10	outubro-30	2030-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1931834.72	0.00	0.00	25000.00	6324.32	1963159.04	0.00	0.00	300000.00	1663159.04	2025-08-13 16:47:29.972043	1
10343	3	2030	11	novembro-30	2030-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1963159.04	0.00	0.00	25000.00	6426.87	1994585.91	0.00	0.00	300000.00	1694585.91	2025-08-13 16:47:29.972043	1
10344	3	2030	12	dezembro-30	2030-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	1994585.91	0.00	0.00	25000.00	6529.76	2026115.67	0.00	0.00	300000.00	1726115.67	2025-08-13 16:47:29.972043	1
10345	3	2031	1	janeiro-31	2031-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2026115.67	0.00	0.00	25000.00	6632.98	2057748.64	0.00	0.00	300000.00	1757748.64	2025-08-13 16:47:29.972043	1
10346	3	2031	2	fevereiro-31	2031-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2057748.64	0.00	0.00	25000.00	6736.53	2089485.18	0.00	0.00	300000.00	1789485.18	2025-08-13 16:47:29.972043	1
10347	3	2031	3	março-31	2031-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2089485.18	0.00	0.00	25000.00	6840.43	2121325.61	0.00	0.00	300000.00	1821325.61	2025-08-13 16:47:29.972043	1
10348	3	2031	4	abril-31	2031-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2121325.61	0.00	0.00	25000.00	6944.67	2153270.27	0.00	0.00	300000.00	1853270.27	2025-08-13 16:47:29.972043	1
10349	3	2031	5	maio-31	2031-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2153270.27	0.00	0.00	25000.00	7049.25	2185319.52	0.00	0.00	300000.00	1885319.52	2025-08-13 16:47:29.972043	1
10350	3	2031	6	junho-31	2031-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2185319.52	0.00	0.00	25000.00	7154.17	2217473.69	0.00	0.00	300000.00	1917473.69	2025-08-13 16:47:29.972043	1
10351	3	2031	7	julho-31	2031-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2217473.69	0.00	0.00	25000.00	7259.43	2249733.12	0.00	0.00	300000.00	1949733.12	2025-08-13 16:47:29.972043	1
10352	3	2031	8	agosto-31	2031-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2249733.12	0.00	0.00	25000.00	7365.04	2282098.16	0.00	0.00	300000.00	1982098.16	2025-08-13 16:47:29.972043	1
10353	3	2031	9	setembro-31	2031-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2282098.16	0.00	0.00	25000.00	7471.00	2314569.16	0.00	0.00	300000.00	2014569.16	2025-08-13 16:47:29.972043	1
10354	3	2031	10	outubro-31	2031-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2314569.16	0.00	0.00	25000.00	7577.30	2347146.45	0.00	0.00	300000.00	2047146.45	2025-08-13 16:47:29.972043	1
10355	3	2031	11	novembro-31	2031-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2347146.45	0.00	0.00	25000.00	7683.95	2379830.40	0.00	0.00	300000.00	2079830.40	2025-08-13 16:47:29.972043	1
10356	3	2031	12	dezembro-31	2031-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2379830.40	0.00	0.00	25000.00	7790.95	2412621.35	0.00	0.00	300000.00	2112621.35	2025-08-13 16:47:29.972043	1
10357	3	2032	1	janeiro-32	2032-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2412621.35	0.00	0.00	25000.00	7898.29	2445519.64	0.00	0.00	300000.00	2145519.64	2025-08-13 16:47:29.972043	1
10358	3	2032	2	fevereiro-32	2032-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2445519.64	0.00	0.00	25000.00	8005.99	2478525.64	0.00	0.00	300000.00	2178525.64	2025-08-13 16:47:29.972043	1
10359	3	2032	3	março-32	2032-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2478525.64	0.00	0.00	25000.00	8114.05	2511639.68	0.00	0.00	300000.00	2211639.68	2025-08-13 16:47:29.972043	1
10360	3	2032	4	abril-32	2032-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2511639.68	0.00	0.00	25000.00	8222.45	2544862.14	0.00	0.00	300000.00	2244862.14	2025-08-13 16:47:29.972043	1
10361	3	2032	5	maio-32	2032-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2544862.14	0.00	0.00	25000.00	8331.22	2578193.35	0.00	0.00	300000.00	2278193.35	2025-08-13 16:47:29.972043	1
10362	3	2032	6	junho-32	2032-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2578193.35	0.00	0.00	25000.00	8440.33	2611633.69	0.00	0.00	300000.00	2311633.69	2025-08-13 16:47:29.972043	1
10363	3	2032	7	julho-32	2032-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2611633.69	0.00	0.00	25000.00	8549.81	2645183.50	0.00	0.00	300000.00	2345183.50	2025-08-13 16:47:29.972043	1
10364	3	2032	8	agosto-32	2032-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2645183.50	0.00	0.00	25000.00	8659.64	2678843.14	0.00	0.00	300000.00	2378843.14	2025-08-13 16:47:29.972043	1
10365	3	2032	9	setembro-32	2032-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2678843.14	0.00	0.00	25000.00	8769.84	2712612.98	0.00	0.00	300000.00	2412612.98	2025-08-13 16:47:29.972043	1
10366	3	2032	10	outubro-32	2032-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2712612.98	0.00	0.00	25000.00	8880.39	2746493.36	0.00	0.00	300000.00	2446493.36	2025-08-13 16:47:29.972043	1
10367	3	2032	11	novembro-32	2032-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2746493.36	0.00	0.00	25000.00	8991.30	2780484.67	0.00	0.00	300000.00	2480484.67	2025-08-13 16:47:29.972043	1
10368	3	2032	12	dezembro-32	2032-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2780484.67	0.00	0.00	25000.00	9102.58	2814587.25	0.00	0.00	300000.00	2514587.25	2025-08-13 16:47:29.972043	1
10369	3	2033	1	janeiro-33	2033-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2814587.25	0.00	0.00	25000.00	9214.23	2848801.48	0.00	0.00	300000.00	2548801.48	2025-08-13 16:47:29.972043	1
10370	3	2033	2	fevereiro-33	2033-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2848801.48	0.00	0.00	25000.00	9326.23	2883127.71	0.00	0.00	300000.00	2583127.71	2025-08-13 16:47:29.972043	1
10371	3	2033	3	março-33	2033-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2883127.71	0.00	0.00	25000.00	9438.61	2917566.32	0.00	0.00	300000.00	2617566.32	2025-08-13 16:47:29.972043	1
10372	3	2033	4	abril-33	2033-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2917566.32	0.00	0.00	25000.00	9551.35	2952117.68	0.00	0.00	300000.00	2652117.68	2025-08-13 16:47:29.972043	1
10373	3	2033	5	maio-33	2033-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2952117.68	0.00	0.00	25000.00	9664.47	2986782.14	0.00	0.00	300000.00	2686782.14	2025-08-13 16:47:29.972043	1
10374	3	2033	6	junho-33	2033-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	2986782.14	0.00	0.00	25000.00	9777.95	3021560.09	0.00	0.00	300000.00	2721560.09	2025-08-13 16:47:29.972043	1
10375	3	2033	7	julho-33	2033-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3021560.09	0.00	0.00	25000.00	9891.80	3056451.89	0.00	0.00	300000.00	2756451.89	2025-08-13 16:47:29.972043	1
10376	3	2033	8	agosto-33	2033-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3056451.89	0.00	0.00	25000.00	10006.03	3091457.92	0.00	0.00	300000.00	2791457.92	2025-08-13 16:47:29.972043	1
10377	3	2033	9	setembro-33	2033-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3091457.92	0.00	0.00	25000.00	10120.63	3126578.55	0.00	0.00	300000.00	2826578.55	2025-08-13 16:47:29.972043	1
10378	3	2033	10	outubro-33	2033-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3126578.55	0.00	0.00	25000.00	10235.60	3161814.15	0.00	0.00	300000.00	2861814.15	2025-08-13 16:47:29.972043	1
10379	3	2033	11	novembro-33	2033-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3161814.15	0.00	0.00	25000.00	10350.96	3197165.11	0.00	0.00	300000.00	2897165.11	2025-08-13 16:47:29.972043	1
10380	3	2033	12	dezembro-33	2033-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3197165.11	0.00	0.00	25000.00	10466.69	3232631.80	0.00	0.00	300000.00	2932631.80	2025-08-13 16:47:29.972043	1
10381	3	2034	1	janeiro-34	2034-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3232631.80	0.00	0.00	25000.00	10582.80	3268214.59	0.00	0.00	300000.00	2968214.59	2025-08-13 16:47:29.972043	1
10382	3	2034	2	fevereiro-34	2034-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3268214.59	0.00	0.00	25000.00	10699.28	3303913.88	0.00	0.00	300000.00	3003913.88	2025-08-13 16:47:29.972043	1
10383	3	2034	3	março-34	2034-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3303913.88	0.00	0.00	25000.00	10816.15	3339730.03	0.00	0.00	300000.00	3039730.03	2025-08-13 16:47:29.972043	1
10384	3	2034	4	abril-34	2034-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3339730.03	0.00	0.00	25000.00	10933.41	3375663.44	0.00	0.00	300000.00	3075663.44	2025-08-13 16:47:29.972043	1
10385	3	2034	5	maio-34	2034-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3375663.44	0.00	0.00	25000.00	11051.04	3411714.48	0.00	0.00	300000.00	3111714.48	2025-08-13 16:47:29.972043	1
10386	3	2034	6	junho-34	2034-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3411714.48	0.00	0.00	25000.00	11169.07	3447883.55	0.00	0.00	300000.00	3147883.55	2025-08-13 16:47:29.972043	1
10387	3	2034	7	julho-34	2034-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3447883.55	0.00	0.00	25000.00	11287.47	3484171.02	0.00	0.00	300000.00	3184171.02	2025-08-13 16:47:29.972043	1
10388	3	2034	8	agosto-34	2034-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3484171.02	0.00	0.00	25000.00	11406.27	3520577.29	0.00	0.00	300000.00	3220577.29	2025-08-13 16:47:29.972043	1
10389	3	2034	9	setembro-34	2034-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3520577.29	0.00	0.00	25000.00	11525.45	3557102.74	0.00	0.00	300000.00	3257102.74	2025-08-13 16:47:29.972043	1
10390	3	2034	10	outubro-34	2034-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3557102.74	0.00	0.00	25000.00	11645.03	3593747.77	0.00	0.00	300000.00	3293747.77	2025-08-13 16:47:29.972043	1
10391	3	2034	11	novembro-34	2034-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3593747.77	0.00	0.00	25000.00	11765.00	3630512.77	0.00	0.00	300000.00	3330512.77	2025-08-13 16:47:29.972043	1
10392	3	2034	12	dezembro-34	2034-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3630512.77	0.00	0.00	25000.00	11885.35	3667398.12	0.00	0.00	300000.00	3367398.12	2025-08-13 16:47:29.972043	1
10393	3	2035	1	janeiro-35	2035-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3667398.12	0.00	0.00	25000.00	12006.11	3704404.23	0.00	0.00	300000.00	3404404.23	2025-08-13 16:47:29.972043	1
10394	3	2035	2	fevereiro-35	2035-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3704404.23	0.00	0.00	25000.00	12127.26	3741531.48	0.00	0.00	300000.00	3441531.48	2025-08-13 16:47:29.972043	1
10395	3	2035	3	março-35	2035-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3741531.48	0.00	0.00	25000.00	12248.80	3778780.28	0.00	0.00	300000.00	3478780.28	2025-08-13 16:47:29.972043	1
10396	3	2035	4	abril-35	2035-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3778780.28	0.00	0.00	25000.00	12370.74	3816151.03	0.00	0.00	300000.00	3516151.03	2025-08-13 16:47:29.972043	1
10397	3	2035	5	maio-35	2035-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3816151.03	0.00	0.00	25000.00	12493.09	3853644.11	0.00	0.00	300000.00	3553644.11	2025-08-13 16:47:29.972043	1
10398	3	2035	6	junho-35	2035-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3853644.11	0.00	0.00	25000.00	12615.83	3891259.94	0.00	0.00	300000.00	3591259.94	2025-08-13 16:47:29.972043	1
10399	3	2035	7	julho-35	2035-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3891259.94	0.00	0.00	25000.00	12738.97	3928998.91	0.00	0.00	300000.00	3628998.91	2025-08-13 16:47:29.972043	1
10400	3	2035	8	agosto-35	2035-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3928998.91	0.00	0.00	25000.00	12862.52	3966861.43	0.00	0.00	300000.00	3666861.43	2025-08-13 16:47:29.972043	1
10401	3	2035	9	setembro-35	2035-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	3966861.43	0.00	0.00	25000.00	12986.47	4004847.90	0.00	0.00	300000.00	3704847.90	2025-08-13 16:47:29.972043	1
10402	3	2035	10	outubro-35	2035-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4004847.90	0.00	0.00	25000.00	13110.83	4042958.73	0.00	0.00	300000.00	3742958.73	2025-08-13 16:47:29.972043	1
10403	3	2035	11	novembro-35	2035-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4042958.73	0.00	0.00	25000.00	13235.59	4081194.33	0.00	0.00	300000.00	3781194.33	2025-08-13 16:47:29.972043	1
10404	3	2035	12	dezembro-35	2035-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4081194.33	0.00	0.00	25000.00	13360.77	4119555.10	0.00	0.00	300000.00	3819555.10	2025-08-13 16:47:29.972043	1
10405	3	2036	1	janeiro-36	2036-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4119555.10	0.00	0.00	25000.00	13486.35	4158041.45	0.00	0.00	300000.00	3858041.45	2025-08-13 16:47:29.972043	1
10406	3	2036	2	fevereiro-36	2036-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4158041.45	0.00	0.00	25000.00	13612.35	4196653.79	0.00	0.00	300000.00	3896653.79	2025-08-13 16:47:29.972043	1
10407	3	2036	3	março-36	2036-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4196653.79	0.00	0.00	25000.00	13738.75	4235392.55	0.00	0.00	300000.00	3935392.55	2025-08-13 16:47:29.972043	1
10408	3	2036	4	abril-36	2036-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4235392.55	0.00	0.00	25000.00	13865.57	4274258.12	0.00	0.00	300000.00	3974258.12	2025-08-13 16:47:29.972043	1
10409	3	2036	5	maio-36	2036-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4274258.12	0.00	0.00	25000.00	13992.81	4313250.93	0.00	0.00	300000.00	4013250.93	2025-08-13 16:47:29.972043	1
10646	3	2056	2	fevereiro-56	2056-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	17875363.02	0.00	0.00	0.00	58519.29	17933882.31	0.00	0.00	300000.00	17633882.31	2025-08-13 16:47:29.972043	1
10410	3	2036	6	junho-36	2036-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4313250.93	0.00	0.00	25000.00	14120.46	4352371.39	0.00	0.00	300000.00	4052371.39	2025-08-13 16:47:29.972043	1
10411	3	2036	7	julho-36	2036-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4352371.39	0.00	0.00	25000.00	14248.53	4391619.92	0.00	0.00	300000.00	4091619.92	2025-08-13 16:47:29.972043	1
10412	3	2036	8	agosto-36	2036-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4391619.92	0.00	0.00	25000.00	14377.02	4430996.94	0.00	0.00	300000.00	4130996.94	2025-08-13 16:47:29.972043	1
10413	3	2036	9	setembro-36	2036-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4430996.94	0.00	0.00	25000.00	14505.93	4470502.87	0.00	0.00	300000.00	4170502.87	2025-08-13 16:47:29.972043	1
10414	3	2036	10	outubro-36	2036-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4470502.87	0.00	0.00	25000.00	14635.26	4510138.14	0.00	0.00	300000.00	4210138.14	2025-08-13 16:47:29.972043	1
10415	3	2036	11	novembro-36	2036-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4510138.14	0.00	0.00	25000.00	14765.02	4549903.16	0.00	0.00	300000.00	4249903.16	2025-08-13 16:47:29.972043	1
10416	3	2036	12	dezembro-36	2036-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4549903.16	0.00	0.00	25000.00	14895.20	4589798.35	0.00	0.00	300000.00	4289798.35	2025-08-13 16:47:29.972043	1
10417	3	2037	1	janeiro-37	2037-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4589798.35	0.00	0.00	25000.00	15025.81	4629824.16	0.00	0.00	300000.00	4329824.16	2025-08-13 16:47:29.972043	1
10418	3	2037	2	fevereiro-37	2037-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4629824.16	0.00	0.00	25000.00	15156.84	4669981.00	0.00	0.00	300000.00	4369981.00	2025-08-13 16:47:29.972043	1
10419	3	2037	3	março-37	2037-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4669981.00	0.00	0.00	25000.00	15288.30	4710269.30	0.00	0.00	300000.00	4410269.30	2025-08-13 16:47:29.972043	1
10420	3	2037	4	abril-37	2037-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4710269.30	0.00	0.00	25000.00	15420.20	4750689.50	0.00	0.00	300000.00	4450689.50	2025-08-13 16:47:29.972043	1
10421	3	2037	5	maio-37	2037-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4750689.50	0.00	0.00	25000.00	15552.52	4791242.02	0.00	0.00	300000.00	4491242.02	2025-08-13 16:47:29.972043	1
10422	3	2037	6	junho-37	2037-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4791242.02	0.00	0.00	25000.00	15685.28	4831927.30	0.00	0.00	300000.00	4531927.30	2025-08-13 16:47:29.972043	1
10423	3	2037	7	julho-37	2037-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4831927.30	0.00	0.00	25000.00	15818.47	4872745.77	0.00	0.00	300000.00	4572745.77	2025-08-13 16:47:29.972043	1
10424	3	2037	8	agosto-37	2037-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4872745.77	0.00	0.00	25000.00	15952.10	4913697.87	0.00	0.00	300000.00	4613697.87	2025-08-13 16:47:29.972043	1
10425	3	2037	9	setembro-37	2037-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4913697.87	0.00	0.00	25000.00	16086.17	4954784.04	0.00	0.00	300000.00	4654784.04	2025-08-13 16:47:29.972043	1
10426	3	2037	10	outubro-37	2037-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4954784.04	0.00	0.00	25000.00	16220.67	4996004.71	0.00	0.00	300000.00	4696004.71	2025-08-13 16:47:29.972043	1
10427	3	2037	11	novembro-37	2037-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	4996004.71	0.00	0.00	25000.00	16355.62	5037360.33	0.00	0.00	300000.00	4737360.33	2025-08-13 16:47:29.972043	1
10428	3	2037	12	dezembro-37	2037-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5037360.33	0.00	0.00	25000.00	16491.01	5078851.34	0.00	0.00	300000.00	4778851.34	2025-08-13 16:47:29.972043	1
10429	3	2038	1	janeiro-38	2038-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5078851.34	0.00	0.00	25000.00	16626.84	5120478.18	0.00	0.00	300000.00	4820478.18	2025-08-13 16:47:29.972043	1
10430	3	2038	2	fevereiro-38	2038-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5120478.18	0.00	0.00	25000.00	16763.11	5162241.29	0.00	0.00	300000.00	4862241.29	2025-08-13 16:47:29.972043	1
10431	3	2038	3	março-38	2038-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5162241.29	0.00	0.00	25000.00	16899.83	5204141.13	0.00	0.00	300000.00	4904141.13	2025-08-13 16:47:29.972043	1
10432	3	2038	4	abril-38	2038-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5204141.13	0.00	0.00	25000.00	17037.00	5246178.13	0.00	0.00	300000.00	4946178.13	2025-08-13 16:47:29.972043	1
10433	3	2038	5	maio-38	2038-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5246178.13	0.00	0.00	25000.00	17174.62	5288352.75	0.00	0.00	300000.00	4988352.75	2025-08-13 16:47:29.972043	1
10434	3	2038	6	junho-38	2038-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5288352.75	0.00	0.00	25000.00	17312.69	5330665.44	0.00	0.00	300000.00	5030665.44	2025-08-13 16:47:29.972043	1
10435	3	2038	7	julho-38	2038-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5330665.44	0.00	0.00	25000.00	17451.21	5373116.65	0.00	0.00	300000.00	5073116.65	2025-08-13 16:47:29.972043	1
10436	3	2038	8	agosto-38	2038-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5373116.65	0.00	0.00	25000.00	17590.19	5415706.84	0.00	0.00	300000.00	5115706.84	2025-08-13 16:47:29.972043	1
10437	3	2038	9	setembro-38	2038-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5415706.84	0.00	0.00	25000.00	17729.61	5458436.46	0.00	0.00	300000.00	5158436.46	2025-08-13 16:47:29.972043	1
10438	3	2038	10	outubro-38	2038-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5458436.46	0.00	0.00	25000.00	17869.50	5501305.96	0.00	0.00	300000.00	5201305.96	2025-08-13 16:47:29.972043	1
10439	3	2038	11	novembro-38	2038-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5501305.96	0.00	0.00	25000.00	18009.84	5544315.80	0.00	0.00	300000.00	5244315.80	2025-08-13 16:47:29.972043	1
10440	3	2038	12	dezembro-38	2038-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5544315.80	0.00	0.00	25000.00	18150.65	5587466.45	0.00	0.00	300000.00	5287466.45	2025-08-13 16:47:29.972043	1
10441	3	2039	1	janeiro-39	2039-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5587466.45	0.00	0.00	25000.00	18291.91	5630758.36	0.00	0.00	300000.00	5330758.36	2025-08-13 16:47:29.972043	1
10442	3	2039	2	fevereiro-39	2039-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5630758.36	0.00	0.00	25000.00	18433.64	5674192.00	0.00	0.00	300000.00	5374192.00	2025-08-13 16:47:29.972043	1
10443	3	2039	3	março-39	2039-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5674192.00	0.00	0.00	25000.00	18575.83	5717767.82	0.00	0.00	300000.00	5417767.82	2025-08-13 16:47:29.972043	1
10444	3	2039	4	abril-39	2039-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5717767.82	0.00	0.00	25000.00	18718.48	5761486.31	0.00	0.00	300000.00	5461486.31	2025-08-13 16:47:29.972043	1
10445	3	2039	5	maio-39	2039-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5761486.31	0.00	0.00	25000.00	18861.61	5805347.92	0.00	0.00	300000.00	5505347.92	2025-08-13 16:47:29.972043	1
10446	3	2039	6	junho-39	2039-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5805347.92	0.00	0.00	25000.00	19005.20	5849353.11	0.00	0.00	300000.00	5549353.11	2025-08-13 16:47:29.972043	1
10447	3	2039	7	julho-39	2039-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5849353.11	0.00	0.00	25000.00	19149.26	5893502.37	0.00	0.00	300000.00	5593502.37	2025-08-13 16:47:29.972043	1
10448	3	2039	8	agosto-39	2039-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5893502.37	0.00	0.00	25000.00	19293.79	5937796.17	0.00	0.00	300000.00	5637796.17	2025-08-13 16:47:29.972043	1
10449	3	2039	9	setembro-39	2039-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5937796.17	0.00	0.00	25000.00	19438.80	5982234.97	0.00	0.00	300000.00	5682234.97	2025-08-13 16:47:29.972043	1
10450	3	2039	10	outubro-39	2039-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	5982234.97	0.00	0.00	25000.00	19584.28	6026819.25	0.00	0.00	300000.00	5726819.25	2025-08-13 16:47:29.972043	1
10451	3	2039	11	novembro-39	2039-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6026819.25	0.00	0.00	25000.00	19730.24	6071549.48	0.00	0.00	300000.00	5771549.48	2025-08-13 16:47:29.972043	1
10452	3	2039	12	dezembro-39	2039-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6071549.48	0.00	0.00	25000.00	19876.67	6116426.16	0.00	0.00	300000.00	5816426.16	2025-08-13 16:47:29.972043	1
10453	3	2040	1	janeiro-40	2040-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6116426.16	0.00	0.00	25000.00	20023.59	6161449.75	0.00	0.00	300000.00	5861449.75	2025-08-13 16:47:29.972043	1
10454	3	2040	2	fevereiro-40	2040-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6161449.75	0.00	0.00	25000.00	20170.98	6206620.73	0.00	0.00	300000.00	5906620.73	2025-08-13 16:47:29.972043	1
10455	3	2040	3	março-40	2040-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6206620.73	0.00	0.00	25000.00	20318.86	6251939.59	0.00	0.00	300000.00	5951939.59	2025-08-13 16:47:29.972043	1
10456	3	2040	4	abril-40	2040-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6251939.59	0.00	0.00	25000.00	20467.22	6297406.81	0.00	0.00	300000.00	5997406.81	2025-08-13 16:47:29.972043	1
10457	3	2040	5	maio-40	2040-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6297406.81	0.00	0.00	25000.00	20616.07	6343022.88	0.00	0.00	300000.00	6043022.88	2025-08-13 16:47:29.972043	1
10458	3	2040	6	junho-40	2040-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6343022.88	0.00	0.00	25000.00	20765.41	6388788.29	0.00	0.00	300000.00	6088788.29	2025-08-13 16:47:29.972043	1
10459	3	2040	7	julho-40	2040-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6388788.29	0.00	0.00	25000.00	20915.23	6434703.52	0.00	0.00	300000.00	6134703.52	2025-08-13 16:47:29.972043	1
10460	3	2040	8	agosto-40	2040-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6434703.52	0.00	0.00	25000.00	21065.54	6480769.07	0.00	0.00	300000.00	6180769.07	2025-08-13 16:47:29.972043	1
10461	3	2040	9	setembro-40	2040-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6480769.07	0.00	0.00	25000.00	21216.35	6526985.42	0.00	0.00	300000.00	6226985.42	2025-08-13 16:47:29.972043	1
10462	3	2040	10	outubro-40	2040-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6526985.42	0.00	0.00	25000.00	21367.65	6573353.07	0.00	0.00	300000.00	6273353.07	2025-08-13 16:47:29.972043	1
10463	3	2040	11	novembro-40	2040-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6573353.07	0.00	0.00	25000.00	21519.45	6619872.52	0.00	0.00	300000.00	6319872.52	2025-08-13 16:47:29.972043	1
10464	3	2040	12	dezembro-40	2040-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6619872.52	0.00	0.00	25000.00	21671.74	6666544.26	0.00	0.00	300000.00	6366544.26	2025-08-13 16:47:29.972043	1
10465	3	2041	1	janeiro-41	2041-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6666544.26	0.00	0.00	25000.00	21824.53	6713368.79	0.00	0.00	300000.00	6413368.79	2025-08-13 16:47:29.972043	1
10466	3	2041	2	fevereiro-41	2041-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6713368.79	0.00	0.00	25000.00	21977.82	6760346.61	0.00	0.00	300000.00	6460346.61	2025-08-13 16:47:29.972043	1
10467	3	2041	3	março-41	2041-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6760346.61	0.00	0.00	25000.00	22131.62	6807478.23	0.00	0.00	300000.00	6507478.23	2025-08-13 16:47:29.972043	1
10468	3	2041	4	abril-41	2041-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6807478.23	0.00	0.00	25000.00	22285.91	6854764.14	0.00	0.00	300000.00	6554764.14	2025-08-13 16:47:29.972043	1
10469	3	2041	5	maio-41	2041-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6854764.14	0.00	0.00	25000.00	22440.71	6902204.85	0.00	0.00	300000.00	6602204.85	2025-08-13 16:47:29.972043	1
10470	3	2041	6	junho-41	2041-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6902204.85	0.00	0.00	25000.00	22596.02	6949800.87	0.00	0.00	300000.00	6649800.87	2025-08-13 16:47:29.972043	1
10471	3	2041	7	julho-41	2041-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6949800.87	0.00	0.00	25000.00	22751.84	6997552.71	0.00	0.00	300000.00	6697552.71	2025-08-13 16:47:29.972043	1
10472	3	2041	8	agosto-41	2041-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	6997552.71	0.00	0.00	25000.00	22908.17	7045460.88	0.00	0.00	300000.00	6745460.88	2025-08-13 16:47:29.972043	1
10473	3	2041	9	setembro-41	2041-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7045460.88	0.00	0.00	25000.00	23065.01	7093525.89	0.00	0.00	300000.00	6793525.89	2025-08-13 16:47:29.972043	1
10474	3	2041	10	outubro-41	2041-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7093525.89	0.00	0.00	25000.00	23222.36	7141748.24	0.00	0.00	300000.00	6841748.24	2025-08-13 16:47:29.972043	1
10475	3	2041	11	novembro-41	2041-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7141748.24	0.00	0.00	25000.00	23380.23	7190128.47	0.00	0.00	300000.00	6890128.47	2025-08-13 16:47:29.972043	1
10476	3	2041	12	dezembro-41	2041-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7190128.47	0.00	0.00	25000.00	23538.61	7238667.08	0.00	0.00	300000.00	6938667.08	2025-08-13 16:47:29.972043	1
10477	3	2042	1	janeiro-42	2042-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7238667.08	0.00	0.00	25000.00	23697.51	7287364.59	0.00	0.00	300000.00	6987364.59	2025-08-13 16:47:29.972043	1
10478	3	2042	2	fevereiro-42	2042-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7287364.59	0.00	0.00	25000.00	23856.94	7336221.53	0.00	0.00	300000.00	7036221.53	2025-08-13 16:47:29.972043	1
10479	3	2042	3	março-42	2042-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7336221.53	0.00	0.00	25000.00	24016.88	7385238.41	0.00	0.00	300000.00	7085238.41	2025-08-13 16:47:29.972043	1
10480	3	2042	4	abril-42	2042-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7385238.41	0.00	0.00	25000.00	24177.35	7434415.76	0.00	0.00	300000.00	7134415.76	2025-08-13 16:47:29.972043	1
10481	3	2042	5	maio-42	2042-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7434415.76	0.00	0.00	25000.00	24338.34	7483754.10	0.00	0.00	300000.00	7183754.10	2025-08-13 16:47:29.972043	1
10482	3	2042	6	junho-42	2042-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7483754.10	0.00	0.00	25000.00	24499.86	7533253.96	0.00	0.00	300000.00	7233253.96	2025-08-13 16:47:29.972043	1
10483	3	2042	7	julho-42	2042-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7533253.96	0.00	0.00	25000.00	24661.91	7582915.88	0.00	0.00	300000.00	7282915.88	2025-08-13 16:47:29.972043	1
10484	3	2042	8	agosto-42	2042-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7582915.88	0.00	0.00	25000.00	24824.49	7632740.37	0.00	0.00	300000.00	7332740.37	2025-08-13 16:47:29.972043	1
10485	3	2042	9	setembro-42	2042-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7632740.37	0.00	0.00	25000.00	24987.61	7682727.97	0.00	0.00	300000.00	7382727.97	2025-08-13 16:47:29.972043	1
10486	3	2042	10	outubro-42	2042-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7682727.97	0.00	0.00	25000.00	25151.25	7732879.23	0.00	0.00	300000.00	7432879.23	2025-08-13 16:47:29.972043	1
10487	3	2042	11	novembro-42	2042-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7732879.23	0.00	0.00	25000.00	25315.43	7783194.66	0.00	0.00	300000.00	7483194.66	2025-08-13 16:47:29.972043	1
10488	3	2042	12	dezembro-42	2042-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7783194.66	0.00	0.00	25000.00	25480.15	7833674.82	0.00	0.00	300000.00	7533674.82	2025-08-13 16:47:29.972043	1
10489	3	2043	1	janeiro-43	2043-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7833674.82	0.00	0.00	25000.00	25645.41	7884320.23	0.00	0.00	300000.00	7584320.23	2025-08-13 16:47:29.972043	1
10490	3	2043	2	fevereiro-43	2043-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7884320.23	0.00	0.00	25000.00	25811.21	7935131.44	0.00	0.00	300000.00	7635131.44	2025-08-13 16:47:29.972043	1
10491	3	2043	3	março-43	2043-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7935131.44	0.00	0.00	25000.00	25977.56	7986109.00	0.00	0.00	300000.00	7686109.00	2025-08-13 16:47:29.972043	1
10492	3	2043	4	abril-43	2043-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	7986109.00	0.00	0.00	25000.00	26144.44	8037253.44	0.00	0.00	300000.00	7737253.44	2025-08-13 16:47:29.972043	1
10493	3	2043	5	maio-43	2043-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8037253.44	0.00	0.00	25000.00	26311.88	8088565.32	0.00	0.00	300000.00	7788565.32	2025-08-13 16:47:29.972043	1
10494	3	2043	6	junho-43	2043-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8088565.32	0.00	0.00	25000.00	26479.86	8140045.17	0.00	0.00	300000.00	7840045.17	2025-08-13 16:47:29.972043	1
10495	3	2043	7	julho-43	2043-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8140045.17	0.00	0.00	25000.00	26648.39	8191693.56	0.00	0.00	300000.00	7891693.56	2025-08-13 16:47:29.972043	1
10496	3	2043	8	agosto-43	2043-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8191693.56	0.00	0.00	25000.00	26817.47	8243511.04	0.00	0.00	300000.00	7943511.04	2025-08-13 16:47:29.972043	1
10497	3	2043	9	setembro-43	2043-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8243511.04	0.00	0.00	25000.00	26987.11	8295498.15	0.00	0.00	300000.00	7995498.15	2025-08-13 16:47:29.972043	1
10498	3	2043	10	outubro-43	2043-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8295498.15	0.00	0.00	25000.00	27157.30	8347655.45	0.00	0.00	300000.00	8047655.45	2025-08-13 16:47:29.972043	1
10499	3	2043	11	novembro-43	2043-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8347655.45	0.00	0.00	25000.00	27328.05	8399983.50	0.00	0.00	300000.00	8099983.50	2025-08-13 16:47:29.972043	1
10500	3	2043	12	dezembro-43	2043-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8399983.50	0.00	0.00	25000.00	27499.36	8452482.86	0.00	0.00	300000.00	8152482.86	2025-08-13 16:47:29.972043	1
10501	3	2044	1	janeiro-44	2044-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8452482.86	0.00	0.00	25000.00	27671.23	8505154.09	0.00	0.00	300000.00	8205154.09	2025-08-13 16:47:29.972043	1
10502	3	2044	2	fevereiro-44	2044-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8505154.09	0.00	0.00	25000.00	27843.66	8557997.75	0.00	0.00	300000.00	8257997.75	2025-08-13 16:47:29.972043	1
10503	3	2044	3	março-44	2044-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8557997.75	0.00	0.00	25000.00	28016.66	8611014.41	0.00	0.00	300000.00	8311014.41	2025-08-13 16:47:29.972043	1
10504	3	2044	4	abril-44	2044-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8611014.41	0.00	0.00	25000.00	28190.22	8664204.63	0.00	0.00	300000.00	8364204.63	2025-08-13 16:47:29.972043	1
10505	3	2044	5	maio-44	2044-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8664204.63	0.00	0.00	25000.00	28364.35	8717568.98	0.00	0.00	300000.00	8417568.98	2025-08-13 16:47:29.972043	1
10506	3	2044	6	junho-44	2044-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8717568.98	0.00	0.00	25000.00	28539.05	8771108.03	0.00	0.00	300000.00	8471108.03	2025-08-13 16:47:29.972043	1
10507	3	2044	7	julho-44	2044-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8771108.03	0.00	0.00	25000.00	28714.33	8824822.36	0.00	0.00	300000.00	8524822.36	2025-08-13 16:47:29.972043	1
10508	3	2044	8	agosto-44	2044-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8824822.36	0.00	0.00	25000.00	28890.17	8878712.53	0.00	0.00	300000.00	8578712.53	2025-08-13 16:47:29.972043	1
10509	3	2044	9	setembro-44	2044-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8878712.53	0.00	0.00	25000.00	29066.59	8932779.13	0.00	0.00	300000.00	8632779.13	2025-08-13 16:47:29.972043	1
10510	3	2044	10	outubro-44	2044-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8932779.13	0.00	0.00	25000.00	29243.59	8987022.72	0.00	0.00	300000.00	8687022.72	2025-08-13 16:47:29.972043	1
10511	3	2044	11	novembro-44	2044-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	8987022.72	0.00	0.00	25000.00	29421.17	9041443.89	0.00	0.00	300000.00	8741443.89	2025-08-13 16:47:29.972043	1
10512	3	2044	12	dezembro-44	2044-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9041443.89	0.00	0.00	25000.00	29599.33	9096043.23	0.00	0.00	300000.00	8796043.23	2025-08-13 16:47:29.972043	1
10513	3	2045	1	janeiro-45	2045-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9096043.23	0.00	0.00	25000.00	29778.08	9150821.31	0.00	0.00	300000.00	8850821.31	2025-08-13 16:47:29.972043	1
10514	3	2045	2	fevereiro-45	2045-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9150821.31	0.00	0.00	25000.00	29957.41	9205778.71	0.00	0.00	300000.00	8905778.71	2025-08-13 16:47:29.972043	1
10515	3	2045	3	março-45	2045-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9205778.71	0.00	0.00	25000.00	30137.32	9260916.04	0.00	0.00	300000.00	8960916.04	2025-08-13 16:47:29.972043	1
10516	3	2045	4	abril-45	2045-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9260916.04	0.00	0.00	25000.00	30317.83	9316233.87	0.00	0.00	300000.00	9016233.87	2025-08-13 16:47:29.972043	1
10517	3	2045	5	maio-45	2045-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9316233.87	0.00	0.00	25000.00	30498.93	9371732.79	0.00	0.00	300000.00	9071732.79	2025-08-13 16:47:29.972043	1
10518	3	2045	6	junho-45	2045-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9371732.79	0.00	0.00	25000.00	30680.61	9427413.41	0.00	0.00	300000.00	9127413.41	2025-08-13 16:47:29.972043	1
10519	3	2045	7	julho-45	2045-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9427413.41	0.00	0.00	25000.00	30862.90	9483276.31	0.00	0.00	300000.00	9183276.31	2025-08-13 16:47:29.972043	1
10520	3	2045	8	agosto-45	2045-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9483276.31	0.00	0.00	25000.00	31045.78	9539322.08	0.00	0.00	300000.00	9239322.08	2025-08-13 16:47:29.972043	1
10521	3	2045	9	setembro-45	2045-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9539322.08	0.00	0.00	25000.00	31229.26	9595551.34	0.00	0.00	300000.00	9295551.34	2025-08-13 16:47:29.972043	1
10522	3	2045	10	outubro-45	2045-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9595551.34	0.00	0.00	25000.00	31413.34	9651964.68	0.00	0.00	300000.00	9351964.68	2025-08-13 16:47:29.972043	1
10523	3	2045	11	novembro-45	2045-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9651964.68	0.00	0.00	25000.00	31598.02	9708562.70	0.00	0.00	300000.00	9408562.70	2025-08-13 16:47:29.972043	1
10524	3	2045	12	dezembro-45	2045-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9708562.70	0.00	0.00	25000.00	31783.31	9765346.01	0.00	0.00	300000.00	9465346.01	2025-08-13 16:47:29.972043	1
10525	3	2046	1	janeiro-46	2046-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9765346.01	0.00	0.00	25000.00	31969.20	9822315.21	0.00	0.00	300000.00	9522315.21	2025-08-13 16:47:29.972043	1
10526	3	2046	2	fevereiro-46	2046-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9822315.21	0.00	0.00	25000.00	32155.70	9879470.92	0.00	0.00	300000.00	9579470.92	2025-08-13 16:47:29.972043	1
10527	3	2046	3	março-46	2046-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9879470.92	0.00	0.00	25000.00	32342.82	9936813.73	0.00	0.00	300000.00	9636813.73	2025-08-13 16:47:29.972043	1
10528	3	2046	4	abril-46	2046-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9936813.73	0.00	0.00	25000.00	32530.54	9994344.27	0.00	0.00	300000.00	9694344.27	2025-08-13 16:47:29.972043	1
10529	3	2046	5	maio-46	2046-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	9994344.27	0.00	0.00	25000.00	32718.88	10052063.16	0.00	0.00	300000.00	9752063.16	2025-08-13 16:47:29.972043	1
10530	3	2046	6	junho-46	2046-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	10052063.16	0.00	0.00	25000.00	32907.84	10109971.00	0.00	0.00	300000.00	9809971.00	2025-08-13 16:47:29.972043	1
10531	3	2046	7	julho-46	2046-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	10109971.00	0.00	0.00	25000.00	33097.41	10168068.41	0.00	0.00	300000.00	9868068.41	2025-08-13 16:47:29.972043	1
10532	3	2046	8	agosto-46	2046-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	10168068.41	0.00	0.00	25000.00	33287.61	10226356.02	0.00	0.00	300000.00	9926356.02	2025-08-13 16:47:29.972043	1
10533	3	2046	9	setembro-46	2046-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	10226356.02	0.00	0.00	25000.00	33478.43	10284834.45	0.00	0.00	300000.00	9984834.45	2025-08-13 16:47:29.972043	1
10534	3	2046	10	outubro-46	2046-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	10284834.45	0.00	0.00	25000.00	33669.87	10343504.32	0.00	0.00	300000.00	10043504.32	2025-08-13 16:47:29.972043	1
10535	3	2046	11	novembro-46	2046-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	10343504.32	0.00	0.00	25000.00	33861.94	10402366.26	0.00	0.00	300000.00	10102366.26	2025-08-13 16:47:29.972043	1
10536	3	2046	12	dezembro-46	2046-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	10402366.26	0.00	0.00	25000.00	34054.64	10461420.90	0.00	0.00	300000.00	10161420.90	2025-08-13 16:47:29.972043	1
10537	3	2047	1	janeiro-47	2047-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	10461420.90	0.00	0.00	25000.00	34247.97	10520668.87	0.00	0.00	300000.00	10220668.87	2025-08-13 16:47:29.972043	1
10538	3	2047	2	fevereiro-47	2047-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	10520668.87	0.00	0.00	25000.00	34441.93	10580110.80	0.00	0.00	300000.00	10280110.80	2025-08-13 16:47:29.972043	1
10539	3	2047	3	março-47	2047-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	10580110.80	0.00	0.00	25000.00	34636.53	10639747.33	0.00	0.00	300000.00	10339747.33	2025-08-13 16:47:29.972043	1
10540	3	2047	4	abril-47	2047-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	10639747.33	0.00	0.00	25000.00	34831.76	10699579.10	0.00	0.00	300000.00	10399579.10	2025-08-13 16:47:29.972043	1
10541	3	2047	5	maio-47	2047-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	10699579.10	0.00	0.00	25000.00	35027.64	10759606.74	0.00	0.00	300000.00	10459606.74	2025-08-13 16:47:29.972043	1
10542	3	2047	6	junho-47	2047-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	10759606.74	0.00	0.00	25000.00	35224.15	10819830.89	0.00	0.00	300000.00	10519830.89	2025-08-13 16:47:29.972043	1
10543	3	2047	7	julho-47	2047-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	10819830.89	0.00	0.00	25000.00	35421.31	10880252.20	0.00	0.00	300000.00	10580252.20	2025-08-13 16:47:29.972043	1
10544	3	2047	8	agosto-47	2047-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	10880252.20	0.00	0.00	25000.00	35619.11	10940871.31	0.00	0.00	300000.00	10640871.31	2025-08-13 16:47:29.972043	1
10545	3	2047	9	setembro-47	2047-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	10940871.31	0.00	0.00	25000.00	35817.57	11001688.88	0.00	0.00	300000.00	10701688.88	2025-08-13 16:47:29.972043	1
10546	3	2047	10	outubro-47	2047-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	11001688.88	0.00	0.00	25000.00	36016.67	11062705.55	0.00	0.00	300000.00	10762705.55	2025-08-13 16:47:29.972043	1
10547	3	2047	11	novembro-47	2047-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	11062705.55	0.00	0.00	25000.00	36216.42	11123921.97	0.00	0.00	300000.00	10823921.97	2025-08-13 16:47:29.972043	1
10548	3	2047	12	dezembro-47	2047-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	11123921.97	0.00	0.00	25000.00	36416.83	11185338.79	0.00	0.00	300000.00	10885338.79	2025-08-13 16:47:29.972043	1
10549	3	2048	1	janeiro-48	2048-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	11185338.79	0.00	0.00	25000.00	36617.89	11246956.68	0.00	0.00	300000.00	10946956.68	2025-08-13 16:47:29.972043	1
10550	3	2048	2	fevereiro-48	2048-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	11246956.68	0.00	0.00	25000.00	36819.61	11308776.29	0.00	0.00	300000.00	11008776.29	2025-08-13 16:47:29.972043	1
10551	3	2048	3	março-48	2048-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	11308776.29	0.00	0.00	25000.00	37021.99	11370798.28	0.00	0.00	300000.00	11070798.28	2025-08-13 16:47:29.972043	1
10552	3	2048	4	abril-48	2048-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	11370798.28	0.00	0.00	25000.00	37225.03	11433023.32	0.00	0.00	300000.00	11133023.32	2025-08-13 16:47:29.972043	1
10553	3	2048	5	maio-48	2048-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	11433023.32	0.00	0.00	25000.00	37428.74	11495452.06	0.00	0.00	300000.00	11195452.06	2025-08-13 16:47:29.972043	1
10554	3	2048	6	junho-48	2048-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	11495452.06	0.00	0.00	25000.00	37633.12	11558085.18	0.00	0.00	300000.00	11258085.18	2025-08-13 16:47:29.972043	1
10555	3	2048	7	julho-48	2048-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	11558085.18	0.00	0.00	25000.00	37838.16	11620923.34	0.00	0.00	300000.00	11320923.34	2025-08-13 16:47:29.972043	1
10556	3	2048	8	agosto-48	2048-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	11620923.34	0.00	0.00	25000.00	38043.88	11683967.22	0.00	0.00	300000.00	11383967.22	2025-08-13 16:47:29.972043	1
10557	3	2048	9	setembro-48	2048-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	11683967.22	0.00	0.00	25000.00	38250.27	11747217.49	0.00	0.00	300000.00	11447217.49	2025-08-13 16:47:29.972043	1
10558	3	2048	10	outubro-48	2048-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	11747217.49	0.00	0.00	25000.00	38457.33	11810674.82	0.00	0.00	300000.00	11510674.82	2025-08-13 16:47:29.972043	1
10559	3	2048	11	novembro-48	2048-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	11810674.82	0.00	0.00	25000.00	38665.08	11874339.90	0.00	0.00	300000.00	11574339.90	2025-08-13 16:47:29.972043	1
10560	3	2048	12	dezembro-48	2048-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	11874339.90	0.00	0.00	25000.00	38873.50	11938213.40	0.00	0.00	300000.00	11638213.40	2025-08-13 16:47:29.972043	1
10561	3	2049	1	janeiro-49	2049-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	11938213.40	0.00	0.00	25000.00	39082.60	12002296.00	0.00	0.00	300000.00	11702296.00	2025-08-13 16:47:29.972043	1
10562	3	2049	2	fevereiro-49	2049-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	12002296.00	0.00	0.00	25000.00	39292.39	12066588.39	0.00	0.00	300000.00	11766588.39	2025-08-13 16:47:29.972043	1
10563	3	2049	3	março-49	2049-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	12066588.39	0.00	0.00	25000.00	39502.87	12131091.26	0.00	0.00	300000.00	11831091.26	2025-08-13 16:47:29.972043	1
10564	3	2049	4	abril-49	2049-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	12131091.26	0.00	0.00	25000.00	39714.04	12195805.30	0.00	0.00	300000.00	11895805.30	2025-08-13 16:47:29.972043	1
10565	3	2049	5	maio-49	2049-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	12195805.30	0.00	0.00	25000.00	39925.89	12260731.19	0.00	0.00	300000.00	11960731.19	2025-08-13 16:47:29.972043	1
10566	3	2049	6	junho-49	2049-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	12260731.19	0.00	0.00	25000.00	40138.44	12325869.64	0.00	0.00	300000.00	12025869.64	2025-08-13 16:47:29.972043	1
10647	3	2056	3	março-56	2056-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	17933882.31	0.00	0.00	0.00	58710.86	17992593.17	0.00	0.00	300000.00	17692593.17	2025-08-13 16:47:29.972043	1
10567	3	2049	7	julho-49	2049-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	12325869.64	0.00	0.00	25000.00	40351.69	12391221.33	0.00	0.00	300000.00	12091221.33	2025-08-13 16:47:29.972043	1
10568	3	2049	8	agosto-49	2049-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	12391221.33	0.00	0.00	25000.00	40565.63	12456786.96	0.00	0.00	300000.00	12156786.96	2025-08-13 16:47:29.972043	1
10569	3	2049	9	setembro-49	2049-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	12456786.96	0.00	0.00	25000.00	40780.28	12522567.24	0.00	0.00	300000.00	12222567.24	2025-08-13 16:47:29.972043	1
10570	3	2049	10	outubro-49	2049-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	12522567.24	0.00	0.00	25000.00	40995.63	12588562.87	0.00	0.00	300000.00	12288562.87	2025-08-13 16:47:29.972043	1
10571	3	2049	11	novembro-49	2049-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	12588562.87	0.00	0.00	25000.00	41211.68	12654774.55	0.00	0.00	300000.00	12354774.55	2025-08-13 16:47:29.972043	1
10572	3	2049	12	dezembro-49	2049-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	12654774.55	0.00	0.00	25000.00	41428.44	12721202.98	0.00	0.00	300000.00	12421202.98	2025-08-13 16:47:29.972043	1
10573	3	2050	1	janeiro-50	2050-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	12721202.98	0.00	0.00	25000.00	41645.91	12787848.89	0.00	0.00	300000.00	12487848.89	2025-08-13 16:47:29.972043	1
10574	3	2050	2	fevereiro-50	2050-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	12787848.89	0.00	0.00	25000.00	41864.09	12854712.98	0.00	0.00	300000.00	12554712.98	2025-08-13 16:47:29.972043	1
10575	3	2050	3	março-50	2050-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	12854712.98	0.00	0.00	25000.00	42082.99	12921795.97	0.00	0.00	300000.00	12621795.97	2025-08-13 16:47:29.972043	1
10576	3	2050	4	abril-50	2050-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	12921795.97	0.00	0.00	25000.00	42302.60	12989098.57	0.00	0.00	300000.00	12689098.57	2025-08-13 16:47:29.972043	1
10577	3	2050	5	maio-50	2050-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	12989098.57	0.00	0.00	25000.00	42522.93	13056621.49	0.00	0.00	300000.00	12756621.49	2025-08-13 16:47:29.972043	1
10578	3	2050	6	junho-50	2050-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	13056621.49	0.00	0.00	25000.00	42743.98	13124365.47	0.00	0.00	300000.00	12824365.47	2025-08-13 16:47:29.972043	1
10579	3	2050	7	julho-50	2050-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	13124365.47	0.00	0.00	25000.00	42965.76	13192331.23	0.00	0.00	300000.00	12892331.23	2025-08-13 16:47:29.972043	1
10580	3	2050	8	agosto-50	2050-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	13192331.23	0.00	0.00	25000.00	43188.26	13260519.49	0.00	0.00	300000.00	12960519.49	2025-08-13 16:47:29.972043	1
10581	3	2050	9	setembro-50	2050-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	13260519.49	0.00	0.00	25000.00	43411.49	13328930.98	0.00	0.00	300000.00	13028930.98	2025-08-13 16:47:29.972043	1
10582	3	2050	10	outubro-50	2050-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	13328930.98	0.00	0.00	25000.00	43635.45	13397566.43	0.00	0.00	300000.00	13097566.43	2025-08-13 16:47:29.972043	1
10583	3	2050	11	novembro-50	2050-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	13397566.43	0.00	0.00	25000.00	43860.15	13466426.58	0.00	0.00	300000.00	13166426.58	2025-08-13 16:47:29.972043	1
10584	3	2050	12	dezembro-50	2050-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	13466426.58	0.00	0.00	25000.00	44085.58	13535512.16	0.00	0.00	300000.00	13235512.16	2025-08-13 16:47:29.972043	1
10585	3	2051	1	janeiro-51	2051-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	13535512.16	0.00	0.00	25000.00	44311.74	13604823.90	0.00	0.00	300000.00	13304823.90	2025-08-13 16:47:29.972043	1
10586	3	2051	2	fevereiro-51	2051-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	13604823.90	0.00	0.00	25000.00	44538.65	13674362.55	0.00	0.00	300000.00	13374362.55	2025-08-13 16:47:29.972043	1
10587	3	2051	3	março-51	2051-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	13674362.55	0.00	0.00	25000.00	44766.30	13744128.86	0.00	0.00	300000.00	13444128.86	2025-08-13 16:47:29.972043	1
10588	3	2051	4	abril-51	2051-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	13744128.86	0.00	0.00	25000.00	44994.70	13814123.56	0.00	0.00	300000.00	13514123.56	2025-08-13 16:47:29.972043	1
10589	3	2051	5	maio-51	2051-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	13814123.56	0.00	0.00	25000.00	45223.85	13884347.41	0.00	0.00	300000.00	13584347.41	2025-08-13 16:47:29.972043	1
10590	3	2051	6	junho-51	2051-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	13884347.41	0.00	0.00	25000.00	45453.74	13954801.15	0.00	0.00	300000.00	13654801.15	2025-08-13 16:47:29.972043	1
10591	3	2051	7	julho-51	2051-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	13954801.15	0.00	0.00	25000.00	45684.39	14025485.53	0.00	0.00	300000.00	13725485.53	2025-08-13 16:47:29.972043	1
10592	3	2051	8	agosto-51	2051-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	14025485.53	0.00	0.00	25000.00	45915.79	14096401.32	0.00	0.00	300000.00	13796401.32	2025-08-13 16:47:29.972043	1
10593	3	2051	9	setembro-51	2051-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	14096401.32	0.00	0.00	25000.00	46147.95	14167549.27	0.00	0.00	300000.00	13867549.27	2025-08-13 16:47:29.972043	1
10594	3	2051	10	outubro-51	2051-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	14167549.27	0.00	0.00	25000.00	46380.87	14238930.14	0.00	0.00	300000.00	13938930.14	2025-08-13 16:47:29.972043	1
10595	3	2051	11	novembro-51	2051-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	14238930.14	0.00	0.00	25000.00	46614.55	14310544.70	0.00	0.00	300000.00	14010544.70	2025-08-13 16:47:29.972043	1
10596	3	2051	12	dezembro-51	2051-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	14310544.70	0.00	0.00	25000.00	46849.00	14382393.70	0.00	0.00	300000.00	14082393.70	2025-08-13 16:47:29.972043	1
10597	3	2052	1	janeiro-52	2052-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	14382393.70	0.00	0.00	25000.00	47084.21	14454477.91	0.00	0.00	300000.00	14154477.91	2025-08-13 16:47:29.972043	1
10598	3	2052	2	fevereiro-52	2052-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	14454477.91	0.00	0.00	25000.00	47320.20	14526798.11	0.00	0.00	300000.00	14226798.11	2025-08-13 16:47:29.972043	1
10599	3	2052	3	março-52	2052-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	14526798.11	0.00	0.00	25000.00	47556.96	14599355.07	0.00	0.00	300000.00	14299355.07	2025-08-13 16:47:29.972043	1
10600	3	2052	4	abril-52	2052-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	14599355.07	0.00	0.00	25000.00	47794.49	14672149.56	0.00	0.00	300000.00	14372149.56	2025-08-13 16:47:29.972043	1
10601	3	2052	5	maio-52	2052-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	14672149.56	0.00	0.00	25000.00	48032.80	14745182.36	0.00	0.00	300000.00	14445182.36	2025-08-13 16:47:29.972043	1
10602	3	2052	6	junho-52	2052-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	14745182.36	0.00	0.00	25000.00	48271.89	14818454.25	0.00	0.00	300000.00	14518454.25	2025-08-13 16:47:29.972043	1
10603	3	2052	7	julho-52	2052-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	14818454.25	0.00	0.00	25000.00	48511.76	14891966.01	0.00	0.00	300000.00	14591966.01	2025-08-13 16:47:29.972043	1
10604	3	2052	8	agosto-52	2052-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	14891966.01	0.00	0.00	25000.00	48752.42	14965718.43	0.00	0.00	300000.00	14665718.43	2025-08-13 16:47:29.972043	1
10605	3	2052	9	setembro-52	2052-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	14965718.43	0.00	0.00	25000.00	48993.87	15039712.30	0.00	0.00	300000.00	14739712.30	2025-08-13 16:47:29.972043	1
10606	3	2052	10	outubro-52	2052-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	15039712.30	0.00	0.00	25000.00	49236.10	15113948.40	0.00	0.00	300000.00	14813948.40	2025-08-13 16:47:29.972043	1
10607	3	2052	11	novembro-52	2052-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	15113948.40	0.00	0.00	25000.00	49479.13	15188427.54	0.00	0.00	300000.00	14888427.54	2025-08-13 16:47:29.972043	1
10608	3	2052	12	dezembro-52	2052-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	15188427.54	0.00	0.00	25000.00	49722.96	15263150.50	0.00	0.00	300000.00	14963150.50	2025-08-13 16:47:29.972043	1
10609	3	2053	1	janeiro-53	2053-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	15263150.50	0.00	0.00	25000.00	49967.58	15338118.08	0.00	0.00	300000.00	15038118.08	2025-08-13 16:47:29.972043	1
10610	3	2053	2	fevereiro-53	2053-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	15338118.08	0.00	0.00	25000.00	50213.01	15413331.09	0.00	0.00	300000.00	15113331.09	2025-08-13 16:47:29.972043	1
10611	3	2053	3	março-53	2053-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	15413331.09	0.00	0.00	25000.00	50459.24	15488790.32	0.00	0.00	300000.00	15188790.32	2025-08-13 16:47:29.972043	1
10612	3	2053	4	abril-53	2053-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	15488790.32	0.00	0.00	25000.00	50706.27	15564496.59	0.00	0.00	300000.00	15264496.59	2025-08-13 16:47:29.972043	1
10613	3	2053	5	maio-53	2053-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	15564496.59	0.00	0.00	25000.00	50954.11	15640450.70	0.00	0.00	300000.00	15340450.70	2025-08-13 16:47:29.972043	1
10614	3	2053	6	junho-53	2053-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	15640450.70	0.00	0.00	25000.00	51202.77	15716653.47	0.00	0.00	300000.00	15416653.47	2025-08-13 16:47:29.972043	1
10615	3	2053	7	julho-53	2053-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	15716653.47	0.00	0.00	25000.00	51452.23	15793105.70	0.00	0.00	300000.00	15493105.70	2025-08-13 16:47:29.972043	1
10616	3	2053	8	agosto-53	2053-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	15793105.70	0.00	0.00	25000.00	51702.52	15869808.22	0.00	0.00	300000.00	15569808.22	2025-08-13 16:47:29.972043	1
10617	3	2053	9	setembro-53	2053-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	15869808.22	0.00	0.00	25000.00	51953.62	15946761.84	0.00	0.00	300000.00	15646761.84	2025-08-13 16:47:29.972043	1
10618	3	2053	10	outubro-53	2053-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	15946761.84	0.00	0.00	25000.00	52205.55	16023967.39	0.00	0.00	300000.00	15723967.39	2025-08-13 16:47:29.972043	1
10619	3	2053	11	novembro-53	2053-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	16023967.39	0.00	0.00	25000.00	52458.30	16101425.69	0.00	0.00	300000.00	15801425.69	2025-08-13 16:47:29.972043	1
10620	3	2053	12	dezembro-53	2053-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	16101425.69	0.00	0.00	25000.00	52711.88	16179137.57	0.00	0.00	300000.00	15879137.57	2025-08-13 16:47:29.972043	1
10621	3	2054	1	janeiro-54	2054-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	16179137.57	0.00	0.00	25000.00	52966.29	16257103.85	0.00	0.00	300000.00	15957103.85	2025-08-13 16:47:29.972043	1
10622	3	2054	2	fevereiro-54	2054-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	16257103.85	0.00	0.00	25000.00	53221.53	16335325.38	0.00	0.00	300000.00	16035325.38	2025-08-13 16:47:29.972043	1
10623	3	2054	3	março-54	2054-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	16335325.38	0.00	0.00	25000.00	53477.60	16413802.99	0.00	0.00	300000.00	16113802.99	2025-08-13 16:47:29.972043	1
10624	3	2054	4	abril-54	2054-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	16413802.99	0.00	0.00	25000.00	53734.52	16492537.51	0.00	0.00	300000.00	16192537.51	2025-08-13 16:47:29.972043	1
10625	3	2054	5	maio-54	2054-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	16492537.51	0.00	0.00	25000.00	53992.28	16571529.78	0.00	0.00	300000.00	16271529.78	2025-08-13 16:47:29.972043	1
10626	3	2054	6	junho-54	2054-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	16571529.78	0.00	0.00	25000.00	54250.88	16650780.66	0.00	0.00	300000.00	16350780.66	2025-08-13 16:47:29.972043	1
10627	3	2054	7	julho-54	2054-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	16650780.66	0.00	0.00	25000.00	54510.32	16730290.98	0.00	0.00	300000.00	16430290.98	2025-08-13 16:47:29.972043	1
10628	3	2054	8	agosto-54	2054-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	16730290.98	0.00	0.00	25000.00	54770.62	16810061.60	0.00	0.00	300000.00	16510061.60	2025-08-13 16:47:29.972043	1
10629	3	2054	9	setembro-54	2054-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	16810061.60	0.00	0.00	25000.00	55031.77	16890093.37	0.00	0.00	300000.00	16590093.37	2025-08-13 16:47:29.972043	1
10630	3	2054	10	outubro-54	2054-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	16890093.37	0.00	0.00	25000.00	55293.77	16970387.14	0.00	0.00	300000.00	16670387.14	2025-08-13 16:47:29.972043	1
10631	3	2054	11	novembro-54	2054-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	16970387.14	0.00	0.00	25000.00	55556.63	17050943.77	0.00	0.00	300000.00	16750943.77	2025-08-13 16:47:29.972043	1
10632	3	2054	12	dezembro-54	2054-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	0.00	17050943.77	0.00	0.00	25000.00	55820.35	17131764.12	0.00	0.00	300000.00	16831764.12	2025-08-13 16:47:29.972043	1
10633	3	2055	1	janeiro-55	2055-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	17131764.12	0.00	0.00	0.00	56084.94	17187849.06	0.00	0.00	300000.00	16887849.06	2025-08-13 16:47:29.972043	1
10634	3	2055	2	fevereiro-55	2055-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	17187849.06	0.00	0.00	0.00	56268.55	17244117.61	0.00	0.00	300000.00	16944117.61	2025-08-13 16:47:29.972043	1
10635	3	2055	3	março-55	2055-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	17244117.61	0.00	0.00	0.00	56452.75	17300570.36	0.00	0.00	300000.00	17000570.36	2025-08-13 16:47:29.972043	1
10636	3	2055	4	abril-55	2055-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	17300570.36	0.00	0.00	0.00	56637.57	17357207.93	0.00	0.00	300000.00	17057207.93	2025-08-13 16:47:29.972043	1
10637	3	2055	5	maio-55	2055-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	17357207.93	0.00	0.00	0.00	56822.98	17414030.91	0.00	0.00	300000.00	17114030.91	2025-08-13 16:47:29.972043	1
10638	3	2055	6	junho-55	2055-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	17414030.91	0.00	0.00	0.00	57009.01	17471039.91	0.00	0.00	300000.00	17171039.91	2025-08-13 16:47:29.972043	1
10639	3	2055	7	julho-55	2055-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	17471039.91	0.00	0.00	0.00	57195.64	17528235.55	0.00	0.00	300000.00	17228235.55	2025-08-13 16:47:29.972043	1
10640	3	2055	8	agosto-55	2055-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	17528235.55	0.00	0.00	0.00	57382.88	17585618.43	0.00	0.00	300000.00	17285618.43	2025-08-13 16:47:29.972043	1
10641	3	2055	9	setembro-55	2055-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	17585618.43	0.00	0.00	0.00	57570.74	17643189.17	0.00	0.00	300000.00	17343189.17	2025-08-13 16:47:29.972043	1
10642	3	2055	10	outubro-55	2055-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	17643189.17	0.00	0.00	0.00	57759.21	17700948.38	0.00	0.00	300000.00	17400948.38	2025-08-13 16:47:29.972043	1
10643	3	2055	11	novembro-55	2055-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	17700948.38	0.00	0.00	0.00	57948.30	17758896.68	0.00	0.00	300000.00	17458896.68	2025-08-13 16:47:29.972043	1
10644	3	2055	12	dezembro-55	2055-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	17758896.68	0.00	0.00	0.00	58138.01	17817034.69	0.00	0.00	300000.00	17517034.69	2025-08-13 16:47:29.972043	1
10645	3	2056	1	janeiro-56	2056-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	17817034.69	0.00	0.00	0.00	58328.34	17875363.02	0.00	0.00	300000.00	17575363.02	2025-08-13 16:47:29.972043	1
10648	3	2056	4	abril-56	2056-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	17992593.17	0.00	0.00	0.00	58903.07	18051496.24	0.00	0.00	300000.00	17751496.24	2025-08-13 16:47:29.972043	1
10649	3	2056	5	maio-56	2056-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	18051496.24	0.00	0.00	0.00	59095.90	18110592.14	0.00	0.00	300000.00	17810592.14	2025-08-13 16:47:29.972043	1
10650	3	2056	6	junho-56	2056-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	18110592.14	0.00	0.00	0.00	59289.37	18169881.51	0.00	0.00	300000.00	17869881.51	2025-08-13 16:47:29.972043	1
10651	3	2056	7	julho-56	2056-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	18169881.51	0.00	0.00	0.00	59483.46	18229364.97	0.00	0.00	300000.00	17929364.97	2025-08-13 16:47:29.972043	1
10652	3	2056	8	agosto-56	2056-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	18229364.97	0.00	0.00	0.00	59678.20	18289043.17	0.00	0.00	300000.00	17989043.17	2025-08-13 16:47:29.972043	1
10653	3	2056	9	setembro-56	2056-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	18289043.17	0.00	0.00	0.00	59873.57	18348916.74	0.00	0.00	300000.00	18048916.74	2025-08-13 16:47:29.972043	1
10654	3	2056	10	outubro-56	2056-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	18348916.74	0.00	0.00	0.00	60069.58	18408986.32	0.00	0.00	300000.00	18108986.32	2025-08-13 16:47:29.972043	1
10655	3	2056	11	novembro-56	2056-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	18408986.32	0.00	0.00	0.00	60266.23	18469252.55	0.00	0.00	300000.00	18169252.55	2025-08-13 16:47:29.972043	1
10656	3	2056	12	dezembro-56	2056-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	18469252.55	0.00	0.00	0.00	60463.53	18529716.08	0.00	0.00	300000.00	18229716.08	2025-08-13 16:47:29.972043	1
10657	3	2057	1	janeiro-57	2057-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	18529716.08	0.00	0.00	0.00	60661.47	18590377.54	0.00	0.00	300000.00	18290377.54	2025-08-13 16:47:29.972043	1
10658	3	2057	2	fevereiro-57	2057-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	18590377.54	0.00	0.00	0.00	60860.06	18651237.60	0.00	0.00	300000.00	18351237.60	2025-08-13 16:47:29.972043	1
10659	3	2057	3	março-57	2057-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	18651237.60	0.00	0.00	0.00	61059.30	18712296.90	0.00	0.00	300000.00	18412296.90	2025-08-13 16:47:29.972043	1
10660	3	2057	4	abril-57	2057-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	18712296.90	0.00	0.00	0.00	61259.19	18773556.09	0.00	0.00	300000.00	18473556.09	2025-08-13 16:47:29.972043	1
10661	3	2057	5	maio-57	2057-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	18773556.09	0.00	0.00	0.00	61459.74	18835015.83	0.00	0.00	300000.00	18535015.83	2025-08-13 16:47:29.972043	1
10662	3	2057	6	junho-57	2057-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	18835015.83	0.00	0.00	0.00	61660.94	18896676.77	0.00	0.00	300000.00	18596676.77	2025-08-13 16:47:29.972043	1
10663	3	2057	7	julho-57	2057-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	18896676.77	0.00	0.00	0.00	61862.80	18958539.57	0.00	0.00	300000.00	18658539.57	2025-08-13 16:47:29.972043	1
10664	3	2057	8	agosto-57	2057-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	18958539.57	0.00	0.00	0.00	62065.33	19020604.90	0.00	0.00	300000.00	18720604.90	2025-08-13 16:47:29.972043	1
10665	3	2057	9	setembro-57	2057-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	19020604.90	0.00	0.00	0.00	62268.51	19082873.41	0.00	0.00	300000.00	18782873.41	2025-08-13 16:47:29.972043	1
10666	3	2057	10	outubro-57	2057-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	19082873.41	0.00	0.00	0.00	62472.36	19145345.77	0.00	0.00	300000.00	18845345.77	2025-08-13 16:47:29.972043	1
10667	3	2057	11	novembro-57	2057-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	19145345.77	0.00	0.00	0.00	62676.88	19208022.65	0.00	0.00	300000.00	18908022.65	2025-08-13 16:47:29.972043	1
10668	3	2057	12	dezembro-57	2057-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	19208022.65	0.00	0.00	0.00	62882.07	19270904.72	0.00	0.00	300000.00	18970904.72	2025-08-13 16:47:29.972043	1
10669	3	2058	1	janeiro-58	2058-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	19270904.72	0.00	0.00	0.00	63087.93	19333992.65	0.00	0.00	300000.00	19033992.65	2025-08-13 16:47:29.972043	1
10670	3	2058	2	fevereiro-58	2058-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	19333992.65	0.00	0.00	0.00	63294.46	19397287.11	0.00	0.00	300000.00	19097287.11	2025-08-13 16:47:29.972043	1
10671	3	2058	3	março-58	2058-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	19397287.11	0.00	0.00	0.00	63501.67	19460788.78	0.00	0.00	300000.00	19160788.78	2025-08-13 16:47:29.972043	1
10672	3	2058	4	abril-58	2058-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	19460788.78	0.00	0.00	0.00	63709.56	19524498.34	0.00	0.00	300000.00	19224498.34	2025-08-13 16:47:29.972043	1
10673	3	2058	5	maio-58	2058-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	19524498.34	0.00	0.00	0.00	63918.13	19588416.46	0.00	0.00	300000.00	19288416.46	2025-08-13 16:47:29.972043	1
10674	3	2058	6	junho-58	2058-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	19588416.46	0.00	0.00	0.00	64127.38	19652543.84	0.00	0.00	300000.00	19352543.84	2025-08-13 16:47:29.972043	1
10675	3	2058	7	julho-58	2058-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	19652543.84	0.00	0.00	0.00	64337.31	19716881.16	0.00	0.00	300000.00	19416881.16	2025-08-13 16:47:29.972043	1
10676	3	2058	8	agosto-58	2058-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	19716881.16	0.00	0.00	0.00	64547.94	19781429.09	0.00	0.00	300000.00	19481429.09	2025-08-13 16:47:29.972043	1
10677	3	2058	9	setembro-58	2058-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	19781429.09	0.00	0.00	0.00	64759.25	19846188.35	0.00	0.00	300000.00	19546188.35	2025-08-13 16:47:29.972043	1
10678	3	2058	10	outubro-58	2058-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	19846188.35	0.00	0.00	0.00	64971.26	19911159.60	0.00	0.00	300000.00	19611159.60	2025-08-13 16:47:29.972043	1
10679	3	2058	11	novembro-58	2058-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	19911159.60	0.00	0.00	0.00	65183.96	19976343.56	0.00	0.00	300000.00	19676343.56	2025-08-13 16:47:29.972043	1
10680	3	2058	12	dezembro-58	2058-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	19976343.56	0.00	0.00	0.00	65397.35	20041740.91	0.00	0.00	300000.00	19741740.91	2025-08-13 16:47:29.972043	1
10681	3	2059	1	janeiro-59	2059-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	20041740.91	0.00	0.00	0.00	65611.44	20107352.35	0.00	0.00	300000.00	19807352.35	2025-08-13 16:47:29.972043	1
10682	3	2059	2	fevereiro-59	2059-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	20107352.35	0.00	0.00	0.00	65826.24	20173178.59	0.00	0.00	300000.00	19873178.59	2025-08-13 16:47:29.972043	1
10683	3	2059	3	março-59	2059-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	20173178.59	0.00	0.00	0.00	66041.74	20239220.33	0.00	0.00	300000.00	19939220.33	2025-08-13 16:47:29.972043	1
10684	3	2059	4	abril-59	2059-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	20239220.33	0.00	0.00	0.00	66257.94	20305478.27	0.00	0.00	300000.00	20005478.27	2025-08-13 16:47:29.972043	1
10685	3	2059	5	maio-59	2059-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	20305478.27	0.00	0.00	0.00	66474.85	20371953.12	0.00	0.00	300000.00	20071953.12	2025-08-13 16:47:29.972043	1
10686	3	2059	6	junho-59	2059-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	20371953.12	0.00	0.00	0.00	66692.47	20438645.60	0.00	0.00	300000.00	20138645.60	2025-08-13 16:47:29.972043	1
10687	3	2059	7	julho-59	2059-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	20438645.60	0.00	0.00	0.00	66910.81	20505556.40	0.00	0.00	300000.00	20205556.40	2025-08-13 16:47:29.972043	1
10688	3	2059	8	agosto-59	2059-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	20505556.40	0.00	0.00	0.00	67129.86	20572686.26	0.00	0.00	300000.00	20272686.26	2025-08-13 16:47:29.972043	1
10689	3	2059	9	setembro-59	2059-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	20572686.26	0.00	0.00	0.00	67349.62	20640035.88	0.00	0.00	300000.00	20340035.88	2025-08-13 16:47:29.972043	1
10690	3	2059	10	outubro-59	2059-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	20640035.88	0.00	0.00	0.00	67570.11	20707605.99	0.00	0.00	300000.00	20407605.99	2025-08-13 16:47:29.972043	1
10691	3	2059	11	novembro-59	2059-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	20707605.99	0.00	0.00	0.00	67791.31	20775397.30	0.00	0.00	300000.00	20475397.30	2025-08-13 16:47:29.972043	1
10692	3	2059	12	dezembro-59	2059-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	20775397.30	0.00	0.00	0.00	68013.24	20843410.54	0.00	0.00	300000.00	20543410.54	2025-08-13 16:47:29.972043	1
10693	3	2060	1	janeiro-60	2060-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	20843410.54	0.00	0.00	0.00	68235.90	20911646.45	0.00	0.00	300000.00	20611646.45	2025-08-13 16:47:29.972043	1
10694	3	2060	2	fevereiro-60	2060-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	20911646.45	0.00	0.00	0.00	68459.29	20980105.74	0.00	0.00	300000.00	20680105.74	2025-08-13 16:47:29.972043	1
10695	3	2060	3	março-60	2060-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	20980105.74	0.00	0.00	0.00	68683.41	21048789.14	0.00	0.00	300000.00	20748789.14	2025-08-13 16:47:29.972043	1
10696	3	2060	4	abril-60	2060-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	21048789.14	0.00	0.00	0.00	68908.26	21117697.40	0.00	0.00	300000.00	20817697.40	2025-08-13 16:47:29.972043	1
10697	3	2060	5	maio-60	2060-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	21117697.40	0.00	0.00	0.00	69133.85	21186831.25	0.00	0.00	300000.00	20886831.25	2025-08-13 16:47:29.972043	1
10698	3	2060	6	junho-60	2060-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	21186831.25	0.00	0.00	0.00	69360.17	21256191.42	0.00	0.00	300000.00	20956191.42	2025-08-13 16:47:29.972043	1
10699	3	2060	7	julho-60	2060-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	21256191.42	0.00	0.00	0.00	69587.24	21325778.66	0.00	0.00	300000.00	21025778.66	2025-08-13 16:47:29.972043	1
10700	3	2060	8	agosto-60	2060-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	21325778.66	0.00	0.00	0.00	69815.05	21395593.71	0.00	0.00	300000.00	21095593.71	2025-08-13 16:47:29.972043	1
10701	3	2060	9	setembro-60	2060-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	21395593.71	0.00	0.00	0.00	70043.61	21465637.31	0.00	0.00	300000.00	21165637.31	2025-08-13 16:47:29.972043	1
10702	3	2060	10	outubro-60	2060-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	21465637.31	0.00	0.00	0.00	70272.91	21535910.23	0.00	0.00	300000.00	21235910.23	2025-08-13 16:47:29.972043	1
10703	3	2060	11	novembro-60	2060-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	21535910.23	0.00	0.00	0.00	70502.97	21606413.19	0.00	0.00	300000.00	21306413.19	2025-08-13 16:47:29.972043	1
10704	3	2060	12	dezembro-60	2060-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	21606413.19	0.00	0.00	0.00	70733.77	21677146.97	0.00	0.00	300000.00	21377146.97	2025-08-13 16:47:29.972043	1
10705	3	2061	1	janeiro-61	2061-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	21677146.97	0.00	0.00	0.00	70965.34	21748112.30	0.00	0.00	300000.00	21448112.30	2025-08-13 16:47:29.972043	1
10706	3	2061	2	fevereiro-61	2061-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	21748112.30	0.00	0.00	0.00	71197.66	21819309.96	0.00	0.00	300000.00	21519309.96	2025-08-13 16:47:29.972043	1
10707	3	2061	3	março-61	2061-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	21819309.96	0.00	0.00	0.00	71430.74	21890740.71	0.00	0.00	300000.00	21590740.71	2025-08-13 16:47:29.972043	1
10708	3	2061	4	abril-61	2061-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	21890740.71	0.00	0.00	0.00	71664.59	21962405.30	0.00	0.00	300000.00	21662405.30	2025-08-13 16:47:29.972043	1
10709	3	2061	5	maio-61	2061-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	21962405.30	0.00	0.00	0.00	71899.20	22034304.50	0.00	0.00	300000.00	21734304.50	2025-08-13 16:47:29.972043	1
10710	3	2061	6	junho-61	2061-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	22034304.50	0.00	0.00	0.00	72134.58	22106439.08	0.00	0.00	300000.00	21806439.08	2025-08-13 16:47:29.972043	1
10711	3	2061	7	julho-61	2061-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	22106439.08	0.00	0.00	0.00	72370.73	22178809.80	0.00	0.00	300000.00	21878809.80	2025-08-13 16:47:29.972043	1
10712	3	2061	8	agosto-61	2061-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	22178809.80	0.00	0.00	0.00	72607.65	22251417.46	0.00	0.00	300000.00	21951417.46	2025-08-13 16:47:29.972043	1
10713	3	2061	9	setembro-61	2061-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	22251417.46	0.00	0.00	0.00	72845.35	22324262.81	0.00	0.00	300000.00	22024262.81	2025-08-13 16:47:29.972043	1
10714	3	2061	10	outubro-61	2061-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	22324262.81	0.00	0.00	0.00	73083.83	22397346.63	0.00	0.00	300000.00	22097346.63	2025-08-13 16:47:29.972043	1
10715	3	2061	11	novembro-61	2061-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	22397346.63	0.00	0.00	0.00	73323.08	22470669.72	0.00	0.00	300000.00	22170669.72	2025-08-13 16:47:29.972043	1
10716	3	2061	12	dezembro-61	2061-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	22470669.72	0.00	0.00	0.00	73563.13	22544232.84	0.00	0.00	300000.00	22244232.84	2025-08-13 16:47:29.972043	1
10717	3	2062	1	janeiro-62	2062-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	22544232.84	0.00	0.00	0.00	73803.95	22618036.80	0.00	0.00	300000.00	22318036.80	2025-08-13 16:47:29.972043	1
10718	3	2062	2	fevereiro-62	2062-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	22618036.80	0.00	0.00	0.00	74045.57	22692082.36	0.00	0.00	300000.00	22392082.36	2025-08-13 16:47:29.972043	1
10719	3	2062	3	março-62	2062-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	22692082.36	0.00	0.00	0.00	74287.97	22766370.34	0.00	0.00	300000.00	22466370.34	2025-08-13 16:47:29.972043	1
10720	3	2062	4	abril-62	2062-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	22766370.34	0.00	0.00	0.00	74531.17	22840901.51	0.00	0.00	300000.00	22540901.51	2025-08-13 16:47:29.972043	1
10721	3	2062	5	maio-62	2062-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	22840901.51	0.00	0.00	0.00	74775.17	22915676.68	0.00	0.00	300000.00	22615676.68	2025-08-13 16:47:29.972043	1
10722	3	2062	6	junho-62	2062-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	22915676.68	0.00	0.00	0.00	75019.96	22990696.64	0.00	0.00	300000.00	22690696.64	2025-08-13 16:47:29.972043	1
10723	3	2062	7	julho-62	2062-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	22990696.64	0.00	0.00	0.00	75265.56	23065962.20	0.00	0.00	300000.00	22765962.20	2025-08-13 16:47:29.972043	1
10724	3	2062	8	agosto-62	2062-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	23065962.20	0.00	0.00	0.00	75511.96	23141474.16	0.00	0.00	300000.00	22841474.16	2025-08-13 16:47:29.972043	1
10725	3	2062	9	setembro-62	2062-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	23141474.16	0.00	0.00	0.00	75759.16	23217233.32	0.00	0.00	300000.00	22917233.32	2025-08-13 16:47:29.972043	1
10726	3	2062	10	outubro-62	2062-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	23217233.32	0.00	0.00	0.00	76007.18	23293240.50	0.00	0.00	300000.00	22993240.50	2025-08-13 16:47:29.972043	1
10727	3	2062	11	novembro-62	2062-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	23293240.50	0.00	0.00	0.00	76256.01	23369496.51	0.00	0.00	300000.00	23069496.51	2025-08-13 16:47:29.972043	1
10728	3	2062	12	dezembro-62	2062-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	23369496.51	0.00	0.00	0.00	76505.65	23446002.16	0.00	0.00	300000.00	23146002.16	2025-08-13 16:47:29.972043	1
10729	3	2063	1	janeiro-63	2063-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	23446002.16	0.00	0.00	0.00	76756.11	23522758.27	0.00	0.00	300000.00	23222758.27	2025-08-13 16:47:29.972043	1
10730	3	2063	2	fevereiro-63	2063-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	23522758.27	0.00	0.00	0.00	77007.39	23599765.66	0.00	0.00	300000.00	23299765.66	2025-08-13 16:47:29.972043	1
10731	3	2063	3	março-63	2063-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	23599765.66	0.00	0.00	0.00	77259.49	23677025.15	0.00	0.00	300000.00	23377025.15	2025-08-13 16:47:29.972043	1
10732	3	2063	4	abril-63	2063-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	23677025.15	0.00	0.00	0.00	77512.42	23754537.57	0.00	0.00	300000.00	23454537.57	2025-08-13 16:47:29.972043	1
10733	3	2063	5	maio-63	2063-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	23754537.57	0.00	0.00	0.00	77766.17	23832303.74	0.00	0.00	300000.00	23532303.74	2025-08-13 16:47:29.972043	1
10734	3	2063	6	junho-63	2063-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	23832303.74	0.00	0.00	0.00	78020.76	23910324.50	0.00	0.00	300000.00	23610324.50	2025-08-13 16:47:29.972043	1
10735	3	2063	7	julho-63	2063-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	23910324.50	0.00	0.00	0.00	78276.18	23988600.68	0.00	0.00	300000.00	23688600.68	2025-08-13 16:47:29.972043	1
10736	3	2063	8	agosto-63	2063-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	23988600.68	0.00	0.00	0.00	78532.44	24067133.12	0.00	0.00	300000.00	23767133.12	2025-08-13 16:47:29.972043	1
10737	3	2063	9	setembro-63	2063-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	24067133.12	0.00	0.00	0.00	78789.53	24145922.65	0.00	0.00	300000.00	23845922.65	2025-08-13 16:47:29.972043	1
10738	3	2063	10	outubro-63	2063-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	24145922.65	0.00	0.00	0.00	79047.47	24224970.12	0.00	0.00	300000.00	23924970.12	2025-08-13 16:47:29.972043	1
10739	3	2063	11	novembro-63	2063-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	24224970.12	0.00	0.00	0.00	79306.25	24304276.37	0.00	0.00	300000.00	24004276.37	2025-08-13 16:47:29.972043	1
10740	3	2063	12	dezembro-63	2063-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	24304276.37	0.00	0.00	0.00	79565.88	24383842.24	0.00	0.00	300000.00	24083842.24	2025-08-13 16:47:29.972043	1
10741	3	2064	1	janeiro-64	2064-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	24383842.24	0.00	0.00	0.00	79826.35	24463668.60	0.00	0.00	300000.00	24163668.60	2025-08-13 16:47:29.972043	1
10742	3	2064	2	fevereiro-64	2064-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	24463668.60	0.00	0.00	0.00	80087.69	24543756.28	0.00	0.00	300000.00	24243756.28	2025-08-13 16:47:29.972043	1
10743	3	2064	3	março-64	2064-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	24543756.28	0.00	0.00	0.00	80349.87	24624106.16	0.00	0.00	300000.00	24324106.16	2025-08-13 16:47:29.972043	1
10744	3	2064	4	abril-64	2064-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	24624106.16	0.00	0.00	0.00	80612.92	24704719.07	0.00	0.00	300000.00	24404719.07	2025-08-13 16:47:29.972043	1
10745	3	2064	5	maio-64	2064-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	24704719.07	0.00	0.00	0.00	80876.82	24785595.89	0.00	0.00	300000.00	24485595.89	2025-08-13 16:47:29.972043	1
10746	3	2064	6	junho-64	2064-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	24785595.89	0.00	0.00	0.00	81141.59	24866737.48	0.00	0.00	300000.00	24566737.48	2025-08-13 16:47:29.972043	1
10747	3	2064	7	julho-64	2064-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	24866737.48	0.00	0.00	0.00	81407.23	24948144.71	0.00	0.00	300000.00	24648144.71	2025-08-13 16:47:29.972043	1
10748	3	2064	8	agosto-64	2064-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	24948144.71	0.00	0.00	0.00	81673.73	25029818.45	0.00	0.00	300000.00	24729818.45	2025-08-13 16:47:29.972043	1
10749	3	2064	9	setembro-64	2064-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25029818.45	0.00	0.00	0.00	81941.11	25111759.56	0.00	0.00	300000.00	24811759.56	2025-08-13 16:47:29.972043	1
10750	3	2064	10	outubro-64	2064-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25111759.56	0.00	0.00	0.00	82209.37	25193968.92	0.00	0.00	300000.00	24893968.92	2025-08-13 16:47:29.972043	1
10751	3	2064	11	novembro-64	2064-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25193968.92	0.00	0.00	0.00	82478.50	25276447.42	0.00	0.00	300000.00	24976447.42	2025-08-13 16:47:29.972043	1
10752	3	2064	12	dezembro-64	2064-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25276447.42	0.00	0.00	0.00	82748.51	25359195.93	0.00	0.00	300000.00	25059195.93	2025-08-13 16:47:29.972043	1
10753	3	2065	1	janeiro-65	2065-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25359195.93	0.00	0.00	0.00	83019.41	25442215.34	0.00	0.00	300000.00	25142215.34	2025-08-13 16:47:29.972043	1
10754	3	2065	2	fevereiro-65	2065-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25442215.34	0.00	0.00	0.00	83291.19	25525506.54	0.00	0.00	300000.00	25225506.54	2025-08-13 16:47:29.972043	1
10755	3	2065	3	março-65	2065-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25525506.54	0.00	0.00	0.00	83563.87	25609070.40	0.00	0.00	300000.00	25309070.40	2025-08-13 16:47:29.972043	1
10756	3	2065	4	abril-65	2065-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25609070.40	0.00	0.00	0.00	83837.43	25692907.83	0.00	0.00	300000.00	25392907.83	2025-08-13 16:47:29.972043	1
10757	3	2065	5	maio-65	2065-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25692907.83	0.00	0.00	0.00	84111.89	25777019.73	0.00	0.00	300000.00	25477019.73	2025-08-13 16:47:29.972043	1
10758	3	2065	6	junho-65	2065-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25777019.73	0.00	0.00	0.00	84387.25	25861406.98	0.00	0.00	300000.00	25561406.98	2025-08-13 16:47:29.972043	1
10759	3	2065	7	julho-65	2065-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25861406.98	0.00	0.00	0.00	84663.52	25946070.50	0.00	0.00	300000.00	25646070.50	2025-08-13 16:47:29.972043	1
10760	3	2065	8	agosto-65	2065-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25946070.50	0.00	0.00	0.00	84940.68	26031011.18	0.00	0.00	300000.00	25731011.18	2025-08-13 16:47:29.972043	1
10761	3	2065	9	setembro-65	2065-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	26031011.18	0.00	0.00	0.00	85218.76	26116229.94	0.00	0.00	300000.00	25816229.94	2025-08-13 16:47:29.972043	1
10762	3	2065	10	outubro-65	2065-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	26116229.94	0.00	0.00	0.00	85497.74	26201727.68	0.00	0.00	300000.00	25901727.68	2025-08-13 16:47:29.972043	1
10763	3	2065	11	novembro-65	2065-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	26201727.68	0.00	0.00	0.00	85777.64	26287505.32	0.00	0.00	300000.00	25987505.32	2025-08-13 16:47:29.972043	1
10764	3	2065	12	dezembro-65	2065-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	26287505.32	0.00	0.00	0.00	86058.45	26373563.77	0.00	0.00	300000.00	26073563.77	2025-08-13 16:47:29.972043	1
10765	3	2066	1	janeiro-66	2066-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	26373563.77	0.00	0.00	0.00	86340.18	26459903.96	0.00	0.00	300000.00	26159903.96	2025-08-13 16:47:29.972043	1
10766	3	2066	2	fevereiro-66	2066-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	26459903.96	0.00	0.00	0.00	86622.84	26546526.80	0.00	0.00	300000.00	26246526.80	2025-08-13 16:47:29.972043	1
10767	3	2066	3	março-66	2066-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	26546526.80	0.00	0.00	0.00	86906.42	26633433.22	0.00	0.00	300000.00	26333433.22	2025-08-13 16:47:29.972043	1
10768	3	2066	4	abril-66	2066-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	26633433.22	0.00	0.00	0.00	87190.93	26720624.15	0.00	0.00	300000.00	26420624.15	2025-08-13 16:47:29.972043	1
10769	3	2066	5	maio-66	2066-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	26720624.15	0.00	0.00	0.00	87476.37	26808100.52	0.00	0.00	300000.00	26508100.52	2025-08-13 16:47:29.972043	1
10770	3	2066	6	junho-66	2066-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	26808100.52	0.00	0.00	0.00	87762.75	26895863.26	0.00	0.00	300000.00	26595863.26	2025-08-13 16:47:29.972043	1
10771	3	2066	7	julho-66	2066-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	26895863.26	0.00	0.00	0.00	88050.06	26983913.32	0.00	0.00	300000.00	26683913.32	2025-08-13 16:47:29.972043	1
10772	3	2066	8	agosto-66	2066-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	26983913.32	0.00	0.00	0.00	88338.31	27072251.63	0.00	0.00	300000.00	26772251.63	2025-08-13 16:47:29.972043	1
10773	3	2066	9	setembro-66	2066-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	27072251.63	0.00	0.00	0.00	88627.51	27160879.14	0.00	0.00	300000.00	26860879.14	2025-08-13 16:47:29.972043	1
10774	3	2066	10	outubro-66	2066-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	27160879.14	0.00	0.00	0.00	88917.65	27249796.79	0.00	0.00	300000.00	26949796.79	2025-08-13 16:47:29.972043	1
10775	3	2066	11	novembro-66	2066-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	27249796.79	0.00	0.00	0.00	89208.74	27339005.53	0.00	0.00	300000.00	27039005.53	2025-08-13 16:47:29.972043	1
10776	3	2066	12	dezembro-66	2066-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	27339005.53	0.00	0.00	0.00	89500.79	27428506.32	0.00	0.00	300000.00	27128506.32	2025-08-13 16:47:29.972043	1
10777	3	2067	1	janeiro-67	2067-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	27428506.32	0.00	0.00	0.00	89793.79	27518300.12	0.00	0.00	300000.00	27218300.12	2025-08-13 16:47:29.972043	1
10778	3	2067	2	fevereiro-67	2067-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	27518300.12	0.00	0.00	0.00	90087.75	27608387.87	0.00	0.00	300000.00	27308387.87	2025-08-13 16:47:29.972043	1
10779	3	2067	3	março-67	2067-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	27608387.87	0.00	0.00	0.00	90382.68	27698770.55	0.00	0.00	300000.00	27398770.55	2025-08-13 16:47:29.972043	1
10780	3	2067	4	abril-67	2067-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	27698770.55	0.00	0.00	0.00	90678.57	27789449.11	0.00	0.00	300000.00	27489449.11	2025-08-13 16:47:29.972043	1
10781	3	2067	5	maio-67	2067-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	27789449.11	0.00	0.00	0.00	90975.43	27880424.54	0.00	0.00	300000.00	27580424.54	2025-08-13 16:47:29.972043	1
10782	3	2067	6	junho-67	2067-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	27880424.54	0.00	0.00	0.00	91273.25	27971697.79	0.00	0.00	300000.00	27671697.79	2025-08-13 16:47:29.972043	1
10783	3	2067	7	julho-67	2067-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	27971697.79	0.00	0.00	0.00	91572.06	28063269.85	0.00	0.00	300000.00	27763269.85	2025-08-13 16:47:29.972043	1
10784	3	2067	8	agosto-67	2067-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	28063269.85	0.00	0.00	0.00	91871.84	28155141.70	0.00	0.00	300000.00	27855141.70	2025-08-13 16:47:29.972043	1
10785	3	2067	9	setembro-67	2067-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	28155141.70	0.00	0.00	0.00	92172.61	28247314.30	0.00	0.00	300000.00	27947314.30	2025-08-13 16:47:29.972043	1
10786	3	2067	10	outubro-67	2067-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	28247314.30	0.00	0.00	0.00	92474.36	28339788.66	0.00	0.00	300000.00	28039788.66	2025-08-13 16:47:29.972043	1
10787	3	2067	11	novembro-67	2067-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	28339788.66	0.00	0.00	0.00	92777.09	28432565.75	0.00	0.00	300000.00	28132565.75	2025-08-13 16:47:29.972043	1
10788	3	2067	12	dezembro-67	2067-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	28432565.75	0.00	0.00	0.00	93080.82	28525646.58	0.00	0.00	300000.00	28225646.58	2025-08-13 16:47:29.972043	1
10789	3	2068	1	janeiro-68	2068-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	28525646.58	0.00	0.00	0.00	93385.54	28619032.12	0.00	0.00	300000.00	28319032.12	2025-08-13 16:47:29.972043	1
10790	3	2068	2	fevereiro-68	2068-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	28619032.12	0.00	0.00	0.00	93691.26	28712723.38	0.00	0.00	300000.00	28412723.38	2025-08-13 16:47:29.972043	1
10791	3	2068	3	março-68	2068-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	28712723.38	0.00	0.00	0.00	93997.98	28806721.37	0.00	0.00	300000.00	28506721.37	2025-08-13 16:47:29.972043	1
10792	3	2068	4	abril-68	2068-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	28806721.37	0.00	0.00	0.00	94305.71	28901027.08	0.00	0.00	300000.00	28601027.08	2025-08-13 16:47:29.972043	1
10793	3	2068	5	maio-68	2068-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	28901027.08	0.00	0.00	0.00	94614.44	28995641.52	0.00	0.00	300000.00	28695641.52	2025-08-13 16:47:29.972043	1
10794	3	2068	6	junho-68	2068-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	28995641.52	0.00	0.00	0.00	94924.19	29090565.71	0.00	0.00	300000.00	28790565.71	2025-08-13 16:47:29.972043	1
10795	3	2068	7	julho-68	2068-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	29090565.71	0.00	0.00	0.00	95234.94	29185800.65	0.00	0.00	300000.00	28885800.65	2025-08-13 16:47:29.972043	1
10796	3	2068	8	agosto-68	2068-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	29185800.65	0.00	0.00	0.00	95546.72	29281347.36	0.00	0.00	300000.00	28981347.36	2025-08-13 16:47:29.972043	1
10797	3	2068	9	setembro-68	2068-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	29281347.36	0.00	0.00	0.00	95859.51	29377206.88	0.00	0.00	300000.00	29077206.88	2025-08-13 16:47:29.972043	1
10798	3	2068	10	outubro-68	2068-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	29377206.88	0.00	0.00	0.00	96173.33	29473380.21	0.00	0.00	300000.00	29173380.21	2025-08-13 16:47:29.972043	1
10799	3	2068	11	novembro-68	2068-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	29473380.21	0.00	0.00	0.00	96488.18	29569868.38	0.00	0.00	300000.00	29269868.38	2025-08-13 16:47:29.972043	1
10800	3	2068	12	dezembro-68	2068-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	29569868.38	0.00	0.00	0.00	96804.05	29666672.44	0.00	0.00	300000.00	29366672.44	2025-08-13 16:47:29.972043	1
10801	3	2069	1	janeiro-69	2069-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	29666672.44	0.00	0.00	0.00	97120.97	29763793.40	0.00	0.00	300000.00	29463793.40	2025-08-13 16:47:29.972043	1
10802	3	2069	2	fevereiro-69	2069-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	29763793.40	0.00	0.00	0.00	97438.91	29861232.32	0.00	0.00	300000.00	29561232.32	2025-08-13 16:47:29.972043	1
10803	3	2069	3	março-69	2069-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	29861232.32	0.00	0.00	0.00	97757.90	29958990.22	0.00	0.00	300000.00	29658990.22	2025-08-13 16:47:29.972043	1
10804	3	2069	4	abril-69	2069-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	29958990.22	0.00	0.00	0.00	98077.94	30057068.16	0.00	0.00	300000.00	29757068.16	2025-08-13 16:47:29.972043	1
10805	3	2069	5	maio-69	2069-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	30057068.16	0.00	0.00	0.00	98399.02	30155467.18	0.00	0.00	300000.00	29855467.18	2025-08-13 16:47:29.972043	1
10806	3	2069	6	junho-69	2069-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	30155467.18	0.00	0.00	0.00	98721.15	30254188.33	0.00	0.00	300000.00	29954188.33	2025-08-13 16:47:29.972043	1
10807	3	2069	7	julho-69	2069-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	30254188.33	0.00	0.00	0.00	99044.34	30353232.67	0.00	0.00	300000.00	30053232.67	2025-08-13 16:47:29.972043	1
10808	3	2069	8	agosto-69	2069-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	30353232.67	0.00	0.00	0.00	99368.59	30452601.26	0.00	0.00	300000.00	30152601.26	2025-08-13 16:47:29.972043	1
10809	3	2069	9	setembro-69	2069-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	30452601.26	0.00	0.00	0.00	99693.89	30552295.15	0.00	0.00	300000.00	30252295.15	2025-08-13 16:47:29.972043	1
10810	3	2069	10	outubro-69	2069-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	30552295.15	0.00	0.00	0.00	100020.26	30652315.42	0.00	0.00	300000.00	30352315.42	2025-08-13 16:47:29.972043	1
10811	3	2069	11	novembro-69	2069-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	30652315.42	0.00	0.00	0.00	100347.70	30752663.12	0.00	0.00	300000.00	30452663.12	2025-08-13 16:47:29.972043	1
10812	3	2069	12	dezembro-69	2069-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	30752663.12	0.00	0.00	0.00	100676.22	30853339.34	0.00	0.00	300000.00	30553339.34	2025-08-13 16:47:29.972043	1
10813	3	2070	1	janeiro-70	2070-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	30853339.34	0.00	0.00	0.00	101005.80	30954345.14	0.00	0.00	300000.00	30654345.14	2025-08-13 16:47:29.972043	1
10814	3	2070	2	fevereiro-70	2070-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	30954345.14	0.00	0.00	0.00	101336.47	31055681.61	0.00	0.00	300000.00	30755681.61	2025-08-13 16:47:29.972043	1
10815	3	2070	3	março-70	2070-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	31055681.61	0.00	0.00	0.00	101668.22	31157349.83	0.00	0.00	300000.00	30857349.83	2025-08-13 16:47:29.972043	1
10816	3	2070	4	abril-70	2070-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	31157349.83	0.00	0.00	0.00	102001.06	31259350.89	0.00	0.00	300000.00	30959350.89	2025-08-13 16:47:29.972043	1
10817	3	2070	5	maio-70	2070-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	31259350.89	0.00	0.00	0.00	102334.98	31361685.87	0.00	0.00	300000.00	31061685.87	2025-08-13 16:47:29.972043	1
10818	3	2070	6	junho-70	2070-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	31361685.87	0.00	0.00	0.00	102670.00	31464355.87	0.00	0.00	300000.00	31164355.87	2025-08-13 16:47:29.972043	1
10819	3	2070	7	julho-70	2070-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	31464355.87	0.00	0.00	0.00	103006.11	31567361.98	0.00	0.00	300000.00	31267361.98	2025-08-13 16:47:29.972043	1
10820	3	2070	8	agosto-70	2070-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	31567361.98	0.00	0.00	0.00	103343.33	31670705.31	0.00	0.00	300000.00	31370705.31	2025-08-13 16:47:29.972043	1
10821	3	2070	9	setembro-70	2070-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	31670705.31	0.00	0.00	0.00	103681.65	31774386.96	0.00	0.00	300000.00	31474386.96	2025-08-13 16:47:29.972043	1
10822	3	2070	10	outubro-70	2070-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	31774386.96	0.00	0.00	0.00	104021.07	31878408.03	0.00	0.00	300000.00	31578408.03	2025-08-13 16:47:29.972043	1
10823	3	2070	11	novembro-70	2070-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	31878408.03	0.00	0.00	0.00	104361.61	31982769.64	0.00	0.00	300000.00	31682769.64	2025-08-13 16:47:29.972043	1
10824	3	2070	12	dezembro-70	2070-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	31982769.64	0.00	0.00	0.00	104703.27	32087472.91	0.00	0.00	300000.00	31787472.91	2025-08-13 16:47:29.972043	1
10825	3	2071	1	janeiro-71	2071-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	32087472.91	0.00	0.00	0.00	105046.04	32192518.95	0.00	0.00	300000.00	31892518.95	2025-08-13 16:47:29.972043	1
10826	3	2071	2	fevereiro-71	2071-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	32192518.95	0.00	0.00	0.00	105389.93	32297908.88	0.00	0.00	300000.00	31997908.88	2025-08-13 16:47:29.972043	1
10827	3	2071	3	março-71	2071-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	32297908.88	0.00	0.00	0.00	105734.95	32403643.83	0.00	0.00	300000.00	32103643.83	2025-08-13 16:47:29.972043	1
10828	3	2071	4	abril-71	2071-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	32403643.83	0.00	0.00	0.00	106081.10	32509724.92	0.00	0.00	300000.00	32209724.92	2025-08-13 16:47:29.972043	1
10829	3	2071	5	maio-71	2071-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	32509724.92	0.00	0.00	0.00	106428.38	32616153.30	0.00	0.00	300000.00	32316153.30	2025-08-13 16:47:29.972043	1
10830	3	2071	6	junho-71	2071-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	32616153.30	0.00	0.00	0.00	106776.80	32722930.10	0.00	0.00	300000.00	32422930.10	2025-08-13 16:47:29.972043	1
10831	3	2071	7	julho-71	2071-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	32722930.10	0.00	0.00	0.00	107126.36	32830056.46	0.00	0.00	300000.00	32530056.46	2025-08-13 16:47:29.972043	1
10832	3	2071	8	agosto-71	2071-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	32830056.46	0.00	0.00	0.00	107477.06	32937533.52	0.00	0.00	300000.00	32637533.52	2025-08-13 16:47:29.972043	1
10833	3	2071	9	setembro-71	2071-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	32937533.52	0.00	0.00	0.00	107828.91	33045362.44	0.00	0.00	300000.00	32745362.44	2025-08-13 16:47:29.972043	1
10834	3	2071	10	outubro-71	2071-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	33045362.44	0.00	0.00	0.00	108181.92	33153544.35	0.00	0.00	300000.00	32853544.35	2025-08-13 16:47:29.972043	1
10835	3	2071	11	novembro-71	2071-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	33153544.35	0.00	0.00	0.00	108536.08	33262080.43	0.00	0.00	300000.00	32962080.43	2025-08-13 16:47:29.972043	1
10836	3	2071	12	dezembro-71	2071-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	33262080.43	0.00	0.00	0.00	108891.40	33370971.83	0.00	0.00	300000.00	33070971.83	2025-08-13 16:47:29.972043	1
10837	3	2072	1	janeiro-72	2072-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	33370971.83	0.00	0.00	0.00	109247.88	33480219.70	0.00	0.00	300000.00	33180219.70	2025-08-13 16:47:29.972043	1
10838	3	2072	2	fevereiro-72	2072-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	33480219.70	0.00	0.00	0.00	109605.53	33589825.23	0.00	0.00	300000.00	33289825.23	2025-08-13 16:47:29.972043	1
10839	3	2072	3	março-72	2072-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	33589825.23	0.00	0.00	0.00	109964.35	33699789.58	0.00	0.00	300000.00	33399789.58	2025-08-13 16:47:29.972043	1
10840	3	2072	4	abril-72	2072-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	33699789.58	0.00	0.00	0.00	110324.34	33810113.92	0.00	0.00	300000.00	33510113.92	2025-08-13 16:47:29.972043	1
10841	3	2072	5	maio-72	2072-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	33810113.92	0.00	0.00	0.00	110685.51	33920799.44	0.00	0.00	300000.00	33620799.44	2025-08-13 16:47:29.972043	1
10842	3	2072	6	junho-72	2072-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	33920799.44	0.00	0.00	0.00	111047.87	34031847.31	0.00	0.00	300000.00	33731847.31	2025-08-13 16:47:29.972043	1
10843	3	2072	7	julho-72	2072-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	34031847.31	0.00	0.00	0.00	111411.41	34143258.72	0.00	0.00	300000.00	33843258.72	2025-08-13 16:47:29.972043	1
10844	3	2072	8	agosto-72	2072-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	34143258.72	0.00	0.00	0.00	111776.14	34255034.86	0.00	0.00	300000.00	33955034.86	2025-08-13 16:47:29.972043	1
10845	3	2072	9	setembro-72	2072-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	34255034.86	0.00	0.00	0.00	112142.07	34367176.93	0.00	0.00	300000.00	34067176.93	2025-08-13 16:47:29.972043	1
10846	3	2072	10	outubro-72	2072-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	34367176.93	0.00	0.00	0.00	112509.19	34479686.13	0.00	0.00	300000.00	34179686.13	2025-08-13 16:47:29.972043	1
10847	3	2072	11	novembro-72	2072-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	34479686.13	0.00	0.00	0.00	112877.52	34592563.65	0.00	0.00	300000.00	34292563.65	2025-08-13 16:47:29.972043	1
10848	3	2072	12	dezembro-72	2072-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	34592563.65	0.00	0.00	0.00	113247.05	34705810.70	0.00	0.00	300000.00	34405810.70	2025-08-13 16:47:29.972043	1
10849	3	2073	1	janeiro-73	2073-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	34705810.70	0.00	0.00	0.00	113617.79	34819428.49	0.00	0.00	300000.00	34519428.49	2025-08-13 16:47:29.972043	1
10850	3	2073	2	fevereiro-73	2073-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	34819428.49	0.00	0.00	0.00	113989.75	34933418.24	0.00	0.00	300000.00	34633418.24	2025-08-13 16:47:29.972043	1
10851	3	2073	3	março-73	2073-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	34933418.24	0.00	0.00	0.00	114362.92	35047781.16	0.00	0.00	300000.00	34747781.16	2025-08-13 16:47:29.972043	1
10852	3	2073	4	abril-73	2073-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	35047781.16	0.00	0.00	0.00	114737.32	35162518.48	0.00	0.00	300000.00	34862518.48	2025-08-13 16:47:29.972043	1
10853	3	2073	5	maio-73	2073-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	35162518.48	0.00	0.00	0.00	115112.94	35277631.41	0.00	0.00	300000.00	34977631.41	2025-08-13 16:47:29.972043	1
10854	3	2073	6	junho-73	2073-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	35277631.41	0.00	0.00	0.00	115489.79	35393121.20	0.00	0.00	300000.00	35093121.20	2025-08-13 16:47:29.972043	1
10855	3	2073	7	julho-73	2073-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	35393121.20	0.00	0.00	0.00	115867.87	35508989.07	0.00	0.00	300000.00	35208989.07	2025-08-13 16:47:29.972043	1
10856	3	2073	8	agosto-73	2073-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	35508989.07	0.00	0.00	0.00	116247.19	35625236.26	0.00	0.00	300000.00	35325236.26	2025-08-13 16:47:29.972043	1
10857	3	2073	9	setembro-73	2073-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	35625236.26	0.00	0.00	0.00	116627.75	35741864.01	0.00	0.00	300000.00	35441864.01	2025-08-13 16:47:29.972043	1
10858	3	2073	10	outubro-73	2073-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	35741864.01	0.00	0.00	0.00	117009.56	35858873.57	0.00	0.00	300000.00	35558873.57	2025-08-13 16:47:29.972043	1
10859	3	2073	11	novembro-73	2073-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	35858873.57	0.00	0.00	0.00	117392.62	35976266.19	0.00	0.00	300000.00	35676266.19	2025-08-13 16:47:29.972043	1
10860	3	2073	12	dezembro-73	2073-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	35976266.19	0.00	0.00	0.00	117776.93	36094043.13	0.00	0.00	300000.00	35794043.13	2025-08-13 16:47:29.972043	1
10861	3	2074	1	janeiro-74	2074-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	36094043.13	0.00	0.00	0.00	118162.50	36212205.63	0.00	0.00	300000.00	35912205.63	2025-08-13 16:47:29.972043	1
10862	3	2074	2	fevereiro-74	2074-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	36212205.63	0.00	0.00	0.00	118549.34	36330754.97	0.00	0.00	300000.00	36030754.97	2025-08-13 16:47:29.972043	1
10863	3	2074	3	março-74	2074-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	36330754.97	0.00	0.00	0.00	118937.44	36449692.41	0.00	0.00	300000.00	36149692.41	2025-08-13 16:47:29.972043	1
10864	3	2074	4	abril-74	2074-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	36449692.41	0.00	0.00	0.00	119326.81	36569019.22	0.00	0.00	300000.00	36269019.22	2025-08-13 16:47:29.972043	1
10865	3	2074	5	maio-74	2074-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	36569019.22	0.00	0.00	0.00	119717.45	36688736.67	0.00	0.00	300000.00	36388736.67	2025-08-13 16:47:29.972043	1
10866	3	2074	6	junho-74	2074-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	36688736.67	0.00	0.00	0.00	120109.38	36808846.05	0.00	0.00	300000.00	36508846.05	2025-08-13 16:47:29.972043	1
10867	3	2074	7	julho-74	2074-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	36808846.05	0.00	0.00	0.00	120502.58	36929348.63	0.00	0.00	300000.00	36629348.63	2025-08-13 16:47:29.972043	1
10868	3	2074	8	agosto-74	2074-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	36929348.63	0.00	0.00	0.00	120897.08	37050245.71	0.00	0.00	300000.00	36750245.71	2025-08-13 16:47:29.972043	1
10869	3	2074	9	setembro-74	2074-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	37050245.71	0.00	0.00	0.00	121292.86	37171538.57	0.00	0.00	300000.00	36871538.57	2025-08-13 16:47:29.972043	1
10870	3	2074	10	outubro-74	2074-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	37171538.57	0.00	0.00	0.00	121689.94	37293228.52	0.00	0.00	300000.00	36993228.52	2025-08-13 16:47:29.972043	1
10871	3	2074	11	novembro-74	2074-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	37293228.52	0.00	0.00	0.00	122088.33	37415316.84	0.00	0.00	300000.00	37115316.84	2025-08-13 16:47:29.972043	1
10872	3	2074	12	dezembro-74	2074-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	37415316.84	0.00	0.00	0.00	122488.01	37537804.85	0.00	0.00	300000.00	37237804.85	2025-08-13 16:47:29.972043	1
10873	3	2075	1	janeiro-75	2075-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	37537804.85	0.00	0.00	0.00	122889.01	37660693.86	0.00	0.00	300000.00	37360693.86	2025-08-13 16:47:29.972043	1
10874	3	2075	2	fevereiro-75	2075-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	37660693.86	0.00	0.00	0.00	123291.31	37783985.17	0.00	0.00	300000.00	37483985.17	2025-08-13 16:47:29.972043	1
10875	3	2075	3	março-75	2075-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	37783985.17	0.00	0.00	0.00	123694.94	37907680.10	0.00	0.00	300000.00	37607680.10	2025-08-13 16:47:29.972043	1
10876	3	2075	4	abril-75	2075-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	37907680.10	0.00	0.00	0.00	124099.88	38031779.98	0.00	0.00	300000.00	37731779.98	2025-08-13 16:47:29.972043	1
10877	3	2075	5	maio-75	2075-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	38031779.98	0.00	0.00	0.00	124506.15	38156286.14	0.00	0.00	300000.00	37856286.14	2025-08-13 16:47:29.972043	1
10878	3	2075	6	junho-75	2075-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	38156286.14	0.00	0.00	0.00	124913.75	38281199.89	0.00	0.00	300000.00	37981199.89	2025-08-13 16:47:29.972043	1
10879	3	2075	7	julho-75	2075-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	38281199.89	0.00	0.00	0.00	125322.69	38406522.57	0.00	0.00	300000.00	38106522.57	2025-08-13 16:47:29.972043	1
10880	3	2075	8	agosto-75	2075-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	38406522.57	0.00	0.00	0.00	125732.96	38532255.54	0.00	0.00	300000.00	38232255.54	2025-08-13 16:47:29.972043	1
10881	3	2075	9	setembro-75	2075-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	38532255.54	0.00	0.00	0.00	126144.58	38658400.11	0.00	0.00	300000.00	38358400.11	2025-08-13 16:47:29.972043	1
10882	3	2075	10	outubro-75	2075-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	38658400.11	0.00	0.00	0.00	126557.54	38784957.66	0.00	0.00	300000.00	38484957.66	2025-08-13 16:47:29.972043	1
10883	3	2075	11	novembro-75	2075-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	38784957.66	0.00	0.00	0.00	126971.86	38911929.51	0.00	0.00	300000.00	38611929.51	2025-08-13 16:47:29.972043	1
10884	3	2075	12	dezembro-75	2075-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	38911929.51	0.00	0.00	0.00	127387.53	39039317.05	0.00	0.00	300000.00	38739317.05	2025-08-13 16:47:29.972043	1
10885	3	2076	1	janeiro-76	2076-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	39039317.05	0.00	0.00	0.00	127804.57	39167121.61	0.00	0.00	300000.00	38867121.61	2025-08-13 16:47:29.972043	1
10886	3	2076	2	fevereiro-76	2076-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	39167121.61	0.00	0.00	0.00	128222.96	39295344.58	0.00	0.00	300000.00	38995344.58	2025-08-13 16:47:29.972043	1
10887	3	2076	3	março-76	2076-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	39295344.58	0.00	0.00	0.00	128642.73	39423987.31	0.00	0.00	300000.00	39123987.31	2025-08-13 16:47:29.972043	1
10888	3	2076	4	abril-76	2076-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	39423987.31	0.00	0.00	0.00	129063.88	39553051.18	0.00	0.00	300000.00	39253051.18	2025-08-13 16:47:29.972043	1
10889	3	2076	5	maio-76	2076-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	39553051.18	0.00	0.00	0.00	129486.40	39682537.58	0.00	0.00	300000.00	39382537.58	2025-08-13 16:47:29.972043	1
10890	3	2076	6	junho-76	2076-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	39682537.58	0.00	0.00	0.00	129910.30	39812447.88	0.00	0.00	300000.00	39512447.88	2025-08-13 16:47:29.972043	1
10891	3	2076	7	julho-76	2076-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	39812447.88	0.00	0.00	0.00	130335.59	39942783.48	0.00	0.00	300000.00	39642783.48	2025-08-13 16:47:29.972043	1
10892	3	2076	8	agosto-76	2076-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	39942783.48	0.00	0.00	0.00	130762.28	40073545.76	0.00	0.00	300000.00	39773545.76	2025-08-13 16:47:29.972043	1
10893	3	2076	9	setembro-76	2076-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	40073545.76	0.00	0.00	0.00	131190.36	40204736.12	0.00	0.00	300000.00	39904736.12	2025-08-13 16:47:29.972043	1
10894	3	2076	10	outubro-76	2076-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	40204736.12	0.00	0.00	0.00	131619.84	40336355.96	0.00	0.00	300000.00	40036355.96	2025-08-13 16:47:29.972043	1
10895	3	2076	11	novembro-76	2076-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	40336355.96	0.00	0.00	0.00	132050.73	40468406.70	0.00	0.00	300000.00	40168406.70	2025-08-13 16:47:29.972043	1
10896	3	2076	12	dezembro-76	2076-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	40468406.70	0.00	0.00	0.00	132483.03	40600889.73	0.00	0.00	300000.00	40300889.73	2025-08-13 16:47:29.972043	1
10897	3	2077	1	janeiro-77	2077-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	40600889.73	0.00	0.00	0.00	132916.75	40733806.48	0.00	0.00	300000.00	40433806.48	2025-08-13 16:47:29.972043	1
10898	3	2077	2	fevereiro-77	2077-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	40733806.48	0.00	0.00	0.00	133351.88	40867158.36	0.00	0.00	300000.00	40567158.36	2025-08-13 16:47:29.972043	1
10899	3	2077	3	março-77	2077-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	40867158.36	0.00	0.00	0.00	133788.44	41000946.80	0.00	0.00	300000.00	40700946.80	2025-08-13 16:47:29.972043	1
10900	3	2077	4	abril-77	2077-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	41000946.80	0.00	0.00	0.00	134226.43	41135173.23	0.00	0.00	300000.00	40835173.23	2025-08-13 16:47:29.972043	1
10901	3	2077	5	maio-77	2077-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	41135173.23	0.00	0.00	0.00	134665.85	41269839.08	0.00	0.00	300000.00	40969839.08	2025-08-13 16:47:29.972043	1
10902	3	2077	6	junho-77	2077-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	41269839.08	0.00	0.00	0.00	135106.71	41404945.80	0.00	0.00	300000.00	41104945.80	2025-08-13 16:47:29.972043	1
10903	3	2077	7	julho-77	2077-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	41404945.80	0.00	0.00	0.00	135549.02	41540494.82	0.00	0.00	300000.00	41240494.82	2025-08-13 16:47:29.972043	1
10904	3	2077	8	agosto-77	2077-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	41540494.82	0.00	0.00	0.00	135992.77	41676487.59	0.00	0.00	300000.00	41376487.59	2025-08-13 16:47:29.972043	1
10905	3	2077	9	setembro-77	2077-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	41676487.59	0.00	0.00	0.00	136437.98	41812925.56	0.00	0.00	300000.00	41512925.56	2025-08-13 16:47:29.972043	1
10906	3	2077	10	outubro-77	2077-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	41812925.56	0.00	0.00	0.00	136884.64	41949810.20	0.00	0.00	300000.00	41649810.20	2025-08-13 16:47:29.972043	1
10907	3	2077	11	novembro-77	2077-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	41949810.20	0.00	0.00	0.00	137332.76	42087142.96	0.00	0.00	300000.00	41787142.96	2025-08-13 16:47:29.972043	1
10908	3	2077	12	dezembro-77	2077-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	42087142.96	0.00	0.00	0.00	137782.35	42224925.32	0.00	0.00	300000.00	41924925.32	2025-08-13 16:47:29.972043	1
10909	3	2078	1	janeiro-78	2078-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	42224925.32	0.00	0.00	0.00	138233.42	42363158.74	0.00	0.00	300000.00	42063158.74	2025-08-13 16:47:29.972043	1
10910	3	2078	2	fevereiro-78	2078-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	42363158.74	0.00	0.00	0.00	138685.96	42501844.69	0.00	0.00	300000.00	42201844.69	2025-08-13 16:47:29.972043	1
10911	3	2078	3	março-78	2078-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	42501844.69	0.00	0.00	0.00	139139.98	42640984.67	0.00	0.00	300000.00	42340984.67	2025-08-13 16:47:29.972043	1
10912	3	2078	4	abril-78	2078-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	42640984.67	0.00	0.00	0.00	139595.49	42780580.16	0.00	0.00	300000.00	42480580.16	2025-08-13 16:47:29.972043	1
10913	3	2078	5	maio-78	2078-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	42780580.16	0.00	0.00	0.00	140052.49	42920632.65	0.00	0.00	300000.00	42620632.65	2025-08-13 16:47:29.972043	1
10914	3	2078	6	junho-78	2078-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	42920632.65	0.00	0.00	0.00	140510.98	43061143.63	0.00	0.00	300000.00	42761143.63	2025-08-13 16:47:29.972043	1
10915	3	2078	7	julho-78	2078-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	43061143.63	0.00	0.00	0.00	140970.98	43202114.61	0.00	0.00	300000.00	42902114.61	2025-08-13 16:47:29.972043	1
10916	3	2078	8	agosto-78	2078-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	43202114.61	0.00	0.00	0.00	141432.48	43343547.09	0.00	0.00	300000.00	43043547.09	2025-08-13 16:47:29.972043	1
10917	3	2078	9	setembro-78	2078-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	43343547.09	0.00	0.00	0.00	141895.49	43485442.59	0.00	0.00	300000.00	43185442.59	2025-08-13 16:47:29.972043	1
10918	3	2078	10	outubro-78	2078-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	43485442.59	0.00	0.00	0.00	142360.02	43627802.61	0.00	0.00	300000.00	43327802.61	2025-08-13 16:47:29.972043	1
10919	3	2078	11	novembro-78	2078-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	43627802.61	0.00	0.00	0.00	142826.07	43770628.68	0.00	0.00	300000.00	43470628.68	2025-08-13 16:47:29.972043	1
10920	3	2078	12	dezembro-78	2078-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	43770628.68	0.00	0.00	0.00	143293.65	43913922.33	0.00	0.00	300000.00	43613922.33	2025-08-13 16:47:29.972043	1
10921	3	2079	1	janeiro-79	2079-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	43913922.33	0.00	0.00	0.00	143762.75	44057685.08	0.00	0.00	300000.00	43757685.08	2025-08-13 16:47:29.972043	1
10922	3	2079	2	fevereiro-79	2079-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	44057685.08	0.00	0.00	0.00	144233.40	44201918.48	0.00	0.00	300000.00	43901918.48	2025-08-13 16:47:29.972043	1
10923	3	2079	3	março-79	2079-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	44201918.48	0.00	0.00	0.00	144705.58	44346624.06	0.00	0.00	300000.00	44046624.06	2025-08-13 16:47:29.972043	1
10924	3	2079	4	abril-79	2079-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	44346624.06	0.00	0.00	0.00	145179.31	44491803.37	0.00	0.00	300000.00	44191803.37	2025-08-13 16:47:29.972043	1
10925	3	2079	5	maio-79	2079-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	44491803.37	0.00	0.00	0.00	145654.59	44637457.95	0.00	0.00	300000.00	44337457.95	2025-08-13 16:47:29.972043	1
10926	3	2079	6	junho-79	2079-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	44637457.95	0.00	0.00	0.00	146131.42	44783589.38	0.00	0.00	300000.00	44483589.38	2025-08-13 16:47:29.972043	1
10927	3	2079	7	julho-79	2079-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	44783589.38	0.00	0.00	0.00	146609.82	44930199.19	0.00	0.00	300000.00	44630199.19	2025-08-13 16:47:29.972043	1
10928	3	2079	8	agosto-79	2079-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	44930199.19	0.00	0.00	0.00	147089.78	45077288.97	0.00	0.00	300000.00	44777288.97	2025-08-13 16:47:29.972043	1
10929	3	2079	9	setembro-79	2079-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	45077288.97	0.00	0.00	0.00	147571.31	45224860.29	0.00	0.00	300000.00	44924860.29	2025-08-13 16:47:29.972043	1
10930	3	2079	10	outubro-79	2079-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	45224860.29	0.00	0.00	0.00	148054.42	45372914.71	0.00	0.00	300000.00	45072914.71	2025-08-13 16:47:29.972043	1
10931	3	2079	11	novembro-79	2079-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	45372914.71	0.00	0.00	0.00	148539.12	45521453.83	0.00	0.00	300000.00	45221453.83	2025-08-13 16:47:29.972043	1
10932	3	2079	12	dezembro-79	2079-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	45521453.83	0.00	0.00	0.00	149025.39	45670479.22	0.00	0.00	300000.00	45370479.22	2025-08-13 16:47:29.972043	1
10933	3	2080	1	janeiro-80	2080-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	45670479.22	0.00	0.00	0.00	149513.26	45819992.49	0.00	0.00	300000.00	45519992.49	2025-08-13 16:47:29.972043	1
10934	3	2080	2	fevereiro-80	2080-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	45819992.49	0.00	0.00	0.00	150002.73	45969995.22	0.00	0.00	300000.00	45669995.22	2025-08-13 16:47:29.972043	1
10935	3	2080	3	março-80	2080-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	45969995.22	0.00	0.00	0.00	150493.80	46120489.02	0.00	0.00	300000.00	45820489.02	2025-08-13 16:47:29.972043	1
10936	3	2080	4	abril-80	2080-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	46120489.02	0.00	0.00	0.00	150986.48	46271475.50	0.00	0.00	300000.00	45971475.50	2025-08-13 16:47:29.972043	1
10937	3	2080	5	maio-80	2080-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	46271475.50	0.00	0.00	0.00	151480.77	46422956.27	0.00	0.00	300000.00	46122956.27	2025-08-13 16:47:29.972043	1
10938	3	2080	6	junho-80	2080-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	46422956.27	0.00	0.00	0.00	151976.68	46574932.95	0.00	0.00	300000.00	46274932.95	2025-08-13 16:47:29.972043	1
10939	3	2080	7	julho-80	2080-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	46574932.95	0.00	0.00	0.00	152474.21	46727407.16	0.00	0.00	300000.00	46427407.16	2025-08-13 16:47:29.972043	1
10940	3	2080	8	agosto-80	2080-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	46727407.16	0.00	0.00	0.00	152973.37	46880380.53	0.00	0.00	300000.00	46580380.53	2025-08-13 16:47:29.972043	1
10941	3	2080	9	setembro-80	2080-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	46880380.53	0.00	0.00	0.00	153474.17	47033854.70	0.00	0.00	300000.00	46733854.70	2025-08-13 16:47:29.972043	1
10942	3	2080	10	outubro-80	2080-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	47033854.70	0.00	0.00	0.00	153976.60	47187831.30	0.00	0.00	300000.00	46887831.30	2025-08-13 16:47:29.972043	1
10943	3	2080	11	novembro-80	2080-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	47187831.30	0.00	0.00	0.00	154480.68	47342311.98	0.00	0.00	300000.00	47042311.98	2025-08-13 16:47:29.972043	1
10944	3	2080	12	dezembro-80	2080-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	47342311.98	0.00	0.00	0.00	154986.41	47497298.39	0.00	0.00	300000.00	47197298.39	2025-08-13 16:47:29.972043	1
10945	3	2081	1	janeiro-81	2081-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	47497298.39	0.00	0.00	0.00	155493.80	47652792.19	0.00	0.00	300000.00	47352792.19	2025-08-13 16:47:29.972043	1
10946	3	2081	2	fevereiro-81	2081-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	47652792.19	0.00	0.00	0.00	156002.84	47808795.03	0.00	0.00	300000.00	47508795.03	2025-08-13 16:47:29.972043	1
10947	3	2081	3	março-81	2081-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	47808795.03	0.00	0.00	0.00	156513.55	47965308.58	0.00	0.00	300000.00	47665308.58	2025-08-13 16:47:29.972043	1
10948	3	2081	4	abril-81	2081-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	47965308.58	0.00	0.00	0.00	157025.94	48122334.52	0.00	0.00	300000.00	47822334.52	2025-08-13 16:47:29.972043	1
10949	3	2081	5	maio-81	2081-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	48122334.52	0.00	0.00	0.00	157540.00	48279874.52	0.00	0.00	300000.00	47979874.52	2025-08-13 16:47:29.972043	1
10950	3	2081	6	junho-81	2081-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	48279874.52	0.00	0.00	0.00	158055.75	48437930.27	0.00	0.00	300000.00	48137930.27	2025-08-13 16:47:29.972043	1
10951	3	2081	7	julho-81	2081-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	48437930.27	0.00	0.00	0.00	158573.18	48596503.45	0.00	0.00	300000.00	48296503.45	2025-08-13 16:47:29.972043	1
10952	3	2081	8	agosto-81	2081-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	48596503.45	0.00	0.00	0.00	159092.31	48755595.75	0.00	0.00	300000.00	48455595.75	2025-08-13 16:47:29.972043	1
10953	3	2081	9	setembro-81	2081-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	48755595.75	0.00	0.00	0.00	159613.13	48915208.89	0.00	0.00	300000.00	48615208.89	2025-08-13 16:47:29.972043	1
10954	3	2081	10	outubro-81	2081-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	48915208.89	0.00	0.00	0.00	160135.67	49075344.55	0.00	0.00	300000.00	48775344.55	2025-08-13 16:47:29.972043	1
10955	3	2081	11	novembro-81	2081-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	49075344.55	0.00	0.00	0.00	160659.91	49236004.46	0.00	0.00	300000.00	48936004.46	2025-08-13 16:47:29.972043	1
10956	3	2081	12	dezembro-81	2081-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	49236004.46	0.00	0.00	0.00	161185.87	49397190.33	0.00	0.00	300000.00	49097190.33	2025-08-13 16:47:29.972043	1
10957	3	2082	1	janeiro-82	2082-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	49397190.33	0.00	0.00	0.00	161713.55	49558903.87	0.00	0.00	300000.00	49258903.87	2025-08-13 16:47:29.972043	1
10958	3	2082	2	fevereiro-82	2082-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	49558903.87	0.00	0.00	0.00	162242.96	49721146.83	0.00	0.00	300000.00	49421146.83	2025-08-13 16:47:29.972043	1
10959	3	2082	3	março-82	2082-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	49721146.83	0.00	0.00	0.00	162774.10	49883920.93	0.00	0.00	300000.00	49583920.93	2025-08-13 16:47:29.972043	1
10960	3	2082	4	abril-82	2082-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	49883920.93	0.00	0.00	0.00	163306.98	50047227.90	0.00	0.00	300000.00	49747227.90	2025-08-13 16:47:29.972043	1
10961	3	2082	5	maio-82	2082-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	50047227.90	0.00	0.00	0.00	163841.60	50211069.50	0.00	0.00	300000.00	49911069.50	2025-08-13 16:47:29.972043	1
10962	3	2082	6	junho-82	2082-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	50211069.50	0.00	0.00	0.00	164377.98	50375447.48	0.00	0.00	300000.00	50075447.48	2025-08-13 16:47:29.972043	1
10963	3	2082	7	julho-82	2082-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	50375447.48	0.00	0.00	0.00	164916.11	50540363.59	0.00	0.00	300000.00	50240363.59	2025-08-13 16:47:29.972043	1
10964	3	2082	8	agosto-82	2082-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	50540363.59	0.00	0.00	0.00	165456.00	50705819.58	0.00	0.00	300000.00	50405819.58	2025-08-13 16:47:29.972043	1
10965	3	2082	9	setembro-82	2082-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	50705819.58	0.00	0.00	0.00	165997.66	50871817.24	0.00	0.00	300000.00	50571817.24	2025-08-13 16:47:29.972043	1
10966	3	2082	10	outubro-82	2082-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	50871817.24	0.00	0.00	0.00	166541.09	51038358.34	0.00	0.00	300000.00	50738358.34	2025-08-13 16:47:29.972043	1
10967	3	2082	11	novembro-82	2082-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	51038358.34	0.00	0.00	0.00	167086.30	51205444.64	0.00	0.00	300000.00	50905444.64	2025-08-13 16:47:29.972043	1
10968	3	2082	12	dezembro-82	2082-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	51205444.64	0.00	0.00	0.00	167633.30	51373077.94	0.00	0.00	300000.00	51073077.94	2025-08-13 16:47:29.972043	1
10969	3	2083	1	janeiro-83	2083-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	51373077.94	0.00	0.00	0.00	168182.09	51541260.03	0.00	0.00	300000.00	51241260.03	2025-08-13 16:47:29.972043	1
10970	3	2083	2	fevereiro-83	2083-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	51541260.03	0.00	0.00	0.00	168732.67	51709992.70	0.00	0.00	300000.00	51409992.70	2025-08-13 16:47:29.972043	1
10971	3	2083	3	março-83	2083-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	51709992.70	0.00	0.00	0.00	169285.06	51879277.76	0.00	0.00	300000.00	51579277.76	2025-08-13 16:47:29.972043	1
10972	3	2083	4	abril-83	2083-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	51879277.76	0.00	0.00	0.00	169839.26	52049117.02	0.00	0.00	300000.00	51749117.02	2025-08-13 16:47:29.972043	1
10973	3	2083	5	maio-83	2083-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	52049117.02	0.00	0.00	0.00	170395.27	52219512.28	0.00	0.00	300000.00	51919512.28	2025-08-13 16:47:29.972043	1
10974	3	2083	6	junho-83	2083-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	52219512.28	0.00	0.00	0.00	170953.09	52390465.38	0.00	0.00	300000.00	52090465.38	2025-08-13 16:47:29.972043	1
10975	3	2083	7	julho-83	2083-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	52390465.38	0.00	0.00	0.00	171512.75	52561978.13	0.00	0.00	300000.00	52261978.13	2025-08-13 16:47:29.972043	1
10976	3	2083	8	agosto-83	2083-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	52561978.13	0.00	0.00	0.00	172074.24	52734052.37	0.00	0.00	300000.00	52434052.37	2025-08-13 16:47:29.972043	1
10977	3	2083	9	setembro-83	2083-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	52734052.37	0.00	0.00	0.00	172637.57	52906689.93	0.00	0.00	300000.00	52606689.93	2025-08-13 16:47:29.972043	1
10978	3	2083	10	outubro-83	2083-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	52906689.93	0.00	0.00	0.00	173202.74	53079892.67	0.00	0.00	300000.00	52779892.67	2025-08-13 16:47:29.972043	1
10979	3	2083	11	novembro-83	2083-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	53079892.67	0.00	0.00	0.00	173769.76	53253662.43	0.00	0.00	300000.00	52953662.43	2025-08-13 16:47:29.972043	1
10980	3	2083	12	dezembro-83	2083-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	53253662.43	0.00	0.00	0.00	174338.63	53428001.06	0.00	0.00	300000.00	53128001.06	2025-08-13 16:47:29.972043	1
10981	3	2084	1	janeiro-84	2084-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	53428001.06	0.00	0.00	0.00	174909.37	53602910.43	0.00	0.00	300000.00	53302910.43	2025-08-13 16:47:29.972043	1
10982	3	2084	2	fevereiro-84	2084-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	53602910.43	0.00	0.00	0.00	175481.98	53778392.41	0.00	0.00	300000.00	53478392.41	2025-08-13 16:47:29.972043	1
10983	3	2084	3	março-84	2084-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	53778392.41	0.00	0.00	0.00	176056.46	53954448.87	0.00	0.00	300000.00	53654448.87	2025-08-13 16:47:29.972043	1
10984	3	2084	4	abril-84	2084-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	53954448.87	0.00	0.00	0.00	176632.83	54131081.70	0.00	0.00	300000.00	53831081.70	2025-08-13 16:47:29.972043	1
10985	3	2084	5	maio-84	2084-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	54131081.70	0.00	0.00	0.00	177211.08	54308292.78	0.00	0.00	300000.00	54008292.78	2025-08-13 16:47:29.972043	1
10986	3	2084	6	junho-84	2084-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	54308292.78	0.00	0.00	0.00	177791.22	54486083.99	0.00	0.00	300000.00	54186083.99	2025-08-13 16:47:29.972043	1
10987	3	2084	7	julho-84	2084-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	54486083.99	0.00	0.00	0.00	178373.26	54664457.25	0.00	0.00	300000.00	54364457.25	2025-08-13 16:47:29.972043	1
10988	3	2084	8	agosto-84	2084-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	54664457.25	0.00	0.00	0.00	178957.21	54843414.46	0.00	0.00	300000.00	54543414.46	2025-08-13 16:47:29.972043	1
10989	3	2084	9	setembro-84	2084-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	54843414.46	0.00	0.00	0.00	179543.07	55022957.53	0.00	0.00	300000.00	54722957.53	2025-08-13 16:47:29.972043	1
10990	3	2084	10	outubro-84	2084-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	55022957.53	0.00	0.00	0.00	180130.85	55203088.38	0.00	0.00	300000.00	54903088.38	2025-08-13 16:47:29.972043	1
10991	3	2084	11	novembro-84	2084-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	55203088.38	0.00	0.00	0.00	180720.55	55383808.92	0.00	0.00	300000.00	55083808.92	2025-08-13 16:47:29.972043	1
10992	3	2084	12	dezembro-84	2084-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	55383808.92	0.00	0.00	0.00	181312.18	55565121.10	0.00	0.00	300000.00	55265121.10	2025-08-13 16:47:29.972043	1
10993	3	2085	1	janeiro-85	2085-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	55565121.10	0.00	0.00	0.00	181905.75	55747026.85	0.00	0.00	300000.00	55447026.85	2025-08-13 16:47:29.972043	1
10994	3	2085	2	fevereiro-85	2085-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	55747026.85	0.00	0.00	0.00	182501.26	55929528.11	0.00	0.00	300000.00	55629528.11	2025-08-13 16:47:29.972043	1
10995	3	2085	3	março-85	2085-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	55929528.11	0.00	0.00	0.00	183098.72	56112626.83	0.00	0.00	300000.00	55812626.83	2025-08-13 16:47:29.972043	1
10996	3	2085	4	abril-85	2085-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	56112626.83	0.00	0.00	0.00	183698.14	56296324.97	0.00	0.00	300000.00	55996324.97	2025-08-13 16:47:29.972043	1
10997	3	2085	5	maio-85	2085-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	56296324.97	0.00	0.00	0.00	184299.52	56480624.49	0.00	0.00	300000.00	56180624.49	2025-08-13 16:47:29.972043	1
10998	3	2085	6	junho-85	2085-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	56480624.49	0.00	0.00	0.00	184902.87	56665527.35	0.00	0.00	300000.00	56365527.35	2025-08-13 16:47:29.972043	1
10999	3	2085	7	julho-85	2085-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	56665527.35	0.00	0.00	0.00	185508.19	56851035.54	0.00	0.00	300000.00	56551035.54	2025-08-13 16:47:29.972043	1
11000	3	2085	8	agosto-85	2085-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	56851035.54	0.00	0.00	0.00	186115.50	57037151.04	0.00	0.00	300000.00	56737151.04	2025-08-13 16:47:29.972043	1
11001	3	2085	9	setembro-85	2085-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	57037151.04	0.00	0.00	0.00	186724.79	57223875.83	0.00	0.00	300000.00	56923875.83	2025-08-13 16:47:29.972043	1
11002	3	2085	10	outubro-85	2085-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	57223875.83	0.00	0.00	0.00	187336.08	57411211.91	0.00	0.00	300000.00	57111211.91	2025-08-13 16:47:29.972043	1
11003	3	2085	11	novembro-85	2085-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	57411211.91	0.00	0.00	0.00	187949.37	57599161.28	0.00	0.00	300000.00	57299161.28	2025-08-13 16:47:29.972043	1
11004	3	2085	12	dezembro-85	2085-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	57599161.28	0.00	0.00	0.00	188564.67	57787725.94	0.00	0.00	300000.00	57487725.94	2025-08-13 16:47:29.972043	1
11005	3	2086	1	janeiro-86	2086-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	57787725.94	0.00	0.00	0.00	189181.98	57976907.92	0.00	0.00	300000.00	57676907.92	2025-08-13 16:47:29.972043	1
11006	3	2086	2	fevereiro-86	2086-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	57976907.92	0.00	0.00	0.00	189801.31	58166709.23	0.00	0.00	300000.00	57866709.23	2025-08-13 16:47:29.972043	1
11007	3	2086	3	março-86	2086-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	58166709.23	0.00	0.00	0.00	190422.67	58357131.90	0.00	0.00	300000.00	58057131.90	2025-08-13 16:47:29.972043	1
11008	3	2086	4	abril-86	2086-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	58357131.90	0.00	0.00	0.00	191046.06	58548177.97	0.00	0.00	300000.00	58248177.97	2025-08-13 16:47:29.972043	1
11009	3	2086	5	maio-86	2086-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	58548177.97	0.00	0.00	0.00	191671.50	58739849.47	0.00	0.00	300000.00	58439849.47	2025-08-13 16:47:29.972043	1
11010	3	2086	6	junho-86	2086-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	58739849.47	0.00	0.00	0.00	192298.98	58932148.45	0.00	0.00	300000.00	58632148.45	2025-08-13 16:47:29.972043	1
11011	3	2086	7	julho-86	2086-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	58932148.45	0.00	0.00	0.00	192928.52	59125076.97	0.00	0.00	300000.00	58825076.97	2025-08-13 16:47:29.972043	1
11012	3	2086	8	agosto-86	2086-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	59125076.97	0.00	0.00	0.00	193560.12	59318637.08	0.00	0.00	300000.00	59018637.08	2025-08-13 16:47:29.972043	1
11013	3	2086	9	setembro-86	2086-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	59318637.08	0.00	0.00	0.00	194193.78	59512830.87	0.00	0.00	300000.00	59212830.87	2025-08-13 16:47:29.972043	1
11014	3	2086	10	outubro-86	2086-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	59512830.87	0.00	0.00	0.00	194829.52	59707660.39	0.00	0.00	300000.00	59407660.39	2025-08-13 16:47:29.972043	1
11015	3	2086	11	novembro-86	2086-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	59707660.39	0.00	0.00	0.00	195467.34	59903127.73	0.00	0.00	300000.00	59603127.73	2025-08-13 16:47:29.972043	1
11016	3	2086	12	dezembro-86	2086-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	59903127.73	0.00	0.00	0.00	196107.25	60099234.98	0.00	0.00	300000.00	59799234.98	2025-08-13 16:47:29.972043	1
11017	3	2087	1	janeiro-87	2087-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	60099234.98	0.00	0.00	0.00	196749.26	60295984.24	0.00	0.00	300000.00	59995984.24	2025-08-13 16:47:29.972043	1
11018	3	2087	2	fevereiro-87	2087-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	60295984.24	0.00	0.00	0.00	197393.36	60493377.60	0.00	0.00	300000.00	60193377.60	2025-08-13 16:47:29.972043	1
11019	3	2087	3	março-87	2087-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	60493377.60	0.00	0.00	0.00	198039.58	60691417.18	0.00	0.00	300000.00	60391417.18	2025-08-13 16:47:29.972043	1
11020	3	2087	4	abril-87	2087-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	60691417.18	0.00	0.00	0.00	198687.91	60890105.09	0.00	0.00	300000.00	60590105.09	2025-08-13 16:47:29.972043	1
11021	3	2087	5	maio-87	2087-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	60890105.09	0.00	0.00	0.00	199338.36	61089443.44	0.00	0.00	300000.00	60789443.44	2025-08-13 16:47:29.972043	1
11022	3	2087	6	junho-87	2087-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	61089443.44	0.00	0.00	0.00	199990.94	61289434.39	0.00	0.00	300000.00	60989434.39	2025-08-13 16:47:29.972043	1
11023	3	2087	7	julho-87	2087-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	61289434.39	0.00	0.00	0.00	200645.66	61490080.05	0.00	0.00	300000.00	61190080.05	2025-08-13 16:47:29.972043	1
11024	3	2087	8	agosto-87	2087-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	61490080.05	0.00	0.00	0.00	201302.52	61691382.57	0.00	0.00	300000.00	61391382.57	2025-08-13 16:47:29.972043	1
11025	3	2087	9	setembro-87	2087-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	61691382.57	0.00	0.00	0.00	201961.53	61893344.10	0.00	0.00	300000.00	61593344.10	2025-08-13 16:47:29.972043	1
11026	3	2087	10	outubro-87	2087-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	61893344.10	0.00	0.00	0.00	202622.70	62095966.80	0.00	0.00	300000.00	61795966.80	2025-08-13 16:47:29.972043	1
11027	3	2087	11	novembro-87	2087-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	62095966.80	0.00	0.00	0.00	203286.04	62299252.84	0.00	0.00	300000.00	61999252.84	2025-08-13 16:47:29.972043	1
11028	3	2087	12	dezembro-87	2087-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	62299252.84	0.00	0.00	0.00	203951.54	62503204.38	0.00	0.00	300000.00	62203204.38	2025-08-13 16:47:29.972043	1
11029	3	2088	1	janeiro-88	2088-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	62503204.38	0.00	0.00	0.00	204619.23	62707823.61	0.00	0.00	300000.00	62407823.61	2025-08-13 16:47:29.972043	1
11030	3	2088	2	fevereiro-88	2088-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	62707823.61	0.00	0.00	0.00	205289.10	62913112.71	0.00	0.00	300000.00	62613112.71	2025-08-13 16:47:29.972043	1
11031	3	2088	3	março-88	2088-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	62913112.71	0.00	0.00	0.00	205961.16	63119073.87	0.00	0.00	300000.00	62819073.87	2025-08-13 16:47:29.972043	1
11032	3	2088	4	abril-88	2088-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	63119073.87	0.00	0.00	0.00	206635.42	63325709.29	0.00	0.00	300000.00	63025709.29	2025-08-13 16:47:29.972043	1
11033	3	2088	5	maio-88	2088-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	63325709.29	0.00	0.00	0.00	207311.89	63533021.18	0.00	0.00	300000.00	63233021.18	2025-08-13 16:47:29.972043	1
11034	3	2088	6	junho-88	2088-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	63533021.18	0.00	0.00	0.00	207990.58	63741011.76	0.00	0.00	300000.00	63441011.76	2025-08-13 16:47:29.972043	1
11035	3	2088	7	julho-88	2088-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	63741011.76	0.00	0.00	0.00	208671.49	63949683.25	0.00	0.00	300000.00	63649683.25	2025-08-13 16:47:29.972043	1
11036	3	2088	8	agosto-88	2088-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	63949683.25	0.00	0.00	0.00	209354.62	64159037.87	0.00	0.00	300000.00	63859037.87	2025-08-13 16:47:29.972043	1
11037	3	2088	9	setembro-88	2088-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	64159037.87	0.00	0.00	0.00	210039.99	64369077.86	0.00	0.00	300000.00	64069077.86	2025-08-13 16:47:29.972043	1
11038	3	2088	10	outubro-88	2088-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	64369077.86	0.00	0.00	0.00	210727.61	64579805.47	0.00	0.00	300000.00	64279805.47	2025-08-13 16:47:29.972043	1
11039	3	2088	11	novembro-88	2088-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	64579805.47	0.00	0.00	0.00	211417.48	64791222.95	0.00	0.00	300000.00	64491222.95	2025-08-13 16:47:29.972043	1
11040	3	2088	12	dezembro-88	2088-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	64791222.95	0.00	0.00	0.00	212109.60	65003332.56	0.00	0.00	300000.00	64703332.56	2025-08-13 16:47:29.972043	1
11041	3	2089	1	janeiro-89	2089-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	65003332.56	0.00	0.00	0.00	212804.00	65216136.55	0.00	0.00	300000.00	64916136.55	2025-08-13 16:47:29.972043	1
11042	3	2089	2	fevereiro-89	2089-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	65216136.55	0.00	0.00	0.00	213500.66	65429637.21	0.00	0.00	300000.00	65129637.21	2025-08-13 16:47:29.972043	1
11043	3	2089	3	março-89	2089-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	65429637.21	0.00	0.00	0.00	214199.61	65643836.82	0.00	0.00	300000.00	65343836.82	2025-08-13 16:47:29.972043	1
11044	3	2089	4	abril-89	2089-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	65643836.82	0.00	0.00	0.00	214900.84	65858737.66	0.00	0.00	300000.00	65558737.66	2025-08-13 16:47:29.972043	1
11045	3	2089	5	maio-89	2089-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	65858737.66	0.00	0.00	0.00	215604.37	66074342.03	0.00	0.00	300000.00	65774342.03	2025-08-13 16:47:29.972043	1
11046	3	2089	6	junho-89	2089-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	66074342.03	0.00	0.00	0.00	216310.20	66290652.23	0.00	0.00	300000.00	65990652.23	2025-08-13 16:47:29.972043	1
11047	3	2089	7	julho-89	2089-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	66290652.23	0.00	0.00	0.00	217018.35	66507670.58	0.00	0.00	300000.00	66207670.58	2025-08-13 16:47:29.972043	1
11048	3	2089	8	agosto-89	2089-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	66507670.58	0.00	0.00	0.00	217728.81	66725399.38	0.00	0.00	300000.00	66425399.38	2025-08-13 16:47:29.972043	1
11049	3	2089	9	setembro-89	2089-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	66725399.38	0.00	0.00	0.00	218441.59	66943840.98	0.00	0.00	300000.00	66643840.98	2025-08-13 16:47:29.972043	1
11050	3	2089	10	outubro-89	2089-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	66943840.98	0.00	0.00	0.00	219156.72	67162997.69	0.00	0.00	300000.00	66862997.69	2025-08-13 16:47:29.972043	1
11051	3	2089	11	novembro-89	2089-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	67162997.69	0.00	0.00	0.00	219874.18	67382871.87	0.00	0.00	300000.00	67082871.87	2025-08-13 16:47:29.972043	1
11052	3	2089	12	dezembro-89	2089-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	67382871.87	0.00	0.00	0.00	220593.99	67603465.86	0.00	0.00	300000.00	67303465.86	2025-08-13 16:47:29.972043	1
11053	3	2090	1	janeiro-90	2090-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	67603465.86	0.00	0.00	0.00	221316.16	67824782.02	0.00	0.00	300000.00	67524782.02	2025-08-13 16:47:29.972043	1
11054	3	2090	2	fevereiro-90	2090-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	67824782.02	0.00	0.00	0.00	222040.69	68046822.70	0.00	0.00	300000.00	67746822.70	2025-08-13 16:47:29.972043	1
11055	3	2090	3	março-90	2090-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	68046822.70	0.00	0.00	0.00	222767.59	68269590.29	0.00	0.00	300000.00	67969590.29	2025-08-13 16:47:29.972043	1
11056	3	2090	4	abril-90	2090-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	68269590.29	0.00	0.00	0.00	223496.87	68493087.17	0.00	0.00	300000.00	68193087.17	2025-08-13 16:47:29.972043	1
11057	3	2090	5	maio-90	2090-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	68493087.17	0.00	0.00	0.00	224228.54	68717315.71	0.00	0.00	300000.00	68417315.71	2025-08-13 16:47:29.972043	1
11058	3	2090	6	junho-90	2090-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	68717315.71	0.00	0.00	0.00	224962.61	68942278.32	0.00	0.00	300000.00	68642278.32	2025-08-13 16:47:29.972043	1
11059	3	2090	7	julho-90	2090-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	68942278.32	0.00	0.00	0.00	225699.08	69167977.40	0.00	0.00	300000.00	68867977.40	2025-08-13 16:47:29.972043	1
11060	3	2090	8	agosto-90	2090-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	69167977.40	0.00	0.00	0.00	226437.96	69394415.36	0.00	0.00	300000.00	69094415.36	2025-08-13 16:47:29.972043	1
11061	3	2090	9	setembro-90	2090-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	69394415.36	0.00	0.00	0.00	227179.26	69621594.62	0.00	0.00	300000.00	69321594.62	2025-08-13 16:47:29.972043	1
11062	3	2090	10	outubro-90	2090-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	69621594.62	0.00	0.00	0.00	227922.98	69849517.60	0.00	0.00	300000.00	69549517.60	2025-08-13 16:47:29.972043	1
11063	3	2090	11	novembro-90	2090-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	69849517.60	0.00	0.00	0.00	228669.14	70078186.75	0.00	0.00	300000.00	69778186.75	2025-08-13 16:47:29.972043	1
11064	3	2090	12	dezembro-90	2090-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	70078186.75	0.00	0.00	0.00	229417.75	70307604.49	0.00	0.00	300000.00	70007604.49	2025-08-13 16:47:29.972043	1
11065	3	2091	1	janeiro-91	2091-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	70307604.49	0.00	0.00	0.00	230168.80	70537773.30	0.00	0.00	300000.00	70237773.30	2025-08-13 16:47:29.972043	1
11066	3	2091	2	fevereiro-91	2091-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	70537773.30	0.00	0.00	0.00	230922.31	70768695.61	0.00	0.00	300000.00	70468695.61	2025-08-13 16:47:29.972043	1
11067	3	2091	3	março-91	2091-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	70768695.61	0.00	0.00	0.00	231678.29	71000373.90	0.00	0.00	300000.00	70700373.90	2025-08-13 16:47:29.972043	1
11068	3	2091	4	abril-91	2091-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	71000373.90	0.00	0.00	0.00	232436.75	71232810.65	0.00	0.00	300000.00	70932810.65	2025-08-13 16:47:29.972043	1
11069	3	2091	5	maio-91	2091-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	71232810.65	0.00	0.00	0.00	233197.69	71466008.34	0.00	0.00	300000.00	71166008.34	2025-08-13 16:47:29.972043	1
11070	3	2091	6	junho-91	2091-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	71466008.34	0.00	0.00	0.00	233961.11	71699969.45	0.00	0.00	300000.00	71399969.45	2025-08-13 16:47:29.972043	1
11071	3	2091	7	julho-91	2091-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	71699969.45	0.00	0.00	0.00	234727.04	71934696.50	0.00	0.00	300000.00	71634696.50	2025-08-13 16:47:29.972043	1
11072	3	2091	8	agosto-91	2091-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	71934696.50	0.00	0.00	0.00	235495.48	72170191.97	0.00	0.00	300000.00	71870191.97	2025-08-13 16:47:29.972043	1
11073	3	2091	9	setembro-91	2091-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	72170191.97	0.00	0.00	0.00	236266.43	72406458.40	0.00	0.00	300000.00	72106458.40	2025-08-13 16:47:29.972043	1
11074	3	2091	10	outubro-91	2091-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	72406458.40	0.00	0.00	0.00	237039.90	72643498.31	0.00	0.00	300000.00	72343498.31	2025-08-13 16:47:29.972043	1
11075	3	2091	11	novembro-91	2091-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	72643498.31	0.00	0.00	0.00	237815.91	72881314.22	0.00	0.00	300000.00	72581314.22	2025-08-13 16:47:29.972043	1
11076	3	2091	12	dezembro-91	2091-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	72881314.22	0.00	0.00	0.00	238594.46	73119908.67	0.00	0.00	300000.00	72819908.67	2025-08-13 16:47:29.972043	1
11077	3	2092	1	janeiro-92	2092-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	73119908.67	0.00	0.00	0.00	239375.55	73359284.23	0.00	0.00	300000.00	73059284.23	2025-08-13 16:47:29.972043	1
11078	3	2092	2	fevereiro-92	2092-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	73359284.23	0.00	0.00	0.00	240159.21	73599443.43	0.00	0.00	300000.00	73299443.43	2025-08-13 16:47:29.972043	1
11079	3	2092	3	março-92	2092-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	73599443.43	0.00	0.00	0.00	240945.43	73840388.86	0.00	0.00	300000.00	73540388.86	2025-08-13 16:47:29.972043	1
11080	3	2092	4	abril-92	2092-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	73840388.86	0.00	0.00	0.00	241734.22	74082123.08	0.00	0.00	300000.00	73782123.08	2025-08-13 16:47:29.972043	1
11081	3	2092	5	maio-92	2092-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	74082123.08	0.00	0.00	0.00	242525.59	74324648.67	0.00	0.00	300000.00	74024648.67	2025-08-13 16:47:29.972043	1
11082	3	2092	6	junho-92	2092-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	74324648.67	0.00	0.00	0.00	243319.56	74567968.23	0.00	0.00	300000.00	74267968.23	2025-08-13 16:47:29.972043	1
11083	3	2092	7	julho-92	2092-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	74567968.23	0.00	0.00	0.00	244116.12	74812084.36	0.00	0.00	300000.00	74512084.36	2025-08-13 16:47:29.972043	1
11084	3	2092	8	agosto-92	2092-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	74812084.36	0.00	0.00	0.00	244915.30	75056999.65	0.00	0.00	300000.00	74756999.65	2025-08-13 16:47:29.972043	1
11085	3	2092	9	setembro-92	2092-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	75056999.65	0.00	0.00	0.00	245717.09	75302716.74	0.00	0.00	300000.00	75002716.74	2025-08-13 16:47:29.972043	1
11086	3	2092	10	outubro-92	2092-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	75302716.74	0.00	0.00	0.00	246521.50	75549238.24	0.00	0.00	300000.00	75249238.24	2025-08-13 16:47:29.972043	1
11087	3	2092	11	novembro-92	2092-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	75549238.24	0.00	0.00	0.00	247328.55	75796566.78	0.00	0.00	300000.00	75496566.78	2025-08-13 16:47:29.972043	1
11088	3	2092	12	dezembro-92	2092-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	75796566.78	0.00	0.00	0.00	248138.24	76044705.02	0.00	0.00	300000.00	75744705.02	2025-08-13 16:47:29.972043	1
11089	3	2093	1	janeiro-93	2093-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	76044705.02	0.00	0.00	0.00	248950.58	76293655.60	0.00	0.00	300000.00	75993655.60	2025-08-13 16:47:29.972043	1
11090	3	2093	2	fevereiro-93	2093-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	76293655.60	0.00	0.00	0.00	249765.58	76543421.17	0.00	0.00	300000.00	76243421.17	2025-08-13 16:47:29.972043	1
11091	3	2093	3	março-93	2093-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	76543421.17	0.00	0.00	0.00	250583.24	76794004.42	0.00	0.00	300000.00	76494004.42	2025-08-13 16:47:29.972043	1
11092	3	2093	4	abril-93	2093-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	76794004.42	0.00	0.00	0.00	251403.59	77045408.00	0.00	0.00	300000.00	76745408.00	2025-08-13 16:47:29.972043	1
11093	3	2093	5	maio-93	2093-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	77045408.00	0.00	0.00	0.00	252226.62	77297634.62	0.00	0.00	300000.00	76997634.62	2025-08-13 16:47:29.972043	1
11094	3	2093	6	junho-93	2093-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	77297634.62	0.00	0.00	0.00	253052.34	77550686.96	0.00	0.00	300000.00	77250686.96	2025-08-13 16:47:29.972043	1
11095	3	2093	7	julho-93	2093-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	77550686.96	0.00	0.00	0.00	253880.77	77804567.73	0.00	0.00	300000.00	77504567.73	2025-08-13 16:47:29.972043	1
11096	3	2093	8	agosto-93	2093-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	77804567.73	0.00	0.00	0.00	254711.91	78059279.64	0.00	0.00	300000.00	77759279.64	2025-08-13 16:47:29.972043	1
11097	3	2093	9	setembro-93	2093-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	78059279.64	0.00	0.00	0.00	255545.77	78314825.41	0.00	0.00	300000.00	78014825.41	2025-08-13 16:47:29.972043	1
11098	3	2093	10	outubro-93	2093-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	78314825.41	0.00	0.00	0.00	256382.36	78571207.77	0.00	0.00	300000.00	78271207.77	2025-08-13 16:47:29.972043	1
11099	3	2093	11	novembro-93	2093-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	78571207.77	0.00	0.00	0.00	257221.69	78828429.46	0.00	0.00	300000.00	78528429.46	2025-08-13 16:47:29.972043	1
11100	3	2093	12	dezembro-93	2093-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	78828429.46	0.00	0.00	0.00	258063.77	79086493.22	0.00	0.00	300000.00	78786493.22	2025-08-13 16:47:29.972043	1
11101	3	2094	1	janeiro-94	2094-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	79086493.22	0.00	0.00	0.00	258908.60	79345401.82	0.00	0.00	300000.00	79045401.82	2025-08-13 16:47:29.972043	1
11102	3	2094	2	fevereiro-94	2094-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	79345401.82	0.00	0.00	0.00	259756.20	79605158.02	0.00	0.00	300000.00	79305158.02	2025-08-13 16:47:29.972043	1
11103	3	2094	3	março-94	2094-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	79605158.02	0.00	0.00	0.00	260606.57	79865764.59	0.00	0.00	300000.00	79565764.59	2025-08-13 16:47:29.972043	1
11104	3	2094	4	abril-94	2094-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	79865764.59	0.00	0.00	0.00	261459.73	80127224.32	0.00	0.00	300000.00	79827224.32	2025-08-13 16:47:29.972043	1
11105	3	2094	5	maio-94	2094-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	80127224.32	0.00	0.00	0.00	262315.68	80389540.00	0.00	0.00	300000.00	80089540.00	2025-08-13 16:47:29.972043	1
11106	3	2094	6	junho-94	2094-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	80389540.00	0.00	0.00	0.00	263174.44	80652714.44	0.00	0.00	300000.00	80352714.44	2025-08-13 16:47:29.972043	1
11107	3	2094	7	julho-94	2094-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	80652714.44	0.00	0.00	0.00	264036.00	80916750.44	0.00	0.00	300000.00	80616750.44	2025-08-13 16:47:29.972043	1
11108	3	2094	8	agosto-94	2094-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	80916750.44	0.00	0.00	0.00	264900.38	81181650.82	0.00	0.00	300000.00	80881650.82	2025-08-13 16:47:29.972043	1
11109	3	2094	9	setembro-94	2094-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	81181650.82	0.00	0.00	0.00	265767.60	81447418.42	0.00	0.00	300000.00	81147418.42	2025-08-13 16:47:29.972043	1
11110	3	2094	10	outubro-94	2094-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	81447418.42	0.00	0.00	0.00	266637.65	81714056.08	0.00	0.00	300000.00	81414056.08	2025-08-13 16:47:29.972043	1
11111	3	2094	11	novembro-94	2094-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	81714056.08	0.00	0.00	0.00	267510.56	81981566.63	0.00	0.00	300000.00	81681566.63	2025-08-13 16:47:29.972043	1
11112	3	2094	12	dezembro-94	2094-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	81981566.63	0.00	0.00	0.00	268386.32	82249952.95	0.00	0.00	300000.00	81949952.95	2025-08-13 16:47:29.972043	1
11113	3	2095	1	janeiro-95	2095-01-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	82249952.95	0.00	0.00	0.00	269264.94	82519217.89	0.00	0.00	300000.00	82219217.89	2025-08-13 16:47:29.972043	1
11114	3	2095	2	fevereiro-95	2095-02-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	82519217.89	0.00	0.00	0.00	270146.45	82789364.34	0.00	0.00	300000.00	82489364.34	2025-08-13 16:47:29.972043	1
11115	3	2095	3	março-95	2095-03-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	82789364.34	0.00	0.00	0.00	271030.84	83060395.18	0.00	0.00	300000.00	82760395.18	2025-08-13 16:47:29.972043	1
11116	3	2095	4	abril-95	2095-04-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	83060395.18	0.00	0.00	0.00	271918.12	83332313.30	0.00	0.00	300000.00	83032313.30	2025-08-13 16:47:29.972043	1
11117	3	2095	5	maio-95	2095-05-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	83332313.30	0.00	0.00	0.00	272808.31	83605121.60	0.00	0.00	300000.00	83305121.60	2025-08-13 16:47:29.972043	1
11118	3	2095	6	junho-95	2095-06-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	83605121.60	0.00	0.00	0.00	273701.41	83878823.02	0.00	0.00	300000.00	83578823.02	2025-08-13 16:47:29.972043	1
11119	3	2095	7	julho-95	2095-07-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	83878823.02	0.00	0.00	0.00	274597.44	84153420.46	0.00	0.00	300000.00	83853420.46	2025-08-13 16:47:29.972043	1
11120	3	2095	8	agosto-95	2095-08-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	84153420.46	0.00	0.00	0.00	275496.40	84428916.86	0.00	0.00	300000.00	84128916.86	2025-08-13 16:47:29.972043	1
11121	3	2095	9	setembro-95	2095-09-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	84428916.86	0.00	0.00	0.00	276398.30	84705315.16	0.00	0.00	300000.00	84405315.16	2025-08-13 16:47:29.972043	1
11122	3	2095	10	outubro-95	2095-10-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	84705315.16	0.00	0.00	0.00	277303.16	84982618.32	0.00	0.00	300000.00	84682618.32	2025-08-13 16:47:29.972043	1
11123	3	2095	11	novembro-95	2095-11-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	84982618.32	0.00	0.00	0.00	278210.98	85260829.30	0.00	0.00	300000.00	84960829.30	2025-08-13 16:47:29.972043	1
11124	3	2095	12	dezembro-95	2095-12-01	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	85260829.30	0.00	0.00	0.00	279121.77	85539951.07	0.00	0.00	300000.00	85239951.07	2025-08-13 16:47:29.972043	1
\.


--
-- Data for Name: despesas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.despesas (id, planejamento_id, descricao, categoria, valor, moeda, membro, imovel, data_inicio, prazo_anos, data_fim, frequencia, meses_recorrencia, ativo, created_at) FROM stdin;
\.


--
-- Data for Name: imoveis; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.imoveis (id, planejamento_id, nome, endereco, area, quartos, banheiros, vagas, moeda, valor_patrimonial, valor_aquisicao, taxa_valorizacao, data_aquisicao, data_venda, status, renda_aluguel, financiamento, tipo_amortizacao, valor_financiado, entrada, juros, data_inicio, prazo_anos, prestacao_mensal, saldo_devedor, percentual_renda_provedor_a, percentual_renda_provedor_b, seguro_eduardo, seguro_monica, observacoes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: indices_economicos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.indices_economicos (id, nome, valor, data, tipo, unidade, manual, atualizacao_automatica, created_at) FROM stdin;
1	CDI	0.0551	2025-08-12	taxa	%	f	t	2025-08-12 21:28:29.158621
2	SELIC	13.2500	2025-08-12	taxa	%	f	t	2025-08-12 21:28:29.190057
3	IPCA	0.2600	2025-08-12	inflacao	%	f	t	2025-08-12 21:28:29.215129
4	Dólar	5.4052	2025-08-12	cambio	R$	f	t	2025-08-12 21:28:29.240284
5	Euro	6.3095	2025-08-12	cambio	R$	f	t	2025-08-12 21:28:29.265975
6	Taxa de Juros Real	0.0400	2025-08-13	taxa	%	t	f	2025-08-13 16:09:45.809424
\.


--
-- Data for Name: inss; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inss (id, planejamento_id, membro_id, idade_concessao, beneficio, moeda, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: membros_family; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.membros_family (id, planejamento_id, nome, parentesco, idade, data_nascimento, dependente, created_at) FROM stdin;
1	3	Eduardo	marido	35	1990-01-01	f	2025-08-13 13:56:43.550033
2	3	Mônica	marido	30	1995-01-01	f	2025-08-13 14:44:38.338895
3	3	Huguinho	marido	5	2020-01-01	t	2025-08-13 14:45:00.599191
4	3	Zezinho	marido	14	2011-01-01	t	2025-08-13 14:45:34.130713
5	3	Aninha	marido	12	2013-01-01	t	2025-08-13 14:46:45.12508
\.


--
-- Data for Name: mood_insights; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.mood_insights (id, planejamento_id, mood, score, primary_insight, secondary_insight, action_item, category, priority, data_points, valid_until, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: objetivos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.objetivos (id, planejamento_id, membro_id, nome, descricao, categoria, valor_objetivo, valor_atual, moeda, prioridade, data_alvo, status, aporte_manual, estrategia, observacoes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: planejamentos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.planejamentos (id, nome, descricao, user_id, planejador_id, status, data_inicio, data_fim, created_at, updated_at) FROM stdin;
2	Antigo - Só Dados Mensais		pedro-001	\N	ativo	2025-01-01	\N	2025-08-12 21:53:12.794169	2025-08-13 13:54:49.422
3	Eduardo e Mônica		pedro-001	\N	ativo	2025-01-01	\N	2025-08-13 13:55:03.4197	2025-08-13 13:55:03.4197
\.


--
-- Data for Name: portfolio_investimentos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.portfolio_investimentos (id, planejamento_id, categoria, ativo, quantidade, preco_medio, valor_atual, moeda, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: receitas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.receitas (id, planejamento_id, descricao, categoria, valor, moeda, membro, imovel, data_inicio, prazo_anos, data_fim, frequencia, meses_recorrencia, ativo, created_at) FROM stdin;
6	3	Salário Eduardo	laborais	25000.00	BRL	1		01/2025	30	12/2054	mensal		t	2025-08-13 14:49:13.730148
\.


--
-- Data for Name: seguros; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.seguros (id, planejamento_id, membro_id, cobertura, seguradora, cs, custo, moeda, frequencia, cs_sugerido, observacoes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sessions (sid, sess, expire) FROM stdin;
\.


--
-- Data for Name: simulacao_provedores; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.simulacao_provedores (id, planejamento_id, membro_id, status, data_simulacao, observacoes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, email, first_name, last_name, profile_image_url, role, status, created_at, updated_at) FROM stdin;
pedro-001	pedro.orlandi@ciklus.com.br	Pedro	Orlandi	\N	administrador	ativo	2025-08-12 21:50:50.973369	2025-08-12 21:50:50.973369
\.


--
-- Name: dados_detalhados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.dados_detalhados_id_seq', 1, false);


--
-- Name: dados_mensais_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.dados_mensais_id_seq', 11124, true);


--
-- Name: despesas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.despesas_id_seq', 5, true);


--
-- Name: imoveis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.imoveis_id_seq', 1, false);


--
-- Name: indices_economicos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.indices_economicos_id_seq', 6, true);


--
-- Name: inss_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.inss_id_seq', 1, false);


--
-- Name: membros_family_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.membros_family_id_seq', 5, true);


--
-- Name: mood_insights_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.mood_insights_id_seq', 1, false);


--
-- Name: objetivos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.objetivos_id_seq', 1, false);


--
-- Name: planejamentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.planejamentos_id_seq', 3, true);


--
-- Name: portfolio_investimentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.portfolio_investimentos_id_seq', 1, false);


--
-- Name: receitas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.receitas_id_seq', 7, true);


--
-- Name: seguros_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.seguros_id_seq', 1, false);


--
-- Name: simulacao_provedores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.simulacao_provedores_id_seq', 1, false);


--
-- Name: dados_detalhados dados_detalhados_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dados_detalhados
    ADD CONSTRAINT dados_detalhados_pkey PRIMARY KEY (id);


--
-- Name: dados_mensais dados_mensais_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dados_mensais
    ADD CONSTRAINT dados_mensais_pkey PRIMARY KEY (id);


--
-- Name: despesas despesas_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.despesas
    ADD CONSTRAINT despesas_pkey PRIMARY KEY (id);


--
-- Name: imoveis imoveis_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.imoveis
    ADD CONSTRAINT imoveis_pkey PRIMARY KEY (id);


--
-- Name: indices_economicos indices_economicos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.indices_economicos
    ADD CONSTRAINT indices_economicos_pkey PRIMARY KEY (id);


--
-- Name: inss inss_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inss
    ADD CONSTRAINT inss_pkey PRIMARY KEY (id);


--
-- Name: membros_family membros_family_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.membros_family
    ADD CONSTRAINT membros_family_pkey PRIMARY KEY (id);


--
-- Name: mood_insights mood_insights_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mood_insights
    ADD CONSTRAINT mood_insights_pkey PRIMARY KEY (id);


--
-- Name: objetivos objetivos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.objetivos
    ADD CONSTRAINT objetivos_pkey PRIMARY KEY (id);


--
-- Name: planejamentos planejamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.planejamentos
    ADD CONSTRAINT planejamentos_pkey PRIMARY KEY (id);


--
-- Name: portfolio_investimentos portfolio_investimentos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.portfolio_investimentos
    ADD CONSTRAINT portfolio_investimentos_pkey PRIMARY KEY (id);


--
-- Name: receitas receitas_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.receitas
    ADD CONSTRAINT receitas_pkey PRIMARY KEY (id);


--
-- Name: seguros seguros_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.seguros
    ADD CONSTRAINT seguros_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: simulacao_provedores simulacao_provedores_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.simulacao_provedores
    ADD CONSTRAINT simulacao_provedores_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: dados_detalhados dados_detalhados_dado_mensal_id_dados_mensais_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dados_detalhados
    ADD CONSTRAINT dados_detalhados_dado_mensal_id_dados_mensais_id_fk FOREIGN KEY (dado_mensal_id) REFERENCES public.dados_mensais(id);


--
-- Name: dados_detalhados dados_detalhados_planejamento_id_planejamentos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dados_detalhados
    ADD CONSTRAINT dados_detalhados_planejamento_id_planejamentos_id_fk FOREIGN KEY (planejamento_id) REFERENCES public.planejamentos(id);


--
-- Name: dados_mensais dados_mensais_planejamento_id_planejamentos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dados_mensais
    ADD CONSTRAINT dados_mensais_planejamento_id_planejamentos_id_fk FOREIGN KEY (planejamento_id) REFERENCES public.planejamentos(id);


--
-- Name: despesas despesas_planejamento_id_planejamentos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.despesas
    ADD CONSTRAINT despesas_planejamento_id_planejamentos_id_fk FOREIGN KEY (planejamento_id) REFERENCES public.planejamentos(id);


--
-- Name: imoveis imoveis_planejamento_id_planejamentos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.imoveis
    ADD CONSTRAINT imoveis_planejamento_id_planejamentos_id_fk FOREIGN KEY (planejamento_id) REFERENCES public.planejamentos(id);


--
-- Name: inss inss_membro_id_membros_family_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inss
    ADD CONSTRAINT inss_membro_id_membros_family_id_fk FOREIGN KEY (membro_id) REFERENCES public.membros_family(id);


--
-- Name: inss inss_planejamento_id_planejamentos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inss
    ADD CONSTRAINT inss_planejamento_id_planejamentos_id_fk FOREIGN KEY (planejamento_id) REFERENCES public.planejamentos(id);


--
-- Name: membros_family membros_family_planejamento_id_planejamentos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.membros_family
    ADD CONSTRAINT membros_family_planejamento_id_planejamentos_id_fk FOREIGN KEY (planejamento_id) REFERENCES public.planejamentos(id);


--
-- Name: mood_insights mood_insights_planejamento_id_planejamentos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mood_insights
    ADD CONSTRAINT mood_insights_planejamento_id_planejamentos_id_fk FOREIGN KEY (planejamento_id) REFERENCES public.planejamentos(id);


--
-- Name: objetivos objetivos_membro_id_membros_family_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.objetivos
    ADD CONSTRAINT objetivos_membro_id_membros_family_id_fk FOREIGN KEY (membro_id) REFERENCES public.membros_family(id);


--
-- Name: objetivos objetivos_planejamento_id_planejamentos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.objetivos
    ADD CONSTRAINT objetivos_planejamento_id_planejamentos_id_fk FOREIGN KEY (planejamento_id) REFERENCES public.planejamentos(id);


--
-- Name: planejamentos planejamentos_planejador_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.planejamentos
    ADD CONSTRAINT planejamentos_planejador_id_users_id_fk FOREIGN KEY (planejador_id) REFERENCES public.users(id);


--
-- Name: planejamentos planejamentos_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.planejamentos
    ADD CONSTRAINT planejamentos_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: portfolio_investimentos portfolio_investimentos_planejamento_id_planejamentos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.portfolio_investimentos
    ADD CONSTRAINT portfolio_investimentos_planejamento_id_planejamentos_id_fk FOREIGN KEY (planejamento_id) REFERENCES public.planejamentos(id);


--
-- Name: receitas receitas_planejamento_id_planejamentos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.receitas
    ADD CONSTRAINT receitas_planejamento_id_planejamentos_id_fk FOREIGN KEY (planejamento_id) REFERENCES public.planejamentos(id);


--
-- Name: seguros seguros_membro_id_membros_family_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.seguros
    ADD CONSTRAINT seguros_membro_id_membros_family_id_fk FOREIGN KEY (membro_id) REFERENCES public.membros_family(id);


--
-- Name: seguros seguros_planejamento_id_planejamentos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.seguros
    ADD CONSTRAINT seguros_planejamento_id_planejamentos_id_fk FOREIGN KEY (planejamento_id) REFERENCES public.planejamentos(id);


--
-- Name: simulacao_provedores simulacao_provedores_membro_id_membros_family_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.simulacao_provedores
    ADD CONSTRAINT simulacao_provedores_membro_id_membros_family_id_fk FOREIGN KEY (membro_id) REFERENCES public.membros_family(id);


--
-- Name: simulacao_provedores simulacao_provedores_planejamento_id_planejamentos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.simulacao_provedores
    ADD CONSTRAINT simulacao_provedores_planejamento_id_planejamentos_id_fk FOREIGN KEY (planejamento_id) REFERENCES public.planejamentos(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

