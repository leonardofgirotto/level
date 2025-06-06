const connectDB = require("../src/config/database");
const { 
  cadastrarUsuario, 
  buscarUsuarios, 
  buscarUsuarioPorId 
} = require("../src/lib/usuarioService");
const { 
  criarPedido, 
  buscarPedidos, 
  atualizarStatusPedido, 
  cancelarPedido 
} = require("../src/lib/pedidoService");
const { 
  inserirProduto, 
  buscarProdutos 
} = require("../src/lib/produtoService");
const mongoose = require("mongoose");

const runExamples = async () => {
  console.log("Iniciando exemplos de uso dos novos modelos...");
  
  await connectDB();
  
  let usuarioId = null;
  let produtoIds = [];
  let pedidoId = null;

  // 1. Cadastrar um usuário
  console.log("\n--- Cadastrando um usuário ---");
  try {
    const dadosUsuario = {
      nome: "Maria Silva",
      email: "maria@exemplo.com",
      senha: "senha123",
      endereco: {
        rua: "Rua das Flores",
        numero: "123",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567"
      },
      telefone: "(11) 98765-4321"
    };
    
    const usuario = await cadastrarUsuario(dadosUsuario);
    usuarioId = usuario._id;
    console.log("Usuário cadastrado:", usuario);
  } catch (error) {
    console.error("Falha ao cadastrar usuário:", error.message);
  }

  // 2. Cadastrar produtos para o pedido
  console.log("\n--- Cadastrando produtos ---");
  try {
    const produtos = [
      {
        nome: "Smartphone XYZ",
        descricao: "Smartphone de última geração",
        preco: 1999.99,
        quantidade_em_estoque: 50,
        categoria: "Eletrônicos"
      },
      {
        nome: "Fone de Ouvido Sem Fio",
        descricao: "Fone bluetooth com cancelamento de ruído",
        preco: 299.90,
        quantidade_em_estoque: 100,
        categoria: "Acessórios"
      }
    ];

    for (const prod of produtos) {
      const produto = await inserirProduto(prod);
      produtoIds.push(produto._id);
      console.log("Produto cadastrado:", produto);
    }
  } catch (error) {
    console.error("Falha ao cadastrar produtos:", error.message);
  }

  // 3. Criar um pedido
  console.log("\n--- Criando um pedido ---");
  if (usuarioId && produtoIds.length >= 2) {
    try {
      const dadosPedido = {
        usuario: usuarioId,
        itens: [
          {
            produto: produtoIds[0],
            quantidade: 1
          },
          {
            produto: produtoIds[1],
            quantidade: 2
          }
        ]
      };
      
      const pedido = await criarPedido(dadosPedido);
      pedidoId = pedido._id;
      console.log("Pedido criado:", pedido);
    } catch (error) {
      console.error("Falha ao criar pedido:", error.message);
    }
  }

  // 4. Buscar pedidos do usuário
  if (usuarioId) {
    console.log("\n--- Buscando pedidos do usuário ---");
    try {
      const pedidos = await buscarPedidos({ usuario: usuarioId });
      console.log("Pedidos do usuário:", pedidos);
    } catch (error) {
      console.error("Falha ao buscar pedidos:", error.message);
    }
  }

  // 5. Atualizar status do pedido
  if (pedidoId) {
    console.log("\n--- Atualizando status do pedido ---");
    try {
      const pedidoAtualizado = await atualizarStatusPedido(pedidoId, "confirmado");
      console.log("Pedido após confirmação:", pedidoAtualizado);
    } catch (error) {
      console.error("Falha ao atualizar status do pedido:", error.message);
    }
  }

  // 6. Cancelar pedido
  if (pedidoId) {
    console.log("\n--- Cancelando pedido ---");
    try {
      const pedidoCancelado = await cancelarPedido(pedidoId);
      console.log("Pedido cancelado:", pedidoCancelado);
      
      // Verificar se os produtos voltaram ao estoque
      console.log("\n--- Verificando estoque após cancelamento ---");
      const produtos = await buscarProdutos({ _id: { $in: produtoIds } });
      console.log("Produtos após cancelamento:", produtos);
    } catch (error) {
      console.error("Falha ao cancelar pedido:", error.message);
    }
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