// src/models/Cargo.js
import { pool } from '../config/database.js';

class Cargo {
  // Buscar todos os cargos
  static async findAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM CARGO ORDER BY nome_cargo');
      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar cargos:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar um cargo pelo ID
  static async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM CARGO WHERE id_cargo = ?', [id]);
      
      if (rows.length === 0) {
        return { success: false, error: 'Cargo não encontrado' };
      }
      
      return { success: true, data: rows[0] };
    } catch (error) {
      console.error('Erro ao buscar cargo por ID:', error);
      return { success: false, error: error.message };
    }
  }

  // Criar um novo cargo
  static async create(cargoData) {
    try {
      const { id_cargo, nome_cargo } = cargoData;
      
      const [result] = await pool.query(
        'INSERT INTO CARGO (id_cargo, nome_cargo) VALUES (?, ?)',
        [id_cargo, nome_cargo]
      );
      
      return { 
        success: true, 
        message: 'Cargo criado com sucesso',
        data: { id_cargo: result.insertId || id_cargo }
      };
    } catch (error) {
      console.error('Erro ao criar cargo:', error);
      return { success: false, error: error.message };
    }
  }

  // Atualizar um cargo
  static async update(id, cargoData) {
    try {
      const { nome_cargo } = cargoData;
      
      const [result] = await pool.query(
        'UPDATE CARGO SET nome_cargo = ? WHERE id_cargo = ?',
        [nome_cargo, id]
      );
      
      if (result.affectedRows === 0) {
        return { success: false, error: 'Cargo não encontrado' };
      }
      
      return { 
        success: true, 
        message: 'Cargo atualizado com sucesso' 
      };
    } catch (error) {
      console.error('Erro ao atualizar cargo:', error);
      return { success: false, error: error.message };
    }
  }

  // Excluir um cargo
  static async delete(id) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Verificar se o cargo está sendo usado por funcionários
      const [funcionarios] = await connection.query(
        'SELECT COUNT(*) as total FROM FUNCIONARIO WHERE id_cargo = ?', 
        [id]
      );
      
      if (funcionarios[0].total > 0) {
        await connection.rollback();
        return { 
          success: false, 
          error: 'Não é possível excluir este cargo pois existem funcionários associados a ele' 
        };
      }
      
      // Verificar se o cargo está sendo usado na tabela EPI_CARGO
      const [epiCargos] = await connection.query(
        'SELECT COUNT(*) as total FROM EPI_CARGO WHERE id_cargo = ?', 
        [id]
      );
      
      if (epiCargos[0].total > 0) {
        await connection.rollback();
        return { 
          success: false, 
          error: 'Não é possível excluir este cargo pois existem EPIs associados a ele' 
        };
      }
      
      // Excluir o cargo
      const [result] = await connection.query(
        'DELETE FROM CARGO WHERE id_cargo = ?', 
        [id]
      );
      
      if (result.affectedRows === 0) {
        await connection.rollback();
        return { success: false, error: 'Cargo não encontrado' };
      }
      
      await connection.commit();
      return { success: true, message: 'Cargo excluído com sucesso' };
    } catch (error) {
      await connection.rollback();
      console.error('Erro ao excluir cargo:', error);
      return { success: false, error: error.message };
    } finally {
      connection.release();
    }
  }

  // Buscar EPIs associados a um cargo
  static async findEpisByCargo(id) {
    try {
      const [rows] = await pool.query(
        `SELECT ec.id_cargo, ec.id_modelo_epi, me.nome_epi, m.nome_marca, c.nome_categoria
         FROM EPI_CARGO ec
         JOIN MODELO_EPI me ON ec.id_modelo_epi = me.id_modelo_epi
         JOIN MARCA m ON me.id_marca = m.id_marca
         JOIN CATEGORIA c ON me.id_categoria = c.id_categoria
         WHERE ec.id_cargo = ?`, 
        [id]
      );
      
      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar EPIs por cargo:', error);
      return { success: false, error: error.message };
    }
  }
}

export default Cargo;
