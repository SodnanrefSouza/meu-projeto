# Projeto: Vendas e Devoluções

Este projeto consiste em:

- **Backend:** Uma API RESTful em Node.js/Express que:
  - Lê os dados do arquivo CSV `vendas_e_devoluções.csv`.
  - Armazena os dados em memória.
  - Agrupa as transações de venda e devolução com base no campo `nr_dctoorigem`.
  - Disponibiliza o endpoint GET `/transactions`.
  - Utiliza modularização, tratamento centralizado de erros e testes de integração (Jest e Supertest).

- **Frontend:** Uma aplicação React que consome a API e exibe os dados em uma tabela.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- npm (geralmente instalado com o Node.js)
- [Visual Studio Code](https://code.visualstudio.com/)


