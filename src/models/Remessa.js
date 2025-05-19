// src/models/Remessa.js
import { pool } from '../config/database.js';

class Remessa {
  // Buscar todas as remessas
  static async findAll() {
    try {
      const [rows] = await pool.query(
        `SELECT r.*, f.nome_fornecedor, me.nome_epi, ca.numero_ca
         FROM REMESSA r
         JOIN FORNECEDOR f ON r.id_fornecedor = f.id_fornecedor
         JOIN MODELO_EPI me ON r.id_modelo_epi = me.id_modelo_epi
         JOIN CA ca ON r.id_ca = ca.id_ca
         ORDER BY r.data_entrega DESC`
      );
      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar remessas:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar uma remessa pelo ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT r.*, f.nome_fornecedor, me.nome_epi, ca.numero_ca
         FROM REMESSA r
         JOIN FORNECEDOR f ON r.id_fornecedor = f.id_fornecedor
         JOIN MODELO_EPI me ON r.id_modelo_epi = me.id_modelo_epi
         JOIN CA ca ON r.id_ca = ca.id_ca
         WHERE r.id_remessa = ?`, 
        [id]
      );
      
      if (rows.length === 0) {
        return { success: false, error: 'Remessa não encontrada' };
      }
      
      return { success: true, data: rows[0] };
    } catch (error) {
      console.error('Erro ao buscar remessa por ID:', error);
      return { success: false, error: error.message };
    }
  }

  // Criar uma nova remessa com estoque
  static async create(remessaData) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const { 
        codigo_lote, 
        quantidade, 
        data_entrega, 
        validade_lote, 
        nota_fiscal, 
        observacoes, 
        id_fornecedor, 
        id_modelo_epi, 
        id_ca 
      } = remessaData;
      
      // Inserir a remessa
      const [remessaResult] = await connection.query(
        `INSERT INTO REMESSA (
          codigo_lote, 
          quantidade, 
          data_entrega, 
          validade_lote, 
          nota_fiscal, 
          observacoes, 
          id_fornecedor, 
          id_modelo_epi, 
          id_ca
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          codigo_lote, 
          quantidade, 
          data_entrega, 
          validade_lote, 
          nota_fiscal, 
          observacoes, 
          id_fornecedor, 
          id_modelo_epi, 
          id_ca
        ]
      );
      
      const remessaId = remessaResult.insertId;
      
      // Criar entrada no estoque
      const [estoqueResult] = await connection.query(
        `INSERT INTO ESTOQUE_LOTE (
          quantidade_estoque,
          id_remessa
        ) VALUES (?, ?)`,
        [quantidade, remessaId]
      );
      
      // Atualizar a quantidade total no MODELO_EPI
      await connection.query(
        `UPDATE MODELO_EPI 
         SET quantidade = quantidade + ? 
         WHERE id_modelo_epi = ?`,
        [quantidade, id_modelo_epi]
      );
      
      await connection.commit();
      
      return { 
        success: true, 
        message: 'Remessa registrada com sucesso',
        data: {
          id_remessa: remessaId,
          id_estoque_lote: estoqueResult.insertId
        }
      };
    } catch (error) {
      await connection.rollback();
      console.error('Erro ao registrar remessa:', error);
      return { success: false, error: error.message };
    } finally {
      connection.release();
    }
  }

  // Atualizar uma remessa
  static async update(id, remessaData) {
    try {
      const { 
        codigo_lote, 
        quantidade,
        data_entrega, 
        validade_lote, 
        nota_fiscal, 
        observacoes, 
        id_fornecedor, 
        id_modelo_epi, 
        id_ca 
      } = remessaData;
      
      const [result] = await pool.query(
        `UPDATE REMESSA SET 
          codigo_lote = ?, 
          quantidade = ?,
          data_entrega = ?, 
          validade_lote = ?, 
          nota_fiscal = ?, 
          observacoes = ?, 
          id_fornecedor = ?, 
          id_modelo_epi = ?, 
          id_ca = ?
         WHERE id_remessa = ?`,
        [
          codigo_lote, 
          quantidade,
          data_entrega, 
          validade_lote, 
          nota_fiscal, 
          observacoes, 
          id_fornecedor, 
          id_modelo_epi, 
          id_ca,
          id
        ]
      );
      
      if (result.affectedRows === 0) {
        return { success: false, error: 'Remessa não encontrada' };
      }
      
      return { 
        success: true, 
        message: 'Remessa atualizada com sucesso' 
      };
    } catch (error) {
      console.error('Erro ao atualizar remessa:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar remessas por fornecedor
  static async findByFornecedor(fornecedorId) {
    try {
      const [rows] = await pool.query(
        `SELECT r.*, f.nome_fornecedor, me.nome_epi, ca.numero_ca
         FROM REMESSA r
         JOIN FORNECEDOR f ON r.id_fornecedor = f.id_fornecedor
         JOIN MODELO_EPI me ON r.id_modelo_epi = me.id_modelo_epi
         JOIN CA ca ON r.id_ca = ca.id_ca
         WHERE r.id_fornecedor = ?
         ORDER BY r.data_entrega DESC`, 
        [fornecedorId]
      );
      
      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar remessas por fornecedor:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar remessas por modelo de EPI
  static async findByModeloEpi(modeloEpiId) {
    try {
      const [rows] = await pool.query(
        `SELECT r.*, f.nome_fornecedor, me.nome_epi, ca.numero_ca
         FROM REMESSA r
         JOIN FORNECEDOR f ON r.id_fornecedor = f.id_fornecedor
         JOIN MODELO_EPI me ON r.id_modelo_epi = me.id_modelo_epi
         JOIN CA ca ON r.id_ca = ca.id_ca
         WHERE r.id_modelo_epi = ?
         ORDER BY r.data_entrega DESC`, 
        [modeloEpiId]
      );
      
      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar remessas por modelo de EPI:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Buscar remessas por período
  static async findByPeriodo(dataInicio, dataFim) {
    try {
      const [rows] = await pool.query(
        `SELECT r.*, f.nome_fornecedor, me.nome_epi, ca.numero_ca
         FROM REMESSA r
         JOIN FORNECEDOR f ON r.id_fornecedor = f.id_fornecedor
         JOIN MODELO_EPI me ON r.id_modelo_epi = me.id_modelo_epi
         JOIN CA ca ON r.id_ca = ca.id_ca
         WHERE r.data_entrega BETWEEN ? AND ?
         ORDER BY r.data_entrega DESC`, 
        [dataInicio, dataFim]
      );
      
      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar remessas por período:', error);
      return { success: false, error: error.message };
    }
  }
}

export default Remessa;