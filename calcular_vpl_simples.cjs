// Script simples para calcular VPL usando dados locais
const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔢 Calculando VPL da coluna SAVINGS - Cenário Base (ambos provedores ativos)');
console.log('📊 Taxa: 4% anual → 0.327374% mensal equivalente');
console.log('');

try {
    // Buscar dados via curl
    const result = execSync('curl -s "http://localhost:5000/api/dados/2"', { encoding: 'utf8' });
    const dados = JSON.parse(result);
    
    console.log(`📈 Total de registros: ${dados.length} meses`);
    console.log(`📅 Período: ${dados[0].ano}/${String(dados[0].mes).padStart(2, '0')} até ${dados[dados.length-1].ano}/${String(dados[dados.length-1].mes).padStart(2, '0')}`);
    console.log('');

    // Configurar taxa
    const taxaAnual = 0.04; // 4% anual
    const taxaMensal = Math.pow(1 + taxaAnual, 1/12) - 1; // Taxa mensal equivalente
    
    console.log(`💹 Taxa anual: ${(taxaAnual * 100).toFixed(2)}%`);
    console.log(`💹 Taxa mensal equivalente: ${(taxaMensal * 100).toFixed(6)}%`);
    console.log('');

    // Calcular VPL
    let vpl = 0;
    let somaPositivos = 0;
    let somaNegativos = 0;
    let countPositivos = 0;
    let countNegativos = 0;

    console.log('📋 Amostra dos primeiros 10 valores:');
    
    dados.forEach((dado, index) => {
        const saving = typeof dado.saving === 'string' ? parseFloat(dado.saving) : (dado.saving || 0);
        
        if (!isNaN(saving) && saving !== null) {
            const valorPresente = saving / Math.pow(1 + taxaMensal, index);
            vpl += valorPresente;
            
            if (saving > 0) {
                somaPositivos += saving;
                countPositivos++;
            } else if (saving < 0) {
                somaNegativos += saving;
                countNegativos++;
            }
            
            // Mostrar primeiros 10 registros
            if (index < 10) {
                console.log(`   ${dado.ano}/${String(dado.mes).padStart(2, '0')}: R$ ${saving.toLocaleString('pt-BR', {minimumFractionDigits: 2})} → VP: R$ ${valorPresente.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
            }
        }
    });

    console.log('');
    console.log('📊 ESTATÍSTICAS DO FLUXO:');
    console.log(`   💚 Savings Positivos: ${countPositivos} meses - Soma: R$ ${somaPositivos.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log(`   🔴 Savings Negativos: ${countNegativos} meses - Soma: R$ ${somaNegativos.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log(`   📈 Saving Líquido Total: R$ ${(somaPositivos + somaNegativos).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log('');
    
    console.log('🎯 RESULTADO FINAL:');
    console.log(`   🏆 VPL do SAVING: R$ ${vpl.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log(`   📊 VPL Absoluto: R$ ${Math.abs(vpl).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    
    if (vpl < 0) {
        console.log('   ⚠️  VPL NEGATIVO: Indica necessidade de capital segurado para cobrir déficit projetado');
    } else {
        console.log('   ✅ VPL POSITIVO: Família consegue acumular patrimônio ao longo do período');
    }

} catch (error) {
    console.error('❌ Erro ao calcular VPL:', error.message);
}