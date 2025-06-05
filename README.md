# Biblioteca E-commerce - Projeto 1 (Programação Web Back-End)

## Descrição

Este projeto consiste no desenvolvimento de uma biblioteca de classes em Node.js para interagir com um banco de dados MongoDB, focada na temática de **E-commerce**. A biblioteca implementa funcionalidades básicas de um sistema de gerenciamento de produtos, incluindo:

*   **Cadastro (Inserção):** Adicionar novos produtos ao catálogo.
*   **Consulta (Busca):** Localizar produtos por diversos critérios (todos, ID, nome, etc.).
*   **Remoção (Deleção):** Excluir produtos do catálogo.

O projeto segue as diretrizes da disciplina de Programação Web Back-End, com ênfase em:

*   Implementação dos casos de uso da temática selecionada (E-commerce: Produtos).
*   Verificação do preenchimento de campos obrigatórios (validação de dados).
*   Tratamento de exceções lançadas pelas bibliotecas (ex: Mongoose, MongoDB Driver).
*   Armazenamento de arquivos de log (`error.log`) com as exceções capturadas.

## Tecnologias Utilizadas

*   **Node.js:** Ambiente de execução JavaScript no servidor.
*   **MongoDB:** Banco de dados NoSQL orientado a documentos.
*   **Mongoose:** Biblioteca ODM (Object Data Modeling) para MongoDB e Node.js, facilitando a interação com o banco, definição de schemas e validações.

## Estrutura do Projeto

```
level/
├── src/                     # Código fonte da biblioteca
│   ├── models/              # Modelos Mongoose (Schema do Produto)
│   │   └── Produto.js
│   ├── lib/                 # Lógica principal (Serviços CRUD)
│   │   └── produtoService.js
│   ├── utils/               # Utilitários (Logger)
│   │   └── logger.js
│   └── config/              # Configuração (Conexão com DB)
│       └── database.js
├── examples/                # Exemplos de uso
│   └── usage.js
├── package.json             # Metadados e dependências do Node.js
├── README.md                # Esta documentação

```
