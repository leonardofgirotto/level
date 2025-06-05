const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome do produto é obrigatório.'],
    trim: true
  },
  descricao: {
    type: String,
    trim: true
  },
  preco: {
    type: Number,
    required: [true, 'O preço do produto é obrigatório.'],
    min: [0.01, 'O preço deve ser um valor positivo.']
  },
  quantidade_em_estoque: {
    type: Number,
    required: [true, 'A quantidade em estoque é obrigatória.'],
    min: [0, 'A quantidade em estoque não pode ser negativa.'],
    validate: {
      validator: Number.isInteger,
      message: 'A quantidade em estoque deve ser um número inteiro.'
    }
  },
  categoria: {
    type: String,
    trim: true
  }
}, { timestamps: true }); 

const Produto = mongoose.model('Produto', produtoSchema);

module.exports = Produto;
