import app from './app.js';
import { testConnection } from './src/config/database.js';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

// Verificar e exibir configurações de ambiente
console.log('===== AMBIENTE =====');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'não definido'}`);
console.log(`DB_HOST: ${process.env.DB_HOST || 'não definido'}`);
console.log(`DB_PORT: ${process.env.DB_PORT || 'não definido'}`);
console.log(`DB_USER: ${process.env.DB_USER || 'não definido'}`);
console.log(`DB_NAME: ${process.env.DB_NAME || 'não definido'}`);
console.log('===================');

// Testa conexão com o banco
testConnection()
  .then(connected => {
    if (connected) {
      console.log('Banco de dados conectado com sucesso!');
    } else {
      console.error('Falha ao conectar ao banco de dados.');
    }
  });

// Inicia o servidor apenas em ambiente não-Vercel
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

// Exportação para Vercel
export default app;