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

      // Agrupa as transações pelo campo "invoice"
      const grouped = transactions.reduce((acc, t) => {
        if (!acc[t.invoice]) acc[t.invoice] = [];
        acc[t.invoice].push(t);
        return acc;
      }, {});

      // Para cada grupo, busca a venda e a devolução e forma o par
      const result = [];
      for (const invoice in grouped) {
        const group = grouped[invoice];
        const sale = group.find(t => t.is_reversal === false);
        const refund = group.find(t => t.is_reversal === true);
        if (sale && refund) {
          result.push({
            invoice,
            transacation: { // conforme solicitado (observe a grafia)
              sale,
              refund
            }
          });
        }
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  });
  return router;
}

module.exports = createTransactionRoutes;
