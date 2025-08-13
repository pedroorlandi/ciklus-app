// Correção de precisão no cálculo VPL
const { execSync } = require('child_process');

console.log('🔧 CORREÇÃO DE PRECISÃO - CÁLCULO VPL');
console.log('');

async function verificarECorrigirVPL() {
    try {
        // Buscar dados via API
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
        
        // COMPARAÇÃO: VPL incorreto vs VPL correto
        let vplIncorreto = 0;
        let vplCorreto = 0;
        
        // Cálculo VPL INCORRETO (sistema atual - usando index)
        dados.forEach((dado, index) => {
            const saving = parseFloat(dado.saving || 0);
            if (!isNaN(saving)) {
                vplIncorreto += saving / Math.pow(1 + taxaMensal, index); // ERRO: usando index
            }
        });
        
        // Cálculo VPL CORRETO (usando index + 1)
        dados.forEach((dado, index) => {
            const saving = parseFloat(dado.saving || 0);
            if (!isNaN(saving)) {
                vplCorreto += saving / Math.pow(1 + taxaMensal, index + 1); // CORRETO: usando index + 1
            }
        });
        
        console.log('🔍 COMPARAÇÃO DE METODOLOGIAS:');
        console.log(`   VPL Sistema Atual (index):     R$ ${vplIncorreto.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
        console.log(`   VPL Correto (index + 1):      R$ ${vplCorreto.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
        console.log(`   Diferença:                    R$ ${(vplCorreto - vplIncorreto).toLocaleString('pt-BR', {minimumFracionDigits: 2})}`);
        console.log('');
        
        // Comparação com resultado esperado do usuário
        const vplEsperadoCSV = 56262.49;
        const diferencaIncorreto = Math.abs(vplIncorreto - vplEsperadoCSV);
        const diferencaCorreto = Math.abs(vplCorreto - vplEsperadoCSV);
        
        console.log('🎯 VALIDAÇÃO COM RESULTADO ESPERADO:');
        console.log(`   VPL CSV (usuário):            R$ ${vplEsperadoCSV.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
        console.log(`   Diferença Sistema Atual:      R$ ${diferencaIncorreto.toFixed(2)} (${diferencaIncorreto < 1 ? '✅ ACEITÁVEL' : '❌ INVESTIGAR'})`);
        console.log(`   Diferença VPL Corrigido:      R$ ${diferencaCorreto.toFixed(2)} (${diferencaCorreto < 1 ? '✅ ACEITÁVEL' : '❌ INVESTIGAR'})`);
        console.log('');
        
        // Mostrar detalhes dos primeiros 5 períodos para análise
        console.log('🔍 ANÁLISE DETALHADA (primeiros 5 períodos):');
        console.log('   Período | Saving      | Fator Incorreto | VP Incorreto | Fator Correto   | VP Correto   | Diferença');
        console.log('   --------|-------------|-----------------|--------------|-----------------|--------------|----------');
        
        for (let i = 0; i < Math.min(5, dados.length); i++) {
            const saving = parseFloat(dados[i].saving || 0);
            const fatorIncorreto = Math.pow(1 + taxaMensal, i);
            const fatorCorreto = Math.pow(1 + taxaMensal, i + 1);
            const vpIncorreto = saving / fatorIncorreto;
            const vpCorreto = saving / fatorCorreto;
            const diferenca = vpCorreto - vpIncorreto;
            
            console.log(`   ${(i+1).toString().padStart(2, '0').padEnd(7)} | ${saving.toFixed(2).padStart(11)} | ${fatorIncorreto.toFixed(6).padStart(15)} | ${vpIncorreto.toFixed(4).padStart(12)} | ${fatorCorreto.toFixed(6).padStart(15)} | ${vpCorreto.toFixed(4).padStart(12)} | ${diferenca.toFixed(4).padStart(9)}`);
        }
        
        console.log('');
        
        // Verificar qual metodologia está mais próxima do resultado esperado
        if (diferencaCorreto < diferencaIncorreto) {
            console.log('✅ CONCLUSÃO: O VPL corrigido (index + 1) está mais próximo do resultado esperado');
            console.log('   📋 AÇÃO NECESSÁRIA: Atualizar cálculo do VPL no sistema');
            console.log('   📍 ARQUIVO: client/src/components/dados/grafico-ciclo-vida.tsx');
            console.log('   🔧 LINHA: 109 - Alterar "index" para "index + 1"');
        } else {
            console.log('⚠️  AVISO: VPL atual parece estar correto. Investigar outras causas da discrepância.');
        }
        
    } catch (error) {
        console.error('❌ Erro na verificação:', error.message);
    }
}

verificarECorrigirVPL();