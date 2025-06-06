const http = require('http');
const url = require('url');
const connectDB = require('./config/database');
const mongoose = require('mongoose');

// Porta em que o servidor vai escutar
const PORT = process.env.PORT || 3000;

/**
 * Função para implementar CORS manualmente
 */
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * Cria um servidor HTTP básico sem Express ou outras dependências externas
 */
const server = http.createServer((req, res) => {
  // Configurar CORS manualmente
  setCorsHeaders(res);
  res.setHeader('Content-Type', 'application/json');
  
  // Lidar com requisições OPTIONS (pré-voo CORS)
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  
  // Parse da URL para obter o caminho
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  // Roteamento básico
  if (path === '/' && req.method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: 'API E-commerce funcionando! (sem Express)' }));
  } 
  else if (path === '/health' && req.method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({ 
      status: 'online',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    }));
  }
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  }
});

/**
 * Inicializa o sistema e-commerce
 */
async function inicializarSistema() {
  console.log('Inicializando o sistema e-commerce...');
  
  try {
    // Conectar ao banco de dados
    await connectDB();
    console.log('Conexão com o banco de dados estabelecida!');
    
    // Iniciar o servidor HTTP
    server.listen(PORT, () => {
      console.log(`\n=== Sistema E-commerce Inicializado ===`);
      console.log(`Servidor escutando na porta ${PORT}`);
      console.log(`Acesse http://localhost:${PORT} para testar`);
      console.log('\nPara encerrar o sistema, pressione Ctrl+C');
    });
    
    // Configuração do manipulador para encerrar corretamente
    process.on('SIGINT', async () => {
      console.log('\nEncerrando sistema...');
      server.close();
      await mongoose.disconnect();
      console.log('Conexão com o banco de dados encerrada.');
      process.exit(0);
    });

  } catch (err) {
    console.error('Falha ao inicializar o sistema:', err.message);
    process.exit(1);
  }
}

// Iniciar o sistema quando o arquivo for executado diretamente
inicializarSistema();