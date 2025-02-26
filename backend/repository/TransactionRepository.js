// repository/TransactionRepository.js
class TransactionRepository {
    constructor() {
      this.transactions = [];
    }
    addTransaction(transaction) {
      this.transactions.push(transaction);
    }
    getAll() {
      return this.transactions;
    }
  }
  
  module.exports = TransactionRepository;
  