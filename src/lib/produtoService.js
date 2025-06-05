
const Produto = require("../models/Produto");
const logger = require("../utils/logger");

/**
 * Insere um novo produto no banco de dados.
 * @param {object} dadosProduto - Os dados do produto a ser inserido.
 * @returns {Promise<object>} O produto criado.
 * @throws {Error} Lança um erro se a validação falhar ou ocorrer um erro no banco de dados.
 */
const inserirProduto = async (dadosProduto) => {
  try {
    const novoProduto = new Produto(dadosProduto);
    // A validação do Mongoose é executada automaticamente no save()
    const produtoSalvo = await novoProduto.save();
    console.log(`Produto "${produtoSalvo.nome}" inserido com sucesso.`);
    return produtoSalvo;
  } catch (error) {
    let errorMessage = `Erro ao inserir produto: ${error.message}`;
    // Verifica se é um erro de validação do Mongoose
    if (error.name === "ValidationError") {
      // Concatena as mensagens de erro de validação
      const errors = Object.values(error.errors).map((el) => el.message);
      errorMessage = `Erro de validação ao inserir produto: ${errors.join(", ")}`;
      console.error(errorMessage);
      // Não loga erros de validação no arquivo, apenas no console, pois são erros de input
    } else {
      // Loga outros erros (ex: erro de conexão com DB)
      console.error(errorMessage);
      logger.error(errorMessage);
    }
    // Relança o erro para ser tratado por quem chamou a função
    throw new Error(errorMessage);
  }
};

/**
 * Busca produtos no banco de dados com base em um filtro.
 * @param {object} filtro - Critérios de busca (ex: { nome: /Notebook/i } para buscar por nome).
 *                         Se vazio, busca todos os produtos.
 * @returns {Promise<Array<object>>} Uma lista de produtos encontrados.
 * @throws {Error} Lança um erro se ocorrer um problema no banco de dados.
 */
const buscarProdutos = async (filtro = {}) => {
  try {
    const produtos = await Produto.find(filtro);
    console.log(`${produtos.length} produto(s) encontrado(s).`);
    return produtos;
  } catch (error) {
    const errorMessage = `Erro ao buscar produtos: ${error.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Busca um produto específico pelo seu ID.
 * @param {string} id - O ID do produto a ser buscado.
 * @returns {Promise<object|null>} O produto encontrado ou null se não existir.
 * @throws {Error} Lança um erro se ocorrer um problema no banco de dados.
 */
const buscarProdutoPorId = async (id) => {
  try {
    // Verifica se o ID é válido antes de buscar (opcional, mas boa prática)
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log(`ID inválido fornecido: ${id}`);
        return null; // Retorna null se o ID não for válido
    }
    const produto = await Produto.findById(id);
    if (produto) {
      console.log(`Produto encontrado: ${produto.nome}`);
    } else {
      console.log(`Produto com ID ${id} não encontrado.`);
    }
    return produto;
  } catch (error) {
    const errorMessage = `Erro ao buscar produto por ID ${id}: ${error.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Deleta um produto do banco de dados pelo seu ID.
 * @param {string} id - O ID do produto a ser deletado.
 * @returns {Promise<object|null>} O resultado da operação de deleção ou null se não encontrado.
 * @throws {Error} Lança um erro se ocorrer um problema no banco de dados.
 */
const deletarProduto = async (id) => {
  try {
    // Verifica se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log(`ID inválido fornecido para deleção: ${id}`);
        return null; 
    }
    const resultado = await Produto.findByIdAndDelete(id);
    if (resultado) {
      console.log(`Produto "${resultado.nome}" (ID: ${id}) deletado com sucesso.`);
    } else {
      console.log(`Produto com ID ${id} não encontrado para deleção.`);
    }
    return resultado;
  } catch (error) {
    const errorMessage = `Erro ao deletar produto com ID ${id}: ${error.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Adiciona a dependência do mongoose que faltou no buscarProdutoPorId e deletarProduto
const mongoose = require("mongoose");

module.exports = {
  inserirProduto,
  buscarProdutos,
  buscarProdutoPorId,
  deletarProduto,
};

