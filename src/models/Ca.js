// src/models/Ca.js
import { pool } from "../config/database.js";

class Ca {
    // Buscar todos os CAs
    static async findAll() {
        try {
            const [rows] = await pool.query(
                `SELECT ca.*, me.nome_epi
                FROM CA ca
                JOIN MODELO_EPI me ON ca.id_modelo_epi = me.id_modelo_epi`
            );
            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar CAs:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar um CA pelo ID
    static async findById(id) {
        try {
            const [rows] = await pool.query(
                `SELECT ca.*, me.nome_epi
                FROM CA ca
                JOIN MODELO_EPI me ON ca.id_modelo_epi = me.id_modelo_epi
                WHERE ca.id_ca = ?`,
                [id]
            );

            if (rows.length === 0) {
                return { success: false, error: 'CA não encontrado' };
            }

            return { success: true, data: rows[0] };
        } catch (error) {
            console.error('Erro ao buscar CA por ID:', error);
            return { success: false, error: error.message };
        }
    }

    // Criar um novo CA
    static async create(caData) {
        try {
            const {
                id_ca,
                numero_ca,
                validade_ca,
                data_emissao,
                ativo,
                id_modelo_epi
            } = caData;

            const [result] = await pool.query(
                `INSERT INTO CA (
                    id_ca,
                    numero_ca,
                    validade_ca,
                    data_emissao,
                    ativo,
                    id_modelo_epi
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    id_ca,
                    numero_ca,
                    validade_ca,
                    data_emissao,
                    ativo,
                    id_modelo_epi
                ]
            );

            return {
                success: true,
                message: 'CA criado com sucesso',
                id: id_ca
            };
        } catch (error) {
            console.error('Erro ao criar CA:', error);
            return { success: false, error: error.message };
        }
    }

    // Atualizar um CA
    static async update(id, caData) {
        try {
            const {
                numero_ca,
                validade_ca,
                data_emissao,
                ativo,
                id_modelo_epi
            } = caData;

            const [result] = await pool.query(
                `UPDATE CA SET 
                    numero_ca = ?,
                    validade_ca = ?,
                    data_emissao = ?,
                    ativo = ?,
                    id_modelo_epi = ?
                WHERE id_ca = ?`,
                [
                    numero_ca,
                    validade_ca,
                    data_emissao,
                    ativo,
                    id_modelo_epi,
                    id
                ]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: 'CA não encontrado' };
            }

            return {
                success: true,
                message: 'CA atualizado com sucesso'
            };
        } catch (error) {
            console.error('Erro ao atualizar CA:', error);
            return { success: false, error: error.message };
        }
    }

    // Excluir um CA
    static async delete(id) {
        try {
            const [result] = await pool.query(
                'DELETE FROM CA WHERE id_ca = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: 'CA não encontrado' };
            }

            return {
                success: true,
                message: 'CA excluído com sucesso'
            };
        } catch (error) {
            console.error('Erro ao excluir CA:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar CAs por modelo de EPI
    static async findByModeloEpi(modeloEpiId) {
        try {
            const [rows] = await pool.query(
                `SELECT ca.*, me.nome_epi
                FROM CA ca
                JOIN MODELO_EPI me ON ca.id_modelo_epi = me.id_modelo_epi
                WHERE ca.id_modelo_epi = ?`,
                [modeloEpiId]
            );

            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar CAs por modelo de EPI:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar CAs ativos
    static async findActiveCA() {
        try {
            const [rows] = await pool.query(
                `SELECT ca.*, me.nome_epi
                FROM CA ca
                JOIN MODELO_EPI me ON ca.id_modelo_epi = me.id_modelo_epi
                WHERE ca.ativo = 1`
            );

            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar CAs ativos:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar CAs vencidos ou próximos do vencimento (em dias)
    static async findExpiringCA(days) {
        try {
            const [rows] = await pool.query(
                `SELECT ca.*, me.nome_epi,
                DATEDIFF(ca.validade_ca, CURDATE()) as dias_para_vencer
                FROM CA ca
                JOIN MODELO_EPI me ON ca.id_modelo_epi = me.id_modelo_epi
                WHERE ca.ativo = 1 
                AND DATEDIFF(ca.validade_ca, CURDATE()) <= ?
                ORDER BY dias_para_vencer ASC`,
                [days]
            );

            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar CAs próximos do vencimento:', error);
            return { success: false, error: error.message };
        }
    }
}

export default Ca;