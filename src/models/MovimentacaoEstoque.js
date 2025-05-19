// src/models/MovimentacaoEstoque.js
import { pool } from '../config/database.js';

class MovimentacaoEstoque {
  // Buscar todas as movimentações de estoque
  static async findAll() {
    try {
      const [rows] = await pool.query(
        `SELECT me.*, f.nome_funcionario, me2.nome_epi
         FROM MOVIMENTACAO_ESTOQUE me
         JOIN FUNCIONARIO f ON me.id_funcionario = f.id_funcionario
         JOIN MODELO_EPI me2 ON me.id_modelo_epi = me2.id_modelo_epi
         ORDER BY me.data DESC, me.hora DESC`
      );
      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar movimentações de estoque:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar uma movimentação de estoque pelo ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT me.*, f.nome_funcionario, me2.nome_epi
         FROM MOVIMENTACAO_ESTOQUE me
         JOIN FUNCIONARIO f ON me.id_funcionario = f.id_funcionario
         JOIN MODELO_EPI me2 ON me.id_modelo_epi = me2.id_modelo_epi
         WHERE me.id = ?`, 
        [id]
      );
      
      if (rows.length === 0) {
        return { success: false, error: 'Movimentação de estoque não encontrada' };
      }
      
      return { success: true, data: rows[0] };
    } catch (error) {
      console.error('Erro ao buscar movimentação de estoque por ID:', error);
      return { success: false, error: error.message };
    }
  }

  // Criar uma nova movimentação de estoque
  static async create(movimentacaoData) {
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
        id_estoque_lote 
      } = movimentacaoData;
      
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
      
      // Inserir a movimentação
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
          id_estoque_lote
        ]
      );
      
      // Atualizar o estoque
      let novaQuantidade;
      
      if (tipo_movimentacao === 'Entrega') {
        novaQuantidade = estoqueAtual - quantidade;
      } else if (tipo_movimentacao === 'Devolucao') {
        novaQuantidade = estoqueAtual + quantidade;
      } else {
        // Para trocas, o estoque permanece o mesmo
        novaQuantidade = estoqueAtual;
      }
      
      await connection.query(
        'UPDATE ESTOQUE_LOTE SET quantidade_estoque = ? WHERE id_estoque_lote = ?',
        [novaQuantidade, id_estoque_lote]
      );
      
      // Se for rastreável, atualizar o status do EPI
      if (tipo_movimentacao === 'Entrega' || tipo_movimentacao === 'Devolucao') {
        const [epiResult] = await connection.query(
          'SELECT rastreavel FROM MODELO_EPI WHERE id_modelo_epi = ?',
          [id_modelo_epi]
        );
        
        if (epiResult[0]?.rastreavel === 1) {
          // Lógica para EPIs rastreáveis
          // Isso vai depender de como você vai gerenciar os EPIs rastreáveis
          // Por exemplo, pode ser necessário atualizar o status na tabela EPI_RASTREAVEL
        }
      }
      
      await connection.commit();
      
      return { 
        success: true, 
        message: 'Movimentação de estoque registrada com sucesso', 
        id: result.insertId 
      };
    } catch (error) {
      await connection.rollback();
      console.error('Erro ao registrar movimentação de estoque:', error);
      return { success: false, error: error.message };
    } finally {
      connection.release();
    }
  }

  // Buscar movimentações por funcionário
  static async findByFuncionario(funcionarioId) {
    try {
      const [rows] = await pool.query(
        `SELECT me.*, f.nome_funcionario, me2.nome_epi
         FROM MOVIMENTACAO_ESTOQUE me
         JOIN FUNCIONARIO f ON me.id_funcionario = f.id_funcionario
         JOIN MODELO_EPI me2 ON me.id_modelo_epi = me2.id_modelo_epi
         WHERE me.id_funcionario = ?
         ORDER BY me.data DESC, me.hora DESC`, 
        [funcionarioId]
      );
      
      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar movimentações por funcionário:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar movimentações por EPI
  static async findByEpi(epiId) {
    try {
      const [rows] = await pool.query(
        `SELECT me.*, f.nome_funcionario, me2.nome_epi
         FROM MOVIMENTACAO_ESTOQUE me
         JOIN FUNCIONARIO f ON me.id_funcionario = f.id_funcionario
         JOIN MODELO_EPI me2 ON me.id_modelo_epi = me2.id_modelo_epi
         WHERE me.id_modelo_epi = ?
         ORDER BY me.data DESC, me.hora DESC`, 
        [epiId]
      );
      
      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar movimentações por EPI:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar movimentações por tipo
  static async findByTipo(tipo) {
    try {
      const [rows] = await pool.query(
        `SELECT me.*, f.nome_funcionario, me2.nome_epi
         FROM MOVIMENTACAO_ESTOQUE me
         JOIN FUNCIONARIO f ON me.id_funcionario = f.id_funcionario
         JOIN MODELO_EPI me2 ON me.id_modelo_epi = me2.id_modelo_epi
         WHERE me.tipo_movimentacao = ?
         ORDER BY me.data DESC, me.hora DESC`, 
        [tipo]
      );
      
      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar movimentações por tipo:', error);
      return { success: false, error: error.message };
    }
  }
}

export default MovimentacaoEstoque;