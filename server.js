import app from './app.js';
import { testConnection } from './src/config/database.js';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

const PORT = process.env.PORT || 3000;

// Verificar e exibir configurações de ambiente
console.log('===== AMBIENTE =====');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'não definido'}`);
console.log(`DB_HOST: ${process.env.DB_HOST || 'não definido'}`);
console.log(`DB_PORT: ${process.env.DB_PORT || 'não definido'}`);
console.log(`DB_USER: ${process.env.DB_USER || 'não definido'}`);
console.log(`DB_NAME: ${process.env.DB_NAME || 'não definido'}`);
console.log('===================');

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    
    // Testa conexão com o banco ao iniciar
    testConnection()
        .then(connected => {
            if (connected) {
                console.log('Banco de dados conectado com sucesso!');
            } else {
                console.error('Falha ao conectar ao banco de dados.');
            }
        });
});