// src/models/Funcionario.js
import { pool } from "../config/database.js";

class Funcionario {
    // Buscar todos os funcionários
    static async findAll() {
        try {
            const [rows] = await pool.query(
                `SELECT f.*, c.nome_cargo 
         FROM FUNCIONARIO f 
         JOIN CARGO c ON f.id_cargo = c.id_cargo`
            );
            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar um funcionário pelo ID
    static async findById(id) {
        try {
            const [rows] = await pool.query(
                `SELECT f.*, c.nome_cargo 
         FROM FUNCIONARIO f 
         JOIN CARGO c ON f.id_cargo = c.id_cargo 
         WHERE f.id_funcionario = ?`,
                [id]
            );

            if (rows.length === 0) {
                return { success: false, error: 'Funcionário não encontrado' };
            }

            return { success: true, data: rows[0] };
        } catch (error) {
            console.error('Erro ao buscar funcionário por ID:', error);
            return { success: false, error: error.message };
        }
    }

    // Criar um novo funcionário
    static async create(funcionarioData) {
        try {
            const {
                nome_funcionario,
                numero_matricula,
                sobrenome_funcionario,
                setor,
                cpf,
                dt_nascimento,
                dt_admissao,
                tipo_sanguineo,
                id_cargo
            } = funcionarioData;

            const [result] = await pool.query(
                `INSERT INTO FUNCIONARIO (
          nome_funcionario, 
          numero_matricula, 
          sobrenome_funcionario, 
          setor, 
          cpf, 
          dt_nascimento, 
          dt_admissao, 
          tipo_sanguineo, 
          id_cargo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    nome_funcionario,
                    numero_matricula,
                    sobrenome_funcionario,
                    setor,
                    cpf,
                    dt_nascimento,
                    dt_admissao,
                    tipo_sanguineo,
                    id_cargo
                ]
            );

            return {
                success: true,
                message: 'Funcionário criado com sucesso',
                id: result.insertId
            };
        } catch (error) {
            console.error('Erro ao criar funcionário:', error);
            return { success: false, error: error.message };
        }
    }

    // Atualizar um funcionário
    static async update(id, funcionarioData) {
        try {
            const {
                nome_funcionario,
                numero_matricula,
                sobrenome_funcionario,
                setor,
                cpf,
                dt_nascimento,
                dt_admissao,
                tipo_sanguineo,
                id_cargo
            } = funcionarioData;

            const [result] = await pool.query(
                `UPDATE FUNCIONARIO SET 
          nome_funcionario = ?, 
          numero_matricula = ?, 
          sobrenome_funcionario = ?, 
          setor = ?, 
          cpf = ?, 
          dt_nascimento = ?, 
          dt_admissao = ?, 
          tipo_sanguineo = ?, 
          id_cargo = ?
         WHERE id_funcionario = ?`,
                [
                    nome_funcionario,
                    numero_matricula,
                    sobrenome_funcionario,
                    setor,
                    cpf,
                    dt_nascimento,
                    dt_admissao,
                    tipo_sanguineo,
                    id_cargo,
                    id
                ]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: 'Funcionário não encontrado' };
            }

            return {
                success: true,
                message: 'Funcionário atualizado com sucesso'
            };
        } catch (error) {
            console.error('Erro ao atualizar funcionário:', error);
            return { success: false, error: error.message };
        }
    }

    // Excluir um funcionário
    static async delete(id) {
        try {
            const [result] = await pool.query(
                'DELETE FROM FUNCIONARIO WHERE id_funcionario = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: 'Funcionário não encontrado' };
            }

            return {
                success: true,
                message: 'Funcionário excluído com sucesso'
            };
        } catch (error) {
            console.error('Erro ao excluir funcionário:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar funcionários por cargo
    static async findByCargo(cargoId) {
        try {
            const [rows] = await pool.query(
                `SELECT f.*, c.nome_cargo 
         FROM FUNCIONARIO f 
         JOIN CARGO c ON f.id_cargo = c.id_cargo 
         WHERE f.id_cargo = ?`,
                [cargoId]
            );

            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar funcionários por cargo:', error);
            return { success: false, error: error.message };
        }
    }
}

export default Funcionario;