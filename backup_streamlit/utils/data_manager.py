import streamlit as st
import pandas as pd
from datetime import datetime

class DataManager:
    """Classe para gerenciar dados da aplicação usando session_state do Streamlit"""
    
    def __init__(self):
        self._initialize_session_state()
    
    def _initialize_session_state(self):
        """Inicializa as estruturas de dados no session_state"""
        if 'membros' not in st.session_state:
            st.session_state.membros = []
        if 'receitas' not in st.session_state:
            st.session_state.receitas = []
        if 'despesas' not in st.session_state:
            st.session_state.despesas = []
        if 'investimentos' not in st.session_state:
            st.session_state.investimentos = []
        if 'projetos' not in st.session_state:
            st.session_state.projetos = []
        if 'seguros' not in st.session_state:
            st.session_state.seguros = []
    
    def has_data(self):
        """Verifica se há dados cadastrados em qualquer categoria"""
        return (len(st.session_state.membros) > 0 or 
                len(st.session_state.receitas) > 0 or 
                len(st.session_state.despesas) > 0 or 
                len(st.session_state.investimentos) > 0 or 
                len(st.session_state.projetos) > 0 or 
                len(st.session_state.seguros) > 0)
    
    # Métodos para Membros
    def add_membro(self, membro_data):
        """Adiciona um novo membro da família"""
        membro = {
            'id': len(st.session_state.membros) + 1,
            'nome': membro_data['nome'],
            'idade': membro_data['idade'],
            'relacionamento': membro_data['relacionamento'],
            'ocupacao': membro_data['ocupacao'],
            'data_cadastro': datetime.now()
        }
        st.session_state.membros.append(membro)
    
    def get_membros(self):
        """Retorna DataFrame com todos os membros"""
        if not st.session_state.membros:
            return pd.DataFrame()
        return pd.DataFrame(st.session_state.membros)
    
    # Métodos para Receitas
    def add_receita(self, receita_data):
        """Adiciona uma nova receita"""
        receita = {
            'id': len(st.session_state.receitas) + 1,
            'descricao': receita_data['descricao'],
            'valor': receita_data['valor'],
            'categoria': receita_data['categoria'],
            'frequencia': receita_data['frequencia'],
            'responsavel': receita_data['responsavel'],
            'data_cadastro': datetime.now()
        }
        st.session_state.receitas.append(receita)
    
    def get_receitas(self):
        """Retorna DataFrame com todas as receitas"""
        if not st.session_state.receitas:
            return pd.DataFrame()
        return pd.DataFrame(st.session_state.receitas)
    
    def get_total_receitas(self):
        """Calcula o total de receitas mensais"""
        if not st.session_state.receitas:
            return 0.0
        
        total = 0.0
        for receita in st.session_state.receitas:
            if receita['frequencia'] == 'Mensal':
                total += receita['valor']
            elif receita['frequencia'] == 'Anual':
                total += receita['valor'] / 12
            # Para receitas únicas, não incluímos no cálculo mensal
        
        return total
    
    # Métodos para Despesas
    def add_despesa(self, despesa_data):
        """Adiciona uma nova despesa"""
        despesa = {
            'id': len(st.session_state.despesas) + 1,
            'descricao': despesa_data['descricao'],
            'valor': despesa_data['valor'],
            'categoria': despesa_data['categoria'],
            'frequencia': despesa_data['frequencia'],
            'responsavel': despesa_data['responsavel'],
            'data_cadastro': datetime.now()
        }
        st.session_state.despesas.append(despesa)
    
    def get_despesas(self):
        """Retorna DataFrame com todas as despesas"""
        if not st.session_state.despesas:
            return pd.DataFrame()
        return pd.DataFrame(st.session_state.despesas)
    
    def get_total_despesas(self):
        """Calcula o total de despesas mensais"""
        if not st.session_state.despesas:
            return 0.0
        
        total = 0.0
        for despesa in st.session_state.despesas:
            if despesa['frequencia'] == 'Mensal':
                total += despesa['valor']
            elif despesa['frequencia'] == 'Anual':
                total += despesa['valor'] / 12
            # Para despesas únicas, não incluímos no cálculo mensal
        
        return total
    
    # Métodos para Investimentos
    def add_investimento(self, investimento_data):
        """Adiciona um novo investimento"""
        investimento = {
            'id': len(st.session_state.investimentos) + 1,
            'nome': investimento_data['nome'],
            'tipo': investimento_data['tipo'],
            'valor_atual': investimento_data['valor_atual'],
            'valor_aplicado': investimento_data['valor_aplicado'],
            'data_aplicacao': investimento_data['data_aplicacao'],
            'taxa_esperada': investimento_data['taxa_esperada'],
            'data_cadastro': datetime.now()
        }
        st.session_state.investimentos.append(investimento)
    
    def get_investimentos(self):
        """Retorna DataFrame com todos os investimentos"""
        if not st.session_state.investimentos:
            return pd.DataFrame()
        return pd.DataFrame(st.session_state.investimentos)
    
    def get_patrimonio_total(self):
        """Calcula o patrimônio total em investimentos"""
        if not st.session_state.investimentos:
            return 0.0
        
        return sum(inv['valor_atual'] for inv in st.session_state.investimentos)
    
    # Métodos para Projetos
    def add_projeto(self, projeto_data):
        """Adiciona um novo projeto"""
        projeto = {
            'id': len(st.session_state.projetos) + 1,
            'nome': projeto_data['nome'],
            'categoria': projeto_data['categoria'],
            'valor_objetivo': projeto_data['valor_objetivo'],
            'valor_atual': projeto_data['valor_atual'],
            'prazo_meses': projeto_data['prazo_meses'],
            'prioridade': projeto_data['prioridade'],
            'data_cadastro': datetime.now()
        }
        st.session_state.projetos.append(projeto)
    
    def get_projetos(self):
        """Retorna DataFrame com todos os projetos"""
        if not st.session_state.projetos:
            return pd.DataFrame()
        return pd.DataFrame(st.session_state.projetos)
    
    # Métodos para Seguros
    def add_seguro(self, seguro_data):
        """Adiciona um novo seguro"""
        seguro = {
            'id': len(st.session_state.seguros) + 1,
            'nome': seguro_data['nome'],
            'tipo': seguro_data['tipo'],
            'seguradora': seguro_data['seguradora'],
            'valor_premio': seguro_data['valor_premio'],
            'valor_cobertura': seguro_data['valor_cobertura'],
            'periodicidade': seguro_data['periodicidade'],
            'segurado': seguro_data['segurado'],
            'data_cadastro': datetime.now()
        }
        st.session_state.seguros.append(seguro)
    
    def get_seguros(self):
        """Retorna DataFrame com todos os seguros"""
        if not st.session_state.seguros:
            return pd.DataFrame()
        return pd.DataFrame(st.session_state.seguros)
    
    # Métodos para Planejamentos
    def create_planejamento(self, planejamento_data):
        """Cria um novo planejamento"""
        if 'planejamentos' not in st.session_state:
            st.session_state.planejamentos = []
        
        planejamento = {
            'id': len(st.session_state.planejamentos) + 1,
            'nome': planejamento_data['nome'],
            'descricao': planejamento_data.get('descricao', ''),
            'data_inicio': planejamento_data['data_inicio'],
            'data_fim': planejamento_data['data_fim'],
            'status': 'ativo',
            'data_criacao': datetime.now()
        }
        st.session_state.planejamentos.append(planejamento)
        return planejamento['id']
    
    def get_planejamentos(self):
        """Retorna DataFrame com todos os planejamentos"""
        if 'planejamentos' not in st.session_state:
            st.session_state.planejamentos = []
        if not st.session_state.planejamentos:
            return pd.DataFrame()
        return pd.DataFrame(st.session_state.planejamentos)
    
    # Métodos para análises avançadas (inspirado no Ciklus original)
    def get_dashboard_data(self):
        """Retorna dados consolidados para o dashboard"""
        return {
            'total_receitas': self.get_total_receitas(),
            'total_despesas': self.get_total_despesas(),
            'patrimonio_total': self.get_patrimonio_total(),
            'saldo_mensal': self.get_total_receitas() - self.get_total_despesas(),
            'total_membros': len(st.session_state.membros),
            'total_investimentos': len(st.session_state.investimentos),
            'total_projetos': len(st.session_state.projetos),
            'total_seguros': len(st.session_state.seguros)
        }
    
    def get_financial_summary(self):
        """Retorna resumo financeiro detalhado"""
        receitas = self.get_receitas()
        despesas = self.get_despesas()
        investimentos = self.get_investimentos()
        
        summary = {
            'receitas_por_categoria': {},
            'despesas_por_categoria': {},
            'investimentos_por_tipo': {},
            'rentabilidade_media': 0.0
        }
        
        if not receitas.empty:
            summary['receitas_por_categoria'] = receitas.groupby('categoria')['valor'].sum().to_dict()
        
        if not despesas.empty:
            summary['despesas_por_categoria'] = despesas.groupby('categoria')['valor'].sum().to_dict()
        
        if not investimentos.empty:
            summary['investimentos_por_tipo'] = investimentos.groupby('tipo')['valor_atual'].sum().to_dict()
            if len(investimentos) > 0:
                rentabilidades = ((investimentos['valor_atual'] - investimentos['valor_aplicado']) / investimentos['valor_aplicado'] * 100)
                summary['rentabilidade_media'] = rentabilidades.mean()
        
        return summary
