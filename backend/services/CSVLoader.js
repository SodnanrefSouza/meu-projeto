// services/CSVLoader.js
const fs = require('fs');
const csv = require('csv-parser');
const Transaction = require('../models/Transaction');

class CSVLoader {
  constructor(filePath, repository) {
    this.filePath = filePath;
    this.repository = repository;
  }

  load() {
    return new Promise((resolve, reject) => {
      fs.createReadStream(this.filePath)
        .pipe(csv({ separator: ',' }))
        .on('data', (row) => {
          try {
            // Mapeamento dos campos conforme o CSV:
            // cd_produto,tp_valor,cd_empresa,round,nr_dctoorigem,nr_sequencia,cd_valor,cd_historico,in_estorno,dt_movimento,dt_cadastro
            const transaction = new Transaction(
              parseInt(row.cd_produto, 10),
              parseInt(row.cd_empresa, 10),
              row.in_estorno === 'T', // 'T' indica devolução
              row.nr_dctoorigem,
              parseFloat(row.round)
            );
            this.repository.addTransaction(transaction);
          } catch (error) {
            // Loga o erro e continua processando as demais linhas
            console.error("Erro ao processar linha do CSV:", row, error);
          }
        })
        .on('end', () => {
          console.log('CSV carregado com sucesso.');
          resolve();
        })
        .on('error', (err) => reject(err));
    });
  }
}

module.exports = CSVLoader;
