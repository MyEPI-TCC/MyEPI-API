import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

// Configuração do banco de dados
const createDatabaseConfig = () => {
  // Prioriza URL completa se disponível
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl && databaseUrl.startsWith('mysql://')) {
    // Configuração usando string de conexão
    return databaseUrl;
  } else {
    // Configuração usando variáveis separadas
    return {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    };
  }
};

// Opções adicionais para conexão
const connectionOptions = {
  connectTimeout: 60000, // 60 segundos de timeout
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // Desabilita verificação SSL rigorosa em produção
  } : undefined
};

// Cria o pool de conexões
const config = createDatabaseConfig();
export const pool = mysql.createPool(
  typeof config === 'string' 
    ? config // Se for string, usa diretamente
    : { ...config, ...connectionOptions } // Se for objeto, mescla com opções
);

// Testa a conexão com o banco de dados
export async function testConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Conexão com banco de dados estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    return false;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Função para obter uma conexão do pool
export async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Erro ao obter conexão do pool:', error);
    throw error;
  }
}

