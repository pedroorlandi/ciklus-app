import { Router } from 'express';
import { db } from '../db';
import { 
  planejamentos, 
  membrosFamily, 
  dadosMensais, 
  objetivos,
  imoveis,
  receitas,
  despesas,
  portfolioInvestimentos
} from '../../shared/schema';
import { sql } from 'drizzle-orm';

const router = Router();

// Estatísticas gerais do banco
router.get('/database-stats', async (req, res) => {
  try {
    const [
      totalPlanejamentos,
      totalMembros,
      totalDadosMensais,
      totalObjetivos,
      totalImoveis,
      totalReceitas,
      totalDespesas,
      totalInvestimentos
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(planejamentos),
      db.select({ count: sql<number>`count(*)` }).from(membrosFamily),
      db.select({ count: sql<number>`count(*)` }).from(dadosMensais),
      db.select({ count: sql<number>`count(*)` }).from(objetivos),
      db.select({ count: sql<number>`count(*)` }).from(imoveis),
      db.select({ count: sql<number>`count(*)` }).from(receitas),
      db.select({ count: sql<number>`count(*)` }).from(despesas),
      db.select({ count: sql<number>`count(*)` }).from(portfolioInvestimentos)
    ]);

    res.json({
      totalPlanejamentos: totalPlanejamentos[0]?.count || 0,
      totalMembros: totalMembros[0]?.count || 0,
      totalDadosMensais: totalDadosMensais[0]?.count || 0,
      totalObjetivos: totalObjetivos[0]?.count || 0,
      totalImoveis: totalImoveis[0]?.count || 0,
      totalReceitas: totalReceitas[0]?.count || 0,
      totalDespesas: totalDespesas[0]?.count || 0,
      totalInvestimentos: totalInvestimentos[0]?.count || 0
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Informações das tabelas
router.get('/tables-info', async (req, res) => {
  try {
    const tableNames = [
      'planejamentos',
      'membros_family', 
      'dados_mensais',
      'objetivos',
      'imoveis',
      'receitas',
      'despesas',
      'investimentos',
      'indices_economicos'
    ];

    const tablesInfo = await Promise.all(
      tableNames.map(async (tableName) => {
        try {
          const countResult = await db.execute(
            sql.raw(`SELECT COUNT(*) as count FROM ${tableName}`)
          );
          
          const sizeResult = await db.execute(
            sql.raw(`
              SELECT 
                pg_size_pretty(pg_total_relation_size('${tableName}')) as size,
                pg_stat_get_last_autoanalyze_time(c.oid) as last_updated
              FROM pg_class c 
              WHERE c.relname = '${tableName}'
            `)
          );

          const count = countResult.rows[0]?.count || 0;
          const size = sizeResult.rows[0]?.size || 'N/A';
          const lastUpdated = sizeResult.rows[0]?.last_updated 
            ? new Date(String(sizeResult.rows[0].last_updated)).toLocaleDateString('pt-BR')
            : 'N/A';

          return {
            tableName,
            recordCount: parseInt(String(count)),
            size: String(size),
            lastUpdated
          };
        } catch (error) {
          console.error(`Erro ao obter info da tabela ${tableName}:`, error);
          return {
            tableName,
            recordCount: 0,
            size: 'N/A',
            lastUpdated: 'N/A'
          };
        }
      })
    );

    res.json(tablesInfo);
  } catch (error) {
    console.error('Erro ao buscar informações das tabelas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Dados de uma tabela específica
router.get('/table-data/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    
    // Lista de tabelas permitidas para segurança
    const allowedTables = [
      'planejamentos',
      'membros_family',
      'dados_mensais',
      'objetivos',
      'imoveis',
      'receitas',
      'despesas',
      'investimentos',
      'indices_economicos'
    ];

    if (!allowedTables.includes(tableName)) {
      return res.status(400).json({ error: 'Tabela não permitida' });
    }

    const result = await db.execute(
      sql.raw(`SELECT * FROM ${tableName} ORDER BY id DESC LIMIT 100`)
    );

    res.json(result.rows);
  } catch (error) {
    console.error(`Erro ao buscar dados da tabela ${req.params.tableName}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Exportar dados de uma tabela em CSV
router.get('/export/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    
    const allowedTables = [
      'planejamentos',
      'membros_family',
      'dados_mensais',
      'objetivos',
      'imoveis',
      'receitas',
      'despesas',
      'investimentos',
      'indices_economicos'
    ];

    if (!allowedTables.includes(tableName)) {
      return res.status(400).json({ error: 'Tabela não permitida' });
    }

    const result = await db.execute(sql.raw(`SELECT * FROM ${tableName}`));
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nenhum dado encontrado' });
    }

    // Gerar CSV
    const headers = Object.keys(result.rows[0]);
    const csvContent = [
      headers.join(','),
      ...result.rows.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escapar valores que contêm vírgulas ou aspas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? '';
        }).join(',')
      )
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${tableName}_export.csv"`);
    res.send(csvContent);
  } catch (error) {
    console.error(`Erro ao exportar tabela ${req.params.tableName}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Exportar backup completo do banco em SQL
router.get('/export/full-database', async (req, res) => {
  try {
    const tableNames = [
      'planejamentos',
      'membros_family',
      'dados_mensais',
      'objetivos',
      'imoveis',
      'receitas',
      'despesas',
      'investimentos',
      'indices_economicos'
    ];

    let sqlDump = `-- Backup completo CIKLUS Database\n-- Gerado em: ${new Date().toISOString()}\n\n`;

    for (const tableName of tableNames) {
      try {
        const result = await db.execute(sql.raw(`SELECT * FROM ${tableName}`));
        
        if (result.rows.length > 0) {
          sqlDump += `-- Dados da tabela: ${tableName}\n`;
          
          const headers = Object.keys(result.rows[0]);
          
          for (const row of result.rows) {
            const values = headers.map(header => {
              const value = row[header];
              if (value === null || value === undefined) return 'NULL';
              if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
              if (value instanceof Date) return `'${value.toISOString()}'`;
              return value;
            }).join(', ');
            
            sqlDump += `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${values});\n`;
          }
          
          sqlDump += '\n';
        }
      } catch (error) {
        console.error(`Erro ao exportar tabela ${tableName}:`, error);
        sqlDump += `-- Erro ao exportar tabela ${tableName}: ${error}\n\n`;
      }
    }

    res.setHeader('Content-Type', 'application/sql');
    res.setHeader('Content-Disposition', `attachment; filename="ciklus_backup_${new Date().toISOString().split('T')[0]}.sql"`);
    res.send(sqlDump);
  } catch (error) {
    console.error('Erro ao gerar backup completo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;