// src/models/Categoria.js
import { pool } from "../config/database.js";

class Categoria {
    // Buscar todas as categorias
    static async findAll() {
        try {
            const [rows] = await pool.query('SELECT * FROM CATEGORIA');
            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar uma categoria pelo ID
    static async findById(id) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM CATEGORIA WHERE id_categoria = ?',
                [id]
            );

            if (rows.length === 0) {
                return { success: false, error: 'Categoria não encontrada' };
            }

            return { success: true, data: rows[0] };
        } catch (error) {
            console.error('Erro ao buscar categoria por ID:', error);
            return { success: false, error: error.message };
        }
    }

    // Criar uma nova categoria
    static async create(categoriaData) {
        try {
            const { id_categoria, nome_categoria } = categoriaData;

            const [result] = await pool.query(
                'INSERT INTO CATEGORIA (id_categoria, nome_categoria) VALUES (?, ?)',
                [id_categoria, nome_categoria]
            );

            return {
                success: true,
                message: 'Categoria criada com sucesso',
                id: id_categoria
            };
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            return { success: false, error: error.message };
        }
    }

    // Atualizar uma categoria
    static async update(id, categoriaData) {
        try {
            const { nome_categoria } = categoriaData;

            const [result] = await pool.query(
                'UPDATE CATEGORIA SET nome_categoria = ? WHERE id_categoria = ?',
                [nome_categoria, id]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: 'Categoria não encontrada' };
            }

            return {
                success: true,
                message: 'Categoria atualizada com sucesso'
            };
        } catch (error) {
            console.error('Erro ao atualizar categoria:', error);
            return { success: false, error: error.message };
        }
    }

    // Excluir uma categoria
    static async delete(id) {
        try {
            const [result] = await pool.query(
                'DELETE FROM CATEGORIA WHERE id_categoria = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: 'Categoria não encontrada' };
            }

            return {
                success: true,
                message: 'Categoria excluída com sucesso'
            };
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar EPIs por categoria
    static async findEpisByCategoria(categoriaId) {
        try {
            const [rows] = await pool.query(
                `SELECT me.*, c.nome_categoria, m.nome_marca
                FROM MODELO_EPI me
                JOIN CATEGORIA c ON me.id_categoria = c.id_categoria
                JOIN MARCA m ON me.id_marca = m.id_marca
                WHERE me.id_categoria = ?`,
                [categoriaId]
            );

            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar EPIs por categoria:', error);
            return { success: false, error: error.message };
        }
    }
}

export default Categoria;