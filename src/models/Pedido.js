const mongoose = require('mongoose');

const itemPedidoSchema = new mongoose.Schema({
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produto',
    required: [true, 'O ID do produto é obrigatório.']
  },
  quantidade: {
    type: Number,
    required: [true, 'A quantidade é obrigatória.'],
    min: [1, 'A quantidade mínima é 1.']
  },
  preco_unitario: {
    type: Number,
    required: [true, 'O preço unitário é obrigatório.'],
    min: [0.01, 'O preço deve ser um valor positivo.']
  }
});

const pedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'O ID do usuário é obrigatório.']
  },
  itens: {
    type: [itemPedidoSchema],
    required: [true, 'O pedido deve conter pelo menos um item.'],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'O pedido deve ter pelo menos um item.'
    }
  },
  valor_total: {
    type: Number,
    required: true,
    min: [0.01, 'O valor total deve ser maior que zero.']
  },
  status: {
    type: String,
    enum: ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'],
    default: 'pendente'
  },
  endereco_entrega: {
    rua: String,
    numero: String,
    complemento: String,
    cidade: String,
    estado: String,
    cep: String
  }
}, { timestamps: true });

// Calcular valor total antes de salvar
pedidoSchema.pre('validate', function(next) {
  if (this.itens && Array.isArray(this.itens)) {
    this.valor_total = this.itens.reduce((total, item) => {
      return total + (item.quantidade * item.preco_unitario);
    }, 0);
  }
  next();
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;