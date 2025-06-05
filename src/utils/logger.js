
const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../../error.log");

const logError = (errorMessage) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ERRO: ${errorMessage}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Falha ao escrever no arquivo de log:", err);
      console.error("Mensagem original do erro:", errorMessage);
    }
  });
};

module.exports = {
  error: logError,
};

