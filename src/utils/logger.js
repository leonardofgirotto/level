
const fs = require("fs");
const path = require("path");

// Define o caminho para o arquivo de log na raiz do projeto
const logFilePath = path.join(__dirname, "../../error.log");

// Função para registrar mensagens de erro no arquivo de log
const logError = (errorMessage) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ERRO: ${errorMessage}\n`;

  // Usa appendFile para adicionar ao log sem sobrescrever
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      // Se não conseguir escrever no arquivo de log, exibe no console
      console.error("Falha ao escrever no arquivo de log:", err);
      console.error("Mensagem original do erro:", errorMessage);
    }
  });
};

module.exports = {
  error: logError,
};

