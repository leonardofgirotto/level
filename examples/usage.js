
const connectDB = require("../src/config/database");
const {
  inserirProduto,
  buscarProdutos,
  buscarProdutoPorId,
  deletarProduto,
} = require("../src/lib/produtoService");
const mongoose = require("mongoose");

const runExamples = async () => {
  console.log("Iniciando exemplos de uso da biblioteca ecommerce-lib...");

  await connectDB();

  let produtoInseridoId = null;

  console.log("\n--- Exemplo: Inserindo um Produto Válido ---");
  try {
    const novoProduto = {
      nome: "Notebook Gamer Pro",
      descricao: "Notebook de alta performance para jogos e trabalho",
      preco: 7500.99,
      quantidade_em_estoque: 15,
      categoria: "Eletrônicos",
    };
    const produtoSalvo = await inserirProduto(novoProduto);
    produtoInseridoId = produtoSalvo._id; 
    console.log("Produto inserido:", produtoSalvo);
  } catch (error) {
    console.error("Falha ao inserir produto válido:", error.message);
  }

  console.log("\n--- Exemplo: Tentando Inserir Produto Inválido (sem nome) ---");
  try {
    const produtoInvalido = {
      descricao: "Este produto não tem nome",
      preco: 10.0,
      quantidade_em_estoque: 5,
    };
    await inserirProduto(produtoInvalido);
  } catch (error) {
    console.log("Erro esperado ao inserir produto inválido:", error.message);
  }

  console.log("\n--- Exemplo: Tentando Inserir Produto Inválido (preço negativo) ---");
  try {
    const produtoPrecoInvalido = {
        nome: "Produto Preço Ruim",
        descricao: "Preço negativo não é permitido",
        preco: -50.00,
        quantidade_em_estoque: 10
    };
    await inserirProduto(produtoPrecoInvalido);
  } catch (error) {
    console.log("Erro esperado ao inserir produto com preço inválido:", error.message);
  }

  console.log("\n--- Exemplo: Buscando Todos os Produtos ---");
  try {
    const todosProdutos = await buscarProdutos();
    console.log("Produtos encontrados:", todosProdutos);
  } catch (error) {
    console.error("Falha ao buscar todos os produtos:", error.message);
  }

  console.log("\n--- Exemplo: Buscando Produtos por Nome (Regex) ---");
  try {
    const produtosNotebook = await buscarProdutos({ nome: /Notebook/i });
    console.log("Notebooks encontrados:", produtosNotebook);
  } catch (error) {
    console.error("Falha ao buscar notebooks:", error.message);
  }

  if (produtoInseridoId) {
    console.log(`\n--- Exemplo: Buscando Produto por ID (${produtoInseridoId}) ---`);
    try {
      const produtoPorId = await buscarProdutoPorId(produtoInseridoId);
      if (produtoPorId) {
        console.log("Produto encontrado pelo ID:", produtoPorId);
      } else {
        console.log("Produto não encontrado pelo ID (inesperado).");
      }
    } catch (error) {
      console.error("Falha ao buscar produto por ID:", error.message);
    }
  }

  console.log("\n--- Exemplo: Buscando Produto por ID Inválido ---");
  try {
    const idInvalido = "id_nao_existente_ou_invalido";
    const produtoNaoEncontrado = await buscarProdutoPorId(idInvalido);
    if (!produtoNaoEncontrado) {
        console.log(`Produto com ID inválido "${idInvalido}" não encontrado (esperado).`);
    }
  } catch (error) {
    console.error("Falha ao buscar produto por ID inválido:", error.message);
  }

  if (produtoInseridoId) {
    console.log(`\n--- Exemplo: Deletando Produto por ID (${produtoInseridoId}) ---`);
    try {
      const resultadoDelecao = await deletarProduto(produtoInseridoId);
      if (resultadoDelecao) {
        console.log("Resultado da deleção:", resultadoDelecao);
        const produtoAposDelecao = await buscarProdutoPorId(produtoInseridoId);
        if (!produtoAposDelecao) {
          console.log("Confirmação: Produto deletado com sucesso.");
        }
      } else {
        console.log("Produto não encontrado para deleção (inesperado).");
      }
    } catch (error) {
      console.error("Falha ao deletar produto:", error.message);
    }
  }

  console.log("\n--- Exemplo: Tentando Deletar Produto com ID Inválido ---");
  try {
    const idInvalidoDel = "id_nao_existe_mesmo";
    const resultadoDelInvalido = await deletarProduto(idInvalidoDel);
     if (!resultadoDelInvalido) {
        console.log(`Produto com ID inválido "${idInvalidoDel}" não encontrado para deleção (esperado).`);
    }
  } catch (error) {
     console.error("Falha ao tentar deletar produto com ID inválido:", error.message);
  }

  console.log("\nExemplos concluídos.");

  try {
    await mongoose.disconnect();
    console.log("Desconectado do MongoDB.");
  } catch (error) {
    console.error("Erro ao desconectar do MongoDB:", error.message);
  }
};

runExamples();

