
const Produto = require("../models/Produto");
const logger = require("../utils/logger");

const inserirProduto = async (dadosProduto) => {
  try {
    const novoProduto = new Produto(dadosProduto);
    const produtoSalvo = await novoProduto.save();
    console.log(`Produto "${produtoSalvo.nome}" inserido com sucesso.`);
    return produtoSalvo;
  } catch (error) {
    let errorMessage = `Erro ao inserir produto: ${error.message}`;
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((el) => el.message);
      errorMessage = `Erro de validação ao inserir produto: ${errors.join(", ")}`;
      console.error(errorMessage);
    } else {
      console.error(errorMessage);
      logger.error(errorMessage);
    }
    throw new Error(errorMessage);
  }
};

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

const buscarProdutoPorId = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log(`ID inválido fornecido: ${id}`);
        return null;
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

const deletarProduto = async (id) => {
  try {
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

const mongoose = require("mongoose");

module.exports = {
  inserirProduto,
  buscarProdutos,
  buscarProdutoPorId,
  deletarProduto,
};