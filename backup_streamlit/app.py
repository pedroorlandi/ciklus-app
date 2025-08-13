import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np

# Configuração da página - Sistema Ciklus Original
st.set_page_config(
    page_title="CIKLUS - Sistema de Planejamento Financeiro",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS customizado para recriar a aparência do sistema original
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
        padding: 1.5rem 2rem;
        border-radius: 10px;
        margin-bottom: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .main-title {
        color: white;
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0;
        text-align: center;
    }
    .main-subtitle {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.1rem;
        text-align: center;
        margin: 0.5rem 0 0 0;
    }
    .metric-card {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border-left: 4px solid #2a5298;
        margin-bottom: 1rem;
    }
    .sidebar-header {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border: 1px solid #e9ecef;
    }
    .data-table {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
</style>
""", unsafe_allow_html=True)

# Inicialização de dados no session_state (simulando conexão com banco)
def init_session_data():
    """Inicializa dados de demonstração baseados no sistema Ciklus original"""
    if 'ciklus_initialized' not in st.session_state:
        
        # Dados de membros da família
        st.session_state.familia_membros = [
            {"id": 1, "nome": "João Silva", "idade": 45, "relacao": "Titular", "profissao": "Engenheiro", "renda": 8500},
            {"id": 2, "nome": "Maria Silva", "idade": 42, "relacao": "Cônjuge", "profissao": "Professora", "renda": 5200},
            {"id": 3, "nome": "Pedro Silva", "idade": 18, "relacao": "Filho", "profissao": "Estudante", "renda": 0}
        ]
        
        # Dados financeiros detalhados
        st.session_state.receitas = [
            {"id": 1, "descricao": "Salário João", "valor": 8500, "categoria": "Salário", "data": "2025-01-01", "recorrente": True},
            {"id": 2, "descricao": "Salário Maria", "valor": 5200, "categoria": "Salário", "data": "2025-01-01", "recorrente": True},
            {"id": 3, "descricao": "Freelance", "valor": 1500, "categoria": "Renda Extra", "data": "2025-01-15", "recorrente": False}
        ]
        
        st.session_state.despesas = [
            {"id": 1, "descricao": "Financiamento Imóvel", "valor": 2800, "categoria": "Habitação", "data": "2025-01-05", "essencial": True},
            {"id": 2, "descricao": "Financiamento Carro", "valor": 980, "categoria": "Transporte", "data": "2025-01-10", "essencial": True},
            {"id": 3, "descricao": "Supermercado", "valor": 1200, "categoria": "Alimentação", "data": "2025-01-08", "essencial": True},
            {"id": 4, "descricao": "Plano Saúde", "valor": 890, "categoria": "Saúde", "data": "2025-01-12", "essencial": True},
            {"id": 5, "descricao": "Energia Elétrica", "valor": 280, "categoria": "Utilidades", "data": "2025-01-15", "essencial": True},
            {"id": 6, "descricao": "Internet/Telefone", "valor": 150, "categoria": "Utilidades", "data": "2025-01-20", "essencial": True},
            {"id": 7, "descricao": "Streaming/Lazer", "valor": 120, "categoria": "Lazer", "data": "2025-01-25", "essencial": False}
        ]
        
        st.session_state.investimentos = [
            {"id": 1, "nome": "Tesouro SELIC", "valor_atual": 35000, "valor_investido": 32000, "rentabilidade": 9.4, "categoria": "Renda Fixa"},
            {"id": 2, "nome": "Ações Diversificadas", "valor_atual": 28500, "valor_investido": 25000, "rentabilidade": 14.0, "categoria": "Renda Variável"},
            {"id": 3, "nome": "Fundo Imobiliário", "valor_atual": 15800, "valor_investido": 15000, "rentabilidade": 5.3, "categoria": "FIIs"},
            {"id": 4, "nome": "Reserva Emergência", "valor_atual": 18000, "valor_investido": 18000, "rentabilidade": 6.8, "categoria": "Reserva"}
        ]
        
        st.session_state.objetivos = [
            {"id": 1, "nome": "Casa Própria", "valor_objetivo": 800000, "valor_atual": 95000, "prazo_meses": 120, "prioridade": "Alta"},
            {"id": 2, "nome": "Educação dos Filhos", "valor_objetivo": 200000, "valor_atual": 45000, "prazo_meses": 72, "prioridade": "Alta"},
            {"id": 3, "nome": "Aposentadoria", "valor_objetivo": 1500000, "valor_atual": 180000, "prazo_meses": 240, "prioridade": "Média"},
            {"id": 4, "nome": "Viagem Europa", "valor_objetivo": 25000, "valor_atual": 8000, "prazo_meses": 18, "prioridade": "Baixa"}
        ]
        
        st.session_state.ciklus_initialized = True

# Inicializar dados
init_session_data()

# Header principal do sistema Ciklus
st.markdown("""
<div class="main-header">
    <div class="main-title">CIKLUS</div>
    <div class="main-subtitle">Sistema de Planejamento Financeiro Familiar</div>
</div>
""", unsafe_allow_html=True)

# Sidebar de navegação
st.sidebar.markdown("""
<div class="sidebar-header">
    <h3 style="margin:0; color:#2a5298;">📊 Painel de Controle</h3>
    <small style="color:#666;">Sistema Ciklus v2.1</small>
</div>
""", unsafe_allow_html=True)

# Menu principal
menu_opcoes = [
    "🏠 Dashboard Principal",
    "👥 Gestão Familiar", 
    "💰 Receitas e Rendas",
    "💸 Despesas e Gastos",
    "📈 Carteira de Investimentos",
    "🎯 Objetivos Financeiros",
    "📊 Análises e Relatórios",
    "🧮 Calculadoras Financeiras",
    "⚙️ Configurações do Sistema"
]

pagina_selecionada = st.sidebar.selectbox("Selecione o módulo:", menu_opcoes)

# Sidebar com informações do usuário
st.sidebar.markdown("---")
st.sidebar.markdown("### 👤 Informações da Conta")
st.sidebar.info("**Família Silva**\nÚltimo acesso: Hoje\nPlano: Premium")

# Botões de ação rápida
st.sidebar.markdown("### ⚡ Ações Rápidas")
col1, col2 = st.sidebar.columns(2)
with col1:
    if st.button("💾 Backup", use_container_width=True):
        st.success("Backup realizado!")
with col2:
    if st.button("📤 Exportar", use_container_width=True):
        st.success("Dados exportados!")

# === DASHBOARD PRINCIPAL ===
if pagina_selecionada == "🏠 Dashboard Principal":
    
    # Métricas principais em cards
    col1, col2, col3, col4 = st.columns(4)
    
    total_receitas = sum([r['valor'] for r in st.session_state.receitas if r.get('recorrente', False)])
    total_despesas = sum([d['valor'] for d in st.session_state.despesas])
    patrimonio_total = sum([i['valor_atual'] for i in st.session_state.investimentos])
    saldo_mensal = total_receitas - total_despesas
    
    with col1:
        st.markdown("""
        <div class="metric-card">
            <h4 style="margin:0; color:#28a745;">💰 Receitas Mensais</h4>
            <h2 style="margin:0.5rem 0; color:#28a745;">R$ {:,.0f}</h2>
            <small style="color:#666;">+2.3% vs mês anterior</small>
        </div>
        """.format(total_receitas), unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="metric-card">
            <h4 style="margin:0; color:#dc3545;">💸 Despesas Mensais</h4>
            <h2 style="margin:0.5rem 0; color:#dc3545;">R$ {:,.0f}</h2>
            <small style="color:#666;">-1.2% vs mês anterior</small>
        </div>
        """.format(total_despesas), unsafe_allow_html=True)
    
    with col3:
        cor_saldo = "#28a745" if saldo_mensal > 0 else "#dc3545"
        st.markdown("""
        <div class="metric-card">
            <h4 style="margin:0; color:{};">📊 Saldo Mensal</h4>
            <h2 style="margin:0.5rem 0; color:{};">R$ {:,.0f}</h2>
            <small style="color:#666;">{:.1f}% da renda</small>
        </div>
        """.format(cor_saldo, cor_saldo, saldo_mensal, (saldo_mensal/total_receitas)*100), unsafe_allow_html=True)
    
    with col4:
        st.markdown("""
        <div class="metric-card">
            <h4 style="margin:0; color:#2a5298;">🏦 Patrimônio Total</h4>
            <h2 style="margin:0.5rem 0; color:#2a5298;">R$ {:,.0f}</h2>
            <small style="color:#666;">+5.8% últimos 6 meses</small>
        </div>
        """.format(patrimonio_total), unsafe_allow_html=True)
    
    # Gráficos do dashboard
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### 📈 Evolução Patrimonial")
        
        # Simular evolução patrimonial dos últimos 12 meses
        meses = pd.date_range(start='2024-01-01', end='2024-12-01', freq='M')
        valores_base = np.linspace(85000, patrimonio_total, len(meses))
        variacao = np.random.normal(0, 5000, len(meses))
        patrimonio_evolucao = valores_base + variacao.cumsum() * 0.1
        
        df_evolucao = pd.DataFrame({
            'Mês': meses,
            'Patrimônio': patrimonio_evolucao
        })
        
        fig = px.line(df_evolucao, x='Mês', y='Patrimônio', 
                     title="Evolução dos Investimentos (12 meses)",
                     color_discrete_sequence=['#2a5298'])
        fig.update_layout(showlegend=False, height=400)
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("### 🍰 Distribuição do Patrimônio")
        
        # Gráfico de pizza dos investimentos
        df_investimentos = pd.DataFrame(st.session_state.investimentos)
        
        fig = px.pie(df_investimentos, values='valor_atual', names='nome',
                    title="Alocação por Investimento")
        fig.update_traces(textposition='inside', textinfo='percent+label')
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
    
    # Seção de despesas por categoria
    st.markdown("### 💸 Análise de Despesas por Categoria")
    
    df_despesas = pd.DataFrame(st.session_state.despesas)
    despesas_categoria = df_despesas.groupby('categoria')['valor'].sum().sort_values(ascending=False)
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        fig = px.bar(x=despesas_categoria.index, y=despesas_categoria.values,
                    title="Despesas por Categoria (R$)",
                    color_discrete_sequence=['#dc3545'])
        fig.update_layout(xaxis_title="Categoria", yaxis_title="Valor (R$)", height=350)
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("#### 📋 Top 5 Categorias")
        for i, (categoria, valor) in enumerate(despesas_categoria.head().items()):
            percentual = (valor / total_despesas) * 100
            st.markdown(f"**{i+1}. {categoria}**")
            st.progress(percentual/100)
            st.markdown(f"R$ {valor:,.0f} ({percentual:.1f}%)")
            st.markdown("---")
    
    # Alertas e recomendações
    st.markdown("### ⚠️ Alertas do Sistema")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if saldo_mensal < total_receitas * 0.1:  # Menos de 10% de poupança
            st.error("🚨 **Taxa de poupança baixa**\nRecomendado: mínimo 10% da renda")
        else:
            st.success("✅ **Taxa de poupança saudável**\nMantendo bons hábitos!")
    
    with col2:
        reserva_emergencia = next((i['valor_atual'] for i in st.session_state.investimentos if i['nome'] == 'Reserva Emergência'), 0)
        meses_cobertura = reserva_emergencia / total_despesas if total_despesas > 0 else 0
        
        if meses_cobertura < 3:
            st.warning(f"⚠️ **Reserva de emergência baixa**\nCobertura atual: {meses_cobertura:.1f} meses")
        else:
            st.success(f"✅ **Reserva adequada**\nCobertura: {meses_cobertura:.1f} meses")
    
    with col3:
        renda_variavel_pct = sum([i['valor_atual'] for i in st.session_state.investimentos if i['categoria'] in ['Renda Variável', 'FIIs']]) / patrimonio_total
        
        if renda_variavel_pct > 0.6:  # Mais de 60% em renda variável
            st.warning("⚠️ **Alta exposição risco**\nConsidere diversificar")
        else:
            st.success("✅ **Carteira balanceada**\nRisco controlado")

# === GESTÃO FAMILIAR ===
elif pagina_selecionada == "👥 Gestão Familiar":
    st.markdown("## 👥 Gestão de Membros da Família")
    
    # Mostrar membros atuais
    st.markdown("### 📋 Membros Cadastrados")
    
    df_familia = pd.DataFrame(st.session_state.familia_membros)
    
    # Customizar exibição da tabela
    for idx, membro in df_familia.iterrows():
        col1, col2, col3 = st.columns([2, 1, 1])
        
        with col1:
            st.markdown(f"""
            <div class="metric-card">
                <h4 style="margin:0;">{membro['nome']}</h4>
                <p style="margin:0.5rem 0;"><strong>Relação:</strong> {membro['relacao']}</p>
                <p style="margin:0;"><strong>Profissão:</strong> {membro['profissao']}</p>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.metric("Idade", f"{membro['idade']} anos")
        
        with col3:
            if membro['renda'] > 0:
                st.metric("Renda Mensal", f"R$ {membro['renda']:,.0f}")
            else:
                st.metric("Renda Mensal", "Não se aplica")
    
    # Formulário para adicionar novo membro
    st.markdown("### ➕ Adicionar Novo Membro")
    
    with st.form("adicionar_membro"):
        col1, col2 = st.columns(2)
        
        with col1:
            nome = st.text_input("Nome Completo*")
            idade = st.number_input("Idade", min_value=0, max_value=120, value=25)
            relacao = st.selectbox("Relação Familiar", 
                                 ["Titular", "Cônjuge", "Filho(a)", "Pai/Mãe", "Irmão(ã)", "Outro"])
        
        with col2:
            profissao = st.text_input("Profissão/Ocupação")
            renda = st.number_input("Renda Mensal (R$)", min_value=0.0, format="%.2f")
            dependente = st.checkbox("É dependente financeiro?")
        
        if st.form_submit_button("Adicionar Membro", use_container_width=True):
            if nome:
                novo_id = max([m['id'] for m in st.session_state.familia_membros]) + 1
                novo_membro = {
                    "id": novo_id,
                    "nome": nome,
                    "idade": idade,
                    "relacao": relacao,
                    "profissao": profissao,
                    "renda": renda
                }
                st.session_state.familia_membros.append(novo_membro)
                st.success(f"✅ {nome} foi adicionado à família!")
                st.rerun()
            else:
                st.error("Nome é obrigatório!")

# === RECEITAS E RENDAS ===
elif pagina_selecionada == "💰 Receitas e Rendas":
    st.markdown("## 💰 Gestão de Receitas e Rendas")
    
    # Resumo das receitas
    total_receitas_mes = sum([r['valor'] for r in st.session_state.receitas if r.get('recorrente', False)])
    total_receitas_extras = sum([r['valor'] for r in st.session_state.receitas if not r.get('recorrente', False)])
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("💰 Receitas Fixas", f"R$ {total_receitas_mes:,.0f}")
    with col2:
        st.metric("⭐ Receitas Extras", f"R$ {total_receitas_extras:,.0f}")
    with col3:
        st.metric("📊 Total Mensal", f"R$ {total_receitas_mes + total_receitas_extras:,.0f}")
    
    # Tabela de receitas
    st.markdown("### 📋 Receitas Cadastradas")
    df_receitas = pd.DataFrame(st.session_state.receitas)
    
    # Personalizar exibição
    for idx, receita in df_receitas.iterrows():
        col1, col2, col3, col4 = st.columns([3, 2, 1, 1])
        
        with col1:
            tipo_icon = "🔄" if receita['recorrente'] else "⭐"
            st.markdown(f"**{tipo_icon} {receita['descricao']}**")
            st.caption(f"Categoria: {receita['categoria']}")
        
        with col2:
            st.markdown(f"**R$ {receita['valor']:,.2f}**")
            
        with col3:
            if receita['recorrente']:
                st.success("Mensal")
            else:
                st.info("Eventual")
        
        with col4:
            st.caption(receita['data'])
        
        st.divider()
    
    # Formulário para nova receita
    st.markdown("### ➕ Nova Receita")
    
    with st.form("nova_receita"):
        col1, col2 = st.columns(2)
        
        with col1:
            descricao = st.text_input("Descrição da Receita*")
            valor = st.number_input("Valor (R$)*", min_value=0.01, format="%.2f")
            categoria = st.selectbox("Categoria", 
                                   ["Salário", "Renda Extra", "Investimentos", "Aluguéis", "Pensão", "Outros"])
        
        with col2:
            data = st.date_input("Data de Recebimento", value=datetime.today())
            recorrente = st.checkbox("Receita recorrente (mensal)")
            observacoes = st.text_area("Observações")
        
        if st.form_submit_button("Cadastrar Receita", use_container_width=True):
            if descricao and valor > 0:
                novo_id = max([r['id'] for r in st.session_state.receitas]) + 1
                nova_receita = {
                    "id": novo_id,
                    "descricao": descricao,
                    "valor": valor,
                    "categoria": categoria,
                    "data": data.strftime("%Y-%m-%d"),
                    "recorrente": recorrente
                }
                st.session_state.receitas.append(nova_receita)
                st.success("✅ Receita cadastrada com sucesso!")
                st.rerun()
            else:
                st.error("Preencha todos os campos obrigatórios!")

# === DESPESAS E GASTOS ===
elif pagina_selecionada == "💸 Despesas e Gastos":
    st.markdown("## 💸 Controle de Despesas e Gastos")
    
    # Análise das despesas
    total_despesas = sum([d['valor'] for d in st.session_state.despesas])
    despesas_essenciais = sum([d['valor'] for d in st.session_state.despesas if d.get('essencial', False)])
    despesas_nao_essenciais = total_despesas - despesas_essenciais
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("🏠 Despesas Essenciais", f"R$ {despesas_essenciais:,.0f}")
    with col2:
        st.metric("🎮 Despesas Não Essenciais", f"R$ {despesas_nao_essenciais:,.0f}")
    with col3:
        st.metric("📊 Total Mensal", f"R$ {total_despesas:,.0f}")
    
    # Gráfico de despesas por categoria
    df_despesas = pd.DataFrame(st.session_state.despesas)
    despesas_por_categoria = df_despesas.groupby('categoria')['valor'].sum().sort_values(ascending=False)
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        fig = px.bar(x=despesas_por_categoria.index, y=despesas_por_categoria.values,
                    title="Despesas por Categoria",
                    color_discrete_sequence=['#dc3545'])
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("#### 🔝 Maiores Gastos")
        for categoria, valor in despesas_por_categoria.head().items():
            percentual = (valor / total_despesas) * 100
            st.markdown(f"**{categoria}**")
            st.progress(percentual/100)
            st.caption(f"R$ {valor:,.0f} ({percentual:.1f}%)")
    
    # Lista detalhada de despesas
    st.markdown("### 📋 Despesas Detalhadas")
    
    for idx, despesa in df_despesas.iterrows():
        col1, col2, col3, col4 = st.columns([3, 2, 1, 1])
        
        with col1:
            essencial_icon = "⚠️" if despesa.get('essencial', False) else "🎯"
            st.markdown(f"**{essencial_icon} {despesa['descricao']}**")
            st.caption(f"Categoria: {despesa['categoria']}")
        
        with col2:
            st.markdown(f"**R$ {despesa['valor']:,.2f}**")
            
        with col3:
            if despesa.get('essencial', False):
                st.error("Essencial")
            else:
                st.info("Opcional")
        
        with col4:
            st.caption(despesa['data'])
        
        st.divider()
    
    # Formulário para nova despesa
    st.markdown("### ➕ Nova Despesa")
    
    with st.form("nova_despesa"):
        col1, col2 = st.columns(2)
        
        with col1:
            descricao = st.text_input("Descrição da Despesa*")
            valor = st.number_input("Valor (R$)*", min_value=0.01, format="%.2f")
            categoria = st.selectbox("Categoria", 
                                   ["Habitação", "Transporte", "Alimentação", "Saúde", 
                                    "Educação", "Lazer", "Utilidades", "Seguros", "Outros"])
        
        with col2:
            data = st.date_input("Data da Despesa", value=datetime.today())
            essencial = st.checkbox("Despesa essencial")
            observacoes = st.text_area("Observações")
        
        if st.form_submit_button("Cadastrar Despesa", use_container_width=True):
            if descricao and valor > 0:
                novo_id = max([d['id'] for d in st.session_state.despesas]) + 1
                nova_despesa = {
                    "id": novo_id,
                    "descricao": descricao,
                    "valor": valor,
                    "categoria": categoria,
                    "data": data.strftime("%Y-%m-%d"),
                    "essencial": essencial
                }
                st.session_state.despesas.append(nova_despesa)
                st.success("✅ Despesa cadastrada com sucesso!")
                st.rerun()
            else:
                st.error("Preencha todos os campos obrigatórios!")

# === CARTEIRA DE INVESTIMENTOS ===
elif pagina_selecionada == "📈 Carteira de Investimentos":
    st.markdown("## 📈 Carteira de Investimentos")
    
    df_investimentos = pd.DataFrame(st.session_state.investimentos)
    
    # Métricas gerais
    total_investido = df_investimentos['valor_investido'].sum()
    total_atual = df_investimentos['valor_atual'].sum()
    rentabilidade_geral = ((total_atual - total_investido) / total_investido) * 100
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("💰 Total Investido", f"R$ {total_investido:,.0f}")
    with col2:
        st.metric("📊 Valor Atual", f"R$ {total_atual:,.0f}")
    with col3:
        ganho_perda = total_atual - total_investido
        st.metric("💹 Ganho/Perda", f"R$ {ganho_perda:,.0f}")
    with col4:
        cor_rentabilidade = "normal" if rentabilidade_geral >= 0 else "inverse"
        st.metric("📈 Rentabilidade", f"{rentabilidade_geral:.2f}%", 
                 delta=f"{rentabilidade_geral:.2f}%", delta_color=cor_rentabilidade)
    
    # Gráficos da carteira
    col1, col2 = st.columns(2)
    
    with col1:
        # Distribuição por categoria
        fig = px.pie(df_investimentos, values='valor_atual', names='categoria',
                    title="Alocação por Categoria de Investimento")
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        # Rentabilidade por investimento
        fig = px.bar(df_investimentos, x='nome', y='rentabilidade',
                    title="Rentabilidade por Investimento (%)",
                    color='rentabilidade',
                    color_continuous_scale=['red', 'yellow', 'green'])
        fig.update_layout(xaxis_title="Investimento", yaxis_title="Rentabilidade (%)")
        st.plotly_chart(fig, use_container_width=True)
    
    # Detalhamento dos investimentos
    st.markdown("### 📋 Detalhamento da Carteira")
    
    for idx, invest in df_investimentos.iterrows():
        with st.container():
            col1, col2, col3, col4 = st.columns(4)
            
            rentabilidade_individual = ((invest['valor_atual'] - invest['valor_investido']) / invest['valor_investido']) * 100
            
            with col1:
                st.markdown(f"""
                <div class="metric-card">
                    <h4 style="margin:0;">{invest['nome']}</h4>
                    <p style="margin:0.5rem 0;"><strong>Categoria:</strong> {invest['categoria']}</p>
                </div>
                """, unsafe_allow_html=True)
            
            with col2:
                st.metric("Valor Atual", f"R$ {invest['valor_atual']:,.0f}")
            
            with col3:
                st.metric("Investido", f"R$ {invest['valor_investido']:,.0f}")
            
            with col4:
                delta_color = "normal" if rentabilidade_individual >= 0 else "inverse"
                st.metric("Rentabilidade", f"{invest['rentabilidade']:.1f}% a.a.",
                         delta=f"{rentabilidade_individual:.2f}%", delta_color=delta_color)
        
        st.divider()
    
    # Formulário para novo investimento
    st.markdown("### ➕ Novo Investimento")
    
    with st.form("novo_investimento"):
        col1, col2 = st.columns(2)
        
        with col1:
            nome = st.text_input("Nome do Investimento*")
            categoria = st.selectbox("Categoria", 
                                   ["Renda Fixa", "Renda Variável", "FIIs", "Reserva", 
                                    "Criptomoedas", "Previdência", "Outros"])
            valor_investido = st.number_input("Valor Investido (R$)*", min_value=0.01, format="%.2f")
        
        with col2:
            valor_atual = st.number_input("Valor Atual (R$)*", min_value=0.01, format="%.2f")
            rentabilidade = st.number_input("Rentabilidade Anual (%)", format="%.2f")
            data_aplicacao = st.date_input("Data da Aplicação")
        
        if st.form_submit_button("Adicionar Investimento", use_container_width=True):
            if nome and valor_investido > 0 and valor_atual > 0:
                novo_id = max([i['id'] for i in st.session_state.investimentos]) + 1
                novo_investimento = {
                    "id": novo_id,
                    "nome": nome,
                    "valor_atual": valor_atual,
                    "valor_investido": valor_investido,
                    "rentabilidade": rentabilidade,
                    "categoria": categoria
                }
                st.session_state.investimentos.append(novo_investimento)
                st.success("✅ Investimento adicionado com sucesso!")
                st.rerun()
            else:
                st.error("Preencha todos os campos obrigatórios!")

# === OBJETIVOS FINANCEIROS ===
elif pagina_selecionada == "🎯 Objetivos Financeiros":
    st.markdown("## 🎯 Objetivos e Metas Financeiras")
    
    # Análise geral dos objetivos
    df_objetivos = pd.DataFrame(st.session_state.objetivos)
    total_objetivos = df_objetivos['valor_objetivo'].sum()
    total_poupado = df_objetivos['valor_atual'].sum()
    progresso_geral = (total_poupado / total_objetivos) * 100
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("🎯 Total dos Objetivos", f"R$ {total_objetivos:,.0f}")
    with col2:
        st.metric("💰 Total Poupado", f"R$ {total_poupado:,.0f}")
    with col3:
        st.metric("📊 Progresso Geral", f"{progresso_geral:.1f}%")
    
    # Progresso individual dos objetivos
    st.markdown("### 📈 Progresso dos Objetivos")
    
    for idx, objetivo in df_objetivos.iterrows():
        progresso = (objetivo['valor_atual'] / objetivo['valor_objetivo']) * 100
        valor_faltante = objetivo['valor_objetivo'] - objetivo['valor_atual']
        aporte_mensal_necessario = valor_faltante / objetivo['prazo_meses'] if objetivo['prazo_meses'] > 0 else 0
        
        with st.container():
            col1, col2, col3 = st.columns([2, 1, 1])
            
            with col1:
                priority_colors = {"Alta": "🔴", "Média": "🟡", "Baixa": "🟢"}
                priority_icon = priority_colors.get(objetivo['prioridade'], '🟢')
                
                st.markdown(f"""
                <div class="metric-card">
                    <h4 style="margin:0;">{priority_icon} {objetivo['nome']}</h4>
                    <p style="margin:0.5rem 0;"><strong>Prioridade:</strong> {objetivo['prioridade']}</p>
                    <p style="margin:0;"><strong>Prazo:</strong> {objetivo['prazo_meses']} meses</p>
                </div>
                """, unsafe_allow_html=True)
            
            with col2:
                st.metric("Progresso", f"{progresso:.1f}%")
                st.progress(min(progresso/100, 1.0))
            
            with col3:
                st.metric("Objetivo", f"R$ {objetivo['valor_objetivo']:,.0f}")
                st.metric("Poupado", f"R$ {objetivo['valor_atual']:,.0f}")
            
            # Informações adicionais
            col1, col2, col3 = st.columns(3)
            with col1:
                st.info(f"💰 Faltam: R$ {valor_faltante:,.0f}")
            with col2:
                st.info(f"📅 Aporte mensal necessário: R$ {aporte_mensal_necessario:,.0f}")
            with col3:
                meses_restantes = objetivo['prazo_meses'] - (objetivo['valor_atual'] / aporte_mensal_necessario) if aporte_mensal_necessario > 0 else 0
                st.info(f"⏰ Tempo estimado: {max(0, meses_restantes):.0f} meses")
        
        st.divider()
    
    # Formulário para novo objetivo
    st.markdown("### ➕ Novo Objetivo Financeiro")
    
    with st.form("novo_objetivo"):
        col1, col2 = st.columns(2)
        
        with col1:
            nome = st.text_input("Nome do Objetivo*")
            valor_objetivo = st.number_input("Valor do Objetivo (R$)*", min_value=1.0, format="%.2f")
            valor_atual = st.number_input("Valor já poupado (R$)", min_value=0.0, format="%.2f")
        
        with col2:
            prazo_meses = st.number_input("Prazo em meses*", min_value=1, value=12)
            prioridade = st.selectbox("Prioridade", ["Alta", "Média", "Baixa"])
            descricao = st.text_area("Descrição/Observações")
        
        if st.form_submit_button("Criar Objetivo", use_container_width=True):
            if nome and valor_objetivo > 0:
                novo_id = max([o['id'] for o in st.session_state.objetivos]) + 1
                novo_objetivo = {
                    "id": novo_id,
                    "nome": nome,
                    "valor_objetivo": valor_objetivo,
                    "valor_atual": valor_atual,
                    "prazo_meses": prazo_meses,
                    "prioridade": prioridade
                }
                st.session_state.objetivos.append(novo_objetivo)
                st.success("✅ Objetivo criado com sucesso!")
                st.rerun()
            else:
                st.error("Preencha todos os campos obrigatórios!")

# Outras páginas (placeholder)
else:
    st.markdown(f"## {pagina_selecionada}")
    st.info("🚧 Esta seção está em desenvolvimento.")
    st.markdown("### Funcionalidades planejadas:")
    
    if "Análises" in pagina_selecionada:
        st.markdown("""
        - 📊 Relatórios detalhados de receitas x despesas
        - 📈 Análise de tendências patrimoniais
        - 🎯 Acompanhamento de metas mensais
        - 💡 Sugestões de otimização financeira
        - 📋 Relatórios personalizáveis em PDF
        """)
    
    elif "Calculadoras" in pagina_selecionada:
        st.markdown("""
        - 🧮 Calculadora de juros compostos
        - 🏠 Simulador de financiamento imobiliário
        - 🚗 Calculadora de financiamento veicular
        - 📈 Simulador de aposentadoria
        - 💰 Calculadora de independência financeira
        """)
    
    elif "Configurações" in pagina_selecionada:
        st.markdown("""
        - ⚙️ Preferências do usuário
        - 🔐 Segurança e privacidade
        - 💾 Backup e restauração
        - 📊 Customização de dashboards
        - 🔔 Configuração de alertas
        """)

# Rodapé do sistema
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #666; padding: 1rem;">
    <small>CIKLUS Sistema de Planejamento Financeiro v2.1 | © 2025</small>
</div>
""", unsafe_allow_html=True)