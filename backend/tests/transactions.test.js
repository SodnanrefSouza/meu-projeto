// tests/transactions.test.js
const request = require('supertest');
const express = require('express');
const createTransactionRoutes = require('../routes/transactions');
const TransactionRepository = require('../repository/TransactionRepository');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
const repository = new TransactionRepository();

// Pré-carrega o repositório com dados de exemplo
repository.addTransaction({ product: 255391, company: 3, is_reversal: false, invoice: "346966", value: 49.30 });
repository.addTransaction({ product: 255391, company: 3, is_reversal: true, invoice: "346966", value: 49.30 });

app.use('/', createTransactionRoutes(repository));
app.use(errorHandler);

describe('GET /transactions', () => {
  it('deve retornar os pares de transações', async () => {
    const res = await request(app).get('/transactions');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBe(1);
    const transactionPair = res.body[0];
    expect(transactionPair).toHaveProperty('invoice');
    expect(transactionPair).toHaveProperty('transacation');
    expect(transactionPair.transacation).toHaveProperty('sale');
    expect(transactionPair.transacation).toHaveProperty('refund');
  });
});
