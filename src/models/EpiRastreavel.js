// src/models/EpiRastreavel.js
import { pool } from "../config/database.js";

class EpiRastreavel {
    // Buscar todos os EPIs rastreáveis
    static async findAll() {
        try {
            const [rows] = await pool.query(
                `SELECT er.*, me.nome_epi, m.nome_marca, c.nome_categoria
                FROM EPI_RASTREAVEL er
                JOIN MODELO_EPI me ON er.id_modelo_epi = me.id_modelo_epi
                JOIN MARCA m ON me.id_marca = m.id_marca
                JOIN CATEGORIA c ON me.id_categoria = c.id_categoria`
            );
            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar EPIs rastreáveis:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar um EPI rastreável pelo ID
    static async findById(id) {
        try {
            const [rows] = await pool.query(
                `SELECT er.*, me.nome_epi, m.nome_marca, c.nome_categoria
                FROM EPI_RASTREAVEL er
                JOIN MODELO_EPI me ON er.id_modelo_epi = me.id_modelo_epi
                JOIN MARCA m ON me.id_marca = m.id_marca
                JOIN CATEGORIA c ON me.id_categoria = c.id_categoria
                WHERE er.id_epi_rastreavel = ?`,
                [id]
            );

            if (rows.length === 0) {
                return { success: false, error: 'EPI rastreável não encontrado' };
            }

            return { success: true, data: rows[0] };
        } catch (error) {
            console.error('Erro ao buscar EPI rastreável por ID:', error);
            return { success: false, error: error.message };
        }
    }

    // Criar um novo EPI rastreável
    static async create(epiRastreavelData) {
        try {
            const {
                id_epi_rastreavel,
                numero_serie,
                status,
                id_modelo_epi
            } = epiRastreavelData;

            const [result] = await pool.query(
                `INSERT INTO EPI_RASTREAVEL (
                    id_epi_rastreavel,
                    numero_serie,
                    status,
                    id_modelo_epi
                ) VALUES (?, ?, ?, ?)`,
                [
                    id_epi_rastreavel,
                    numero_serie,
                    status,
                    id_modelo_epi
                ]
            );

            return {
                success: true,
                message: 'EPI rastreável criado com sucesso',
                id: id_epi_rastreavel
            };
        } catch (error) {
            console.error('Erro ao criar EPI rastreável:', error);
            return { success: false, error: error.message };
        }
    }

    // Atualizar um EPI rastreável
    static async update(id, epiRastreavelData) {
        try {
            const {
                numero_serie,
                status,
                id_modelo_epi
            } = epiRastreavelData;

            const [result] = await pool.query(
                `UPDATE EPI_RASTREAVEL SET 
                    numero_serie = ?,
                    status = ?,
                    id_modelo_epi = ?
                WHERE id_epi_rastreavel = ?`,
                [
                    numero_serie,
                    status,
                    id_modelo_epi,
                    id
                ]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: 'EPI rastreável não encontrado' };
            }

            return {
                success: true,
                message: 'EPI rastreável atualizado com sucesso'
            };
        } catch (error) {
            console.error('Erro ao atualizar EPI rastreável:', error);
            return { success: false, error: error.message };
        }
    }

    // Excluir um EPI rastreável
    static async delete(id) {
        try {
            const [result] = await pool.query(
                'DELETE FROM EPI_RASTREAVEL WHERE id_epi_rastreavel = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: 'EPI rastreável não encontrado' };
            }

            return {
                success: true,
                message: 'EPI rastreável excluído com sucesso'
            };
        } catch (error) {
            console.error('Erro ao excluir EPI rastreável:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar EPIs rastreáveis por modelo
    static async findByModelo(modeloId) {
        try {
            const [rows] = await pool.query(
                `SELECT er.*, me.nome_epi
                FROM EPI_RASTREAVEL er
                JOIN MODELO_EPI me ON er.id_modelo_epi = me.id_modelo_epi
                WHERE er.id_modelo_epi = ?`,
                [modeloId]
            );

            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar EPIs rastreáveis por modelo:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar EPIs rastreáveis por status
    static async findByStatus(status) {
        try {
            const [rows] = await pool.query(
                `SELECT er.*, me.nome_epi, m.nome_marca
                FROM EPI_RASTREAVEL er
                JOIN MODELO_EPI me ON er.id_modelo_epi = me.id_modelo_epi
                JOIN MARCA m ON me.id_marca = m.id_marca
                WHERE er.status = ?`,
                [status]
            );

            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar EPIs rastreáveis por status:', error);
            return { success: false, error: error.message };
        }
    }

    // Atualizar status de um EPI rastreável
    static async updateStatus(id, status) {
        try {
            const [result] = await pool.query(
                'UPDATE EPI_RASTREAVEL SET status = ? WHERE id_epi_rastreavel = ?',
                [status, id]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: 'EPI rastreável não encontrado' };
            }

            return {
                success: true,
                message: 'Status do EPI rastreável atualizado com sucesso'
            };
        } catch (error) {
            console.error('Erro ao atualizar status do EPI rastreável:', error);
            return { success: false, error: error.message };
        }
    }
}

export default EpiRastreavel;