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
      let rowCount = 0; // Variável para contar as linhas processadas
  
      fs.createReadStream(this.filePath)
        .pipe(csv({ separator: ',' }))
        .on('data', (row) => {
          try {
            rowCount++; // Incrementa o contador a cada linha processada
            //console.log(`Linha ${rowCount}:`, row); // Log da linha atual
  
            const transaction = new Transaction(
              parseInt(row.cd_produto, 10),
              parseInt(row.cd_empresa, 10),
              row.in_estorno === 'T', // 'T' indica devolução
              row.nr_dctoorigem,
              parseFloat(row.round)
            );
            this.repository.addTransaction(transaction);
          } catch (error) {
            console.error("Erro ao processar linha do CSV:", row, error);
          }
        })
        .on('end', () => {
          console.log(`CSV carregado com sucesso. Total de linhas processadas: ${rowCount}`);
          resolve();
        })
        .on('error', (err) => reject(err));
    });
  }  
}

module.exports = CSVLoader;
