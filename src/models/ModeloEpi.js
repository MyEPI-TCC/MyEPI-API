// src/models/ModeloEpi.js
import { pool } from '../config/database.js';

class ModeloEpi {
  // Buscar todos os modelos de EPI
  static async findAll() {
    try {
      const [rows] = await pool.query(
        `SELECT me.*, m.nome_marca, c.nome_categoria 
         FROM MODELO_EPI me
         JOIN MARCA m ON me.id_marca = m.id_marca
         JOIN CATEGORIA c ON me.id_categoria = c.id_categoria`
      );
      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar modelos de EPI:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar um modelo de EPI pelo ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT me.*, m.nome_marca, c.nome_categoria 
         FROM MODELO_EPI me
         JOIN MARCA m ON me.id_marca = m.id_marca
         JOIN CATEGORIA c ON me.id_categoria = c.id_categoria
         WHERE me.id_modelo_epi = ?`, 
        [id]
      );
      
      if (rows.length === 0) {
        return { success: false, error: 'Modelo de EPI não encontrado' };
      }
      
      return { success: true, data: rows[0] };
    } catch (error) {
      console.error('Erro ao buscar modelo de EPI por ID:', error);
      return { success: false, error: error.message };
    }
  }

  // Criar um novo modelo de EPI
  static async create(epiData) {
    try {
      const { 
        nome_epi, 
        quantidade, 
        descartavel, 
        rastreavel, 
        descricao_epi, 
        id_marca, 
        id_categoria 
      } = epiData;
      
      const [result] = await pool.query(
        `INSERT INTO MODELO_EPI (
          nome_epi, 
          quantidade, 
          descartavel, 
          rastreavel, 
          descricao_epi, 
          id_marca, 
          id_categoria
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          nome_epi, 
          quantidade, 
          descartavel, 
          rastreavel, 
          descricao_epi, 
          id_marca, 
          id_categoria
        ]
      );
      
      return { 
        success: true, 
        message: 'Modelo de EPI criado com sucesso', 
        id: result.insertId 
      };
    } catch (error) {
      console.error('Erro ao criar modelo de EPI:', error);
      return { success: false, error: error.message };
    }
  }

  // Atualizar um modelo de EPI
  static async update(id, epiData) {
    try {
      const { 
        nome_epi, 
        quantidade, 
        descartavel, 
        rastreavel, 
        descricao_epi, 
        id_marca, 
        id_categoria 
      } = epiData;
      
      const [result] = await pool.query(
        `UPDATE MODELO_EPI SET 
          nome_epi = ?, 
          quantidade = ?, 
          descartavel = ?, 
          rastreavel = ?, 
          descricao_epi = ?, 
          id_marca = ?, 
          id_categoria = ?
         WHERE id_modelo_epi = ?`,
        [
          nome_epi, 
          quantidade, 
          descartavel, 
          rastreavel, 
          descricao_epi, 
          id_marca, 
          id_categoria,
          id
        ]
      );
      
      if (result.affectedRows === 0) {
        return { success: false, error: 'Modelo de EPI não encontrado' };
      }
      
      return { 
        success: true, 
        message: 'Modelo de EPI atualizado com sucesso' 
      };
    } catch (error) {
      console.error('Erro ao atualizar modelo de EPI:', error);
      return { success: false, error: error.message };
    }
  }

  // Excluir um modelo de EPI
  static async delete(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM MODELO_EPI WHERE id_modelo_epi = ?', 
        [id]
      );
      
      if (result.affectedRows === 0) {
        return { success: false, error: 'Modelo de EPI não encontrado' };
      }
      
      return { 
        success: true, 
        message: 'Modelo de EPI excluído com sucesso' 
      };
    } catch (error) {
      console.error('Erro ao excluir modelo de EPI:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar EPIs por categoria
  static async findByCategoria(categoriaId) {
    try {
      const [rows] = await pool.query(
        `SELECT me.*, m.nome_marca, c.nome_categoria 
         FROM MODELO_EPI me
         JOIN MARCA m ON me.id_marca = m.id_marca
         JOIN CATEGORIA c ON me.id_categoria = c.id_categoria
         WHERE me.id_categoria = ?`, 
        [categoriaId]
      );
      
      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar EPIs por categoria:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar EPIs associados a um cargo específico
  static async findByCargo(cargoId) {
    try {
      const [rows] = await pool.query(
        `SELECT me.*, m.nome_marca, c.nome_categoria 
         FROM MODELO_EPI me
         JOIN MARCA m ON me.id_marca = m.id_marca
         JOIN CATEGORIA c ON me.id_categoria = c.id_categoria
         JOIN EPI_CARGO ec ON me.id_modelo_epi = ec.id_modelo_epi
         WHERE ec.id_cargo = ?`, 
        [cargoId]
      );
      
      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar EPIs por cargo:', error);
      return { success: false, error: error.message };
    }
  }
}

export default ModeloEpi;