import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Número de linhas por página

  useEffect(() => {
    fetch("http://localhost:3000/transactions")
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados recebidos da API:", data);
        
        const allTransactions = [];
        
        data.forEach((item) => {
          // Adicionar todas as transações de venda
          if (item.transaction.sale) {
            item.transaction.sale.forEach((sale) => {
              allTransactions.push({
                invoice: item.invoice,
                product: sale.product,
                company: sale.company,
                type: "Venda",
                value: sale.value,
              });
            });
          }
          
          // Adicionar todas as transações de reembolso
          if (item.transaction.refund) {
            item.transaction.refund.forEach((refund) => {
              allTransactions.push({
                invoice: item.invoice,
                product: refund.product,
                company: refund.company,
                type: "Reembolso",
                value: refund.value,
              });
            });
          }
        });

        setTransactions(allTransactions);
      })
      .catch((error) => console.error("Erro ao buscar transações:", error));
  }, []);

  // Páginação
  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="App">
      <h1>Transações</h1>

      {/* Descrição da tabela */}
      <h3>Descrição da tabela.</h3>
      <p><strong>Venda:</strong> Transação de venda realizada.</p>
      <p><strong>Reembolso:</strong> Transação de devolução da venda.</p>

      <div className="table-container">
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Nota Fiscal</th>
              <th>Produto</th>
              <th>Empresa</th>
              <th>Tipo</th>
              <th>Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length > 0 ? (
              currentTransactions.map((item, index) => (
                <tr key={index}>
                  <td>{item.invoice}</td>
                  <td>{item.product}</td>
                  <td>{item.company}</td>
                  <td>{item.type}</td>
                  <td>{item.value && !isNaN(item.value) ? item.value.toFixed(2) : 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Nenhuma transação encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Páginação */}
      <div className="pagination">
        <button onClick={() => paginate(1)} disabled={currentPage === 1}>
          Primeira
        </button>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
          Próxima
        </button>
        <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>
          Última
        </button>
      </div>
    </div>
  );
}

export default App;
