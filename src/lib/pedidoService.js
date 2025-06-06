const Pedido = require('../models/Pedido');
const Produto = require('../models/Produto');
const Usuario = require('../models/Usuario');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

/**
 * Cria um novo pedido
 * @param {object} dadosPedido 
 * @returns {Promise<object>}
 * @throws {Error}
 */
const criarPedido = async (dadosPedido) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Verificar se o usuário existe
    const usuario = await Usuario.findById(dadosPedido.usuario).session(session);
    if (!usuario) {
      throw new Error(`Usuário com ID ${dadosPedido.usuario} não encontrado.`);
    }

    // Verificar e processar os itens
    const itensProcessados = [];
    let valorTotal = 0;

    for (const item of dadosPedido.itens) {
      const produto = await Produto.findById(item.produto).session(session);
      if (!produto) {
        throw new Error(`Produto com ID ${item.produto} não encontrado.`);
      }

      if (produto.quantidade_em_estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para o produto ${produto.nome}.`);
      }

      // Atualizar o estoque
      await Produto.findByIdAndUpdate(
        produto._id,
        { $inc: { quantidade_em_estoque: -item.quantidade } },
        { session }
      );

      const itemProcessado = {
        produto: produto._id,
        quantidade: item.quantidade,
        preco_unitario: produto.preco
      };

      itensProcessados.push(itemProcessado);
      valorTotal += produto.preco * item.quantidade;
    }

    // Criar o pedido com os itens processados
    const novoPedido = new Pedido({
      usuario: dadosPedido.usuario,
      itens: itensProcessados,
      valor_total: valorTotal,
      endereco_entrega: dadosPedido.endereco_entrega || usuario.endereco
    });

    const pedidoSalvo = await novoPedido.save({ session });
    await session.commitTransaction();
    session.endSession();

    console.log(`Pedido ${pedidoSalvo._id} criado com sucesso.`);
    return pedidoSalvo;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    let errorMessage = `Erro ao criar pedido: ${error.message}`;
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((el) => el.message);
      errorMessage = `Erro de validação ao criar pedido: ${errors.join(", ")}`;
    }
    console.error(errorMessage);
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Busca pedidos com base em filtros
 * @param {object} filtro 
 * @returns {Promise<Array<object>>}
 * @throws {Error}
 */
const buscarPedidos = async (filtro = {}) => {
  try {
    const pedidos = await Pedido.find(filtro)
      .populate('usuario', 'nome email')
      .populate('itens.produto', 'nome preco');
    console.log(`${pedidos.length} pedido(s) encontrado(s).`);
    return pedidos;
  } catch (error) {
    const errorMessage = `Erro ao buscar pedidos: ${error.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Busca um pedido pelo ID
 * @param {string} id 
 * @returns {Promise<object|null>}
 * @throws {Error}
 */
const buscarPedidoPorId = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`ID inválido fornecido: ${id}`);
      return null;
    }

    const pedido = await Pedido.findById(id)
      .populate('usuario', 'nome email')
      .populate('itens.produto', 'nome preco');

    if (pedido) {
      console.log(`Pedido ${id} encontrado.`);
    } else {
      console.log(`Pedido com ID ${id} não encontrado.`);
    }
    return pedido;
  } catch (error) {
    const errorMessage = `Erro ao buscar pedido por ID ${id}: ${error.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Atualiza o status de um pedido
 * @param {string} id 
 * @param {string} novoStatus 
 * @returns {Promise<object|null>}
 * @throws {Error}
 */
const atualizarStatusPedido = async (id, novoStatus) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`ID inválido fornecido para atualização de status: ${id}`);
      return null;
    }

    const statusPermitidos = ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'];
    if (!statusPermitidos.includes(novoStatus)) {
      throw new Error(`Status inválido: ${novoStatus}. Use um dos seguintes: ${statusPermitidos.join(', ')}`);
    }

    const pedidoAtualizado = await Pedido.findByIdAndUpdate(
      id,
      { status: novoStatus },
      { new: true, runValidators: true }
    ).populate('usuario', 'nome email').populate('itens.produto', 'nome');

    if (pedidoAtualizado) {
      console.log(`Status do pedido ${id} atualizado para ${novoStatus}.`);
    } else {
      console.log(`Pedido com ID ${id} não encontrado para atualização.`);
    }
    return pedidoAtualizado;
  } catch (error) {
    const errorMessage = `Erro ao atualizar status do pedido: ${error.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Cancela um pedido e devolve os produtos ao estoque
 * @param {string} id 
 * @returns {Promise<object|null>}
 * @throws {Error}
 */
const cancelarPedido = async (id) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`ID inválido fornecido para cancelamento: ${id}`);
      return null;
    }

    const pedido = await Pedido.findById(id).session(session);
    if (!pedido) {
      console.log(`Pedido com ID ${id} não encontrado para cancelamento.`);
      await session.abortTransaction();
      session.endSession();
      return null;
    }

    if (pedido.status === 'cancelado') {
      console.log(`Pedido ${id} já está cancelado.`);
      await session.abortTransaction();
      session.endSession();
      return pedido;
    }

    if (['entregue'].includes(pedido.status)) {
      throw new Error(`Não é possível cancelar um pedido com status ${pedido.status}.`);
    }

    // Devolver produtos ao estoque
    for (const item of pedido.itens) {
      await Produto.findByIdAndUpdate(
        item.produto,
        { $inc: { quantidade_em_estoque: item.quantidade } },
        { session }
      );
    }

    // Atualizar status para cancelado
    pedido.status = 'cancelado';
    await pedido.save({ session });

    await session.commitTransaction();
    session.endSession();

    console.log(`Pedido ${id} cancelado com sucesso.`);
    return pedido;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    const errorMessage = `Erro ao cancelar pedido ${id}: ${error.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

module.exports = {
  criarPedido,
  buscarPedidos,
  buscarPedidoPorId,
  atualizarStatusPedido,
  cancelarPedido
};