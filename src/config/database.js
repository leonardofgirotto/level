
const mongoose = require('mongoose');
const logger = require('../utils/logger'); // Assumindo que o logger estará em utils

// Substitua pela sua string de conexão do MongoDB
// Exemplo: 'mongodb://localhost:27017/ecommerce_db'
// Para desenvolvimento local, você pode usar o MongoDB Community Server ou um serviço como MongoDB Atlas.
// É importante NÃO colocar a string de conexão diretamente no código em produção.
// Use variáveis de ambiente.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      // Opções do Mongoose para evitar warnings de depreciação (podem variar com a versão)
      // useNewUrlParser: true, // Não mais necessário a partir do Mongoose 6
      // useUnifiedTopology: true, // Não mais necessário a partir do Mongoose 6
      // useCreateIndex: true, // Não suportado
      // useFindAndModify: false // Não suportado
    });
    console.log('MongoDB conectado com sucesso.');
  } catch (err) {
    const errorMessage = `Erro ao conectar ao MongoDB: ${err.message}`;
    console.error(errorMessage);
    logger.error(errorMessage); // Loga o erro
    // Encerra o processo com falha se não conseguir conectar ao DB
    process.exit(1);
  }
};

module.exports = connectDB;

