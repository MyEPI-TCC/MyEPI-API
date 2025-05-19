// src/models/Marca.js
import { pool } from "../config/database.js";

class Marca {
    // Buscar todas as marcas
    static async findAll() {
        try {
            const [rows] = await pool.query('SELECT * FROM MARCA');
            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar marcas:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar uma marca pelo ID
    static async findById(id) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM MARCA WHERE id_marca = ?',
                [id]
            );

            if (rows.length === 0) {
                return { success: false, error: 'Marca não encontrada' };
            }

            return { success: true, data: rows[0] };
        } catch (error) {
            console.error('Erro ao buscar marca por ID:', error);
            return { success: false, error: error.message };
        }
    }

    // Criar uma nova marca
    static async create(marcaData) {
        try {
            const { id_marca, nome_marca } = marcaData;

            const [result] = await pool.query(
                'INSERT INTO MARCA (id_marca, nome_marca) VALUES (?, ?)',
                [id_marca, nome_marca]
            );

            return {
                success: true,
                message: 'Marca criada com sucesso',
                id: id_marca
            };
        } catch (error) {
            console.error('Erro ao criar marca:', error);
            return { success: false, error: error.message };
        }
    }

    // Atualizar uma marca
    static async update(id, marcaData) {
        try {
            const { nome_marca } = marcaData;

            const [result] = await pool.query(
                'UPDATE MARCA SET nome_marca = ? WHERE id_marca = ?',
                [nome_marca, id]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: 'Marca não encontrada' };
            }

            return {
                success: true,
                message: 'Marca atualizada com sucesso'
            };
        } catch (error) {
            console.error('Erro ao atualizar marca:', error);
            return { success: false, error: error.message };
        }
    }

    // Excluir uma marca
    static async delete(id) {
        try {
            const [result] = await pool.query(
                'DELETE FROM MARCA WHERE id_marca = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: 'Marca não encontrada' };
            }

            return {
                success: true,
                message: 'Marca excluída com sucesso'
            };
        } catch (error) {
            console.error('Erro ao excluir marca:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar EPIs por marca
    static async findEpisByMarca(marcaId) {
        try {
            const [rows] = await pool.query(
                `SELECT me.*, m.nome_marca, c.nome_categoria
                FROM MODELO_EPI me
                JOIN MARCA m ON me.id_marca = m.id_marca
                JOIN CATEGORIA c ON me.id_categoria = c.id_categoria
                WHERE me.id_marca = ?`,
                [marcaId]
            );

            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar EPIs por marca:', error);
            return { success: false, error: error.message };
        }
    }
}

export default Marca;