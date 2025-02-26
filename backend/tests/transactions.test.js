// tests/transactions.test.js
const request = require('supertest');
const express = require('express');
const createTransactionRoutes = require('../routes/transactions');
const TransactionRepository = require('../repository/TransactionRepository');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
const repository = new TransactionRepository();

// Pré-carrega o repositório com os dados do CSV antes de executar os testes
beforeAll(async () => {
  const CSVLoader = require('../services/CSVLoader');
  const csvLoader = new CSVLoader('vendas_e_devoluções.csv', repository);
  
  // Aguarda o carregamento completo do CSV
  await csvLoader.load();
  app.use('/', createTransactionRoutes(repository));
  app.use(errorHandler);
});

describe('GET /transactions', () => {
  it('deve retornar os pares de transações', async () => {
    const res = await request(app).get('/transactions');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0); // Verifique se há pelo menos uma transação
    const transactionPair = res.body[0];
    expect(transactionPair).toHaveProperty('invoice');
    expect(transactionPair).toHaveProperty('transacation');
    expect(transactionPair.transacation).toHaveProperty('sale');
    expect(transactionPair.transacation).toHaveProperty('refund');
  });
});
