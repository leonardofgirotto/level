const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Substitua pela sua string de conexão do MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_lib_dev';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB conectado com sucesso.');
  } catch (err) {
    const errorMessage = `Erro ao conectar ao MongoDB: ${err.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    // Encerra o processo com falha se não conseguir conectar ao DB
    process.exit(1);
  }
};

module.exports = connectDB;

