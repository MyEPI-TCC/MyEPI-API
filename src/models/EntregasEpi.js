// src/models/EntregasEpi.js
import { pool } from '../config/database.js';

class EntregasEpi {
  // Buscar todas as entregas
  static async findAll() {
    try {
      const [rows] = await pool.query(
        `SELECT e.*, f.nome_funcionario, m.nome_epi
         FROM MOVIMENTACAO_ESTOQUE e
         JOIN FUNCIONARIO f ON e.id_funcionario = f.id_funcionario
         JOIN MODELO_EPI m ON e.id_modelo_epi = m.id_modelo_epi
         ORDER BY e.data DESC, e.hora DESC`
      );
      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar entregas de EPI:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar uma entrega pelo ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT e.*, f.nome_funcionario, m.nome_epi
         FROM MOVIMENTACAO_ESTOQUE e
         JOIN FUNCIONARIO f ON e.id_funcionario = f.id_funcionario
         JOIN MODELO_EPI m ON e.id_modelo_epi = m.id_modelo_epi
         WHERE e.id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return { success: false, error: 'Entrega não encontrada' };
      }

      return { success: true, data: rows[0] };
    } catch (error) {
      console.error('Erro ao buscar entrega por ID:', error);
      return { success: false, error: error.message };
    }
  }

  // Registrar uma nova entrega
  static async create(entregaData) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const {
        tipo_movimentacao,
        data,
        hora,
        quantidade,
        descricao,
        id_funcionario,
        id_modelo_epi,
        id_estoque_lote,
      } = entregaData;

      // Verificar estoque disponível
      const [estoqueLoteResult] = await connection.query(
        'SELECT quantidade_estoque FROM ESTOQUE_LOTE WHERE id_estoque_lote = ?',
        [id_estoque_lote]
      );

      if (estoqueLoteResult.length === 0) {
        await connection.rollback();
        return { success: false, error: 'Lote de estoque não encontrado' };
      }

      const estoqueAtual = estoqueLoteResult[0].quantidade_estoque;

      // Verificar se há estoque suficiente (para entregas)
      if (tipo_movimentacao === 'Entrega' && estoqueAtual < quantidade) {
        await connection.rollback();
        return { success: false, error: 'Quantidade insuficiente em estoque' };
      }

      // Inserir a entrega
      const [result] = await connection.query(
        `INSERT INTO MOVIMENTACAO_ESTOQUE (
          tipo_movimentacao,
          data,
          hora,
          quantidade,
          descricao,
          id_funcionario,
          id_modelo_epi,
          id_estoque_lote
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tipo_movimentacao,
          data,
          hora,
          quantidade,
          descricao,
          id_funcionario,
          id_modelo_epi,
          id_estoque_lote,
        ]
      );

      // Atualizar o estoque
      let novaQuantidade;

      if (tipo_movimentacao === 'Entrega') {
        novaQuantidade = estoqueAtual - quantidade;
      } else if (tipo_movimentacao === 'Devolucao') {
        novaQuantidade = estoqueAtual + quantidade;
      } else {
        novaQuantidade = estoqueAtual; // Outros tipos não afetam o estoque
      }

      await connection.query(
        'UPDATE ESTOQUE_LOTE SET quantidade_estoque = ? WHERE id_estoque_lote = ?',
        [novaQuantidade, id_estoque_lote]
      );

      // Se for rastreável, atualizar o status do EPI (se aplicável)
      const [epiResult] = await connection.query(
        'SELECT rastreavel FROM MODELO_EPI WHERE id_modelo_epi = ?',
        [id_modelo_epi]
      );

      if (epiResult[0]?.rastreavel === 1) {
        // Implementar lógica para EPIs rastreáveis, se houver
        // Exemplo: atualizar tabela EPI_RASTREAVEL
      }

      await connection.commit();

      return {
        success: true,
        message: 'Entrega registrada com sucesso',
        id: result.insertId,
      };
    } catch (error) {
      await connection.rollback();
      console.error('Erro ao registrar entrega:', error);
      return { success: false, error: error.message };
    } finally {
      connection.release();
    }
  }

  // Buscar entregas por funcionário
  static async findByFuncionario(funcionarioId) {
    try {
      const [rows] = await pool.query(
        `SELECT e.*, f.nome_funcionario, m.nome_epi
         FROM MOVIMENTACAO_ESTOQUE e
         JOIN FUNCIONARIO f ON e.id_funcionario = f.id_funcionario
         JOIN MODELO_EPI m ON e.id_modelo_epi = m.id_modelo_epi
         WHERE e.id_funcionario = ?
         ORDER BY e.data DESC, e.hora DESC`,
        [funcionarioId]
      );

      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar entregas por funcionário:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar entregas por EPI
  static async findByEpi(epiId) {
    try {
      const [rows] = await pool.query(
        `SELECT e.*, f.nome_funcionario, m.nome_epi
         FROM MOVIMENTACAO_ESTOQUE e
         JOIN FUNCIONARIO f ON e.id_funcionario = f.id_funcionario
         JOIN MODELO_EPI m ON e.id_modelo_epi = m.id_modelo_epi
         WHERE e.id_modelo_epi = ?
         ORDER BY e.data DESC, e.hora DESC`,
        [epiId]
      );

      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar entregas por EPI:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar entregas por tipo
  static async findByTipo(tipo) {
    try {
      const [rows] = await pool.query(
        `SELECT e.*, f.nome_funcionario, m.nome_epi
         FROM MOVIMENTACAO_ESTOQUE e
         JOIN FUNCIONARIO f ON e.id_funcionario = f.id_funcionario
         JOIN MODELO_EPI m ON e.id_modelo_epi = m.id_modelo_epi
         WHERE e.tipo_movimentacao = ?
         ORDER BY e.data DESC, e.hora DESC`,
        [tipo]
      );

      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar entregas por tipo:', error);
      return { success: false, error: error.message };
    }
  }
}

export default EntregasEpi;
