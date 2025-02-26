// models/Transaction.js
class Transaction {
    constructor(product, company, isReversal, invoice, value) {
      this.product = product;
      this.company = company;
      this.is_reversal = isReversal;
      this.invoice = invoice;
      this.value = value;
    }
  }
  
  module.exports = Transaction;
  