import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/transactions")
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados recebidos da API:", data); // Log para depuração
        setTransactions(data);
      })
      .catch((error) => console.error("Erro ao buscar transações:", error));
  }, []);

  return (
    <div className="App">
      <h1>Transações</h1>
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
          {transactions.length > 0 ? (
            transactions.map((item, index) => (
              <React.Fragment key={index}>
                {/* Venda */}
                {item.transacation.sale && (
                  <tr>
                    <td>{item.invoice}</td>
                    <td>{item.transacation.sale.product}</td>
                    <td>{item.transacation.sale.company}</td>
                    <td>Venda</td>
                    <td>{item.transacation.sale.value.toFixed(2)}</td>
                  </tr>
                )}
                {/* Reembolso */}
                {item.transacation.refund && (
                  <tr>
                    <td>{item.invoice}</td>
                    <td>{item.transacation.refund.product}</td>
                    <td>{item.transacation.refund.company}</td>
                    <td>Reembolso</td>
                    <td>{item.transacation.refund.value.toFixed(2)}</td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="5">Nenhuma transação encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Descrição da tabela.</h3>
      <p><strong>Venda:</strong> Transação de venda realizada.</p>
      <p><strong>Reembolso:</strong> Transação de devolução da venda.</p>
    </div>
  );
}

export default App;
