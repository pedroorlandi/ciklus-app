// Verificação de precisão no cálculo VPL
const fs = require('fs');

console.log('🔍 Verificando precisão do cálculo VPL');
console.log('');

try {
    // Ler dados mensais via API
    const { execSync } = require('child_process');
    const result = execSync('curl -s "http://localhost:5000/api/dados/2"', { encoding: 'utf8' });
    const dados = JSON.parse(result);
    
    console.log(`📊 Total de registros: ${dados.length}`);
    console.log(`📅 Período: ${dados[0].ano}/${dados[0].mes.toString().padStart(2, '0')} até ${dados[dados.length-1].ano}/${dados[dados.length-1].mes.toString().padStart(2, '0')}`);
    console.log('');
    
    // Parâmetros VPL
    const taxaAnual = 0.04; // 4%
    const taxaMensal = Math.pow(1 + taxaAnual, 1/12) - 1; // Conversão correta
    
    console.log(`📈 Taxa anual: ${(taxaAnual * 100).toFixed(6)}%`);
    console.log(`📈 Taxa mensal: ${(taxaMensal * 100).toFixed(6)}%`);
    console.log('');
    
    // Cálculo VPL detalhado
    let vplTotal = 0;
    let portfolioInicial = 0;
    
    // Primeiro registro para obter portfolio inicial
    if (dados.length > 0) {
        portfolioInicial = parseFloat(dados[0].portfolioInicial || 0);
        console.log(`💰 Portfolio Inicial: R$ ${portfolioInicial.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
        console.log('');
    }
    
    // Calcular VPL mês a mês
    console.log('📋 CÁLCULO VPL DETALHADO (primeiros 12 meses):');
    
    for (let i = 0; i < Math.min(dados.length, 12); i++) {
        const dado = dados[i];
        const periodo = i + 1;
        
        const saving = parseFloat(dado.saving || 0);
        const fatorDesconto = Math.pow(1 + taxaMensal, periodo);
        const valorPresente = saving / fatorDesconto;
        
        vplTotal += valorPresente;
        
        console.log(`   Mês ${periodo.toString().padStart(2, '0')}: Saving R$ ${saving.toFixed(2).padStart(12)} | Fator ${fatorDesconto.toFixed(6)} | VP R$ ${valorPresente.toFixed(4)}`);
    }
    
    // Continuar cálculo para todos os meses (sem mostrar detalhes)
    for (let i = 12; i < dados.length; i++) {
        const dado = dados[i];
        const periodo = i + 1;
        
        const saving = parseFloat(dado.saving || 0);
        const fatorDesconto = Math.pow(1 + taxaMensal, periodo);
        const valorPresente = saving / fatorDesconto;
        
        vplTotal += valorPresente;
    }
    
    console.log(`   ... (calculando ${dados.length - 12} meses restantes)`);
    console.log('');
    
    // VPL final descontando portfolio inicial
    const vplFinal = vplTotal - portfolioInicial;
    
    console.log('💎 RESULTADO FINAL:');
    console.log(`   VPL dos fluxos (sem portfolio): R$ ${vplTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log(`   Portfolio inicial (desconto): R$ ${portfolioInicial.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log(`   VPL FINAL: R$ ${vplFinal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log('');
    
    // Comparação com resultado esperado
    const vplEsperadoSistema = 56446.68;
    const vplEsperadoCSV = 56262.49;
    const diferencaSistema = Math.abs(vplFinal - vplEsperadoSistema);
    const diferencaCSV = Math.abs(vplFinal - vplEsperadoCSV);
    
    console.log('🔍 COMPARAÇÃO:');
    console.log(`   VPL Sistema anterior: R$ ${vplEsperadoSistema.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log(`   VPL CSV (usuário): R$ ${vplEsperadoCSV.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log(`   VPL Calculado agora: R$ ${vplFinal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log('');
    console.log(`   Diferença vs Sistema: R$ ${diferencaSistema.toFixed(2)} (${diferencaSistema < 1 ? 'ACEITÁVEL' : 'INVESTIGAR'})`);
    console.log(`   Diferença vs CSV: R$ ${diferencaCSV.toFixed(2)} (${diferencaCSV < 1 ? 'ACEITÁVEL' : 'INVESTIGAR'})`);
    
    // Verificar se há dados zerados ou inválidos
    const dadosComSavingZero = dados.filter(d => parseFloat(d.saving || 0) === 0);
    const dadosComSavingNaN = dados.filter(d => isNaN(parseFloat(d.saving || 0)));
    
    console.log('');
    console.log('🔍 VERIFICAÇÃO DE DADOS:');
    console.log(`   Registros com saving = 0: ${dadosComSavingZero.length}`);
    console.log(`   Registros com saving = NaN: ${dadosComSavingNaN.length}`);
    
    if (dadosComSavingNaN.length > 0) {
        console.log('   ⚠️  ATENÇÃO: Encontrados valores NaN que podem afetar precisão');
    }
    
    // Verificar valores extremos
    const savings = dados.map(d => parseFloat(d.saving || 0)).filter(s => !isNaN(s));
    const savingMin = Math.min(...savings);
    const savingMax = Math.max(...savings);
    
    console.log(`   Saving mínimo: R$ ${savingMin.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log(`   Saving máximo: R$ ${savingMax.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log(`   Saving médio: R$ ${(savings.reduce((a,b) => a+b, 0) / savings.length).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);

} catch (error) {
    console.error('❌ Erro na verificação:', error.message);
}