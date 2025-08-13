// Descobrir schema exato da tabela dados_mensais no Supabase
const SUPABASE_URL = 'https://xjaoydofavoyuxosqaua.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function testarColunas() {
  console.log('🔍 DESCOBRINDO SCHEMA SUPABASE - dados_mensais');
  
  // Teste 1: Inserir registro mínimo para ver erro
  const testData = {
    planejamento_id: 2,
    ano: 2025,
    mes: 1
  };
  
  console.log('\n📋 Testando inserção básica...');
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/dados_mensais`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      console.log('✅ Inserção básica funcionou!');
    } else {
      const errorText = await response.text();
      console.log('❌ Erro inserção básica:', errorText);
    }
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
  
  // Teste 2: SELECT vazio para ver estrutura
  console.log('\n📊 Verificando estrutura via SELECT...');
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/dados_mensais?limit=1`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      }
    });

    const data = await response.json();
    console.log('📋 Resposta Supabase:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ Erro SELECT:', error.message);
  }
  
  // Teste 3: Testar uma única coluna conhecida
  console.log('\n🧪 Testando coluna por coluna...');
  
  const possiveisColunas = [
    'id', 'planejamento_id', 'ano', 'mes', 'periodo', 'data',
    'receita_total', 'despesa_total', 'saldo', 'patrimonio',
    'receitas', 'despesas', 'investimentos'
  ];
  
  for (const coluna of possiveisColunas) {
    const testObj = {
      planejamento_id: 2,
      ano: 2025,
      mes: 1,
      [coluna]: coluna === 'data' ? '2025-01-01' : 100
    };
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/dados_mensais`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(testObj)
      });

      if (response.ok) {
        console.log(`✅ ${coluna} - EXISTE`);
      } else {
        const errorText = await response.text();
        if (errorText.includes('Could not find')) {
          console.log(`❌ ${coluna} - NÃO EXISTE`);
        } else {
          console.log(`⚠️ ${coluna} - ERRO: ${errorText.substring(0, 100)}`);
        }
      }
    } catch (error) {
      console.log(`❌ ${coluna} - ERRO: ${error.message}`);
    }
    
    // Pausa entre testes
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

testarColunas();