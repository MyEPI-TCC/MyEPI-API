// src/models/EstoqueLote.js
import { pool } from "../config/database.js";

class EstoqueLote {
    // Buscar todos os estoques de lotes
    static async findAll() {
        try {
            const [rows] = await pool.query(
                `SELECT el.*, r.codigo_lote, r.nota_fiscal, me.nome_epi, f.nome_fornecedor
                FROM ESTOQUE_LOTE el
                JOIN REMESSA r ON el.id_remessa = r.id_remessa
                JOIN MODELO_EPI me ON r.id_modelo_epi = me.id_modelo_epi
                JOIN FORNECEDOR f ON r.id_fornecedor = f.id_fornecedor`
            );
            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar estoques de lotes:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar um estoque de lote pelo ID
    static async findById(id) {
        try {
            const [rows] = await pool.query(
                `SELECT el.*, r.codigo_lote, r.nota_fiscal, me.nome_epi, f.nome_fornecedor
                FROM ESTOQUE_LOTE el
                JOIN REMESSA r ON el.id_remessa = r.id_remessa
                JOIN MODELO_EPI me ON r.id_modelo_epi = me.id_modelo_epi
                JOIN FORNECEDOR f ON r.id_fornecedor = f.id_fornecedor
                WHERE el.id_estoque_lote = ?`,
                [id]
            );

            if (rows.length === 0) {
                return { success: false, error: 'Estoque de lote não encontrado' };
            }

            return { success: true, data: rows[0] };
        } catch (error) {
            console.error('Erro ao buscar estoque de lote por ID:', error);
            return { success: false, error: error.message };
        }
    }

    // Criar um novo estoque de lote
    static async create(estoqueLoteData) {
        try {
            const {
                id_estoque_lote,
                quantidade_estoque,
                id_remessa
            } = estoqueLoteData;

            const [result] = await pool.query(
                `INSERT INTO ESTOQUE_LOTE (
                    id_estoque_lote,
                    quantidade_estoque,
                    id_remessa
                ) VALUES (?, ?, ?)`,
                [
                    id_estoque_lote,
                    quantidade_estoque,
                    id_remessa
                ]
            );

            return {
                success: true,
                message: 'Estoque de lote criado com sucesso',
                id: id_estoque_lote
            };
        } catch (error) {
            console.error('Erro ao criar estoque de lote:', error);
            return { success: false, error: error.message };
        }
    }

    // Atualizar um estoque de lote
    static async update(id, estoqueLoteData) {
        try {
            const {
                quantidade_estoque,
                id_remessa
            } = estoqueLoteData;

            const [result] = await pool.query(
                `UPDATE ESTOQUE_LOTE SET 
                    quantidade_estoque = ?,
                    id_remessa = ?
                WHERE id_estoque_lote = ?`,
                [
                    quantidade_estoque,
                    id_remessa,
                    id
                ]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: 'Estoque de lote não encontrado' };
            }

            return {
                success: true,
                message: 'Estoque de lote atualizado com sucesso'
            };
        } catch (error) {
            console.error('Erro ao atualizar estoque de lote:', error);
            return { success: false, error: error.message };
        }
    }

    // Excluir um estoque de lote
    static async delete(id) {
        try {
            const [result] = await pool.query(
                'DELETE FROM ESTOQUE_LOTE WHERE id_estoque_lote = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: 'Estoque de lote não encontrado' };
            }

            return {
                success: true,
                message: 'Estoque de lote excluído com sucesso'
            };
        } catch (error) {
            console.error('Erro ao excluir estoque de lote:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar estoques por remessa
    static async findByRemessa(remessaId) {
        try {
            const [rows] = await pool.query(
                `SELECT el.*, r.codigo_lote, r.nota_fiscal, me.nome_epi
                FROM ESTOQUE_LOTE el
                JOIN REMESSA r ON el.id_remessa = r.id_remessa
                JOIN MODELO_EPI me ON r.id_modelo_epi = me.id_modelo_epi
                WHERE el.id_remessa = ?`,
                [remessaId]
            );

            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar estoques por remessa:', error);
            return { success: false, error: error.message };
        }
    }

    // Atualizar quantidade em estoque
    static async updateQuantidade(id, quantidade) {
        try {
            const [result] = await pool.query(
                'UPDATE ESTOQUE_LOTE SET quantidade_estoque = ? WHERE id_estoque_lote = ?',
                [quantidade, id]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: 'Estoque de lote não encontrado' };
            }

            return {
                success: true,
                message: 'Quantidade em estoque atualizada com sucesso'
            };
        } catch (error) {
            console.error('Erro ao atualizar quantidade em estoque:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar estoques com baixa quantidade
    static async findLowStock(minQuantidade) {
        try {
            const [rows] = await pool.query(
                `SELECT el.*, r.codigo_lote, me.nome_epi
                FROM ESTOQUE_LOTE el
                JOIN REMESSA r ON el.id_remessa = r.id_remessa
                JOIN MODELO_EPI me ON r.id_modelo_epi = me.id_modelo_epi
                WHERE el.quantidade_estoque <= ?`,
                [minQuantidade]
            );

            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar estoques com baixa quantidade:', error);
            return { success: false, error: error.message };
        }
    }
}

export default EstoqueLote;