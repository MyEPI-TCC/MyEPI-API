// src/models/ModeloEpi.js
import { pool } from '../config/database.js';
import fs from 'fs/promises';

class ModeloEpi {
  // Buscar todos os modelos de EPI
  static async findAll() {
    try {
      const [rows] = await pool.query(
        `SELECT me.*, m.nome_marca, c.nome_categoria, me.foto_epi_path 
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
        `SELECT me.*, m.nome_marca, c.nome_categoria, me.foto_epi_path 
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
  static async create(epiData, fotoPath) {
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

      const boolToInt = (val) => val === true || val === 'true' ? 1 : 0;
      
      const [result] = await pool.query(
        `INSERT INTO MODELO_EPI (
          nome_epi, 
          quantidade, 
          descartavel, 
          rastreavel, 
          descricao_epi, 
          id_marca, 
          id_categoria,
          foto_epi_path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nome_epi, 
          quantidade || 0, 
          boolToInt(descartavel), 
          boolToInt(rastreavel), 
          descricao_epi, 
          id_marca, 
          id_categoria,
          fotoPath || null
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
  static async update(id, epiData, fotoPath) {
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

      const boolToInt = (val) => val === true || val === 'true' ? 1 : 0;

      let query = `UPDATE MODELO_EPI SET 
                     nome_epi = ?, 
                     quantidade = ?, 
                     descartavel = ?, 
                     rastreavel = ?, 
                     descricao_epi = ?, 
                     id_marca = ?, 
                     id_categoria = ?`;
      let params = [
        nome_epi, 
        quantidade || 0, 
        boolToInt(descartavel), 
        boolToInt(rastreavel), 
        descricao_epi, 
        id_marca, 
        id_categoria
      ];

      if (fotoPath !== undefined) {
        query += `, foto_epi_path = ?`;
        params.push(fotoPath);
      }

      query += ` WHERE id_modelo_epi = ?`;
      params.push(id);

      const [result] = await pool.query(query, params);
      
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
      // Opcional: Excluir arquivo de imagem associado, se existir
      const epi = await this.findById(id);
      if (epi.success && epi.data.foto_epi_path) {
        await fs.unlink(epi.data.foto_epi_path).catch(err =>
          console.warn('Não foi possível excluir o arquivo da imagem:', err.message)
        );
      }

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
        `SELECT me.*, m.nome_marca, c.nome_categoria, me.foto_epi_path 
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
        `SELECT me.*, m.nome_marca, c.nome_categoria, me.foto_epi_path 
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

  // Buscar EPIs com estoque baixo (quantidade menor que um limite)
  static async findComEstoqueBaixo(limite = 10) {
    try {
      const [rows] = await pool.query(
        `SELECT me.*, m.nome_marca, c.nome_categoria, me.foto_epi_path 
         FROM MODELO_EPI me
         JOIN MARCA m ON me.id_marca = m.id_marca
         JOIN CATEGORIA c ON me.id_categoria = c.id_categoria
         WHERE me.quantidade < ?
         ORDER BY me.quantidade ASC`, 
        [limite]
      );
      
      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar EPIs com estoque baixo:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar EPIs sem estoque (quantidade = 0)
  static async findSemEstoque() {
    try {
      const [rows] = await pool.query(
        `SELECT me.*, m.nome_marca, c.nome_categoria, me.foto_epi_path 
         FROM MODELO_EPI me
         JOIN MARCA m ON me.id_marca = m.id_marca
         JOIN CATEGORIA c ON me.id_categoria = c.id_categoria
         WHERE me.quantidade = 0
         ORDER BY me.nome_epi ASC`
      );
      
      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar EPIs sem estoque:', error);
      return { success: false, error: error.message };
    }
  }
}

export default ModeloEpi;