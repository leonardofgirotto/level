const Usuario = require('../models/Usuario');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

/**
 * Cadastra um novo usuário no sistema
 * @param {object} dadosUsuario 
 * @returns {Promise<object>}
 * @throws {Error}
 */
const cadastrarUsuario = async (dadosUsuario) => {
  try {
    const novoUsuario = new Usuario(dadosUsuario);
    const usuarioSalvo = await novoUsuario.save();
    console.log(`Usuário ${usuarioSalvo.nome} cadastrado com sucesso.`);
    return usuarioSalvo;
  } catch (error) {
    let errorMessage = `Erro ao cadastrar usuário: ${error.message}`;
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((el) => el.message);
      errorMessage = `Erro de validação ao cadastrar usuário: ${errors.join(", ")}`;
    } else if (error.code === 11000) {
      errorMessage = `Erro ao cadastrar usuário: Email já cadastrado no sistema.`;
    }
    console.error(errorMessage);
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Busca usuários com base em filtros
 * @param {object} filtro 
 * @returns {Promise<Array<object>>}
 * @throws {Error}
 */
const buscarUsuarios = async (filtro = {}) => {
  try {
    const usuarios = await Usuario.find(filtro, { senha: 0 }); // Exclui a senha dos resultados
    console.log(`${usuarios.length} usuário(s) encontrado(s).`);
    return usuarios;
  } catch (error) {
    const errorMessage = `Erro ao buscar usuários: ${error.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Busca um usuário pelo ID
 * @param {string} id 
 * @returns {Promise<object|null>}
 * @throws {Error}
 */
const buscarUsuarioPorId = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`ID inválido fornecido: ${id}`);
      return null;
    }
    const usuario = await Usuario.findById(id, { senha: 0 }); // Exclui a senha do resultado
    if (usuario) {
      console.log(`Usuário encontrado: ${usuario.nome}`);
    } else {
      console.log(`Usuário com ID ${id} não encontrado.`);
    }
    return usuario;
  } catch (error) {
    const errorMessage = `Erro ao buscar usuário por ID ${id}: ${error.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Atualiza os dados de um usuário
 * @param {string} id 
 * @param {object} dadosAtualizacao 
 * @returns {Promise<object|null>}
 * @throws {Error}
 */
const atualizarUsuario = async (id, dadosAtualizacao) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`ID inválido fornecido para atualização: ${id}`);
      return null;
    }
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      id,
      dadosAtualizacao,
      { new: true, runValidators: true }
    );
    if (usuarioAtualizado) {
      console.log(`Usuário ${usuarioAtualizado.nome} atualizado com sucesso.`);
    } else {
      console.log(`Usuário com ID ${id} não encontrado para atualização.`);
    }
    return usuarioAtualizado;
  } catch (error) {
    let errorMessage = `Erro ao atualizar usuário: ${error.message}`;
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((el) => el.message);
      errorMessage = `Erro de validação ao atualizar usuário: ${errors.join(", ")}`;
    }
    console.error(errorMessage);
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Remove um usuário do sistema (soft delete)
 * @param {string} id 
 * @returns {Promise<object|null>}
 * @throws {Error}
 */
const removerUsuario = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`ID inválido fornecido para remoção: ${id}`);
      return null;
    }
    // Implementa soft delete alterando o status para inativo
    const usuarioInativado = await Usuario.findByIdAndUpdate(
      id,
      { ativo: false },
      { new: true }
    );
    if (usuarioInativado) {
      console.log(`Usuário ${usuarioInativado.nome} inativado com sucesso.`);
    } else {
      console.log(`Usuário com ID ${id} não encontrado para inativação.`);
    }
    return usuarioInativado;
  } catch (error) {
    const errorMessage = `Erro ao remover usuário com ID ${id}: ${error.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

module.exports = {
  cadastrarUsuario,
  buscarUsuarios,
  buscarUsuarioPorId,
  atualizarUsuario,
  removerUsuario
};