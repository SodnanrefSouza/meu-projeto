// routes/transactions.js
const express = require('express');
const router = express.Router();

/**
 * Cria as rotas para transações, utilizando o repositório passado como parâmetro.
 */
function createTransactionRoutes(repository) {
  router.get('/transactions', (req, res, next) => {
    try {
      const transactions = repository.getAll();
      //console.log('Transações carregadas:', transactions);

      // Agrupa as transações pelo campo "invoice"
      const grouped = transactions.reduce((acc, t) => {
        if (!acc[t.invoice]) acc[t.invoice] = [];
        acc[t.invoice].push(t);
        return acc;
      }, {});

      //console.log('Transações agrupadas:', grouped);

      // Para cada grupo, busca as vendas e devoluções
      const result = [];
      for (const invoice in grouped) {
        const group = grouped[invoice];
        //console.log(`Grupo para o invoice ${invoice}:`, group);

        // Filtra todas as transações de venda (não estornadas) e devolução (estornadas)
        const sales = group.filter(t => t.is_reversal === false);
        const refunds = group.filter(t => t.is_reversal === true);

        //console.log(`Vendas para o invoice ${invoice}:`, sales);
        //console.log(`Devoluções para o invoice ${invoice}:`, refunds);

        // Agora, vamos sempre adicionar as transações, mesmo que não haja par completo
        result.push({
          invoice,
          transaction: { 
            sale: sales,  // Todas as transações de venda
            refund: refunds  // Todas as transações de devolução
          }
        });

        if (sales.length === 0 || refunds.length === 0) {
          //console.log(`Par de transações faltando para o invoice ${invoice}`);
        }
      }

      //console.log('Resultado final:', result);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });
  return router;
}

module.exports = createTransactionRoutes;
