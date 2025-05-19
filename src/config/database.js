import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuração para conexão com o banco de dados
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Teste de conexão
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
        connection.release();
        return true;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        return false;
    }
}

// Função para executar queries SQL
async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Erro ao executar query:', error);
    throw error;
  }
}

export { pool, testConnection, query };