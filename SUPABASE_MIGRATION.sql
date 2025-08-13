-- CIKLUS APP - Schema Migration for Supabase
-- Execute este script no Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Session storage table (required for auth)
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- Users table (required for auth)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    profile_image_url TEXT,
    role TEXT DEFAULT 'cliente',
    status TEXT DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Planejamentos table
CREATE TABLE IF NOT EXISTS planejamentos (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    user_id TEXT NOT NULL REFERENCES users(id),
    planejador_id TEXT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Membros table
CREATE TABLE IF NOT EXISTS membros (
    id SERIAL PRIMARY KEY,
    planejamento_id INTEGER NOT NULL REFERENCES planejamentos(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    data_nascimento DATE,
    renda_mensal DECIMAL(15,2) DEFAULT 0,
    dependente BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Imoveis table
CREATE TABLE IF NOT EXISTS imoveis (
    id SERIAL PRIMARY KEY,
    planejamento_id INTEGER NOT NULL REFERENCES planejamentos(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    valor_atual DECIMAL(15,2) NOT NULL,
    valor_financiamento DECIMAL(15,2) DEFAULT 0,
    prestacao_mensal DECIMAL(15,2) DEFAULT 0,
    prazo_anos INTEGER DEFAULT 0,
    taxa_juros DECIMAL(5,2) DEFAULT 0,
    sistema_amortizacao TEXT DEFAULT 'SAC',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Receitas table
CREATE TABLE IF NOT EXISTS receitas (
    id SERIAL PRIMARY KEY,
    planejamento_id INTEGER NOT NULL REFERENCES planejamentos(id) ON DELETE CASCADE,
    descricao TEXT NOT NULL,
    categoria TEXT NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    moeda TEXT DEFAULT 'BRL',
    membro_id INTEGER REFERENCES membros(id),
    imovel_id INTEGER REFERENCES imoveis(id),
    data_inicio TEXT NOT NULL,
    data_fim TEXT,
    prazo_anos INTEGER,
    frequencia TEXT NOT NULL,
    meses_recorrencia TEXT,
    percentual_mensal DECIMAL(5,2),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Despesas table
CREATE TABLE IF NOT EXISTS despesas (
    id SERIAL PRIMARY KEY,
    planejamento_id INTEGER NOT NULL REFERENCES planejamentos(id) ON DELETE CASCADE,
    descricao TEXT NOT NULL,
    categoria TEXT NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    moeda TEXT DEFAULT 'BRL',
    membro_id INTEGER REFERENCES membros(id),
    imovel_id INTEGER REFERENCES imoveis(id),
    data_inicio TEXT NOT NULL,
    data_fim TEXT,
    prazo_anos INTEGER,
    frequencia TEXT NOT NULL,
    meses_recorrencia TEXT,
    percentual_mensal DECIMAL(5,2),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Objetivos table
CREATE TABLE IF NOT EXISTS objetivos (
    id SERIAL PRIMARY KEY,
    planejamento_id INTEGER NOT NULL REFERENCES planejamentos(id) ON DELETE CASCADE,
    descricao TEXT NOT NULL,
    valor_objetivo DECIMAL(15,2) NOT NULL,
    prazo_meses INTEGER NOT NULL,
    valor_mensal DECIMAL(15,2) NOT NULL,
    membro_id INTEGER REFERENCES membros(id),
    prioridade TEXT DEFAULT 'media',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio investimentos table
CREATE TABLE IF NOT EXISTS portfolio_investimentos (
    id SERIAL PRIMARY KEY,
    planejamento_id INTEGER NOT NULL REFERENCES planejamentos(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    valor_atual DECIMAL(15,2) NOT NULL,
    percentual_carteira DECIMAL(5,2) DEFAULT 0,
    rentabilidade_anual DECIMAL(5,2) DEFAULT 0,
    membro_id INTEGER REFERENCES membros(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indices economicos table
CREATE TABLE IF NOT EXISTS indices_economicos (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    valor DECIMAL(10,4) NOT NULL,
    data_referencia DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Dados mensais table (metodologia DADOS)
CREATE TABLE IF NOT EXISTS dados_mensais (
    id SERIAL PRIMARY KEY,
    planejamento_id INTEGER NOT NULL REFERENCES planejamentos(id) ON DELETE CASCADE,
    ano INTEGER NOT NULL,
    mes INTEGER NOT NULL,
    data DATE NOT NULL,
    receita_id INTEGER REFERENCES receitas(id),
    receita_descricao TEXT,
    receita_categoria TEXT,
    receita_valor DECIMAL(15,2) DEFAULT 0,
    receita_moeda TEXT DEFAULT 'BRL',
    despesa_id INTEGER REFERENCES despesas(id),
    despesa_descricao TEXT,
    despesa_categoria TEXT,
    despesa_valor DECIMAL(15,2) DEFAULT 0,
    despesa_moeda TEXT DEFAULT 'BRL',
    tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    gerado_em TIMESTAMP DEFAULT NOW(),
    versao INTEGER DEFAULT 1
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_dados_mensais_planejamento ON dados_mensais(planejamento_id);
CREATE INDEX IF NOT EXISTS idx_dados_mensais_data ON dados_mensais(data);
CREATE INDEX IF NOT EXISTS idx_dados_mensais_tipo ON dados_mensais(tipo);
CREATE INDEX IF NOT EXISTS idx_receitas_planejamento ON receitas(planejamento_id);
CREATE INDEX IF NOT EXISTS idx_despesas_planejamento ON despesas(planejamento_id);
CREATE INDEX IF NOT EXISTS idx_membros_planejamento ON membros(planejamento_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_planejamento ON imoveis(planejamento_id);
CREATE INDEX IF NOT EXISTS idx_objetivos_planejamento ON objetivos(planejamento_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_planejamento ON portfolio_investimentos(planejamento_id);

-- Sample data for indices economicos
INSERT INTO indices_economicos (nome, valor, data_referencia) VALUES
('Dólar', 5.4500, CURRENT_DATE),
('Euro', 5.9200, CURRENT_DATE),
('IPCA', 4.2300, CURRENT_DATE),
('Selic', 12.2500, CURRENT_DATE),
('CDI', 12.1500, CURRENT_DATE),
('INPC', 4.1800, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE planejamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE imoveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE despesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE objetivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_investimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE dados_mensais ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic - can be refined later)  
-- Note: Supabase auth.uid() returns UUID, but our user.id is TEXT
-- We'll handle authentication at application level for now
-- CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id);
-- CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id);

-- Note: More specific RLS policies should be added based on business rules
-- For now, we'll handle access control at the application level

-- Functions for automatic updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_planejamentos_updated_at BEFORE UPDATE ON planejamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_membros_updated_at BEFORE UPDATE ON membros FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_imoveis_updated_at BEFORE UPDATE ON imoveis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_receitas_updated_at BEFORE UPDATE ON receitas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_despesas_updated_at BEFORE UPDATE ON despesas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_objetivos_updated_at BEFORE UPDATE ON objetivos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON portfolio_investimentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_indices_updated_at BEFORE UPDATE ON indices_economicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários das tabelas
COMMENT ON TABLE users IS 'Usuários do sistema com autenticação Replit';
COMMENT ON TABLE planejamentos IS 'Planejamentos financeiros familiares';
COMMENT ON TABLE membros IS 'Membros das famílias dos planejamentos';
COMMENT ON TABLE imoveis IS 'Imóveis associados aos planejamentos';
COMMENT ON TABLE receitas IS 'Receitas recorrentes dos planejamentos';
COMMENT ON TABLE despesas IS 'Despesas recorrentes dos planejamentos';
COMMENT ON TABLE objetivos IS 'Objetivos financeiros dos planejamentos';
COMMENT ON TABLE portfolio_investimentos IS 'Portfolio de investimentos';
COMMENT ON TABLE dados_mensais IS 'Dados mensais expandidos (metodologia DADOS)';
COMMENT ON TABLE indices_economicos IS 'Índices econômicos de referência';

-- Performance monitoring view
CREATE VIEW performance_summary AS
SELECT 
    'users' as table_name,
    count(*) as total_records,
    pg_size_pretty(pg_total_relation_size('users')) as size
FROM users
UNION ALL
SELECT 
    'planejamentos' as table_name,
    count(*) as total_records,
    pg_size_pretty(pg_total_relation_size('planejamentos')) as size
FROM planejamentos
UNION ALL
SELECT 
    'dados_mensais' as table_name,
    count(*) as total_records,
    pg_size_pretty(pg_total_relation_size('dados_mensais')) as size
FROM dados_mensais;

-- Success message
SELECT 'CIKLUS APP schema created successfully!' as message;