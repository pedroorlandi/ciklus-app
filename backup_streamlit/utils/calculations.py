import math
from datetime import datetime, timedelta

class FinancialCalculator:
    """Classe para cálculos financeiros avançados - inspirada no sistema Ciklus"""
    
    def __init__(self):
        # Índices econômicos padrão (simulando dados reais)
        self.indices_economicos = {
            'selic': 0.1275,  # 12.75% - Taxa SELIC
            'ipca': 0.0438,   # 4.38% - IPCA acumulado 12 meses
            'cdi': 0.1250,    # 12.50% - CDI
            'igpm': 0.0295,   # 2.95% - IGP-M
            'inpc': 0.0421,   # 4.21% - INPC
            'poupanca': 0.0691 # 6.91% - Poupança
        }
    
    def calcular_tempo_para_objetivo(self, valor_atual, valor_objetivo, aporte_mensal, taxa_juros_aa=0.10):
        """Calcula tempo necessário para atingir um objetivo financeiro"""
        if valor_atual >= valor_objetivo:
            return 0
        
        taxa_mensal = (1 + taxa_juros_aa) ** (1/12) - 1
        
        if aporte_mensal <= 0:
            return float('inf')  # Nunca atingirá o objetivo sem aportes
        
        # Fórmula para cálculo de tempo com juros compostos e aportes
        fator_objetivo = (valor_objetivo / aporte_mensal)
        fator_atual = (valor_atual / aporte_mensal)
        
        if taxa_mensal > 0:
            numerador = math.log(fator_objetivo * taxa_mensal + 1)
            denominador = math.log(fator_atual * taxa_mensal + 1)
            meses = (numerador - denominador) / math.log(1 + taxa_mensal)
        else:
            meses = (valor_objetivo - valor_atual) / aporte_mensal
        
        return max(0, meses)
    
    def calcular_aporte_necessario(self, valor_atual, valor_objetivo, prazo_meses, taxa_juros_aa=0.10):
        """Calcula o aporte mensal necessário para atingir um objetivo"""
        if valor_atual >= valor_objetivo:
            return 0
        
        if prazo_meses <= 0:
            return float('inf')
        
        taxa_mensal = (1 + taxa_juros_aa) ** (1/12) - 1
        
        if taxa_mensal > 0:
            # PMT com juros compostos
            fv = valor_objetivo
            pv = valor_atual
            n = prazo_meses
            r = taxa_mensal
            
            # Valor futuro do valor atual
            fv_atual = pv * (1 + r) ** n
            # Valor que ainda precisa ser acumulado
            valor_faltante = fv - fv_atual
            
            # PMT para acumular valor faltante
            if valor_faltante <= 0:
                return 0
            
            pmt = valor_faltante / (((1 + r) ** n - 1) / r)
        else:
            pmt = (valor_objetivo - valor_atual) / prazo_meses
        
        return max(0, pmt)
    
    def calcular_projecao_patrimonial(self, patrimonio_atual, saldo_mensal, anos=10, taxa_juros_aa=0.10):
        """Calcula projeção patrimonial com aportes mensais (modelo Ciklus)"""
        if patrimonio_atual < 0:
            patrimonio_atual = 0
        
        taxa_mensal = (1 + taxa_juros_aa) ** (1/12) - 1
        meses = anos * 12
        
        projecao = []
        patrimonio = patrimonio_atual
        
        for mes in range(1, meses + 1):
            # Juros sobre patrimônio atual + aporte mensal
            patrimonio = patrimonio * (1 + taxa_mensal) + saldo_mensal
            projecao.append({
                'mes': mes,
                'patrimonio': max(0, patrimonio),
                'ano': mes / 12,
                'aportes_acumulados': saldo_mensal * mes,
                'juros_acumulados': max(0, patrimonio) - patrimonio_atual - (saldo_mensal * mes)
            })
        
        if not projecao:
            return None
        
        return {
            'meses': [p['mes'] for p in projecao],
            'patrimonio': [p['patrimonio'] for p in projecao],
            'anos': [p['ano'] for p in projecao],
            'aportes_acumulados': [p['aportes_acumulados'] for p in projecao],
            'juros_acumulados': [p['juros_acumulados'] for p in projecao]
        }
    
    def calcular_vpl(self, fluxo_caixa, taxa_desconto):
        """Calcula o Valor Presente Líquido (VPL) - funcionalidade do Ciklus"""
        vpl = 0
        for i, fc in enumerate(fluxo_caixa):
            vpl += fc / (1 + taxa_desconto) ** i
        return vpl
    
    def calcular_tir(self, fluxo_caixa, precisao=0.0001, max_iter=1000):
        """Calcula a Taxa Interna de Retorno (TIR) - funcionalidade do Ciklus"""
        # Implementação simplificada do método de Newton-Raphson
        taxa = 0.1  # Taxa inicial de 10%
        
        for _ in range(max_iter):
            vpl = sum(fc / (1 + taxa) ** i for i, fc in enumerate(fluxo_caixa))
            derivada_vpl = sum(-i * fc / (1 + taxa) ** (i + 1) for i, fc in enumerate(fluxo_caixa))
            
            if abs(vpl) < precisao:
                return taxa
                
            if derivada_vpl == 0:
                break
                
            taxa_nova = taxa - vpl / derivada_vpl
            
            if abs(taxa_nova - taxa) < precisao:
                return taxa_nova
                
            taxa = taxa_nova
        
        return None  # Não convergiu
    
    def calcular_payback(self, investimento_inicial, fluxo_caixa_liquido):
        """Calcula o período de payback de um investimento"""
        if investimento_inicial <= 0:
            return 0
        
        saldo_recuperar = abs(investimento_inicial)
        
        for i, fluxo in enumerate(fluxo_caixa_liquido):
            if fluxo <= 0:
                continue
                
            if saldo_recuperar <= fluxo:
                # Payback fracionário
                return i + (saldo_recuperar / fluxo)
            else:
                saldo_recuperar -= fluxo
        
        return None  # Nunca recupera o investimento
    
    def simular_cenarios(self, patrimonio_atual, saldo_mensal, anos=10):
        """Simula cenários otimista, realista e pessimista (funcionalidade do Ciklus)"""
        cenarios = {
            'pessimista': {'taxa': 0.06, 'nome': 'Pessimista'},  # 6% ao ano
            'realista': {'taxa': 0.10, 'nome': 'Realista'},      # 10% ao ano  
            'otimista': {'taxa': 0.14, 'nome': 'Otimista'}       # 14% ao ano
        }
        
        resultados = {}
        
        for nome_cenario, config in cenarios.items():
            projecao = self.calcular_projecao_patrimonial(
                patrimonio_atual=patrimonio_atual,
                saldo_mensal=saldo_mensal,
                anos=anos,
                taxa_juros_aa=config['taxa']
            )
            
            if projecao:
                patrimonio_final = projecao['patrimonio'][-1]
                total_aportes = saldo_mensal * 12 * anos
                total_juros = patrimonio_final - patrimonio_atual - total_aportes
                
                resultados[nome_cenario] = {
                    'patrimonio_final': patrimonio_final,
                    'total_aportes': total_aportes,
                    'total_juros': total_juros,
                    'taxa_utilizada': config['taxa'],
                    'rentabilidade_total': (patrimonio_final - patrimonio_atual) / patrimonio_atual * 100 if patrimonio_atual > 0 else 0,
                    'projecao': projecao
                }
        
        return resultados
    
    def calcular_independencia_financeira(self, patrimonio_atual, saldo_mensal, gastos_mensais_desejados, taxa_rendimento_aa=0.06):
        """Calcula quando atingir independência financeira (renda passiva = gastos)"""
        # Para independência financeira, o patrimônio deve gerar renda passiva suficiente
        # Patrimônio necessário = gastos_mensais * 12 / taxa_rendimento
        patrimonio_necessario = (gastos_mensais_desejados * 12) / taxa_rendimento_aa
        
        if patrimonio_atual >= patrimonio_necessario:
            return {
                'meses_para_independencia': 0,
                'patrimonio_necessario': patrimonio_necessario,
                'patrimonio_atual': patrimonio_atual,
                'renda_passiva_atual': patrimonio_atual * taxa_rendimento_aa / 12,
                'alcancado': True
            }
        
        # Calcular tempo para atingir patrimônio necessário
        tempo_meses = self.calcular_tempo_para_objetivo(
            valor_atual=patrimonio_atual,
            valor_objetivo=patrimonio_necessario,
            aporte_mensal=saldo_mensal,
            taxa_juros_aa=0.10  # Taxa de crescimento do patrimônio
        )
        
        return {
            'meses_para_independencia': tempo_meses,
            'anos_para_independencia': tempo_meses / 12,
            'patrimonio_necessario': patrimonio_necessario,
            'patrimonio_atual': patrimonio_atual,
            'renda_passiva_atual': patrimonio_atual * taxa_rendimento_aa / 12,
            'renda_passiva_objetivo': gastos_mensais_desejados,
            'alcancado': False
        }
    
    def analisar_saude_financeira(self, receitas, despesas, patrimonio, reserva_emergencia):
        """Analisa a saúde financeira geral (inspirado no mood analyzer do Ciklus)"""
        score = 0
        alertas = []
        recomendacoes = []
        
        # 1. Análise de fluxo de caixa (30 pontos)
        saldo_mensal = receitas - despesas
        if saldo_mensal > 0:
            percentual_poupanca = saldo_mensal / receitas
            if percentual_poupanca >= 0.30:
                score += 30
                recomendacoes.append("Excelente capacidade de poupança! Mantenha esse ritmo.")
            elif percentual_poupanca >= 0.20:
                score += 25
                recomendacoes.append("Boa capacidade de poupança. Tente aumentar para 30%.")
            elif percentual_poupanca >= 0.10:
                score += 15
                recomendacoes.append("Capacidade básica de poupança. Revise gastos desnecessários.")
            else:
                score += 5
                alertas.append("Baixa capacidade de poupança. Urgente revisar despesas.")
        else:
            alertas.append("Receitas insuficientes para cobrir despesas!")
            recomendacoes.append("Priorize aumento de receitas e corte de gastos.")
        
        # 2. Análise de reserva de emergência (25 pontos)
        gastos_cobertos = reserva_emergencia / despesas if despesas > 0 else 0
        if gastos_cobertos >= 6:
            score += 25
            recomendacoes.append("Reserva de emergência excelente!")
        elif gastos_cobertos >= 3:
            score += 15
            recomendacoes.append("Reserve emergência adequada. Considere chegar a 6 meses.")
        elif gastos_cobertos >= 1:
            score += 5
            alertas.append("Reserva de emergência baixa. Priorize acumular 3-6 meses de gastos.")
        else:
            alertas.append("Sem reserva de emergência! Risco financeiro alto.")
        
        # 3. Análise de patrimônio (25 pontos)
        if patrimonio > 0:
            meses_patrimonio = patrimonio / despesas if despesas > 0 else patrimonio / 1000
            if meses_patrimonio >= 60:  # 5 anos de gastos
                score += 25
                recomendacoes.append("Patrimônio excelente para sustentabilidade financeira.")
            elif meses_patrimonio >= 24:  # 2 anos
                score += 20
                recomendacoes.append("Bom patrimônio acumulado. Continue investindo.")
            elif meses_patrimonio >= 6:
                score += 10
                recomendacoes.append("Patrimônio inicial. Foque em aumentar investimentos.")
            else:
                score += 5
                recomendacoes.append("Comece a construir seu patrimônio através de investimentos.")
        
        # 4. Diversificação e planejamento (20 pontos)
        score += 10  # Pontuação básica por ter um sistema de planejamento
        recomendacoes.append("Continue usando ferramentas de planejamento financeiro.")
        
        # Classificação da saúde financeira
        if score >= 80:
            classificacao = "Excelente"
            emoji = "🟢"
        elif score >= 60:
            classificacao = "Boa"
            emoji = "🟡"
        elif score >= 40:
            classificacao = "Regular"
            emoji = "🟠"
        else:
            classificacao = "Precária"
            emoji = "🔴"
        
        return {
            'score': score,
            'classificacao': classificacao,
            'emoji': emoji,
            'alertas': alertas,
            'recomendacoes': recomendacoes,
            'detalhes': {
                'saldo_mensal': saldo_mensal,
                'percentual_poupanca': (saldo_mensal / receitas * 100) if receitas > 0 else 0,
                'meses_reserva': gastos_cobertos,
                'meses_patrimonio': patrimonio / despesas if despesas > 0 else 0
            }
        }
    
    def get_indices_economicos(self):
        """Retorna os índices econômicos atuais (simulados)"""
        return self.indices_economicos