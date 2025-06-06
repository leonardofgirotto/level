const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome do usuário é obrigatório.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'O email é obrigatório.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor, informe um email válido.']
  },
  senha: {
    type: String,
    required: [true, 'A senha é obrigatória.'],
    minlength: [6, 'A senha deve ter no mínimo 6 caracteres.']
  },
  endereco: {
    rua: String,
    numero: String,
    complemento: String,
    cidade: String,
    estado: String,
    cep: String
  },
  telefone: {
    type: String,
    trim: true
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;