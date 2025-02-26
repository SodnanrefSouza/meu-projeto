// index.js
const express = require('express');
const cors = require('cors');
const TransactionRepository = require('./repository/TransactionRepository');
const CSVLoader = require('./services/CSVLoader');
const createTransactionRoutes = require('./routes/transactions');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Instancia do repositório e carregamento do CSV
const transactionRepository = new TransactionRepository();
const csvLoader = new CSVLoader('vendas_e_devoluções.csv', transactionRepository);

csvLoader.load()
  .then(() => {
    // Configura as rotas utilizando o repositório com os dados carregados
    app.use('/', createTransactionRoutes(transactionRepository));

    // Middleware de tratamento de erros (sempre após as rotas)
    app.use(errorHandler);

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao carregar o CSV:', err);
  });
