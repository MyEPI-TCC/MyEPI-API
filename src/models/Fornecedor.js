// src/models/Fornecedor.js
import { pool } from "../config/database.js";

class Fornecedor {
    // Buscar todos os fornecedores
    static async findAll() {
        try {
            const [rows] = await pool.query('SELECT * FROM FORNECEDOR');
            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar fornecedores:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar um fornecedor pelo ID
    static async findById(id) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM FORNECEDOR WHERE id_fornecedor = ?',
                [id]
            );

            if (rows.length === 0) {
                return { success: false, error: 'Fornecedor não encontrado' };
            }

            return { success: true, data: rows[0] };
        } catch (error) {
            console.error('Erro ao buscar fornecedor por ID:', error);
            return { success: false, error: error.message };
        }
    }

    // Criar um novo fornecedor
    static async create(fornecedorData) {
        try {
            const {
                id_fornecedor,
                nome_fornecedor,
                cnpj,
                logradouro,
                numero,
                bairro,
                cidade,
                estado
            } = fornecedorData;

            const [result] = await pool.query(
                `INSERT INTO FORNECEDOR (
                    id_fornecedor,
                    nome_fornecedor,
                    cnpj,
                    logradouro,
                    numero,
                    bairro,
                    cidade,
                    estado
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id_fornecedor,
                    nome_fornecedor,
                    cnpj,
                    logradouro,
                    numero,
                    bairro,
                    cidade,
                    estado
                ]
            );

            return {
                success: true,
                message: 'Fornecedor criado com sucesso',
                id: id_fornecedor
            };
        } catch (error) {
            console.error('Erro ao criar fornecedor:', error);
            return { success: false, error: error.message };
        }
    }

    // Atualizar um fornecedor
    static async update(id, fornecedorData) {
        try {
            const {
                nome_fornecedor,
                cnpj,
                logradouro,
                numero,
                bairro,
                cidade,
                estado
            } = fornecedorData;

            const [result] = await pool.query(
                `UPDATE FORNECEDOR SET 
                    nome_fornecedor = ?,
                    cnpj = ?,
                    logradouro = ?,
                    numero = ?,
                    bairro = ?,
                    cidade = ?,
                    estado = ?
                WHERE id_fornecedor = ?`,
                [
                    nome_fornecedor,
                    cnpj,
                    logradouro,
                    numero,
                    bairro,
                    cidade,
                    estado,
                    id
                ]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: 'Fornecedor não encontrado' };
            }

            return {
                success: true,
                message: 'Fornecedor atualizado com sucesso'
            };
        } catch (error) {
            console.error('Erro ao atualizar fornecedor:', error);
            return { success: false, error: error.message };
        }
    }

    // Excluir um fornecedor
    static async delete(id) {
        try {
            const [result] = await pool.query(
                'DELETE FROM FORNECEDOR WHERE id_fornecedor = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: 'Fornecedor não encontrado' };
            }

            return {
                success: true,
                message: 'Fornecedor excluído com sucesso'
            };
        } catch (error) {
            console.error('Erro ao excluir fornecedor:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar remessas por fornecedor
    static async findRemessasByFornecedor(fornecedorId) {
        try {
            const [rows] = await pool.query(
                `SELECT r.*, f.nome_fornecedor, me.nome_epi
                FROM REMESSA r
                JOIN FORNECEDOR f ON r.id_fornecedor = f.id_fornecedor
                JOIN MODELO_EPI me ON r.id_modelo_epi = me.id_modelo_epi
                WHERE r.id_fornecedor = ?`,
                [fornecedorId]
            );

            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar remessas por fornecedor:', error);
            return { success: false, error: error.message };
        }
    }
}

export default Fornecedor;